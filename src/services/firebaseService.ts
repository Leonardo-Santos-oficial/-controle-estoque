import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp,
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Product, Movement, Alert, User, Activity } from '../store/useInventoryStore';

// Cache para armazenar os unsubscribe functions
const unsubscribes: { [key: string]: () => void } = {};

// Products
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Product[];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    // Criar o documento com os dados iniciais
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'active'
    });

    // Retornar o produto com o ID gerado
    return {
      ...product,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Product;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    throw error;
  }
};

export const updateProduct = async (product: Product) => {
  try {
    if (!product.id) {
      throw new Error('ID do produto não fornecido');
    }

    // Verificar se o documento existe antes de atualizar
    const docRef = doc(db, 'products', product.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Produto não encontrado: ${product.id}`);
    }

    // Preparar dados para atualização
    const updateData = { ...product };
    delete updateData.id;

    // Converter datas para Timestamp
    if (updateData.createdAt instanceof Date) {
      updateData.createdAt = Timestamp.fromDate(updateData.createdAt);
    }
    if (updateData.updatedAt instanceof Date) {
      updateData.updatedAt = Timestamp.fromDate(updateData.updatedAt);
    }

    // Atualizar o documento
    await updateDoc(docRef, updateData);

    // Registrar atividade
    await addActivity({
      type: 'product_update',
      description: `Produto ${product.name} atualizado`,
      userId: 'system', // Substituir pelo ID do usuário real quando implementar autenticação
      userName: 'Sistema', // Substituir pelo nome do usuário real quando implementar autenticação
      metadata: {
        productId: product.id,
        productName: product.name
      }
    });

    // Retornar o produto atualizado
    return {
      ...product,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};

export const observeProducts = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, 'products'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Product[];
    
    callback(products);
  }, (error) => {
    console.error('Erro ao observar produtos:', error);
  });

  return unsubscribe;
};

export const getProduct = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Produto não encontrado: ${id}`);
    }

    return {
      ...docSnap.data(),
      id: docSnap.id,
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate()
    } as Product;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }
};

// Movements
export const getMovements = async () => {
  try {
    console.log('Buscando movimentações...');
    const querySnapshot = await getDocs(collection(db, 'movements'));
    const movements = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        productId: data.productId || '',
        quantity: Number(data.quantity) || 0
      } as Movement;
    });
    console.log('Movimentações carregadas:', movements.length);
    return movements;
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    throw error;
  }
};

export const addMovement = async (movement: Omit<Movement, 'id'>) => {
  try {
    // Verificar se o produto existe antes de adicionar o movimento
    const productRef = doc(db, 'products', movement.productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error(`Produto não encontrado: ${movement.productId}`);
    }

    const product = { id: productSnap.id, ...productSnap.data() } as Product;

    // Adicionar o movimento
    const docRef = await addDoc(collection(db, 'movements'), {
      ...movement,
      timestamp: movement.timestamp instanceof Date 
        ? Timestamp.fromDate(movement.timestamp)
        : Timestamp.now(),
      quantity: Number(movement.quantity)
    });

    // Registrar atividade
    await addActivity({
      type: 'movement',
      description: `${movement.type === 'in' ? 'Entrada' : 'Saída'} de ${movement.quantity} unidades do produto ${product.name}`,
      userId: 'system', // Substituir pelo ID do usuário real quando implementar autenticação
      userName: 'Sistema', // Substituir pelo nome do usuário real quando implementar autenticação
      metadata: {
        productId: movement.productId,
        productName: product.name,
        movementId: docRef.id
      }
    });

    // Retornar o movimento com o ID gerado
    return {
      ...movement,
      id: docRef.id,
      timestamp: movement.timestamp instanceof Date 
        ? movement.timestamp 
        : new Date(),
      quantity: Number(movement.quantity)
    } as Movement;
  } catch (error) {
    console.error('Erro ao adicionar movimentação:', error);
    throw error;
  }
};

export const observeMovements = (callback: (movements: Movement[]) => void) => {
  try {
    console.log('Iniciando observação de movimentações...');
    const q = query(collection(db, 'movements'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const movements = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          productId: data.productId || '',
          quantity: Number(data.quantity) || 0
        } as Movement;
      });
      
      console.log('Movimentações atualizadas:', movements.length);
      callback(movements);
    }, (error) => {
      console.error('Erro ao observar movimentações:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Erro ao configurar observação de movimentações:', error);
    throw error;
  }
};

// Alerts
export const getAlerts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'alerts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Alert[];
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    throw error;
  }
};

export const addAlert = async (alert: Omit<Alert, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'alerts'), {
      ...alert,
      createdAt: Timestamp.now(),
      isRead: false
    });

    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar alerta:', error);
    throw error;
  }
};

export const updateAlert = async (id: string, alert: Partial<Alert>) => {
  try {
    const alertRef = doc(db, 'alerts', id);
    const updateData = { ...alert };
    
    if (updateData.createdAt instanceof Date) {
      updateData.createdAt = Timestamp.fromDate(updateData.createdAt);
    }
    
    await updateDoc(alertRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar alerta:', error);
    throw error;
  }
};

export const deleteAlert = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'alerts', id));
  } catch (error) {
    console.error('Erro ao deletar alerta:', error);
    throw error;
  }
};

// Users
export const subscribeToUsers = (callback: (users: User[]) => void) => {
  if (unsubscribes['users']) {
    unsubscribes['users']();
  }

  const q = collection(db, 'users');
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as User[];
    callback(users);
  }, (error) => {
    console.error('Error subscribing to users:', error);
  });

  unsubscribes['users'] = unsubscribe;
  return unsubscribe;
};

export const addUser = async (userData: Omit<User, 'id'>) => {
  try {
    const user = {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'users'), user);
    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const docRef = doc(db, 'users', id);
    const updateData = {
      ...userData,
      updatedAt: Timestamp.now()
    };
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'users', id));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Activities
export const addActivity = async (activity: Omit<Activity, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activity,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar atividade:', error);
    throw error;
  }
};
