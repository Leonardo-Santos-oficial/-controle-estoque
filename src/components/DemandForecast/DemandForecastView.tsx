import React, { useEffect, useState } from 'react';
import { demandForecastService, ForecastResult } from '../../services/demandForecastService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Props {
  productId: string;
}

export const DemandForecastView: React.FC<Props> = ({ productId }) => {
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForecast = async () => {
      try {
        setLoading(true);
        const result = await demandForecastService.getProductForecast(productId);
        setForecast(result);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar previsão');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (!forecast) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Previsão de Demanda</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Demanda Prevista</h3>
          <p className="text-3xl font-bold text-blue-600">
            {forecast.predictedDemand.toFixed(0)} unidades
          </p>
          <p className="text-sm text-gray-600">
            Confiança: {(forecast.confidence * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Próximo Pedido</h3>
          <p className="text-3xl font-bold text-green-600">
            {forecast.suggestedQuantity.toFixed(0)} unidades
          </p>
          <p className="text-sm text-gray-600">
            Data sugerida: {new Date(forecast.nextReorderDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Tendência de Demanda</h3>
        <div className="h-64">
          <LineChart
            width={600}
            height={250}
            data={[
              { name: 'Atual', value: forecast.predictedDemand },
              { name: 'Previsto', value: forecast.suggestedQuantity }
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};
