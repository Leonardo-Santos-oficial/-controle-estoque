import React from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { formatDateTime, formatQuantity } from '../utils/formatters';
import { FileText } from 'lucide-react';

export function Reports() {
  const products = useInventoryStore((state) => state.products);
  const movements = useInventoryStore((state) => state.movements);

  const generateStockReport = () => {
    const headers = ['Produto', 'Quantidade em Estoque', 'Valor Unitário', 'Valor Total'];
    const stockData = products.map(product => [
      product.name,
      formatQuantity(product.quantity, 'un'),
      `R$ ${product.price.toFixed(2)}`,
      `R$ ${(product.quantity * product.price).toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(','),
      ...stockData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_estoque_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const generateMovementReport = () => {
    const headers = ['Data/Hora', 'Produto', 'Tipo', 'Quantidade', 'Responsável', 'Motivo'];
    const movementData = movements.map(movement => {
      const product = products.find(p => p.id === movement.productId);
      return [
        formatDateTime(movement.timestamp),
        product ? product.name : 'Produto não encontrado',
        movement.type === 'in' ? 'Entrada' : 'Saída',
        formatQuantity(movement.quantity, 'un'),
        movement.userId,
        movement.reason
      ];
    });

    const csvContent = [
      headers.join(','),
      ...movementData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_movimentacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4">Relatório de Status do Estoque</h3>
              <p className="text-gray-600 mb-4">
                Exporta um relatório detalhado com todos os produtos em estoque, 
                incluindo quantidades e valores.
              </p>
              <button 
                onClick={generateStockReport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </button>
            </div>
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4">Relatório de Histórico de Movimentações</h3>
              <p className="text-gray-600 mb-4">
                Exporta um relatório completo com todas as movimentações de entrada e 
                saída do estoque.
              </p>
              <button 
                onClick={generateMovementReport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}