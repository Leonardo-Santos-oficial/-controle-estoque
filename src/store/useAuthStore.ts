import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'react-hot-toast';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      set({ error: 'Erro ao fazer login', loading: false });
      toast.error('Email ou senha inválidos');
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      set({ user: result.user, loading: false });
      toast.success('Login com Google realizado com sucesso!');
    } catch (error) {
      console.error('Google login error:', error);
      set({ error: 'Erro ao fazer login com Google', loading: false });
      toast.error('Erro ao fazer login com Google');
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut(auth);
      set({ user: null, loading: false });
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Logout error:', error);
      set({ error: 'Erro ao fazer logout', loading: false });
      toast.error('Erro ao fazer logout');
      throw error;
    }
  },
}));

// Listener para mudanças no estado de autenticação
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});