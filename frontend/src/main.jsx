import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// 1. 导入国际化配置
import './i18n';

// 2. 在此处导入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 3. 导入我们自定义的全局样式 (放在 Bootstrap 之后，以便覆盖)
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)