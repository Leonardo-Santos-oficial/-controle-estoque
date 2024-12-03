import { detectAnomalies } from './anomalyDetection.mjs';

// Função de teste para verificar a detecção de anomalias
function testAnomalyDetection() {
  // Dados de exemplo
  const data = [
    { quantity: 10, timestamp: '2023-10-01' },
    { quantity: 20, timestamp: '2023-10-02' },
    { quantity: 30, timestamp: '2023-10-03' },
    { quantity: 1000, timestamp: '2023-10-04' }, // Anomalia
    { quantity: 50, timestamp: '2023-10-05' },
    { quantity: 60, timestamp: '2023-10-06' },
    { quantity: 70, timestamp: '2023-10-07' }
  ];

  // Detectar anomalias
  const anomalies = detectAnomalies(data);

  // Exibir resultados
  console.log("Anomalias detectadas:", anomalies);
}

// Executar teste
testAnomalyDetection();
