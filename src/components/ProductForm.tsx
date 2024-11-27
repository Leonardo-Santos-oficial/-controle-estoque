import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { UNITS } from '../utils/constants';
import { toast } from 'react-hot-toast';

type ProductFormProps = {
  onClose: () => void;
  initialData?: Product;
};

export function ProductForm({ onClose, initialData }: ProductFormProps) {
  const addProduct = useInventoryStore((state) => state.addProduct);
  const updateProduct = useInventoryStore((state) => state.updateProduct);
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      sku: '',
      description: '',
      category: '',
      unit: 'un',
      minQuantity: 0,
      currentQuantity: 0,
      supplier: '',
      price: 0,
      location: {
        sector: '',
        shelf: '',
        position: '',
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (initialData) {
        await updateProduct({
          ...formData,
          id: initialData.id,
          updatedAt: new Date(),
        });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await addProduct({
          ...formData,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('Produto adicionado com sucesso!');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar produto');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium">{initialData ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Produto
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sku: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unidade de Medida
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade Mínima
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.minQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minQuantity: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade Atual
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.currentQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentQuantity: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fornecedor
              </label>
              <input
                type="text"
                required
                value={formData.supplier}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, supplier: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Localização
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Setor
                  </label>
                  <input
                    type="text"
                    value={formData.location.sector}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, sector: e.target.value },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prateleira
                  </label>
                  <input
                    type="text"
                    value={formData.location.shelf}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, shelf: e.target.value },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Posição
                  </label>
                  <input
                    type="text"
                    value={formData.location.position}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, position: e.target.value },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialData ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}