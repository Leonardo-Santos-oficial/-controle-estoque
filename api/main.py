from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SaleHistory(BaseModel):
    productId: str
    date: str
    quantity: int

class ForecastResult(BaseModel):
    productId: str
    predictedDemand: float
    confidence: float
    nextReorderDate: str
    suggestedQuantity: float

class BatchForecastRequest(BaseModel):
    productIds: List[str]

# Diretório para armazenar modelos treinados
MODEL_DIR = "models"
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def train_model(sales_data: List[SaleHistory], product_id: str):
    """Treina um modelo de previsão para um produto específico."""
    
    # Converte dados para DataFrame
    df = pd.DataFrame([s.dict() for s in sales_data])
    df['date'] = pd.to_datetime(df['date'])
    
    # Cria features temporais
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['dayofweek'] = df['date'].dt.dayofweek
    
    # Prepara dados para treinamento
    X = df[['year', 'month', 'day', 'dayofweek']].values
    y = df['quantity'].values
    
    # Normaliza features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Treina modelo
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)
    
    # Salva modelo e scaler
    model_path = os.path.join(MODEL_DIR, f"model_{product_id}.joblib")
    scaler_path = os.path.join(MODEL_DIR, f"scaler_{product_id}.joblib")
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    return model, scaler

def load_model(product_id: str):
    """Carrega modelo treinado para um produto específico."""
    model_path = os.path.join(MODEL_DIR, f"model_{product_id}.joblib")
    scaler_path = os.path.join(MODEL_DIR, f"scaler_{product_id}.joblib")
    
    try:
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        return model, scaler
    except:
        return None, None

@app.post("/api/sales-data")
async def submit_sales_data(sales_data: List[SaleHistory]):
    """Endpoint para receber dados históricos de vendas e treinar modelo."""
    try:
        # Agrupa dados por produto
        product_groups = {}
        for sale in sales_data:
            if sale.productId not in product_groups:
                product_groups[sale.productId] = []
            product_groups[sale.productId].append(sale)
        
        # Treina modelo para cada produto
        for product_id, product_sales in product_groups.items():
            train_model(product_sales, product_id)
        
        return {"message": "Dados processados com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/forecast/{product_id}")
async def get_product_forecast(product_id: str):
    """Endpoint para obter previsão de demanda para um produto específico."""
    try:
        model, scaler = load_model(product_id)
        if not model:
            raise HTTPException(status_code=404, detail="Modelo não encontrado para este produto")
        
        # Prepara dados para previsão
        today = datetime.now()
        next_date = today + timedelta(days=30)  # Previsão para próximo mês
        
        X_pred = np.array([[
            next_date.year,
            next_date.month,
            next_date.day,
            next_date.weekday()
        ]])
        
        X_pred_scaled = scaler.transform(X_pred)
        
        # Faz previsão
        prediction = model.predict(X_pred_scaled)[0]
        confidence = 0.8  # Simplificado - em produção, calcular baseado no modelo
        
        # Calcula data sugerida para próximo pedido
        reorder_date = today + timedelta(days=15)  # Simplificado
        
        return ForecastResult(
            productId=product_id,
            predictedDemand=float(prediction),
            confidence=confidence,
            nextReorderDate=reorder_date.isoformat(),
            suggestedQuantity=float(prediction * 1.2)  # Adiciona margem de segurança
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/batch-forecast")
async def get_batch_forecast(request: BatchForecastRequest):
    """Endpoint para obter previsões em lote para múltiplos produtos."""
    try:
        results = []
        for product_id in request.productIds:
            try:
                forecast = await get_product_forecast(product_id)
                results.append(forecast)
            except HTTPException:
                continue
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
