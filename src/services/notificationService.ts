import { useInventoryStore } from '../store/useInventoryStore';
import { Product, Movement } from '../store/useInventoryStore';
import { addActivity } from './activityService';

export const checkLowStockLevels = async () => {
  try {
    const store = useInventoryStore.getState();
    const products = store.products;
    
    for (const product of products) {
      if (product.currentQuantity <= product.minimumQuantity) {
        await store.addAlert({
          type: 'low_stock',
          severity: 'warning',
          title: 'Estoque Baixo',
          description: `O produto ${product.name} está com estoque baixo (${product.currentQuantity} unidades)`,
          isRead: false,
          productId: product.id,
          createdAt: new Date()
        });

        await addActivity({
          type: 'alert',
          description: `Alerta de estoque baixo para ${product.name} (${product.currentQuantity} unidades)`,
          userId: 'system',
          userName: 'Sistema',
          metadata: {
            productId: product.id,
            productName: product.name
          }
        });
      }
    }
  } catch (error) {
    console.error('Erro ao verificar níveis de estoque:', error);
  }
};

export const checkProductExpiration = async () => {
  try {
    const store = useInventoryStore.getState();
    const products = store.products;
    const today = new Date();
    
    for (const product of products) {
      if (product.expirationDate && new Date(product.expirationDate) <= today) {
        await store.addAlert({
          type: 'expiration',
          severity: 'error',
          title: 'Produto Vencido',
          description: `O produto ${product.name} está vencido`,
          isRead: false,
          productId: product.id,
          createdAt: new Date()
        });

        await addActivity({
          type: 'alert',
          description: `Alerta de vencimento para ${product.name}`,
          userId: 'system',
          userName: 'Sistema',
          metadata: {
            productId: product.id,
            productName: product.name
          }
        });
      }
    }
  } catch (error) {
    console.error('Erro ao verificar datas de vencimento:', error);
  }
};

export const generateDailyMovementSummary = async () => {
  try {
    const store = useInventoryStore.getState();
    const movements = store.movements;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMovements = movements.filter(movement => {
      const movementDate = new Date(movement.timestamp);
      movementDate.setHours(0, 0, 0, 0);
      return movementDate.getTime() === today.getTime();
    });

    if (todayMovements.length > 0) {
      const entriesCount = todayMovements.filter(m => m.type === 'in').length;
      const exitsCount = todayMovements.filter(m => m.type === 'out').length;

      await store.addAlert({
        type: 'movement_summary',
        severity: 'info',
        title: 'Resumo Diário',
        description: `Hoje: ${entriesCount} entradas e ${exitsCount} saídas`,
        isRead: false,
        createdAt: new Date()
      });

      await addActivity({
        type: 'movement',
        description: `Resumo diário: ${entriesCount} entradas e ${exitsCount} saídas`,
        userId: 'system',
        userName: 'Sistema'
      });
    }
  } catch (error) {
    console.error('Erro ao gerar resumo diário:', error);
  }
};

let checkStockInterval: NodeJS.Timeout;
let checkExpirationInterval: NodeJS.Timeout;
let dailySummaryTimeout: NodeJS.Timeout;

export const startNotificationChecks = () => {
  // Verificar estoque baixo a cada 5 minutos
  checkStockInterval = setInterval(checkLowStockLevels, 5 * 60 * 1000);

  // Verificar vencimentos a cada hora
  checkExpirationInterval = setInterval(checkProductExpiration, 60 * 60 * 1000);

  // Configurar resumo diário para 23:59
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    0
  );
  let delay = endOfDay.getTime() - now.getTime();
  if (delay < 0) delay += 24 * 60 * 60 * 1000;

  dailySummaryTimeout = setTimeout(() => {
    generateDailyMovementSummary();
    // Reagendar para o próximo dia
    dailySummaryTimeout = setInterval(generateDailyMovementSummary, 24 * 60 * 60 * 1000);
  }, delay);

  // Executar verificações iniciais
  checkLowStockLevels();
  checkProductExpiration();
};

export const stopNotificationChecks = () => {
  if (checkStockInterval) clearInterval(checkStockInterval);
  if (checkExpirationInterval) clearInterval(checkExpirationInterval);
  if (dailySummaryTimeout) clearTimeout(dailySummaryTimeout);
};
