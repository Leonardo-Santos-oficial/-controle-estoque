import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useEffect } from 'react';
import { applyTheme } from '../utils/theme';
import { 
  FaBox, 
  FaExchangeAlt, 
  FaWarehouse, 
  FaBell, 
  FaHistory, 
  FaChartBar, 
  FaCog, 
  FaUsers,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaRobot  
} from 'react-icons/fa';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Produtos' },
    { path: '/movements', icon: <FaExchangeAlt />, label: 'Movimentações' },
    { path: '/inventory', icon: <FaWarehouse />, label: 'Estoque' },
    { path: '/alerts', icon: <FaBell />, label: 'Alertas' },
    { path: '/history', icon: <FaHistory />, label: 'Histórico' },
    { path: '/reports', icon: <FaChartBar />, label: 'Relatórios' },
    { path: '/settings', icon: <FaCog />, label: 'Configurações' },
    { path: '/users', icon: <FaUsers />, label: 'Usuários' },
    { path: '/ai-test', icon: <FaRobot />, label: 'Teste IA' },  
  ];

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-dark text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Mobile Header */}
      <div className="lg:hidden bg-blue-600 text-white p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="text-xl font-bold">Controle de Estoque</h1>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-64 bg-white shadow-lg`}
      >
        {/* Logo */}
        <div className="hidden lg:flex h-16 bg-blue-600 text-white items-center justify-center">
          <h1 className="text-xl font-bold">Controle de Estoque</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : ''
              }`}
            >
              <span className="text-xl mr-4">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt className="text-xl mr-4" />
            <span>Sair</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`lg:ml-64 min-h-screen transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}