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

      

      <button class="flex items-center gap-2 text-lg">
        <span class="uppercase">rus</span>
        <span class="h-4 w-2 bg-white"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
import logo from '../assets/P_nodes.svg'

const currentPage = ref('community')
const emit = defineEmits(['change-page'])

function setPage(page) {
  currentPage.value = page
  emit('change-page', page)
}
</script>

