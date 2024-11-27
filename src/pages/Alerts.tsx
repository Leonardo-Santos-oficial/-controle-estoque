import React, { useEffect } from 'react';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';
import { formatDate } from '../utils/formatters';

export function Alerts() {
  const alerts = useInventoryStore((state) => state.alerts);
  const fetchAlerts = useInventoryStore((state) => state.fetchAlerts);
  const deleteAlert = useInventoryStore((state) => state.deleteAlert);
  const updateAlert = useInventoryStore((state) => state.updateAlert);

  useEffect(() => {
    console.log('Buscando alertas...');
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDismissAlert = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
    } catch (error) {
      console.error('Erro ao remover alerta:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      for (const alert of alerts) {
        if (!alert.isRead) {
          await updateAlert(alert.id, { isRead: true });
        }
      }
    } catch (error) {
      console.error('Erro ao marcar alertas como lidos:', error);
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertClass = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Alertas</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-center">Não há alertas no momento</p>
        </div>
      </div>
    );
  }

  console.log('Alertas:', alerts);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Alertas</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-blue-600 hover:text-blue-800"
        >
          Marcar todos como lidos
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertClass(alert.severity)} ${
                  alert.isRead ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type, alert.severity)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(alert.createdAt)}
                    </p>
                  </div>
                  <div className="ml-3 flex items-center space-x-4">
                    {!alert.isRead && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Novo
                      </span>
                    )}
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      title="Remover alerta"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}