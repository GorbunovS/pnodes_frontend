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
<HeaderComp />
<ProgressBar v-if="proStore.loading || aistore.loading" mode="indeterminate" style="height: 6px"></ProgressBar>
<RouterView />
</template>

<style scoped>

</style>
