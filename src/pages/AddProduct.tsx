import React from 'react';
import { AddProductForm } from '../components/AddProductForm';
import { useInventoryStore } from '../store/useInventoryStore';
import { useNavigate } from 'react-router-dom';

export function AddProduct() {
  const { addProduct } = useInventoryStore();
  const navigate = useNavigate();

  const handleSubmit = async (productData: any) => {
    try {
      await addProduct(productData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      // Aqui você pode adicionar uma notificação de erro
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Adicionar Novo Produto
      </h1>
      <div className="bg-white shadow rounded-lg p-6">
        <AddProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
