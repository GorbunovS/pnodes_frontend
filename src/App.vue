<script setup>

import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import HeaderComp from './components/HeaderComp.vue';
import { useUserStore } from './store/user';
import { useAiApiStore } from './store/aistore';
import ProgressBar from 'primevue/progressbar';
import { useProStore } from './store/pro';


const userStore = useUserStore()
const aistore = useAiApiStore();
const proStore = useProStore()

const router = useRouter()

onMounted(() => {
  userStore.handleYandexAuth()
    document.documentElement.classList.add('dark-mode')
    document.documentElement.style.colorScheme = 'dark'
})


</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Фиксированный хедер -->
    <header class="fixed top-0 left-0 right-0 z-50">
      <HeaderComp />
      <ProgressBar 
        v-if="proStore.loading || aistore.loading" 
        mode="indeterminate" 
        class="h-1.5 w-full"
      />
    </header>

    <!-- Основной контент -->
    <main class="flex-1 pt-16">
      <RouterView />
    </main>
  </div>
</template>


<style scoped>

</style>
