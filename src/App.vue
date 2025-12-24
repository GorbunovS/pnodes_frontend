<script setup>

import { RouterView } from 'vue-router';
import { onMounted } from 'vue'
import HeaderComp from './components/HeaderComp.vue';

onMounted(() => {
    document.documentElement.classList.add('dark-mode')
    document.documentElement.style.colorScheme = 'dark'
})

</script>

<template>
  <HeaderComp/>
<RouterView/>
</template>

<style scoped>

</style>
