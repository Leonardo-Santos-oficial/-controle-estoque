import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { UserPlus, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotificationStore } from '../store/useNotificationStore';

export function Users() {
  const { users, addUser, updateUser, removeUser, fetchUsers } = useInventoryStore();
  const { addNotification } = useNotificationStore();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator' as 'admin' | 'manager' | 'operator'
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'active' as const,
      createdAt: new Date()
    };

    try {
      await addUser(newUser);
      setIsAddingUser(false);
      setFormData({
        name: '',
        email: '',
        role: 'operator'
      });

      addNotification({
        title: 'Novo usuário adicionado',
        message: `${newUser.name} foi adicionado como ${getRoleName(newUser.role).toLowerCase()}.`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Erro ao adicionar usuário');
    }
  };

  const handleRemoveUser = (userId: string, userName: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      removeUser(userId);
      toast.success('Usuário removido com sucesso!');

      // Adiciona notificação
      addNotification({
        title: 'Usuário removido',
        message: `${userName} foi removido do sistema.`,
        type: 'warning',
      });
    }
  };

  const handleToggleStatus = (userId: string, userName: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateUser(userId, { status: newStatus });

    // Adiciona notificação
    addNotification({
      title: 'Status do usuário alterado',
      message: `${userName} foi ${newStatus === 'active' ? 'ativado' : 'desativado'}.`,
      type: newStatus === 'active' ? 'success' : 'warning',
    });
  };

  const getRoleName = (role: string) => {
    const roles = {
      admin: 'Administrador',
      manager: 'Gerente',
      operator: 'Operador'
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Usuários</h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </button>
      </div>

      {isAddingUser && (
        <div className="mb-6 bg-white dark:bg-dark-200 p-4 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-dark-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-100 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-dark-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-100 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Função
                </label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-dark-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-100 dark:text-white sm:text-sm"
                >
                  <option value="operator">Operador</option>
                  <option value="manager">Gerente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingUser(false);
                  setFormData({
                    name: '',
                    email: '',
                    role: 'operator'
                  });
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-400 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-100 hover:bg-gray-50 dark:hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Check className="h-4 w-4 mr-2" />
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-dark-200 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-400">
            <thead className="bg-gray-50 dark:bg-dark-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-dark-400">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {getRoleName(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.name, user.status)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveUser(user.id, user.name)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}