interface MovementData {
  quantity: number;
  timestamp: string;
  type: 'entrada' | 'saida';
}

interface ProductData {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  movements: MovementData[];
}

interface RestockRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  recommendedQuantity: number;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  estimatedDaysUntilStockout: number | null;
}

export function calculateRestockRecommendations(products: ProductData[]): RestockRecommendation[] {
  return products.map((product) => {
    // Calcular média diária de consumo
    const dailyConsumption = calculateDailyConsumption(product.movements);
    
    // Calcular dias estimados até acabar o estoque
    const daysUntilStockout = dailyConsumption > 0 
      ? Math.round(product.currentStock / dailyConsumption)
      : 999; // Se não houver consumo, consideramos estoque para muito tempo
    
    // Calcular quantidade recomendada para reabastecimento
    const recommendedQuantity = calculateRecommendedQuantity(
      product.currentStock,
      product.minStock,
      dailyConsumption
    );
    
    // Determinar urgência
    const urgency = determineUrgency(daysUntilStockout, product.currentStock, product.minStock);
    
    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.currentStock,
      recommendedQuantity,
      urgency,
      reason: generateReason(urgency, daysUntilStockout, product.currentStock, product.minStock),
      estimatedDaysUntilStockout: daysUntilStockout === 999 ? null : daysUntilStockout
    };
  });
}

function calculateDailyConsumption(movements: MovementData[]): number {
  // Filtrar apenas saídas dos últimos 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentMovements = movements.filter(
    (movement) => 
      movement.type === 'saida' && 
      new Date(movement.timestamp) >= thirtyDaysAgo
  );
  
  if (recentMovements.length === 0) return 0;
  
  const totalConsumption = recentMovements.reduce(
    (sum, movement) => sum + movement.quantity,
    0
  );
  
  return totalConsumption / 30; // Média diária
}

function calculateRecommendedQuantity(
  currentStock: number,
  minStock: number,
  dailyConsumption: number
): number {
  // Calcular quantidade para 30 dias de estoque + estoque mínimo
  const targetStock = (dailyConsumption * 30) + minStock;
  const recommendedQuantity = Math.max(0, targetStock - currentStock);
  
  return Math.ceil(recommendedQuantity);
}

function determineUrgency(
  daysUntilStockout: number,
  currentStock: number,
  minStock: number
): 'high' | 'medium' | 'low' {
  if (currentStock <= minStock || daysUntilStockout <= 7) {
    return 'high';
  } else if (daysUntilStockout <= 14) {
    return 'medium';
  }
  return 'low';
}

function generateReason(
  urgency: 'high' | 'medium' | 'low',
  daysUntilStockout: number,
  currentStock: number,
  minStock: number
): string {
  if (currentStock <= minStock) {
    return `Estoque atual está abaixo do mínimo requerido (${minStock} unidades)`;
  }
  
  switch (urgency) {
    case 'high':
      return `Estoque estimado para acabar em ${Math.round(daysUntilStockout)} dias`;
    case 'medium':
      return `Reabastecimento recomendado nos próximos ${Math.round(daysUntilStockout)} dias`;
    case 'low':
      return 'Níveis de estoque adequados para a demanda atual';
  }
}
