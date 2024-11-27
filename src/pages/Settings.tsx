import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { applyTheme } from '../utils/theme';
import toast from 'react-hot-toast';

export function Settings() {
  const user = useAuthStore((state) => state.user);
  const { settings, updateSettings } = useSettingsStore();
  
  // Estado local para controlar os inputs
  const [formState, setFormState] = useState({
    notifications: {
      stockAlerts: settings.notifications.stockAlerts,
      movementSummary: settings.notifications.movementSummary,
    },
    theme: settings.theme,
  });

  // Aplicar tema quando o componente montar ou quando o tema mudar
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Handler para mudanças nas notificações
  const handleNotificationChange = (field: 'stockAlerts' | 'movementSummary') => {
    setFormState({
      ...formState,
      notifications: {
        ...formState.notifications,
        [field]: !formState.notifications[field],
      },
    });
  };

  // Handler para mudança de tema
  const handleThemeChange = (theme: 'light' | 'dark') => {
    setFormState({
      ...formState,
      theme,
    });
  };

  // Handler para salvar alterações
  const handleSave = () => {
    updateSettings(formState);
    applyTheme(formState.theme);
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6 dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h2>
      </div>

      <div className="bg-white shadow rounded-lg dark:bg-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Seção de Perfil */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Perfil</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                <p>Informações do seu perfil de usuário.</p>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={user?.name || ''}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <div className="mt-1">
                    <input
                      type="email"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Função</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      value={user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gerente' : 'Operador'}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Notificações */}
            <div className="pt-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Notificações</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                <p>Configure suas preferências de notificação.</p>
              </div>
              <div className="mt-5 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="stockAlerts"
                      name="stockAlerts"
                      type="checkbox"
                      checked={formState.notifications.stockAlerts}
                      onChange={() => handleNotificationChange('stockAlerts')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:border-gray-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="stockAlerts" className="font-medium text-gray-700 dark:text-gray-300">
                      Receber alertas de estoque baixo
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Seja notificado quando produtos atingirem o estoque mínimo.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="movementSummary"
                      name="movementSummary"
                      type="checkbox"
                      checked={formState.notifications.movementSummary}
                      onChange={() => handleNotificationChange('movementSummary')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:border-gray-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="movementSummary" className="font-medium text-gray-700 dark:text-gray-300">
                      Receber resumo de movimentações
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Receba um resumo diário das movimentações do estoque.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Tema */}
            <div className="pt-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Aparência</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                <p>Personalize a aparência do sistema.</p>
              </div>
              <div className="mt-5">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="theme-light"
                      name="theme"
                      type="radio"
                      checked={formState.theme === 'light'}
                      onChange={() => handleThemeChange('light')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-500"
                    />
                    <label htmlFor="theme-light" className="ml-3">
                      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tema Claro</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="theme-dark"
                      name="theme"
                      type="radio"
                      checked={formState.theme === 'dark'}
                      onChange={() => handleThemeChange('dark')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-500"
                    />
                    <label htmlFor="theme-dark" className="ml-3">
                      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tema Escuro</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 dark:bg-gray-600">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}