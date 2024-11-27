import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { toast } from 'react-hot-toast';
import { formatQuantity } from '../utils/formatters';

type InventoryCountFormProps = {
  onClose: () => void;
  onFinish: (counts: Record<string, number>) => void;
};

export function InventoryCountForm({ onClose, onFinish }: InventoryCountFormProps) {
  const products = useInventoryStore((state) => state.products);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const handleCountChange = (productId: string, count: number) => {
    setCounts((prev) => ({
      ...prev,
      [productId]: count,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      onFinish(counts);
      toast.success('Contagem finalizada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao finalizar contagem');
    }
  };

  const getDifference = (productId: string, currentQuantity: number) => {
    const counted = counts[productId] || 0;
    return counted - currentQuantity;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium">Contagem de Inventário</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
                    Quantidade Contada
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diferença
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const difference = getDifference(product.id, product.currentQuantity);
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatQuantity(product.currentQuantity, product.unit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="number"
                          min="0"
                          value={counts[product.id] || ''}
                          onChange={(e) => handleCountChange(product.id, Number(e.target.value))}
                          className="w-24 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`${
                            difference === 0
                              ? 'text-gray-500'
                              : difference > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {difference === 0 ? '-' : formatQuantity(difference, product.unit)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Finalizar Contagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
