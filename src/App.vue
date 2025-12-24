<script setup>
import NodesView from './components/NodesView.vue';

import { onMounted } from 'vue'

onMounted(() => {
<<<<<<< HEAD
=======
    // Блокируем светлую тему
>>>>>>> 1178a014c4af1a04c549de6a2ba76e18bb5163f5
    document.documentElement.classList.add('dark-mode')
    document.documentElement.style.colorScheme = 'dark'
})

</script>

<template>

  <NodesView />
</template>

<style scoped>

</style>
