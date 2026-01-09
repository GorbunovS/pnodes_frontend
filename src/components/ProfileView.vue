<script setup>

import AuthPage from './AuthPage.vue'

import { useUserStore } from '../store/user'
const userStore = useUserStore()
</script>

<template>
    <div v-if="userStore.user">
    <main class="min-h-screen text-white flex flex-col items-center justify-between pb-16 pt-24">
      <section class="flex flex-col items-center gap-4">
        <img 
          :src="userStore.user.default_avatar_id 
            ? `https://avatars.yandex.net/get-yapic/${userStore.user.default_avatar_id}/islands-200` 
            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
          class="h-20 w-20 rounded-full object-cover" 
        />

        <!-- Или вывод конкретных полей -->
        <h2 class="text-2xl font-bold">
            {{ userStore.user.first_name }} {{ userStore.user.last_name }}
        </h2>
        <p class="text-gray-400">{{ userStore.user.default_email }}</p>
    <Button severity="primary" @click="userStore.logout">Выйти из профиля</Button>
      </section>
 </main>

  </div>

  <AuthPage v-else />
</template>

