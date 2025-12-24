<script setup>

import { RouterView } from 'vue-router';
import { onMounted } from 'vue'

onMounted(() => {
    document.documentElement.classList.add('dark-mode')
    document.documentElement.style.colorScheme = 'dark'
})

</script>

<template>
<RouterView/>
</template>

<style scoped>

</style>
