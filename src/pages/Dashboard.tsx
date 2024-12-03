import { useEffect, useState } from 'react';
import { 
  FaBox, 
  FaExchangeAlt, 
  FaWarehouse, 
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle,
  FaBoxOpen
} from 'react-icons/fa';
import { useInventoryStore } from '../store/useInventoryStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calculateRestockRecommendations } from '../utils/restockRecommendation';

export function Dashboard() {
  const { 
    products, 
    movements, 
    activities,
    alerts,
    loading,
    error,
    fetchProducts,
    fetchMovements,
    fetchActivities,
    fetchAlerts,
    setActivities
  } = useInventoryStore();

  const [anomalies, setAnomalies] = useState([]);
  const [restockRecommendations, setRestockRecommendations] = useState([]);

  useEffect(() => {
    console.log('Iniciando carregamento do dashboard...');
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchMovements(),
          fetchActivities(),
          fetchAlerts()
        ]);
        console.log('Dados do dashboard carregados com sucesso!');
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    };
    loadData();
  }, [fetchProducts, fetchMovements, fetchActivities, fetchAlerts]);

  useEffect(() => {
    console.log('Atividades atuais:', activities);
    if (activities.length === 0) {
      console.warn('Nenhuma atividade encontrada. Verifique se a consulta está correta e se os dados estão sendo atualizados.');
    }
  }, [activities]);

  useEffect(() => {
    // Simular detecção de anomalias para teste
    const detectedAnomalies = detectAnomalies(movements);
    setAnomalies(detectedAnomalies);
  }, [movements]);

  useEffect(() => {
    // Preparar dados para recomendações
    const productsWithMovements = products.map(product => ({
      ...product,
      movements: movements.filter(m => m.productId === product.id)
    }));
    
    // Calcular recomendações
    const recommendations = calculateRestockRecommendations(productsWithMovements);
    setRestockRecommendations(recommendations);
  }, [products, movements]);

  const stats = [
    {
      title: 'Total de Produtos',
      value: products.length,
      icon: <FaBox className="text-blue-500" />,
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Movimentações',
      value: movements.length,
      icon: <FaExchangeAlt className="text-green-500" />,
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Itens em Estoque',
      value: products.reduce((total, product) => total + product.currentQuantity, 0),
      icon: <FaWarehouse className="text-purple-500" />,
      change: '-2%',
      changeType: 'decrease'
    },
    {
      title: 'Alertas',
      value: alerts.filter(alert => !alert.isRead).length,
      icon: <FaBell className="text-red-500" />,
      change: '+2',
      changeType: 'increase'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product_update':
        return <FaBox className="text-blue-500" />;
      case 'movement':
        return <FaExchangeAlt className="text-green-500" />;
      case 'alert':
        return <FaBell className="text-red-500" />;
      default:
        return <FaClipboardList className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-600">
            <p>Erro ao carregar dados:</p>
            <p className="mt-2">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Seção de Anomalias */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Anomalias Detectadas
              </h2>
              <div className="space-y-4">
                {anomalies.length > 0 ? (
                  anomalies.map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-red-50 rounded-full mr-4">
                          <FaExclamationTriangle className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Quantidade: {anomaly.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Data: {new Date(anomaly.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma anomalia detectada.</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={`${stat.title}-${index}`} 
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === 'increase' ? (
                    <FaArrowUp className="text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">vs último mês</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Movimentações Recentes
              </h2>
              <div className="space-y-4">
                {movements.slice(0, 5).map((movement) => {
                  const product = products.find(p => p.id === movement.productId);
                  return (
                    <div
                      key={movement.id} 
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-full mr-4">
                          <FaExchangeAlt className={movement.type === 'in' ? 'text-green-500' : 'text-red-500'} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {movement.type === 'in' ? 'Entrada' : 'Saída'} de Produto
                          </p>
                          <p className="text-sm text-gray-500">
                            {product?.name} - {movement.quantity} unidades
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(movement.timestamp), { 
                          addSuffix: true,
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Produtos Mais Movimentados
              </h2>
              <div className="space-y-4">
                {products
                  .sort((a, b) => b.currentQuantity - a.currentQuantity)
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id} 
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-50 rounded-full mr-4">
                          <FaBox className="text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.currentQuantity} unidades em estoque
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Seção de Recomendações de Reabastecimento */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Recomendações de Reabastecimento
              </h2>
              <div className="space-y-4">
                {restockRecommendations.length > 0 ? (
                  restockRecommendations.map((recommendation) => (
                    <div
                      key={recommendation.productId} 
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-4 ${
                          recommendation.urgency === 'high' 
                            ? 'bg-red-50' 
                            : recommendation.urgency === 'medium'
                            ? 'bg-yellow-50'
                            : 'bg-green-50'
                        }`}>
                          <FaBoxOpen className={`${
                            recommendation.urgency === 'high'
                              ? 'text-red-500'
                              : recommendation.urgency === 'medium'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {recommendation.productName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {recommendation.reason}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantidade Recomendada: {recommendation.recommendedQuantity} unidades
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {recommendation.estimatedDaysUntilStockout !== null 
                          ? `${recommendation.estimatedDaysUntilStockout} dias restantes`
                          : 'Sem consumo recente'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Nenhuma recomendação de reabastecimento no momento.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Atividades Recentes
              </h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-full mr-4">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === 'product_update' ? 'Produto atualizado' : 
                           activity.type === 'movement' ? 'Movimentação registrada' : 
                           'Alerta gerado'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(activity.timestamp, { 
                        addSuffix: true,
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Simulação de detecção de anomalias
function detectAnomalies(movements) {
  // Implementar lógica para detectar anomalias
  return [
    { quantity: 10, timestamp: new Date('2023-03-01T10:00:00') },
    { quantity: 20, timestamp: new Date('2023-03-05T12:00:00') },
  ];
}

export default Dashboard;