# Frontend 模块 - React Web 应用

[根目录](../CLAUDE.md) > **frontend**

> 最后更新时间：2025-11-11T15:30:03+0800

## 变更记录 (Changelog)

### 2025-11-11
- **首次生成** - 完成前端模块架构文档

---

## 模块职责

本模块是 wiseCookie 项目的前端应用，负责：

1. **用户界面**: 提供直观的 Web 界面供用户交互
2. **模型预测表单**: 动态生成输入表单，调用后端 API 进行预测
3. **数据可视化**: 以交互式表格展示 CSV 数据
4. **相似度搜索**: 基于多维特征计算样本相似度
5. **类型筛选**: 支持按类别筛选数据
6. **客户端路由**: 使用 React Router 实现单页应用导航

**核心技术**: React 19, Vite 7, React Router DOM, TanStack Table, Axios, PapaParse

---

## 入口与启动

### 主入口文件

- **`index.html`**: HTML 模板
- **`src/main.jsx`**: JavaScript 应用入口，挂载 React 应用
- **`src/App.jsx`**: 根组件，定义路由结构

### 启动命令

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

**开发服务器**：默认运行在 `http://localhost:5173`

### 启动流程

1. Vite 加载 `index.html`
2. 引入 `src/main.jsx` 作为入口模块
3. React 渲染 `<App />` 组件
4. React Router 根据 URL 渲染对应页面组件

---

## 对外接口

本模块作为客户端应用，不直接对外暴露 API，但通过以下方式与用户和后端交互：

### 用户界面路由

| 路由 | 页面组件 | 功能描述 |
|------|---------|---------|
| `/` | `HomePage` | 首页，展示项目介绍和导航链接 |
| `/predict` | `PredictPage` | 模型预测页面，提供输入表单 |
| `/table` | `TablePage` | 数据表格页面，支持搜索和筛选 |

### 调用的后端 API

**后端基础 URL**: `http://202.112.170.143:23300`（配置在 `PredictionForm.jsx`）

| 端点 | 方法 | 用途 | 调用位置 |
|-----|------|------|---------|
| `/api/v1/features` | GET | 获取模型期望的特征列表 | `PredictionForm.jsx` (useEffect) |
| `/api/v1/predict` | POST | 提交特征数据进行预测 | `PredictionForm.jsx` (handleSubmit) |

---

## 关键依赖与配置

### 依赖包

#### 核心依赖

```json
{
  "react": "^19.1.1",               // React 核心库
  "react-dom": "^19.1.1",           // React DOM 渲染
  "react-router-dom": "^7.9.4",     // 客户端路由
  "@tanstack/react-table": "^8.21.3", // 强大的表格库
  "axios": "^1.12.2",               // HTTP 客户端
  "papaparse": "^5.5.3"             // CSV 解析库
}
```

#### 开发依赖

```json
{
  "@vitejs/plugin-react": "^5.0.4", // Vite React 插件
  "vite": "^7.1.7",                 // 构建工具
  "eslint": "^9.36.0",              // 代码检查
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.22"
}
```

### 配置文件

#### 1. Vite 配置 (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**说明**: 最小化配置，使用默认的 Vite React 插件。

#### 2. ESLint 配置 (`eslint.config.js`)

- 基于 ESLint 9 的扁平配置格式
- 启用 React Hooks 和 React Refresh 规则
- 忽略 `dist/` 目录
- 自定义规则：忽略大写字母开头的未使用变量（组件名）

#### 3. 后端 API 地址

**位置**: `src/components/PredictionForm.jsx` 第 5 行

```javascript
const API_URL = 'http://202.112.170.143:23300';
```

**修改方式**: 根据后端部署地址修改此常量。建议使用环境变量：

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:23300';
```

然后在 `.env` 文件中配置：
```
VITE_API_URL=http://your-backend-host:23300
```

---

## 数据模型

### CSV 数据结构 (`public/my_data.csv`)

**位置**: `frontend/public/my_data.csv`

**关键字段**（从 `InteractiveTable.jsx` 推断）：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| `Name` | 字符串 | 样本名称（必需，用于过滤空行） |
| `Type` | 字符串 | 样本类型/分类 |
| `Spread ratio` | 数值 | 扩散比率（用于相似度计算） |
| `Cookie hardness` | 数值 | 饼干硬度（用于相似度计算） |
| `WI` | 数值 | WI 指标（用于相似度计算） |
| `Crack Ratio` | 数值 | 裂纹比率（用于相似度计算） |
| `Sensory score` | 数值 | 感官评分（用于相似度计算） |

**注意**: CSV 文件应放在 `public/` 目录下，部署时会被复制到构建输出的根目录。

### 组件状态管理

#### PredictionForm 组件状态

```javascript
const [formData, setFormData] = useState({});       // 表单输入数据
const [expectedFeatures, setExpectedFeatures] = useState([]); // 特征列表
const [prediction, setPrediction] = useState(null); // 预测结果
const [isLoading, setIsLoading] = useState(false);  // 加载状态
const [error, setError] = useState(null);           // 错误消息
```

#### InteractiveTable 组件状态

```javascript
const [originalData, setOriginalData] = useState([]);     // 原始数据
const [data, setData] = useState([]);                     // 当前显示数据
const [searchValues, setSearchValues] = useState({...}); // 搜索输入
const [selectedType, setSelectedType] = useState('all'); // 类型筛选
const [searchMode, setSearchMode] = useState('similarity'); // 搜索模式
const [sorting, setSorting] = useState([]);               // 排序状态
```

---

## 页面与组件

### 页面组件 (`src/pages/`)

#### HomePage.jsx

**职责**: 首页，展示项目介绍和导航链接。

**关键元素**:
- 项目说明文本
- 指向 `/predict` 和 `/table` 的链接

#### PredictPage.jsx

**职责**: 模型预测页面容器。

**子组件**:
- `<PredictionForm />` - 实际的预测表单

#### TablePage.jsx

**职责**: 数据表格页面容器。

**子组件**:
- `<InteractiveTable />` - 交互式数据表格

---

### 可复用组件 (`src/components/`)

#### Navbar.jsx

**职责**: 顶部导航栏，提供全站导航。

**功能**:
- 显示应用标题 "ML 预测平台"
- 导航链接：首页、模型预测、交互表格
- 使用 React Router 的 `<Link>` 实现客户端路由

**样式**: 内联样式（深蓝灰色背景，白色文字）

#### PredictionForm.jsx (120 行)

**职责**: 动态生成预测输入表单，调用后端 API。

**主要功能**:

1. **动态加载特征列表**
   - 在组件挂载时调用 `GET /api/v1/features`
   - 根据返回的特征列表动态生成输入框

2. **表单验证**
   - 确保所有字段已填写
   - 转换输入为数字类型

3. **提交预测请求**
   - 构造 `{ features: {...} }` 格式的请求体
   - 调用 `POST /api/v1/predict`
   - 显示预测结果或错误消息

**核心代码片段**:

```javascript
// 获取特征列表
useEffect(() => {
  axios.get(`${API_URL}/api/v1/features`)
    .then(response => {
      const features = response.data.expected_features;
      setExpectedFeatures(features);
      // 初始化表单数据
      const initialForm = features.reduce((acc, feature) => {
        acc[feature] = '';
        return acc;
      }, {});
      setFormData(initialForm);
    })
    .catch(err => {
      setError('无法从后端加载特征列表。');
    });
}, []);

// 提交预测
const handleSubmit = (e) => {
  e.preventDefault();
  const payload = { features: formData };
  axios.post(`${API_URL}/api/v1/predict`, payload)
    .then(response => {
      setPrediction(response.data.prediction);
    })
    .catch(err => {
      setError(err.response?.data?.detail || '预测失败');
    });
};
```

#### InteractiveTable.jsx (399 行)

**职责**: 交互式数据表格，支持相似度搜索和类型筛选。

**主要功能**:

1. **CSV 数据加载**
   - 使用 PapaParse 解析 `public/my_data.csv`
   - 动态生成表格列
   - 计算归一化参数（每个数值特征的 min/max）

2. **相似度搜索**
   - 用户输入 5 个特征值
   - 计算所有样本与输入的归一化欧氏距离
   - 按距离升序排序（最相似在前）

3. **类型筛选**
   - 提取 CSV 中唯一的 `Type` 值
   - 用户选择类型，筛选出匹配的行

4. **表格功能**（基于 TanStack Table）
   - 列排序（点击表头）
   - 列过滤（每列搜索框）
   - 分页（默认每页显示一定行数）

**相似度计算算法**:

```javascript
const calculateDistance = (row, inputs, normParams) => {
  let sumOfSquares = 0;
  for (const key of SEARCH_KEYS) {
    const params = normParams[key];
    const rowVal = parseFloat(row[key]);
    const inputVal = parseFloat(inputs[key]);

    if (params && !isNaN(rowVal) && !isNaN(inputVal)) {
      const range = params.max - params.min;
      if (range === 0) continue;
      // 归一化到 [0, 1]
      const normRowVal = (rowVal - params.min) / range;
      const normInput = (inputVal - params.min) / range;
      sumOfSquares += Math.pow(normRowVal - normInput, 2);
    } else {
      return Infinity; // 无效值，不参与排序
    }
  }
  return Math.sqrt(sumOfSquares); // 欧氏距离
};
```

**搜索模式**:

| 模式 | 描述 | 必填字段 | 结果处理 |
|-----|------|---------|---------|
| `similarity` | 相似度搜索 | 5 个数值特征 | 计算距离，按升序排序 |
| `type` | 类型筛选 | Type 下拉选择 | 过滤匹配的行 |

---

## 样式与设计

### 全局样式 (`src/index.css`)

- 包含自定义全局样式
- 放在 Bootstrap CSS 之后，用于覆盖默认样式

### UI 框架

**Bootstrap 5** (通过 CDN 导入)

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

**使用场景**:
- `InteractiveTable` 使用 Bootstrap 表格和表单类
- 响应式布局（`container`, `row`, `col-*`）
- 按钮和卡片样式

### 内联样式

部分组件（如 `Navbar`, `PredictionForm`）使用内联样式对象：

```javascript
const navStyle = {
  backgroundColor: '#2c3e50',
  padding: '1rem 2rem',
  // ...
};
```

**建议**: 考虑迁移到 CSS Modules 或 styled-components 以便更好的样式管理。

---

## 测试与质量

### 当前状态

- **自动化测试**: ❌ 暂无
- **代码检查**: ✅ ESLint 配置
- **类型检查**: ❌ 未使用 TypeScript

### 建议的测试策略

1. **单元测试**
   - 测试 `calculateDistance` 函数
   - 测试表单验证逻辑
   - 测试状态更新逻辑

2. **组件测试**
   - 使用 React Testing Library 测试组件渲染
   - 测试用户交互（点击、输入、提交）
   - 模拟 API 响应

3. **端到端测试**
   - 使用 Playwright 或 Cypress
   - 测试完整的用户流程
   - 测试与后端 API 的集成

### 测试工具建议

- **Vitest**: Vite 原生的测试框架
- **React Testing Library**: React 组件测试
- **MSW (Mock Service Worker)**: 模拟 API 请求
- **Playwright**: 端到端测试

---

## 常见问题 (FAQ)

### Q1: 如何修改后端 API 地址？

在 `src/components/PredictionForm.jsx` 中修改 `API_URL` 常量：

```javascript
const API_URL = 'http://your-backend-url:port';
```

建议使用环境变量（见"关键依赖与配置"章节）。

### Q2: 如何添加新的页面？

1. 在 `src/pages/` 创建新组件，如 `NewPage.jsx`
2. 在 `src/App.jsx` 的 `<Routes>` 中添加路由：
   ```javascript
   <Route path="/new" element={<NewPage />} />
   ```
3. 在 `Navbar.jsx` 添加导航链接：
   ```javascript
   <Link to="/new" style={linkStyle}>新页面</Link>
   ```

### Q3: CSV 文件如何更新？

将新的 CSV 文件放入 `public/` 目录，覆盖 `my_data.csv`。确保列名与代码中使用的一致（特别是 `SEARCH_KEYS` 中的 5 个字段）。

### Q4: 表格分页如何配置？

TanStack Table 默认启用分页。可在 `InteractiveTable.jsx` 中配置每页行数：

```javascript
const table = useReactTable({
  // ...
  initialState: {
    pagination: { pageSize: 20 } // 每页显示 20 行
  }
});
```

### Q5: 如何调整相似度计算的特征？

修改 `InteractiveTable.jsx` 中的 `SEARCH_KEYS` 常量：

```javascript
const SEARCH_KEYS = [
  'Feature1',
  'Feature2',
  // ... 根据需要添加或删除
];
```

确保这些字段在 CSV 文件中存在。

### Q6: 为什么预测表单没有显示？

可能原因：
1. 后端 `/api/v1/features` 端点不可访问（检查网络和 CORS）
2. 后端返回的特征列表为空
3. 浏览器控制台查看错误信息

---

## 相关文件清单

### 核心文件

- `src/main.jsx` (18 行) - 应用入口
- `src/App.jsx` (29 行) - 根组件和路由配置
- `src/index.css` - 全局样式

### 页面组件

- `src/pages/HomePage.jsx` (23 行) - 首页
- `src/pages/PredictPage.jsx` (17 行) - 预测页面
- `src/pages/TablePage.jsx` (17 行) - 表格页面

### 可复用组件

- `src/components/Navbar.jsx` (38 行) - 导航栏
- `src/components/PredictionForm.jsx` (120 行) - 预测表单
- `src/components/InteractiveTable.jsx` (399 行) - 交互表格

### 配置文件

- `package.json` - 依赖和脚本
- `vite.config.js` - Vite 配置
- `eslint.config.js` - ESLint 配置
- `index.html` - HTML 模板

### 静态资源

- `public/my_data.csv` - 饼干性质数据
- `public/vite.svg` - Vite 图标

### 其他

- `node_modules/` - 依赖包（应排除在版本控制外）
- `README.md` - React + Vite 模板说明

---

## 下一步改进建议

### 高优先级

1. **使用环境变量管理 API 地址**: 避免硬编码，便于多环境部署
2. **添加加载状态**: 在数据加载时显示加载指示器
3. **错误边界**: 添加 React Error Boundary 捕获组件错误
4. **无障碍优化**: 添加 ARIA 标签，改善键盘导航

### 中优先级

5. **迁移到 TypeScript**: 提升代码健壮性和可维护性
6. **组件测试**: 添加单元测试和集成测试
7. **样式模块化**: 使用 CSS Modules 或 styled-components
8. **代码拆分**: 使用 React.lazy 进行路由级别的代码分割

### 低优先级

9. **数据可视化**: 添加图表（如 Chart.js, Recharts）展示预测趋势
10. **历史记录**: 在本地存储用户的预测历史
11. **批量预测**: 支持上传 CSV 进行批量预测
12. **国际化**: 支持多语言切换

---

## 性能优化

### 当前性能瓶颈

1. **大型 CSV 加载**: 如果 `my_data.csv` 很大，解析和渲染可能较慢
2. **全量数据渲染**: 没有虚拟滚动，大数据集性能下降

### 优化建议

1. **虚拟化表格**: 使用 `@tanstack/react-virtual` 或 `react-window`
2. **懒加载**: 按需加载数据（分页或滚动加载）
3. **Memoization**: 使用 `useMemo` 缓存计算结果（如相似度计算）
4. **Web Worker**: 将耗时计算移到 Worker 线程
5. **代码拆分**: 按路由拆分打包，减少初始加载体积

---

## 部署注意事项

### 生产构建

```bash
npm run build
```

构建输出位于 `dist/` 目录。

### 静态托管

可部署到以下平台：
- **Netlify**: 自动检测 Vite 项目
- **Vercel**: 零配置部署
- **GitHub Pages**: 需配置 base 路径
- **Nginx**: 配置静态文件服务和 SPA 路由重写

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html; # SPA 路由回退
    }

    location /api/ {
        proxy_pass http://backend:23300; # 反向代理后端 API
    }
}
```

### 环境变量配置

在 Vite 中，环境变量必须以 `VITE_` 开头：

**.env.production**:
```
VITE_API_URL=https://api.your-domain.com
```

在代码中访问：
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 与后端的交互

### 数据流图

```
User Input → PredictionForm
           → axios.post('/api/v1/predict')
           → Backend API
           → Model Inference
           ← Response { prediction: number }
           ← Update UI (显示结果)
```

### 错误处理

| 场景 | 前端处理 |
|-----|---------|
| 网络错误 | 显示 "无法连接到服务器" |
| 400 错误 | 显示后端返回的 `detail` 消息 |
| 500 错误 | 显示通用错误消息 |
| CORS 错误 | 检查后端 CORS 配置 |

---

## 技术债务

- 缺少自动化测试
- 硬编码的 API 地址
- 部分组件使用内联样式，不利于维护
- 缺少 TypeScript 类型安全
- `InteractiveTable.jsx` 组件过大（399 行），应拆分
- 缺少错误边界
- 缺少加载状态动画
- CSV 文件路径硬编码

---

## 相关资源

- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vite.dev/)
- [TanStack Table 文档](https://tanstack.com/table/)
- [React Router 文档](https://reactrouter.com/)
- [Axios 文档](https://axios-http.com/)
- [PapaParse 文档](https://www.papaparse.com/)
