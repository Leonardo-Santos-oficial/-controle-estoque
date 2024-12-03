<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      Adicionar Novo Produto
    </h1>
    <div class="bg-white shadow rounded-lg p-6">
      <AddProductForm @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AddProductForm from '../components/AddProductForm.vue';

const router = useRouter();

const handleSubmit = async (productData: any) => {
  try {
    // Aqui você deve implementar a lógica para salvar o produto
    console.log('Produto a ser salvo:', productData);
    // await saveProduct(productData);
    router.push('/dashboard');
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
  }
};
</script>
