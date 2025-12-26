<template>
    <div class="w-40 h-40 border flex flex-col p-4 border-slate-700 rounded-3xl">
        <div class="date text-slate-400 text-2xl flex-1 w-full flex justify-end">{{ date }}</div>
        <span class="type  text-2xl" 
              :class="typeColors[type] || 'text-white'"
        >{{ type }}</span>
        <span class="name text-sm">{{ name }}</span>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    id: Number,
    name: String,
    date: String,
    type: String
})
const typeColors = {
    HERO: 'text-blue-400',       // Пример: Синий
    SELFIE: 'text-pink-400',     // Пример: Розовый
    CINEMATIC: 'text-amber-400', // Пример: Золотой/Янтарный
    FASHION: 'text-purple-400'   // Пример: Фиолетовый
}


</script>