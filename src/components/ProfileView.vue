<script setup>
import { ref } from 'vue'
import AuthPage from './AuthPage.vue'
import ApiKeysManager from './user/ApiKeysManager.vue'
import { useUserStore } from '../store/user'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'

const userStore = useUserStore()
const activeTab = ref(0)
</script>

<template>
  <div v-if="userStore.user">
    <main class="min-h-screen text-white pb-16 pt-24 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Profile Header -->
        <div class="flex items-center gap-6 mb-8">
          <img 
            :src="userStore.user.default_avatar_id 
              ? `https://avatars.yandex.net/get-yapic/${userStore.user.default_avatar_id}/islands-200` 
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
            class="h-24 w-24 rounded-full object-cover border-2 border-zinc-700" 
          />
          <div>
            <h1 class="text-3xl font-bold">
              {{ userStore.user.first_name }} {{ userStore.user.last_name }}
            </h1>
            <p class="text-zinc-400 mt-1">{{ userStore.user.default_email }}</p>
            <Button 
              severity="secondary" 
              @click="userStore.logout"
              class="mt-3"
              size="small"
              text
            >
              <i class="pi pi-sign-out mr-2"></i>
              Выйти из профиля
            </Button>
          </div>
        </div>

        <!-- Tabs -->
        <TabView 
          v-model:activeIndex="activeTab"
          :pt="{
            root: { class: '!bg-transparent' },
            nav: { class: ' !border-zinc-700' },
            tablist: { class: '!border-zinc-700' },
            inkbar: { class: '!bg-blue-500' },
            tab: { 
              class: '!text-zinc-400 hover:!text-white hover:!bg-zinc-800',
              active: '!text-white !bg-zinc-800'
            }
          }"
        >
          <!-- API Connections Tab -->
          <TabPanel>
            <template #header>
              <div class="flex items-center gap-2 px-2">
                <i class="pi pi-key"></i>
                <span>API Подключения</span>
              </div>
            </template>
            <div class="pt-4">
              <ApiKeysManager />
            </div>
          </TabPanel>

          <!-- Generation History Tab -->
          <TabPanel>
            <template #header>
              <div class="flex items-center gap-2 px-2">
                <i class="pi pi-images"></i>
                <span>История генераций</span>
              </div>
            </template>
            <div class="pt-4">
              <div class="text-center text-zinc-500 py-12">
                <i class="pi pi-images text-4xl mb-4"></i>
                <p>История генераций будет отображаться здесь</p>
              </div>
            </div>
          </TabPanel>

          <!-- Settings Tab -->
          <TabPanel>
            <template #header>
              <div class="flex items-center gap-2 px-2">
                <i class="pi pi-cog"></i>
                <span>Настройки</span>
              </div>
            </template>
            <div class="pt-4">
              <div class="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6 max-w-2xl">
                <h3 class="text-lg font-semibold mb-4">Настройки приложения</h3>
                <p class="text-zinc-400">Дополнительные настройки будут добавлены позже.</p>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </main>
  </div>

  <AuthPage v-else />
</template>

<style scoped>
:deep(.p-tabview-panels) {
  background: transparent !important;
}
</style>
