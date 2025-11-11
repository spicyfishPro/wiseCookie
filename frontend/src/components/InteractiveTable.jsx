import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

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
                ? <span className="text-muted">-</span>
                : <strong className="text-success">{info.getValue().toFixed(5)}</strong>
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

  // --- 渲染 (Loading) (不变) ---
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">正在加载...</span>
        </div>
        <span className="ms-3">正在加载数据...</span>
      </div>
    );
  }

  // --- 渲染 (主 JSX) (已重写) ---
  return (
    <div>
      <div className="card mb-4">
        <div className="card-header">
          <strong>高级搜索</strong>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearchSubmit}>
            
            {/* 1. 搜索模式选择 */}
            <div className="mb-3">
              <label className="form-label">请选择搜索模式:</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchMode"
                  id="mode-similarity"
                  value="similarity"
                  checked={searchMode === 'similarity'}
                  onChange={handleModeChange}
                />
                <label className="form-check-label" htmlFor="mode-similarity">
                  按 5 项特征相似度搜索
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="searchMode"
                  id="mode-type"
                  value="type"
                  checked={searchMode === 'type'}
                  onChange={handleModeChange}
                />
                <label className="form-check-label" htmlFor="mode-type">
                  按 Type 类型搜索
                </label>
              </div>
            </div>

            <hr />

            {/* 2. 条件渲染的表单内容 */}
            
            {/* 模式一：相似度搜索表单 */}
            {searchMode === 'similarity' && (
              <div id="similarity-form">
                <p>请输入所有 5 个特征值，将按相似度排序：</p>
                <div className="row g-3">
                  {SEARCH_KEYS.map(key => (
                    <div className="col-md-4 col-lg" key={key}>
                      <label htmlFor={key} className="form-label">{key}</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        id={key}
                        name={key}
                        value={searchValues[key]}
                        onChange={handleSearchChange}
                        required // 仅在此模式下必填
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 模式二：Type 搜索表单 */}
            {searchMode === 'type' && (
              <div id="type-form">
                <p>请选择一个 Type，将筛选出所有匹配项：</p>
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="type-select" className="form-label">
                      指定 Type
                    </label>
                    <select 
                      id="type-select" 
                      className="form-select" 
                      value={selectedType} 
                      onChange={handleTypeChange}
                    >
                      {uniqueTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'all' ? '--- 请选择 ---' : type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* 3. 提交和清除按钮 */}
            <div className="mt-3">
              <button type="submit" className="btn btn-primary me-2">
                搜索
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleClearSearch}>
                清除所有搜索
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 表格 (不变) */}
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered table-sm">
          {/* ... (thead 和 tbody 渲染逻辑不变) ... */}
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} scope="col" style={{ width: header.getSize() !== 150 ? undefined : header.getSize() }}>
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className={header.column.getCanSort() ? 'cursor-pointer' : ''}
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

      {/* 分页 (不变) */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        {/* ... (分页控件不变) ... */}
      </div>
    </div>
  );
}

export default InteractiveTable;