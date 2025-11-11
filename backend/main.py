from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib
from typing import List, Dict, Any
import os
import traceback
import uvicorn

from sklearn.preprocessing import RobustScaler
from sklearn.impute import SimpleImputer

# --- 自定义模块：特征工程和处理器 ---
class AdvancedProcessor:
    def __init__(self, feature_selection_method='rfe', n_features=12):
        self.valid_features = None
        self.scaler = RobustScaler()
        self.y_mean = None
        self.numeric_cols = None
        self.feature_selector = None
        self.imputer = SimpleImputer(strategy='median')
        self.feature_selection_method = feature_selection_method
        self.n_features = n_features

    def fit(self, X_train, y_train):
        # This method is not used in inference, but kept for completeness
        pass

    def transform(self, X):
        X_filtered = X[self.valid_features].copy()
        X_filtered = pd.DataFrame(
            self.imputer.transform(X_filtered),
            columns=X_filtered.columns,
            index=X_filtered.index
        )
        if self.numeric_cols is not None and len(self.numeric_cols) > 0:
            X_filtered[self.numeric_cols] = self.scaler.transform(X_filtered[self.numeric_cols])
            if self.feature_selector is not None:
                selected_mask = self.feature_selector.get_support()
                if len(selected_mask) == len(self.numeric_cols):
                    selected_features = self.numeric_cols[selected_mask]
                    X_filtered = X_filtered[selected_features]
        return X_filtered

def create_features(X):
    """添加均值特征"""
    X_new = X.copy()
    numeric_cols = X.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 0:
        X_new['mean_features'] = X_new[numeric_cols].mean(axis=1)
    return X_new

# --- 配置路径（请根据你的实际路径修改）---
MODEL_PATH = "models/ensemble_model.joblib"
PROCESSOR_PATH = "models/data_processor.joblib"

# 检查模型和处理器是否存在
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"模型文件未找到: {MODEL_PATH}")
if not os.path.exists(PROCESSOR_PATH):
    raise FileNotFoundError(f"处理器文件未找到: {PROCESSOR_PATH}")

# 加载模型和处理器（启动时一次性加载）
model = joblib.load(MODEL_PATH)
processor = joblib.load(PROCESSOR_PATH)

# 获取模型期望的原始特征（训练时的输入列名，不包括 'mean_features'）
# 注意：processor.valid_features 是训练时保留的列（去除了常量列）
EXPECTED_FEATURES = ['Gluten_content', 'Protein_content', 'Hardness'] # processor.valid_features  # 这是前端应提供的字段列表
print(EXPECTED_FEATURES)

# --- FastAPI 应用 ---
app = FastAPI(
    title="机器学习模型预测 API",
    description="一个用于 'ensemble_only_regression' 模型的API."
)

# --- CORS 配置 ---
origins = [
    "http://202.112.170.143:28765",
    "http://202.112.170.143",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic 输入模型 ---
class PredictionInput(BaseModel):
    features: Dict[str, float]  # 例如 {"feature1": 1.2, "feature2": 3.4, ...}

# --- API 端点 ---
@app.get("/")
def read_root():
    return {"message": "模型预测API运行中"}

@app.get("/api/v1/features")
def get_features_list():
    """返回模型期望的输入特征列表"""
    return {"expected_features": EXPECTED_FEATURES}

@app.post("/api/v1/predict")
def predict(input_data: PredictionInput):
    """
    接收特征字典，进行特征工程、预处理并返回预测结果。
    """
    try:
        # 1. 验证输入特征是否完整
        provided_features = set(input_data.features.keys())
        expected_set = set(EXPECTED_FEATURES)
        missing = expected_set - provided_features
        extra = provided_features - expected_set

        if missing:
            raise ValueError(f"缺少必要特征: {sorted(missing)}")
        if extra:
            # 可选：忽略多余特征，或报错。这里选择忽略
            pass

        # 2. 构建 DataFrame（单样本）
        # 保持列顺序与 EXPECTED_FEATURES 一致
        input_dict = {feat: input_data.features.get(feat, 0.0) for feat in EXPECTED_FEATURES}
        df = pd.DataFrame([input_dict])

        # 3. 特征工程：添加 mean_features
        df_enhanced = create_features(df)

        # 4. 预处理（使用已加载的 processor）
        df_processed = processor.transform(df_enhanced)
        def sigmoid(x, k=2):
            return 1 / (1 + np.exp(-k * x))
        
        # 5. 预测
        prediction = model.predict(df_processed)[0]  # 单样本，取第一个
        prediction = sigmoid(prediction, k=2) * 100

        return {"prediction": float(prediction)}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"输入数据错误: {e}")
    except Exception as e:
        error_detail = f"预测过程中发生错误: {e}\n{traceback.format_exc()}"
        print(error_detail)  # 服务端日志
        raise HTTPException(status_code=500, detail="内部服务器错误，请检查输入格式或联系管理员")

# --- 启动服务器 ---
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=23300)