// Removendo a importação e uso direto do OpenAI
// import { openai } from '../config/openai';

export class AIService {
  // Analisar tendências de inventário e fazer previsões
  async analyzeInventory(inventoryData: any) {
    try {
      const response = await fetch('http://localhost:5005/api/analyze-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventoryData })
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error analyzing inventory:', error);
      throw error;
    }
  }

  // Prever níveis de estoque ótimos
  async predictStockLevels(productData: any) {
    try {
      const response = await fetch('http://localhost:5005/api/predict-stock-levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productData })
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error predicting stock levels:', error);
      throw error;
    }
  }

  // Categorizar produtos automaticamente
  async categorizeProduct(productInfo: any) {
    try {
      const response = await fetch('http://localhost:5005/api/categorize-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInfo })
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error categorizing product:', error);
      throw error;
    }
  }
}
