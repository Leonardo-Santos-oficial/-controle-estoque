<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Teste das Funcionalidades de IA</h1>

    <!-- Teste de Análise de Inventário -->
    <div class="mb-8 p-4 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Análise de Inventário</h2>
      <textarea
        v-model="inventoryData"
        class="w-full p-2 border rounded mb-2"
        rows="4"
        placeholder="Cole aqui os dados do inventário em formato JSON"
      ></textarea>
      <button
        @click="analyzeInventory"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="loading.inventory"
      >
        {{ loading.inventory ? 'Analisando...' : 'Analisar Inventário' }}
      </button>
      <div v-if="results.inventory" class="mt-4 p-4 bg-gray-100 rounded">
        <h3 class="font-semibold">Resultado da Análise:</h3>
        <p class="whitespace-pre-wrap">{{ results.inventory }}</p>
      </div>
    </div>

    <!-- Teste de Previsão de Estoque -->
    <div class="mb-8 p-4 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Previsão de Níveis de Estoque</h2>
      <textarea
        v-model="productData"
        class="w-full p-2 border rounded mb-2"
        rows="4"
        placeholder="Cole aqui os dados do produto em formato JSON"
      ></textarea>
      <button
        @click="predictStock"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        :disabled="loading.prediction"
      >
        {{ loading.prediction ? 'Prevendo...' : 'Prever Estoque' }}
      </button>
      <div v-if="results.prediction" class="mt-4 p-4 bg-gray-100 rounded">
        <h3 class="font-semibold">Resultado da Previsão:</h3>
        <p class="whitespace-pre-wrap">{{ results.prediction }}</p>
      </div>
    </div>

    <!-- Teste de Categorização de Produto -->
    <div class="mb-8 p-4 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">Categorização de Produto</h2>
      <textarea
        v-model="productInfo"
        class="w-full p-2 border rounded mb-2"
        rows="4"
        placeholder="Cole aqui as informações do produto em formato JSON"
      ></textarea>
      <button
        @click="categorizeProduct"
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        :disabled="loading.categorization"
      >
        {{ loading.categorization ? 'Categorizando...' : 'Categorizar Produto' }}
      </button>
      <div v-if="results.categorization" class="mt-4 p-4 bg-gray-100 rounded">
        <h3 class="font-semibold">Resultado da Categorização:</h3>
        <p class="whitespace-pre-wrap">{{ results.categorization }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AIService } from '../services/aiService';

const aiService = new AIService();

const inventoryData = ref('');
const productData = ref('');
const productInfo = ref('');

const loading = ref({
  inventory: false,
  prediction: false,
  categorization: false
});

const results = ref({
  inventory: '',
  prediction: '',
  categorization: ''
});

const analyzeInventory = async () => {
  try {
    loading.value.inventory = true;
    const data = JSON.parse(inventoryData.value);
    results.value.inventory = await aiService.analyzeInventory(data);
  } catch (error) {
    results.value.inventory = 'Erro: ' + (error as Error).message;
  } finally {
    loading.value.inventory = false;
  }
};

const predictStock = async () => {
  try {
    loading.value.prediction = true;
    const data = JSON.parse(productData.value);
    results.value.prediction = await aiService.predictStockLevels(data);
  } catch (error) {
    results.value.prediction = 'Erro: ' + (error as Error).message;
  } finally {
    loading.value.prediction = false;
  }
};

const categorizeProduct = async () => {
  try {
    loading.value.categorization = true;
    const data = JSON.parse(productInfo.value);
    results.value.categorization = await aiService.categorizeProduct(data);
  } catch (error) {
    results.value.categorization = 'Erro: ' + (error as Error).message;
  } finally {
    loading.value.categorization = false;
  }
};
</script>
