import { createRouter, createWebHistory } from 'vue-router';
import AITest from '../views/AITest.vue';
import AddProduct from '../views/AddProduct.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/ai-test',
      name: 'ai-test',
      component: AITest
    },
    {
      path: '/add-product',
      name: 'add-product',
      component: AddProduct
    }
  ]
});

export default router;
