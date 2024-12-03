import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Movements } from './pages/Movements';
import { Inventory } from './pages/Inventory';
import { Alerts } from './pages/Alerts';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import AITest from './pages/AITest';
import { startNotificationChecks, stopNotificationChecks } from './services/notificationService';
import { useInventoryStore } from './store/useInventoryStore';

function App() {
  const fetchProducts = useInventoryStore((state) => state.fetchProducts);
  const fetchAlerts = useInventoryStore((state) => state.fetchAlerts);
  const fetchMovements = useInventoryStore((state) => state.fetchMovements);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Inicializando aplicação...');
        await Promise.all([
          fetchProducts(),
          fetchAlerts(),
          fetchMovements()
        ]);
        startNotificationChecks();
        console.log('Aplicação inicializada com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar app:', error);
      }
    };

    initializeApp();

    // Cleanup ao desmontar o componente
    return () => {
      stopNotificationChecks();
    };
  }, [fetchProducts, fetchAlerts, fetchMovements]);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="movements" element={<Movements />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="history" element={<History />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="ai-test" element={<AITest />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;