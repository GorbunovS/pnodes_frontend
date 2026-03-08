<template>
    <div class="w-48 h-32 cursor-pointer hover:scale-95 border-2 border-blue-400/60 flex flex-col p-4 rounded-2xl transition-all duration-300 bg-zinc-900/50 hover:border-blue-400 hover:bg-zinc-800/50 group">
        <!-- Жёлтый круг (превью) -->
        <div class="w-12 h-12 rounded-full bg-amber-400 mb-3 flex items-center justify-center shrink-0">
            <i class="pi pi-image text-amber-700 text-lg"></i>
        </div>
        
        <!-- Название проекта -->
        <div class="text-blue-400 text-lg font-medium truncate leading-tight">
            {{ name }}
        </div>
        
        <!-- Дата создания -->
        <div class="text-zinc-500 text-xs mt-1">
            {{ formattedDate }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    id: String,
    name: String,
    createdAt: Number
});

const formattedDate = computed(() => {
    if (!props.createdAt) return '';
    const date = new Date(props.createdAt);
    return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
});
</script>
