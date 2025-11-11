import joblib
import pandas as pd
import numpy as np
from pydantic import BaseModel, Field
from typing import List


from sklearn.feature_selection import RFE
from sklearn.preprocessing import RobustScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Lasso

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
        self.valid_features = X_train.columns[X_train.nunique() > 1].tolist()
        X_filtered = X_train[self.valid_features].copy()
        X_filtered = pd.DataFrame(
            self.imputer.fit_transform(X_filtered),
            columns=X_filtered.columns,
            index=X_filtered.index
        )
        self.numeric_cols = X_filtered.select_dtypes(include=[np.number]).columns

        if len(self.numeric_cols) > 0:
            X_scaled = self.scaler.fit_transform(X_filtered[self.numeric_cols])
            X_filtered[self.numeric_cols] = X_scaled

            max_feat = min(12, len(y_train) // 10, len(self.numeric_cols))
            self.n_features = min(self.n_features, max_feat)

            if len(self.numeric_cols) > self.n_features:
                if self.feature_selection_method == 'rfe':
                    self.feature_selector = RFE(
                        estimator=Lasso(alpha=0.01, random_state=123, max_iter=5000),
                        n_features_to_select=self.n_features
                    )
                    self.feature_selector.fit(X_filtered[self.numeric_cols], y_train)

        self.y_mean = y_train.mean()
        return self

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


# --- 从 model.py 复制过来的辅助函数 ---
def create_features(X):
    X_new = X.copy()
    numeric_cols = X.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 0:
        X_new['mean_features'] = X_new[numeric_cols].mean(axis=1)
    return X_new

# --- 全局加载模型 ---
# 在服务器启动时只加载一次，而不是每次请求都加载
try:
    MODEL = joblib.load('./models/ensemble_model.joblib')
    PROCESSOR = joblib.load('./models/data_processor.joblib')
    print("Loaded PROCESSOR class:", getattr(PROCESSOR, "__class__", None).__module__, getattr(PROCESSOR, "__class__", None).__name__)
    print("Loaded MODEL class/module:", getattr(MODEL, "__class__", None).__module__, getattr(MODEL, "__class__", None).__name__)
    
    # 关键：从加载的处理器中获取特征列表
    # AdvancedProcessor 似乎没有直接暴露 fit 时的列名
    # 我们假设 processor.valid_features 存储了这些列
    # 如果没有，你可能需要修改 AdvancedProcessor 来保存它们
    
    # ！！！重要！！！
    # 你必须在这里定义你的模型期望的输入特征
    # 我不知道你 'model-1.txt' 里的列名，这里用 f1, f2... 代替
    # Gluten_content, Protein_content, Hardness
    # 请将 'f1', 'f2' 替换为你训练时使用的 *所有* 原始特征列名
    
    # 示例：
    EXPECTED_FEATURES = ['Gluten_content', 'Protein_content', 'Hardness']
    
    # 临时占位符，你必须修改这里
    if hasattr(PROCESSOR, 'valid_features') and PROCESSOR.valid_features is not None:
         EXPECTED_FEATURES = PROCESSOR.valid_features
    else:
        # 如果处理器没有保存，你必须手动列出它们
        # 这是一个高风险点，必须与训练数据一致
        print("警告：无法从处理器自动获取特征列表，请在 model_loader.py 中手动定义 EXPECTED_FEATURES")
        # 你必须替换这个列表
        EXPECTED_FEATURES = ['Gluten_content', 'Protein_content', 'Hardness']


except FileNotFoundError:
    print("错误：找不到模型文件。请确保 'ensemble_model.joblib' 和 'data_processor.joblib' 位于 /models 目录中")
    MODEL = None
    PROCESSOR = None
    EXPECTED_FEATURES = []


# --- 定义API的输入数据模型 ---
# 使用 Pydantic 进行数据验证
# 再次提醒：请将 'f1', 'f2' 替换为你的真实特征名
class PredictionInput(BaseModel):
    # 示例:
    # feature_A: float
    # humidity_sensor_1: float
    
    # 临时占位符 (你必须修改)
    Gluten_content: float = Field(..., example=10.5)
    Protein_content: float = Field(..., example=22.1)
    Hardness: float = Field(..., example=5.0)
    
    # 允许传入其他特征，但我们只使用 EXPECTED_FEATURES
    class Config:
        extra = 'allow'


# --- 预测函数 ---
def get_prediction(input_data: PredictionInput) -> float:
    if MODEL is None or PROCESSOR is None:
        raise RuntimeError("模型或处理器未加载")

    # 1. 将 Pydantic 输入转换为 DataFrame
    # 确保列的顺序和名称与训练时完全一致
    input_dict = input_data.model_dump()
    
    # 创建一个空的DataFrame，并填充已知的值
    # 这样可以保证即使输入缺少某些列（虽然Pydantic会检查），DataFrame的结构也是正确的
    data_for_df = {col: [input_dict.get(col)] for col in EXPECTED_FEATURES}
    
    raw_df = pd.DataFrame(data_for_df)

    # 2. 应用特征工程 (来自 model.py)
    X_enhanced = create_features(raw_df)

    # 3. 应用预处理器 (来自 model.py)
    X_processed = PROCESSOR.transform(X_enhanced)

    # 4. 进行预测
    prediction = MODEL.predict(X_processed)

    # 返回第一个（也是唯一一个）预测结果
    return float(prediction[0])