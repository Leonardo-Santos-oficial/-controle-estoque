import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Package } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { ProductForm } from '../components/ProductForm';
import { formatCurrency, formatQuantity } from '../utils/formatters';

export function Products() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: '',
    searchTerm: ''
  });

  const { 
    products, 
    updateProduct,
    deleteProduct 
  } = useInventoryStore((state) => ({
    products: state.products,
    updateProduct: state.updateProduct,
    deleteProduct: state.deleteProduct
  }));

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleStatusChange = (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    updateProduct({
      ...product,
      status: newStatus
    });
  };

  const handleRemoveProduct = (productId) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      deleteProduct(productId);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesStatus = 
        filters.status === 'all' || 
        product.status === filters.status;
      
      const matchesCategory = 
        !filters.category || 
        product.category === filters.category;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, filters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({
                    ...prev, 
                    searchTerm: e.target.value
                  }))}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({
                  ...prev, 
                  status: e.target.value
                }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({
                  ...prev, 
                  category: e.target.value
                }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todas as Categorias</option>
                <option value="esquadrias">Esquadrias</option>
                <option value="limpeza_fachada">Limpeza de Fachada</option>
                <option value="vidros">Vidros</option>
                <option value="portas_automaticas">Portas Automáticas</option>
                <option value="automacao">Automação</option>
                <option value="ferramentas">Ferramentas</option>
                <option value="fixacao">Fixação</option>
                <option value="acabamento">Acabamentos</option>
              </select>
            </div>
          </div>

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
                    Categoria
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr 
                    key={`${product.id}-${product.sku}`} 
                    className={`${
                      product.status === 'inactive' 
                        ? 'bg-gray-100 text-gray-500' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.supplier}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatQuantity(product.currentQuantity, product.unit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleStatusChange(product)}
                          className={`
                            ${
                              product.status === 'active' 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }
                          `}
                        >
                          {product.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm 
          onClose={handleCloseForm} 
          initialData={editingProduct}
        />
      )}
    </div>
  );
}