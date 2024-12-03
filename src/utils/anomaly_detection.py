import pandas as pd
from sklearn.ensemble import IsolationForest

# Função para detectar anomalias em movimentações de estoque
def detect_anomalies(data: pd.DataFrame) -> pd.DataFrame:
    # Selecionar características relevantes
    features = data[['quantity', 'timestamp']]
    
    # Normalizar dados
    features['timestamp'] = features['timestamp'].astype('int64')
    
    # Criar e treinar o modelo Isolation Forest
    model = IsolationForest(contamination=0.05, random_state=42)
    data['anomaly'] = model.fit_predict(features)
    
    # Marcar anomalias
    anomalies = data[data['anomaly'] == -1]
    return anomalies

# Exemplo de uso
if __name__ == "__main__":
    # Dados de exemplo
    data = pd.DataFrame({
        'quantity': [10, 20, 30, 1000, 50, 60, 70],
        'timestamp': pd.to_datetime([
            '2023-10-01', '2023-10-02', '2023-10-03',
            '2023-10-04', '2023-10-05', '2023-10-06', '2023-10-07'
        ])
    })
    
    anomalies = detect_anomalies(data)
    print("Anomalias detectadas:")
    print(anomalies)
