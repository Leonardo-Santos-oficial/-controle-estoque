import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { toast } from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
import { NotificationPanel } from './NotificationPanel';

export function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const { notifications } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sessão encerrada com sucesso');
  };

  return (
    <header className="dark:bg-dark-100 bg-white border-b dark:border-dark-200 border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <img
              src="/networking-logo.svg"
              alt="Networking Engenharia"
              className="h-10 w-auto mr-3"
            />
            <h1 className="text-2xl font-semibold dark:text-white text-gray-900">
              Sistema de Controle de Estoque
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 dark:text-gray-400 dark:hover:text-gray-300 text-gray-600 hover:text-gray-900 transition-colors relative"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-dark-100 rounded-lg shadow-lg border dark:border-dark-200 z-50">
                  <NotificationPanel />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-l dark:border-dark-200 pl-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium dark:text-white text-gray-900">
                  {user?.name}
                </span>
                <span className="text-xs dark:text-gray-400 text-gray-500">
                  {user?.role === 'admin' ? 'Administrador' : 
                   user?.role === 'supervisor' ? 'Supervisor' : 'Almoxarife'}
                </span>
              </div>
              <div className="h-8 w-8 dark:bg-dark-200 dark:text-gray-300 bg-gray-100 text-gray-400 rounded-full p-1">
                <User className="h-6 w-6" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 dark:text-gray-400 dark:hover:text-red-400 text-gray-400 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}