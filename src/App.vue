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

function handleChangePage(page) {
  if (page === 'community') router.push('/')
  if (page === 'profile') router.push('/profile')
  if (page === 'prompting') router.push('/prompting')
}

</script>

<template>
  <HeaderComp @change-page="handleChangePage" />
<RouterView/>
</template>

<style scoped>

</style>
