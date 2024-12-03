<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-3">
        <router-link 
          to="/ai-test" 
          class="text-blue-600 hover:text-blue-800"
        >
          Testar Funcionalidades IA
        </router-link>
      </div>
    </nav>
    
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// Componente principal
</script>
