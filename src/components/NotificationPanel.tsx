import { useNotificationStore } from '../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export function NotificationPanel() {
  const { notifications, markAsRead, removeNotification, markAllAsRead } =
    useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className="w-96 p-4 text-center text-gray-500 dark:text-gray-400">
        Nenhuma notificação
      </div>
    );
  }

  return (
    <div className="w-96 max-h-[32rem] overflow-y-auto">
      <div className="p-4 border-b dark:border-dark-200 flex items-center justify-between">
        <h3 className="font-medium dark:text-white">
          Notificações ({unreadCount} não lidas)
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>
      <div className="divide-y dark:divide-dark-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 ${
              !notification.read
                ? 'bg-blue-50 dark:bg-dark-200'
                : 'dark:bg-dark-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div>
                  <h4
                    className={`text-sm font-medium ${
                      !notification.read
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {notification.title}
                  </h4>
                  <p
                    className={`mt-1 text-sm ${
                      !notification.read
                        ? 'text-gray-600 dark:text-gray-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    title="Marcar como lida"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Remover notificação"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
