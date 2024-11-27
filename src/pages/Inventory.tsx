import React, { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { formatQuantity } from '../utils/formatters';
import { InventoryCountForm } from '../components/InventoryCountForm';
import { toast } from 'react-hot-toast';

export function Inventory() {
  const [isCountingMode, setIsCountingMode] = useState(false);
  const products = useInventoryStore((state) => state.products);
  const updateProduct = useInventoryStore((state) => state.updateProduct);

  const handleFinishCount = (counts: Record<string, number>) => {
    // Atualiza a quantidade de cada produto contado
    Object.entries(counts).forEach(([productId, count]) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        updateProduct({
          ...product,
          currentQuantity: count,
          updatedAt: new Date(),
        });
      }
    });
    
    toast.success('Quantidades atualizadas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventário</h2>
        <button 
          onClick={() => setIsCountingMode(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Iniciar Contagem
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade Atual
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atualização
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatQuantity(product.currentQuantity, product.unit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.updatedAt.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCountingMode && (
        <InventoryCountForm
          onClose={() => setIsCountingMode(false)}
          onFinish={handleFinishCount}
        />
      )}
    </div>
  );
}