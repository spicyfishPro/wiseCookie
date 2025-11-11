# Backend 模块 - FastAPI ML 预测服务

[根目录](../CLAUDE.md) > **backend**

> 最后更新时间：2025-11-11T15:30:03+0800

## 变更记录 (Changelog)

### 2025-11-11
- **首次生成** - 完成后端模块架构文档

---

## 模块职责

本模块是 wiseCookie 项目的后端服务，负责：

1. **机器学习模型推理**: 加载预训练的集成模型，接收输入特征并返回预测结果
2. **特征工程**: 自动添加衍生特征（如均值特征）
3. **数据预处理**: 使用 RobustScaler 和 SimpleImputer 进行数据标准化和缺失值填充
4. **RESTful API 服务**: 提供标准化的 HTTP 接口供前端调用
5. **跨域支持**: 配置 CORS 中间件允许前端跨域访问

**核心技术**：FastAPI (Web 框架), scikit-learn (机器学习), joblib (模型序列化), uvicorn (ASGI 服务器)

---

## 入口与启动

### 主入口文件

- **`main.py`**: FastAPI 应用主文件，定义所有 API 端点和中间件

### 启动命令

```bash
# 激活虚拟环境（如果使用）
source venv/bin/activate  # macOS/Linux
# 或 venv\Scripts\activate  # Windows

# 启动服务器
python main.py
```

服务将监听在 `http://127.0.0.1:23300`。

### 启动流程

1. 加载预训练模型文件：
   - `models/ensemble_model.joblib` (集成模型)
   - `models/data_processor.joblib` (数据预处理器)

2. 初始化 FastAPI 应用和 CORS 中间件

3. 暴露以下端点：
   - `GET /` - 健康检查
   - `GET /api/v1/features` - 获取模型期望的输入特征列表
   - `POST /api/v1/predict` - 执行预测

4. 启动 uvicorn 服务器

---

## 对外接口

### API 端点

#### 1. 健康检查

```http
GET /
```

**响应示例：**
```json
{
  "message": "模型预测API运行中"
}
```

#### 2. 获取特征列表

```http
GET /api/v1/features
```

**响应示例：**
```json
{
  "expected_features": [
    "Gluten_content",
    "Protein_content",
    "Hardness"
  ]
}
```

#### 3. 预测接口

```http
POST /api/v1/predict
Content-Type: application/json

{
  "features": {
    "Gluten_content": 10.5,
    "Protein_content": 22.1,
    "Hardness": 5.0
  }
}
```

**响应示例（成功）：**
```json
{
  "prediction": 85.234567
}
```

**响应示例（错误）：**
```json
{
  "detail": "缺少必要特征: ['Hardness']"
}
```

### 数据模型

#### PredictionInput (Pydantic)

```python
class PredictionInput(BaseModel):
    features: Dict[str, float]
```

**字段说明：**
- `features`: 包含所有必需特征的字典，键为特征名，值为浮点数

---

## 关键依赖与配置

### 依赖包

`requirements.txt` 中声明的主要依赖：

```
fastapi         # Web 框架
uvicorn         # ASGI 服务器（注意：文件中拼写为 vicorn，可能是笔误）
pandas          # 数据处理
scikit-learn    # 机器学习库
joblib          # 模型序列化
pydantic        # 数据验证
```

**注意**: `requirements.txt` 第 2 行的 `vicorn` 应该是 `uvicorn`，这是一个拼写错误，建议修正。

### 配置项

#### 1. 模型路径 (`main.py`)

```python
MODEL_PATH = "models/ensemble_model.joblib"
PROCESSOR_PATH = "models/data_processor.joblib"
```

#### 2. CORS 配置 (`main.py`)

允许的前端域名：

```python
origins = [
    "http://202.112.170.143:28765",
    "http://202.112.170.143",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost"
]
```

**修改方式**：根据部署环境调整 `origins` 列表。

#### 3. 期望特征 (`main.py`)

```python
EXPECTED_FEATURES = ['Gluten_content', 'Protein_content', 'Hardness']
```

**修改说明**：
- 如果更换模型或修改训练特征，需同步更新此列表
- 必须与训练时的特征列名完全一致（大小写敏感）

#### 4. 服务器监听地址 (`main.py`)

```python
uvicorn.run(app, host="127.0.0.1", port=23300)
```

**修改方式**：
- 如需允许外部访问，将 `host` 改为 `"0.0.0.0"`
- 端口可根据需要调整

---

## 数据模型

### AdvancedProcessor 类

自定义数据预处理器，负责特征工程和标准化。

**关键属性：**
- `valid_features`: 有效特征列表（去除常量列）
- `scaler`: RobustScaler 实例，用于特征缩放
- `imputer`: SimpleImputer 实例，使用中位数填充缺失值
- `feature_selector`: 特征选择器（可选，RFE）
- `numeric_cols`: 数值列名列表

**关键方法：**
- `fit(X_train, y_train)`: 拟合预处理器（训练时使用，推理时不调用）
- `transform(X)`: 对输入数据进行预处理

### 模型文件

位于 `models/` 目录：

| 文件名 | 说明 | 大小 |
|-------|------|------|
| `ensemble_model.joblib` | 当前使用的集成模型 | 未知 |
| `data_processor.joblib` | 数据预处理器 | 未知 |
| `ensemble_model.joblib.old` | 旧版本模型备份 | 未知 |
| `data_processor.joblib.old` | 旧版本预处理器备份 | 未知 |

**注意**：模型文件是二进制格式，不应纳入版本控制（建议添加到 `.gitignore`）。

---

## 特征工程流程

### 完整预测流程

1. **输入验证**
   - 检查是否提供了所有必需特征
   - 检查特征值是否为有效数字

2. **构建 DataFrame**
   - 将输入字典转换为单行 pandas DataFrame
   - 保持列顺序与 `EXPECTED_FEATURES` 一致

3. **特征工程**（`create_features` 函数）
   - 计算所有数值特征的行均值
   - 添加新列 `mean_features`

4. **数据预处理**（`AdvancedProcessor.transform`）
   - 筛选有效特征
   - 填充缺失值（使用训练时的中位数）
   - RobustScaler 标准化
   - 特征选择（如果启用 RFE）

5. **模型预测**
   - 调用集成模型的 `predict` 方法
   - 应用 sigmoid 函数并缩放到 0-100 区间

6. **后处理**
   - 使用自定义 sigmoid 函数（`k=2`）进行转换
   - 乘以 100 得到最终预测分数

### Sigmoid 转换

```python
def sigmoid(x, k=2):
    return 1 / (1 + np.exp(-k * x))

prediction = sigmoid(prediction, k=2) * 100
```

**目的**：将模型原始输出映射到 0-100 的分数区间。

---

## 测试与质量

### 当前状态

- **自动化测试**: ❌ 暂无
- **代码覆盖率**: 未测量
- **类型提示**: ✅ 使用 Pydantic 进行输入验证

### 建议的测试策略

1. **单元测试**
   - 测试 `create_features` 函数
   - 测试 `AdvancedProcessor` 的 transform 方法
   - 测试 API 端点的输入验证逻辑

2. **集成测试**
   - 测试完整的预测流程（端到端）
   - 测试模型加载和推理
   - 测试错误处理（缺失特征、无效输入）

3. **性能测试**
   - 测试预测延迟
   - 测试并发请求处理能力

### 测试工具建议

- **pytest**: 单元测试框架
- **httpx**: 异步 HTTP 客户端，用于测试 FastAPI
- **pytest-cov**: 代码覆盖率报告

---

## 常见问题 (FAQ)

### Q1: 如何更换模型？

1. 将新模型文件放入 `models/` 目录
2. 更新 `main.py` 中的 `MODEL_PATH` 和 `PROCESSOR_PATH`
3. 确保新模型的输入特征与 `EXPECTED_FEATURES` 一致
4. 重启服务

### Q2: 如何添加新的输入特征？

1. 更新 `EXPECTED_FEATURES` 列表
2. 重新训练模型（包含新特征）
3. 更新 `data_processor.joblib`
4. 通知前端开发者更新输入表单

### Q3: 预测结果的范围是多少？

当前实现将预测结果映射到 0-100 的区间，代表某种质量评分。具体含义取决于模型训练时的标签定义。

### Q4: 如何处理缺失值？

`AdvancedProcessor` 使用 `SimpleImputer(strategy='median')` 自动填充缺失值。中位数是在训练时计算的，推理时直接使用。

### Q5: CORS 错误如何解决？

在 `main.py` 的 `origins` 列表中添加前端部署的域名和端口。例如：

```python
origins = [
    "http://example.com",
    "https://example.com",
    # ... 其他域名
]
```

### Q6: 如何查看日志？

当前实现使用 `print` 输出到标准输出。建议改用 Python 的 `logging` 模块以便更好地控制日志级别和输出格式。

---

## 相关文件清单

### 核心文件

- `main.py` (157 行) - FastAPI 应用主文件
- `model_loader.py` (160 行) - 模型加载工具（似乎未被使用）
- `requirements.txt` (6 行) - 依赖声明

### 模型文件

- `models/ensemble_model.joblib` - 当前使用的模型
- `models/data_processor.joblib` - 当前使用的预处理器
- `models/*.joblib.old` - 备份文件

### 虚拟环境

- `venv/` - Python 虚拟环境（应排除在版本控制外）

---

## 下一步改进建议

### 高优先级

1. **修复拼写错误**: `requirements.txt` 中的 `vicorn` → `uvicorn`
2. **添加日志系统**: 使用 `logging` 替代 `print`
3. **环境变量配置**: 使用 `.env` 文件管理配置（如模型路径、CORS 域名）
4. **健康检查增强**: `/` 端点返回模型加载状态和版本信息

### 中优先级

5. **添加 API 文档**: 确保 FastAPI 的自动文档（`/docs`）可用
6. **输入范围验证**: 对特征值添加合理范围检查
7. **错误日志记录**: 记录预测失败的详细堆栈信息
8. **模型版本管理**: 在响应中返回模型版本号

### 低优先级

9. **异步处理**: 对于耗时的预测任务，考虑使用异步端点
10. **批量预测**: 支持一次提交多个样本
11. **缓存机制**: 对相同输入缓存预测结果
12. **监控指标**: 添加 Prometheus 指标导出

---

## 与前端的交互

### 数据流

```
Frontend → POST /api/v1/predict
         → { features: { ... } }

Backend  → 特征工程
         → 数据预处理
         → 模型推理
         → 后处理

Backend ← { prediction: float }
       ← Frontend
```

### 错误处理

| HTTP 状态码 | 原因 | 前端处理 |
|-----------|------|---------|
| 400 | 缺少必需特征或输入格式错误 | 显示错误消息，提示用户修正 |
| 500 | 服务器内部错误（模型推理失败） | 显示通用错误消息，建议重试 |

---

## 部署注意事项

### 生产环境配置

1. **修改监听地址**: `host="0.0.0.0"` 以允许外部访问
2. **使用进程管理器**: 如 systemd, supervisor, PM2
3. **反向代理**: 使用 Nginx 或 Caddy 进行反向代理
4. **HTTPS**: 配置 SSL 证书
5. **环境隔离**: 使用 Docker 容器化部署

### 安全建议

- 限制 CORS 白名单，仅允许可信域名
- 添加请求频率限制（Rate Limiting）
- 对输入数据进行严格验证
- 定期更新依赖包以修复安全漏洞
- 不要在代码中硬编码敏感信息

---

## 技术债务

- `model_loader.py` 文件存在但未被使用，考虑移除或整合到 `main.py`
- `requirements.txt` 拼写错误需修正
- 缺少自动化测试
- 缺少日志系统
- 模型路径和配置应使用环境变量
- 缺少 API 限流和认证机制
