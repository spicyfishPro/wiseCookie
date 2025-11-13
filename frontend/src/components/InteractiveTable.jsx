import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import LoadingSpinner from './ui/LoadingSpinner';
import SearchSection from './ui/SearchSection';

// 5个数值特征的键名
const SEARCH_KEYS = [
  'Spread ratio', 
  'Cookie hardness', 
  'WI', 
  'Crack Ratio', 
  'Sensory score'
];

// 辅助组件：列过滤器 (不变)
function ColumnFilter({ column }) {
  const columnFilterValue = column.getFilterValue() || '';
  return (
    <input
      type="text"
      value={columnFilterValue}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`搜索...`}
      className="form-control form-control-sm"
    />
  );
}

// 辅助函数：计算距离 (不变)
const calculateDistance = (row, inputs, normParams) => {
  let sumOfSquares = 0;
  for (const key of SEARCH_KEYS) {
    const params = normParams[key];
    const rowVal = parseFloat(row[key]);
    const inputVal = parseFloat(inputs[key]);

    if (params && !isNaN(rowVal) && !isNaN(inputVal)) {
      const range = params.max - params.min;
      if (range === 0) continue;
      const normRowVal = (rowVal - params.min) / range;
      const normInput = (inputVal - params.min) / range;
      sumOfSquares += Math.pow(normRowVal - normInput, 2);
    } else {
      return Infinity;
    }
  }
  return Math.sqrt(sumOfSquares);
};

// 主表格组件
function InteractiveTable() {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]); 
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 存储 Min/Max
  const [normalizationParams, setNormalizationParams] = useState({});
  // 存储5个数值输入
  const [searchValues, setSearchValues] = useState(
    SEARCH_KEYS.reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  );
  // 存储表格排序
  const [sorting, setSorting] = useState([]);
  // 存储唯一的 Type 值
  const [uniqueTypes, setUniqueTypes] = useState([]);
  // 存储 Type 下拉框选择
  const [selectedType, setSelectedType] = useState('all');

  // --- 新增：控制搜索模式 ---
  const [searchMode, setSearchMode] = useState('similarity'); // 'similarity' 或 'type'

  // --- 数据加载 Effect (已修改) ---
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/my_data.csv');
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const headers = results.meta.fields;
          const parsedData = results.data.filter(row => row.Name); // 过滤空行

          // 1. 计算归一化参数
          const params = {};
          for (const key of SEARCH_KEYS) {
            const values = parsedData.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
            if (values.length > 0) {
              params[key] = {
                min: Math.min(...values),
                max: Math.max(...values),
              };
            }
          }
          setNormalizationParams(params);

          // 2. 提取唯一的 Type
          // .filter(Boolean) 会移除 null, undefined, "" 等空值
          const types = [...new Set(parsedData.map(row => row.Type).filter(Boolean))];
          setUniqueTypes(['all', ...types]); // 'all' 作为默认/清除选项

          // 3. 准备表格数据
          const dataWithIds = parsedData.map((row, index) => ({
            ...row,
            _id: index,
            matchScore: Infinity // 初始匹配分
          }));
          
          setOriginalData(dataWithIds);
          setData(dataWithIds);

          // 4. 生成列
          const dataColumns = headers.map((header) => ({
            accessorKey: header,
            header: header,
            cell: info => info.getValue(),
            meta: { filterComponent: ColumnFilter },
          }));
          
          const scoreColumn = {
            id: 'matchScore',
            header: '匹配度',
            accessorKey: 'matchScore',
            cell: info => (
              info.getValue() === Infinity
                ? <span className="match-score-na">-</span>
                : <span className="match-score">{info.getValue().toFixed(5)}</span>
            ),
            enableSorting: true,
            enableColumnFilter: false,
            size: 120,
          };
          
          setColumns([scoreColumn, ...dataColumns]);
          setLoading(false);
        }
      });
    }
    fetchData();
  }, []);

  // --- TanStack Table 实例 (不变) ---
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // --- 搜索表单处理函数 ---
  
  // 更新5个数值输入框
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchValues(prev => ({ ...prev, [name]: value }));
  };
  
  // 更新 Type 下拉框
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // 更新搜索模式
  const handleModeChange = (e) => {
    setSearchMode(e.target.value);
  };

  // --- 提交搜索 (逻辑已重写) ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchMode === 'similarity') {
      // 模式一：相似度搜索
      const allFilled = SEARCH_KEYS.every(key => searchValues[key] !== '');
      if (!allFilled) {
        alert("请填写所有 5 个特征值。");
        return;
      }
      
      const newData = originalData.map(row => ({
        ...row,
        matchScore: calculateDistance(row, searchValues, normalizationParams)
      }));
      
      setData(newData);
      setSorting([{ id: 'matchScore', desc: false }]); // 按匹配度升序排序

    } else if (searchMode === 'type') {
      // 模式二：按 Type 搜索
      if (selectedType === 'all') {
        alert("请选择一个具体的 Type。");
        return;
      }

      // 仅过滤 Type，重置所有行的 matchScore
      const newData = originalData
        .filter(row => row.Type === selectedType)
        .map(row => ({ ...row, matchScore: Infinity }));

      setData(newData);
      setSorting([]); // 清除排序
    }
  };
  
  // --- 清除搜索 (已重写) ---
  const handleClearSearch = () => {
    setSearchValues(SEARCH_KEYS.reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
    setSelectedType('all');
    setSearchMode('similarity'); // 重置回默认模式
    setData([...originalData]); // 重置为完整数据
    setSorting([]); // 清除排序
  };

  // --- 渲染 (Loading) ---
  if (loading) {
    return <LoadingSpinner text="正在加载数据..." />;
  }

  // --- 渲染 (主 JSX) ---
  return (
    <div>
      <SearchSection title="高级搜索">
        <form onSubmit={handleSearchSubmit}>
          {/* 1. 搜索模式选择 */}
          <div className="form-group">
            <label className="form-label">请选择搜索模式:</label>
            <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="searchMode"
                  value="similarity"
                  checked={searchMode === 'similarity'}
                  onChange={handleModeChange}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>按 5 项特征相似度搜索</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="searchMode"
                  value="type"
                  checked={searchMode === 'type'}
                  onChange={handleModeChange}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>按 Type 类型搜索</span>
              </label>
            </div>
          </div>

          <hr style={{
            border: 'none',
            borderTop: '1px solid var(--border-color)',
            margin: '24px 0'
          }} />

          {/* 2. 条件渲染的表单内容 */}

          {/* 模式一：相似度搜索表单 */}
          {searchMode === 'similarity' && (
            <div id="similarity-form">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                请输入所有 5 个特征值，将按相似度排序：
              </p>
              <div className="grid grid-3">
                {SEARCH_KEYS.map(key => (
                  <Input
                    key={key}
                    label={key}
                    type="number"
                    name={key}
                    value={searchValues[key]}
                    onChange={handleSearchChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 模式二：Type 搜索表单 */}
          {searchMode === 'type' && (
            <div id="type-form">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                请选择一个 Type，将筛选出所有匹配项：
              </p>
              <div style={{ maxWidth: '400px' }}>
                <Select
                  label="指定 Type"
                  value={selectedType}
                  onChange={handleTypeChange}
                  options={uniqueTypes.map(type => ({
                    value: type,
                    label: type === 'all' ? '--- 请选择 ---' : type,
                  }))}
                />
              </div>
            </div>
          )}

          {/* 3. 提交和清除按钮 */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button type="submit" variant="primary">
              搜索
            </Button>
            <Button type="button" variant="outline" onClick={handleClearSearch}>
              清除所有搜索
            </Button>
          </div>
        </form>
      </SearchSection>

      {/* 表格 */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} scope="col" style={{ width: header.column.getSize() }}>
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="点击排序"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                    {header.column.getCanFilter() && header.column.columnDef.meta?.filterComponent
                      ? React.createElement(header.column.columnDef.meta.filterComponent, { column: header.column })
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          显示第 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} 到{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          条，共 {table.getFilteredRowModel().rows.length} 条记录
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InteractiveTable;