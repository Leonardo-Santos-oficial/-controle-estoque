<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nome do Produto</label>
      <input
        type="text"
        v-model="formData.name"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Descrição</label>
      <textarea
        v-model="formData.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      ></textarea>
    </div>

    <!-- Seção de Classificação Automática -->
    <div v-if="classification" class="bg-blue-50 p-4 rounded-md mb-4">
      <h3 class="text-sm font-medium text-blue-900 mb-2">Classificação Automática</h3>
      <div class="space-y-2">
        <div class="flex items-center">
          <span class="text-sm font-medium text-blue-800">Categoria Sugerida:</span>
          <span class="ml-2 text-sm text-blue-700">
            {{ getCategoryName(classification.categoryId) }}
          </span>
          <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {{ Math.round(classification.confidence * 100) }}% de confiança
          </span>
        </div>
        
        <div v-if="classification.suggestedCategories?.length > 1" class="mt-2">
          <p class="text-xs text-blue-700">Outras sugestões:</p>
          <ul class="mt-1 space-y-1">
            <li 
              v-for="cat in classification.suggestedCategories.slice(1, 3)" 
              :key="cat.id" 
              class="text-xs text-blue-600"
            >
              {{ getCategoryName(cat.id) }} ({{ Math.round(cat.confidence * 100) }}%)
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Características (separadas por vírgula)</label>
      <input
        type="text"
        v-model="formData.characteristics"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Preço</label>
      <input
        type="number"
        v-model="formData.price"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Quantidade</label>
      <input
        type="number"
        v-model="formData.quantity"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Adicionar Produto
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { classifyNewProduct, getCategoryName } from '../utils/productClassification';

const formData = ref({
  name: '',
  description: '',
  characteristics: '',
  price: '',
  quantity: '',
});

const classification = ref(null);

// Observar mudanças nos campos de nome e descrição
watch(
  () => [formData.value.name, formData.value.description, formData.value.characteristics],
  ([name, description, characteristics]) => {
    console.log('Watch ativado:', { name, description, characteristics });
    
    if (name || description) {
      try {
        const result = classifyNewProduct({
          name,
          description,
          characteristics: characteristics 
            ? characteristics.split(',').map(c => c.trim()) 
            : []
        });
        
        console.log('Resultado da classificação:', result);
        classification.value = result;
      } catch (error) {
        console.error('Erro na classificação:', error);
        classification.value = null;
      }
    }
  },
  { immediate: true }
);

const emit = defineEmits(['submit']);

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    categoryId: classification.value?.categoryId,
    categoryConfidence: classification.value?.confidence
  });
};
</script>
