import axios from 'axios';

export interface SaleHistory {
  productId: string;
  date: string;
  quantity: number;
}

export interface ForecastResult {
  productId: string;
  predictedDemand: number;
  confidence: number;
  nextReorderDate: string;
  suggestedQuantity: number;
}

class DemandForecastService {
  private readonly baseURL = 'http://localhost:3001/api'; // Ajuste conforme necessário

  async getProductForecast(productId: string): Promise<ForecastResult> {
    try {
      const response = await axios.get(`${this.baseURL}/forecast/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter previsão:', error);
      throw error;
    }
  }

  async submitSalesData(salesData: SaleHistory[]): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/sales-data`, salesData);
    } catch (error) {
      console.error('Erro ao enviar dados de vendas:', error);
      throw error;
    }
  }

  async getBatchForecast(productIds: string[]): Promise<ForecastResult[]> {
    try {
      const response = await axios.post(`${this.baseURL}/batch-forecast`, { productIds });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter previsões em lote:', error);
      throw error;
    }
  }
}

export const demandForecastService = new DemandForecastService();
