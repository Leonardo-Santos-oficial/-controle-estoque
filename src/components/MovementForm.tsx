import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { toast } from 'react-hot-toast';

type MovementFormProps = {
  onClose: () => void;
};

export function MovementForm({ onClose }: MovementFormProps) {
  const addMovement = useInventoryStore((state) => state.addMovement);
  const products = useInventoryStore((state) => state.products);
  
  const [formData, setFormData] = useState({
    productId: '',
    type: 'in' as 'in' | 'out',
    quantity: 0,
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formData.quantity <= 0) {
        toast.error('A quantidade deve ser maior que zero');
        return;
      }

      if (!formData.productId) {
        toast.error('Selecione um produto');
        return;
      }

      // Verificar se o produto existe e está ativo
      const selectedProduct = products.find(p => p.id === formData.productId && p.status === 'active');
      if (!selectedProduct) {
        toast.error('Produto não encontrado ou inativo');
        return;
      }

      if (!formData.reason.trim()) {
        toast.error('Informe o motivo da movimentação');
        return;
      }

      // Validar quantidade disponível para saída
      if (formData.type === 'out' && selectedProduct.currentQuantity < formData.quantity) {
        toast.error('Quantidade insuficiente em estoque');
        return;
      }
      
      await addMovement({
        ...formData,
        timestamp: new Date(),
        userId: 'user1', // Temporário até implementar autenticação
      });

      toast.success('Movimentação registrada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao registrar movimentação');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium">Registrar Nova Movimentação</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Produto
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) => {
                  const productId = e.target.value;
                  const product = products.find(p => p.id === productId);
                  if (product) {
                    setFormData(prev => ({ ...prev, productId }));
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione um produto</option>
                {products
                  .filter(product => product.status === 'active')
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku}) - Estoque: {product.currentQuantity}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Movimentação
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value as 'in' | 'out' }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="in">Entrada</option>
                <option value="out">Saída</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Motivo
              </label>
              <input
                type="text"
                required
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
