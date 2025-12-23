<script setup>
import NodesView from './components/NodesView.vue';

import { onMounted } from 'vue'

onMounted(() => {
    // Блокируем светлую тему
    document.documentElement.classList.add('dark-mode')
    document.documentElement.style.colorScheme = 'dark'
})

</script>

<template>

  <NodesView />
</template>

<style scoped>

</style>
