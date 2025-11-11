import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PredictPage from './pages/PredictPage'
import TablePage from './pages/TablePage'

function App() {
  return (
    <div className="App">
      {/* 1. 导航栏始终显示在所有页面顶部 */}
      <Navbar />

      {/* 2. 主内容区域，应用了 .content-container 样式 */}
      <div className="content-container">
        {/* Routes 会根据当前 URL 匹配第一个符合的 Route, 
          并渲染其 element 
        */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/table" element={<TablePage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App