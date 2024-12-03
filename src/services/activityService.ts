import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  Timestamp,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Activity {
  id: string;
  type: 'product_update' | 'movement' | 'alert';
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata?: {
    productId?: string;
    productName?: string;
    movementId?: string;
    alertId?: string;
  };
}

export const observeRecentActivities = (callback: (activities: Activity[]) => void) => {
  try {
    console.log('Iniciando observação de atividades...');
    const q = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Snapshot recebido:', snapshot.size, 'documentos');
      const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Dados do documento:', data);
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date()
        } as Activity;
      });
      
      console.log('Atividades atualizadas:', activities.length);
      callback(activities);
    }, (error) => {
      console.error('Erro ao observar atividades:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Erro ao configurar observação de atividades:', error);
    throw error;
  }
};

export const addActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activity,
      timestamp: Timestamp.now()
    });

    return {
      id: docRef.id,
      ...activity,
      timestamp: new Date()
    } as Activity;
  } catch (error) {
    console.error('Erro ao adicionar atividade:', error);
    throw error;
  }
};

export const getRecentActivities = async () => {
  try {
    const q = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Activity[];
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    throw error;
  }
};
