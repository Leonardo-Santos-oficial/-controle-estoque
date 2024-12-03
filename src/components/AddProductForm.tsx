import React, { useState, useEffect } from 'react';
import { classifyNewProduct, getCategoryName } from '../utils/productClassification';

interface AddProductFormProps {
  onSubmit: (product: any) => void;
}

export function AddProductForm({ onSubmit }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    characteristics: '',
    price: '',
    quantity: '',
  });

  const [classification, setClassification] = useState<{
    categoryId: string;
    confidence: number;
    suggestedCategories: Array<{ id: string; confidence: number }>;
  } | null>(null);

  // Atualizar classificação quando o nome ou descrição mudar
  useEffect(() => {
    if (formData.name || formData.description) {
      const result = classifyNewProduct({
        name: formData.name,
        description: formData.description,
        characteristics: formData.characteristics.split(',').map(c => c.trim())
      });
      setClassification(result);
    }
  }, [formData.name, formData.description, formData.characteristics]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      categoryId: classification?.categoryId,
      categoryConfidence: classification?.confidence
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome do Produto
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Características (separadas por vírgula)
        </label>
        <input
          type="text"
          name="characteristics"
          value={formData.characteristics}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preço
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantidade
        </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {classification && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-900">
            Classificação Sugerida
          </h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-600">
              Categoria Principal: {getCategoryName(classification.categoryId)}
              <span className="ml-2 text-xs text-gray-500">
                ({Math.round(classification.confidence * 100)}% de confiança)
              </span>
            </p>
            {classification.suggestedCategories.length > 1 && (
              <div>
                <p className="text-xs text-gray-500 mt-1">Outras sugestões:</p>
                <ul className="text-xs text-gray-500">
                  {classification.suggestedCategories.slice(1, 3).map(cat => (
                    <li key={cat.id}>
                      {getCategoryName(cat.id)} ({Math.round(cat.confidence * 100)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Adicionar Produto
        </button>
      </div>
    </form>
  );
}
