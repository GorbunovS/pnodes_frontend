<template>
  <Panel 
    header="Библиотека нод"
    class="absolute top-5 left-5 w-72 max-h-[calc(100vh-2.5rem)] flex flex-col z-50 border border-zinc-800 text-white backdrop-blur-md shadow-2xl rounded-xl"
  >
    <template #icons>
      <span class="text-[10px] text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-700 mr-2">{{ nodeConfigsList.length }} шт.</span>
    </template>

    <div class="p-2 space-y-2">
      <!-- Шаблоны нод -->
      <div 
        v-for="config in nodeConfigsList" 
        :key="config.type"
        class="group flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-800/80 transition-all border border-transparent hover:border-zinc-700"
        @click="createNode(config.type)"
      >
        <div 
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :style="{ backgroundColor: config.color + '30', color: config.color }"
        >
          <i :class="config.icon || 'pi pi-tag'"></i>
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-zinc-200 group-hover:text-white">{{ config.name }}</div>
          <div class="text-[10px] text-zinc-500">
            {{ config.hasInput ? '1 in' : '0 in' }} / {{ config.hasOutput ? '1 out' : '0 out' }}
          </div>
        </div>
        <i class="pi pi-plus text-zinc-600 group-hover:text-zinc-400 text-xs"></i>
      </div>

      <Divider class="!my-3" />

      <!-- Хоткеи -->
      <div class="text-[10px] text-zinc-500 space-y-1 px-1">
        <div class="font-bold text-zinc-400 mb-1">Горячие клавиши:</div>
        <div class="flex justify-between"><span>Ctrl+Click</span><span>Мультиселект</span></div>
        <div class="flex justify-between"><span>Drag</span><span>Рамка выделения</span></div>
        <div class="flex justify-between"><span>Ctrl+Z/Y</span><span>Отмена/Повтор</span></div>
        <div class="flex justify-between"><span>Ctrl+C/V</span><span>Копировать/Вставить</span></div>
        <div class="flex justify-between"><span>Delete</span><span>Удалить</span></div>
      </div>

      <Divider class="!my-3" />

      <!-- Действия -->
      <div class="space-y-2">
        <Button 
          label="Очистить всё" 
          icon="pi pi-trash" 
          severity="danger" 
          text 
          size="small"
          class="w-full !justify-start"
          @click="confirmClear"
        />
        <Button 
          label="Сбросить к дефолту" 
          icon="pi pi-refresh" 
          severity="secondary" 
          text 
          size="small"
          class="w-full !justify-start"
          @click="resetToDefault"
        />
      </div>
    </div>
  </Panel>
</template>

<script setup>
import { computed } from 'vue'
import { Panel, Button, Divider } from 'primevue'
import { useBoardStore } from '../store/boardStore'
import { getAllNodeConfigs } from '../data/nodeConfig'

const store = useBoardStore()

const nodeConfigsList = computed(() => getAllNodeConfigs())

const createNode = (type) => {
  const canvasCenterX = 3000
  const canvasCenterY = 2000
  const randomOffset = () => (Math.random() - 0.5) * 100
  
  store.createNode(type, canvasCenterX + randomOffset(), canvasCenterY + randomOffset())
}

const confirmClear = () => {
  if (confirm('Удалить все ноды и соединения?')) {
    store.clearAll()
  }
}

const resetToDefault = () => {
  if (confirm('Сбросить к дефолтному графу?')) {
    store.clearAll()
    store.loadDefault()
  }
}
</script>
