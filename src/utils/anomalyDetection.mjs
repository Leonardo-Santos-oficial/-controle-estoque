import { IsolationForest } from 'isolation-forest';

// Função para detectar anomalias em movimentações de estoque
export function detectAnomalies(data) {
  // Selecionar características relevantes
  const features = data.map(item => [item.quantity, new Date(item.timestamp).getTime()]);
  
  // Criar e treinar o modelo Isolation Forest
  const model = new IsolationForest();
  model.fit(features);
  const scores = model.scores();
  
  // Marcar anomalias
  const anomalies = data.filter((_, index) => scores[index] < 0.5);
  return anomalies;
}

// Exemplo de uso
const data = [
  { quantity: 10, timestamp: '2023-10-01' },
  { quantity: 20, timestamp: '2023-10-02' },
  { quantity: 30, timestamp: '2023-10-03' },
  { quantity: 1000, timestamp: '2023-10-04' },
  { quantity: 50, timestamp: '2023-10-05' },
  { quantity: 60, timestamp: '2023-10-06' },
  { quantity: 70, timestamp: '2023-10-07' }
];

const anomalies = detectAnomalies(data);
console.log("Anomalias detectadas:", anomalies);
