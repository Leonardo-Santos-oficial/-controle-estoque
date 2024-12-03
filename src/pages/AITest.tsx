import React, { useState } from 'react';
import { AIService } from '../services/aiService';

const AITest = () => {
  const [product, setProduct] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [serviceFrequency, setServiceFrequency] = useState('');
  const [replenishmentTime, setReplenishmentTime] = useState('');

  const [serviceName, setServiceName] = useState('');
  const [usageFrequency, setUsageFrequency] = useState('');
  const [minStock, setMinStock] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');

  const [loading, setLoading] = useState({
    inventory: false,
    prediction: false,
    categorization: false
  });

  const [results, setResults] = useState({
    inventory: '',
    prediction: '',
    categorization: ''
  });

  const aiService = new AIService();

  const analyzeInventory = async () => {
    try {
      setLoading((prev) => ({ ...prev, inventory: true }));
      const inventoryData = {
        produto: product,
        quantidade_atual: parseInt(currentQuantity),
        frequencia_servico: serviceFrequency.split(',').map(Number),
        tempo_reposicao: parseInt(replenishmentTime),
      };
      const result = await aiService.analyzeInventory(inventoryData);
      setResults((prev) => ({ ...prev, inventory: result }));
    } catch (error) {
      setResults((prev) => ({ ...prev, inventory: `Erro: ${(error as Error).message}` }));
    } finally {
      setLoading((prev) => ({ ...prev, inventory: false }));
    }
  };

  const predictStockLevels = async () => {
    try {
      setLoading((prev) => ({ ...prev, prediction: true }));
      const productData = {
        servico: serviceName,
        frequencia_uso: usageFrequency.split(',').map(Number),
        estoque_minimo: parseInt(minStock),
        prazo_entrega: parseInt(deliveryTime),
      };
      const result = await aiService.predictStockLevels(productData);
      setResults((prev) => ({ ...prev, prediction: result }));
    } catch (error) {
      setResults((prev) => ({ ...prev, prediction: `Erro: ${(error as Error).message}` }));
    } finally {
      setLoading((prev) => ({ ...prev, prediction: false }));
    }
  };

  const categorizeProduct = async () => {
    try {
      setLoading((prev) => ({ ...prev, categorization: true }));
      const productInfo = {
        nome: categoryName,
        descricao: description,
        material: material,
        cor: color,
      };
      const result = await aiService.categorizeProduct(productInfo);
      setResults((prev) => ({ ...prev, categorization: result }));
    } catch (error) {
      setResults((prev) => ({ ...prev, categorization: `Erro: ${(error as Error).message}` }));
    } finally {
      setLoading((prev) => ({ ...prev, categorization: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Teste das Funcionalidades de IA</h1>

      {/* Formulário de Análise de Estoque para Serviços */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Análise de Estoque para Serviços</h2>
        <div className="mb-2">
          <label className="block mb-1">Peça/Material:</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Quantidade Atual:</label>
          <input
            type="number"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Frequência de Uso em Serviços:</label>
          <input
            type="text"
            value={serviceFrequency}
            onChange={(e) => setServiceFrequency(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Tempo de Reposição (dias):</label>
          <input
            type="number"
            value={replenishmentTime}
            onChange={(e) => setReplenishmentTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={analyzeInventory}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading.inventory}
        >
          Analisar Estoque
        </button>
        {results.inventory && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Resultado:</h3>
            <p>{results.inventory}</p>
          </div>
        )}
      </div>

      {/* Formulário de Previsão de Estoque para Serviços */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Previsão de Estoque para Serviços</h2>
        <div className="mb-2">
          <label className="block mb-1">Nome do Serviço:</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Frequência de Uso:</label>
          <input
            type="text"
            value={usageFrequency}
            onChange={(e) => setUsageFrequency(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Estoque Mínimo Necessário:</label>
          <input
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Prazo de Entrega (dias):</label>
          <input
            type="number"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={predictStockLevels}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading.prediction}
        >
          Prever Estoque
        </button>
        {results.prediction && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Resultado:</h3>
            <p>{results.prediction}</p>
          </div>
        )}
      </div>

      {/* Formulário de Categorização de Produto */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Categorização de Peça/Material</h2>
        <div className="mb-2">
          <label className="block mb-1">Nome da Peça/Material:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Material:</label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Cor:</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={categorizeProduct}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading.categorization}
        >
          Categorizar
        </button>
        {results.categorization && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Resultado:</h3>
            <p>{results.categorization}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITest;
