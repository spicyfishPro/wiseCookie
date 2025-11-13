import React from 'react';
import InteractiveTable from '../components/InteractiveTable';

function TablePage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">饼干性质数据表</h1>
        <p className="page-subtitle">
          浏览和分析现有的饼干数据集，支持按类型筛选、相似度搜索和多种排序方式
        </p>
      </div>
      <InteractiveTable />
    </div>
  );
}

export default TablePage;