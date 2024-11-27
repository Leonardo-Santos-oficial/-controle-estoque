import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import * as firebaseService from '../services/firebaseService';
import { checkLowStockLevels } from '../services/notificationService';
import { Activity, observeRecentActivities, addActivity } from '../services/activityService';

export interface Product {
  id: string;
  name: string;
  description: string;
  currentQuantity: number;
  minQuantity: number;
  unit: string;
  category: string;
  location: string;
  supplier: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Movement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  timestamp: Date;
  userId: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'expiration' | 'movement_summary';
  severity: 'warning' | 'error' | 'info';
  message: string;
  productId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  active: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

interface InventoryState {
  products: Product[];
  movements: Movement[];
  alerts: Alert[];
  activities: Activity[];
  users: User[];
  loading: boolean;
  error: string | null;
  cleanup: {
    products?: () => void;
    movements?: () => void;
    activities?: () => void;
  };

  // Products
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Movements
  fetchMovements: () => Promise<void>;
  addMovement: (movement: Omit<Movement, 'id'>) => Promise<void>;

  // Activities
  fetchActivities: () => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => Promise<void>;

  // Alerts
  fetchAlerts: () => Promise<void>;
  addAlert: (alert: Omit<Alert, 'id'>) => Promise<void>;
  updateAlert: (id: string, update: Partial<Alert>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;

  // Users
  fetchUsers: () => Promise<void>;
  addUser: (userData: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [],
  movements: [],
  alerts: [],
  activities: [],
  users: [],
  loading: false,
  error: null,
  cleanup: {},

  // Products
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      // Iniciar observação em tempo real dos produtos
      const unsubscribe = await firebaseService.observeProducts((products) => {
        set({ products, loading: false });
      });
      
      // Armazenar função de cleanup
      set(state => ({
        ...state,
        cleanup: {
          ...state.cleanup,
          products: unsubscribe
        }
      }));
      
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao buscar produtos',
        loading: false 
      });
    }
  },

  addProduct: async (product: Omit<Product, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const newProduct = await firebaseService.addProduct(product);
      set(state => ({
        products: [...state.products, newProduct],
        loading: false
      }));
      toast.success('Produto adicionado com sucesso!');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao adicionar produto',
        loading: false 
      });
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar produto');
      throw error;
    }
  },

  updateProduct: async (product: Product) => {
    try {
      set({ loading: true, error: null });
      
      // Verificar se o produto existe
      const existingProduct = get().products.find(p => p.id === product.id);
      if (!existingProduct) {
        throw new Error('Produto não encontrado');
      }

      const updatedProduct = await firebaseService.updateProduct(product);
      set(state => ({
        products: state.products.map(p => p.id === product.id ? updatedProduct : p),
        loading: false
      }));
      toast.success('Produto atualizado com sucesso!');
      checkLowStockLevels();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar produto',
        loading: false 
      });
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar produto');
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await firebaseService.deleteProduct(id);
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        loading: false
      }));
      toast.success('Produto removido com sucesso');
    } catch (error) {
      set({ error: 'Erro ao remover produto', loading: false });
      toast.error('Erro ao remover produto');
    }
  },

  // Movements
  fetchMovements: async () => {
    try {
      set({ loading: true, error: null });
      
      // Iniciar observação em tempo real dos movimentos
      const unsubscribe = firebaseService.observeMovements((movements) => {
        set({ movements, loading: false });
      });
      
      // Armazenar função de cleanup
      set(state => ({
        ...state,
        cleanup: {
          ...state.cleanup,
          movements: unsubscribe
        }
      }));
      
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar movimentações',
        loading: false 
      });
      toast.error('Erro ao carregar movimentações');
    }
  },

  addMovement: async (movement: Omit<Movement, 'id'>) => {
    try {
      set({ loading: true, error: null });
      
      // Verificar se o produto existe e está ativo
      const product = get().products.find(p => p.id === movement.productId && p.status === 'active');
      if (!product) {
        throw new Error('Produto não encontrado ou inativo');
      }

      // Verificar quantidade para saída
      if (movement.type === 'out' && product.currentQuantity < movement.quantity) {
        throw new Error('Quantidade insuficiente em estoque');
      }

      // Adicionar movimento
      const newMovement = await firebaseService.addMovement({
        ...movement,
        timestamp: new Date()
      });

      // Atualizar quantidade do produto
      const newQuantity = movement.type === 'in'
        ? product.currentQuantity + movement.quantity
        : product.currentQuantity - movement.quantity;

      await get().updateProduct({
        ...product,
        currentQuantity: newQuantity,
        updatedAt: new Date()
      });

      set(state => ({
        movements: [...state.movements, newMovement],
        loading: false
      }));

      toast.success(
        movement.type === 'in'
          ? 'Entrada registrada com sucesso!'
          : 'Saída registrada com sucesso!'
      );

    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao adicionar movimentação',
        loading: false 
      });
      toast.error(error instanceof Error ? error.message : 'Erro ao adicionar movimentação');
      throw error;
    }
  },

  // Activities
  fetchActivities: async () => {
    try {
      set({ loading: true, error: null });
      
      // Iniciar observação em tempo real das atividades
      const unsubscribe = observeRecentActivities((activities) => {
        set({ activities, loading: false });
      });
      
      // Armazenar função de cleanup
      set(state => ({
        ...state,
        cleanup: {
          ...state.cleanup,
          activities: unsubscribe
        }
      }));
      
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar atividades',
        loading: false 
      });
    }
  },

  addActivity: async (activity) => {
    try {
      const newActivity = await addActivity(activity);
      set(state => ({
        activities: [newActivity, ...state.activities].slice(0, 10)
      }));
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error);
      throw error;
    }
  },

  // Alerts
  fetchAlerts: async () => {
    try {
      set({ loading: true, error: null });
      const alertsData = await firebaseService.getAlerts();
      
      // Converter as datas de string para Date
      const alerts = alertsData.map(alert => ({
        ...alert,
        createdAt: alert.createdAt instanceof Date ? alert.createdAt : new Date(alert.createdAt)
      }));
      
      set({ alerts, loading: false });
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      set({ error: 'Erro ao carregar alertas', loading: false });
      toast.error('Erro ao carregar alertas');
    }
  },

  addAlert: async (alert: Omit<Alert, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const id = await firebaseService.addAlert({
        ...alert,
        isRead: false,
        createdAt: new Date()
      });
      
      const newAlert = { ...alert, id, isRead: false, createdAt: new Date() };
      
      set(state => ({
        alerts: [...state.alerts, newAlert],
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao adicionar alerta:', error);
      set({ error: 'Erro ao adicionar alerta', loading: false });
      toast.error('Erro ao adicionar alerta');
    }
  },

  updateAlert: async (id: string, update: Partial<Alert>) => {
    try {
      set({ loading: true, error: null });
      await firebaseService.updateAlert(id, update);
      
      set(state => ({
        alerts: state.alerts.map(alert => 
          alert.id === id ? { ...alert, ...update } : alert
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      set({ error: 'Erro ao atualizar alerta', loading: false });
      toast.error('Erro ao atualizar alerta');
    }
  },

  deleteAlert: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await firebaseService.deleteAlert(id);
      
      set(state => ({
        alerts: state.alerts.filter(alert => alert.id !== id),
        loading: false
      }));
      
      toast.success('Alerta removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover alerta:', error);
      set({ error: 'Erro ao remover alerta', loading: false });
      toast.error('Erro ao remover alerta');
    }
  },

  // Users
  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      
      // Inscreve-se para atualizações em tempo real
      firebaseService.subscribeToUsers((users) => {
        set({ users, loading: false });
      });
    } catch (error) {
      set({ error: 'Erro ao carregar usuários', loading: false });
      toast.error('Erro ao carregar usuários');
    }
  },

  addUser: async (userData: Omit<User, 'id'>) => {
    try {
      set({ loading: true, error: null });
      await firebaseService.addUser(userData);
      toast.success('Usuário adicionado com sucesso!');
    } catch (error) {
      console.error('Error in store:', error);
      set({ error: 'Erro ao adicionar usuário', loading: false });
      toast.error('Erro ao adicionar usuário');
      throw error;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      set({ loading: true, error: null });
      await firebaseService.updateUser(id, userData);
      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {
      set({ error: 'Erro ao atualizar usuário', loading: false });
      toast.error('Erro ao atualizar usuário');
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await firebaseService.deleteUser(id);
      toast.success('Usuário removido com sucesso!');
    } catch (error) {
      set({ error: 'Erro ao remover usuário', loading: false });
      toast.error('Erro ao remover usuário');
    }
  },
}));