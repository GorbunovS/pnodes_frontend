<template>
    <div class="w-40 h-40 cursor-pointer hover:scale-95 border flex flex-col p-4 border-slate-700 rounded-3xl transition-all duration-300">
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
    person: 'text-blue-400',       // Пример: Синий
    selfie: 'text-pink-400',     // Пример: Розовый
    CINEMATIC: 'text-amber-400', // Пример: Золотой/Янтарный
    FASHION: 'text-purple-400'   // Пример: Фиолетовый
}


</script>