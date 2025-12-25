<template>
  <header class="w-full bg-black text-white border-b border-slate-700">
    <div class="mx-auto flex items-center justify-between px-8 py-4">
      <div class="flex items-baseline gap-1">
      <img :src="logo" alt="P nodes" class="h-6" />
      </div>

      <nav class="flex items-center gap-12 text-lg">
        <span
          class="cursor-pointer transition-colors"
          :class="currentPage === 'community' ? 'text-primary' : 'text-white hover:text-primary'"
          @click="setPage('community')"
        >
          сообщество
        </span>



        <span
          class="cursor-pointer transition-colors"
          :class="currentPage === 'prompting' ? 'text-primary' : 'text-white hover:text-primary'"
          @click="setPage('prompting')"
        >
          промтинг
        </span>
                <span
          class="cursor-pointer transition-colors"
          :class="currentPage === 'profile' ? 'text-primary' : 'text-white hover:text-primary'"
          @click="setPage('profile')"
        >
          профиль
        </span>
      </nav>

       <div v-if="userStore.user">
        <img 
          :src="userStore.user.default_avatar_id 
            ? `https://avatars.yandex.net/get-yapic/${userStore.user.default_avatar_id}/islands-200` 
            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
          class="h-10 w-10 rounded-full object-cover cursor-pointer" 
        />
      </div>
      
      <!-- ИНАЧЕ показываем кнопку "Войти" -->
      <div v-else>
         <Button @click="setPage('profile')" class="text-sm font-bold text-primary hover:underline">
           Войти
         </Button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
import logo from '../assets/P_nodes.svg'
import { useUserStore } from '../store'
const userStore = useUserStore()

const currentPage = ref('community')
const emit = defineEmits(['change-page'])

function setPage(page) {
  currentPage.value = page
  emit('change-page', page)
}
</script>

