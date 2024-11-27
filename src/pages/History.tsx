import React, { useState, useMemo, useEffect } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { formatDateTime, formatQuantity } from '../utils/formatters';
import { Download, Filter, Search } from 'lucide-react';

interface FilterState {
  startDate: string;
  endDate: string;
  type: '' | 'in' | 'out';
  searchTerm: string;
}

export function History() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    type: '',
    searchTerm: ''
  });

  const movements = useInventoryStore((state) => state.movements);
  const products = useInventoryStore((state) => state.products);
  const fetchMovements = useInventoryStore((state) => state.fetchMovements);
  const fetchProducts = useInventoryStore((state) => state.fetchProducts);

  useEffect(() => {
    console.log('Carregando dados do histórico...');
    const loadData = async () => {
      try {
        await Promise.all([
          fetchMovements(),
          fetchProducts()
        ]);
        console.log('Dados carregados com sucesso');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, [fetchMovements, fetchProducts]);

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  const filteredMovements = useMemo(() => {
    console.log('Filtrando movimentações:', { movements, filters });
    return movements.filter(movement => {
      const matchesSearch = 
        getProductName(movement.productId).toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        movement.reason.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        movement.userId.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesDateRange = 
        (!filters.startDate || new Date(movement.timestamp) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(movement.timestamp) <= new Date(filters.endDate));
      
      const matchesType = 
        !filters.type || movement.type === filters.type;
      
      return matchesSearch && matchesDateRange && matchesType;
    });
  }, [movements, filters, products]);

  const exportToCSV = () => {
    const headers = ['Data/Hora', 'Produto', 'Tipo', 'Quantidade', 'Responsável', 'Motivo'];
    const csvData = filteredMovements.map(movement => [
      formatDateTime(movement.timestamp),
      getProductName(movement.productId),
      movement.type === 'in' ? 'Entrada' : 'Saída',
      formatQuantity(movement.quantity, 'un'),
      movement.userId,
      movement.reason
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico_movimentacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      searchTerm: ''
    });
  };

  if (!movements || !products) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Histórico de Movimentações</h2>
        <div className="flex gap-4">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            {isFilterOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Buscar</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  placeholder="Produto, responsável ou motivo..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Final</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as '' | 'in' | 'out' }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="in">Entrada</option>
                <option value="out">Saída</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {filteredMovements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma movimentação encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsável
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motivo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(movement.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getProductName(movement.productId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            movement.type === 'in'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {movement.type === 'in' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatQuantity(movement.quantity, 'un')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}