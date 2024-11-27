import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ArrowRightLeft,
  Settings,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Produtos', to: '/products', icon: Package },
  { name: 'Movimentações', to: '/movements', icon: ArrowRightLeft },
  { name: 'Usuários', to: '/users', icon: Users },
  { name: 'Relatórios', to: '/reports', icon: FileText },
  { name: 'Configurações', to: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Usuários', to: '/users', icon: Users },
  { name: 'Configurações', to: '/settings', icon: Settings },
];

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const { settings } = useSettingsStore();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="w-64 min-h-screen dark:bg-dark-100 bg-white border-r dark:border-dark-200 border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/networking-logo.svg"
            alt="Networking Engenharia"
            className="h-12 w-auto"
          />
        </div>
        <div className="space-y-4">
          <div>
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'dark:bg-dark-200 dark:text-white bg-blue-50 text-blue-700'
                          : 'dark:text-gray-400 dark:hover:bg-dark-200 dark:hover:text-white text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {isAdmin && (
            <div>
              <div className="px-4 py-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider dark:text-gray-400 text-gray-500">
                  Administração
                </h2>
              </div>
              <ul className="space-y-1">
                {adminNavigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'dark:bg-dark-200 dark:text-white bg-blue-50 text-blue-700'
                            : 'dark:text-gray-400 dark:hover:bg-dark-200 dark:hover:text-white text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 w-full p-4 border-t dark:border-dark-200 border-gray-200">
        <div className="flex items-center justify-between text-sm dark:text-gray-400 text-gray-500">
          <span>v1.0.0</span>
          <span> 2024 Networking</span>
        </div>
      </div>
    </nav>
  );
}