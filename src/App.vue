<script setup>

import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import HeaderComp from './components/HeaderComp.vue';
import { useUserStore } from './store';

const userStore = useUserStore()

const router = useRouter()

onMounted(() => {
  userStore.handleYandexAuth()
    document.documentElement.classList.add('dark-mode')
    document.documentElement.style.colorScheme = 'dark'
})


</script>

<template>
<HeaderComp />
<RouterView />
</template>

<style scoped>

</style>
