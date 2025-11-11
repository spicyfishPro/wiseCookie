import React from 'react';
import InteractiveTable from '../components/InteractiveTable';
import './TablePage.css';

function TablePage() {
  return (
    <div className="table-page">
      <div className="table-header">
        <h1>📊 数据分析工具</h1>
        <p>交互式饼干数据库，支持相似度搜索、类型筛选和多维排序</p>
      </div>
      <InteractiveTable />
    </div>
  );
}

export default TablePage;