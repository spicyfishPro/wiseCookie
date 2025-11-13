import React from 'react';
import InteractiveTable from '../components/InteractiveTable'; 

function TablePage() {
  return (
    <div>
      <h1>饼干性质</h1>
      <p>
        饼干性质的可交互表格。
      </p>
      <hr style={{ margin: '20px 0' }} />
      <InteractiveTable />
    </div>
  );
}

export default TablePage;