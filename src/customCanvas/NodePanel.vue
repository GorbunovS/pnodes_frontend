<template>
  <Panel 
    header="Библиотека нод"
    class="absolute top-5 left-5 w-72 max-h-[calc(100vh-2.5rem)] flex flex-col z-50 border border-zinc-800 text-white backdrop-blur-md shadow-2xl rounded-xl"
  >
    <template #icons>
      <span class="text-[10px] text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-700 mr-2">{{ nodeConfigsList.length }} шт.</span>
    </template>

    <div class="p-2 space-y-2">
      <!-- Тумблер Подсказки -->
      <div class="flex items-center justify-between px-1 py-2 mb-2 bg-zinc-800/50 rounded-lg">
        <span class="text-xs font-medium text-zinc-300">Подсказки</span>
        <CustomToggleSwitch 
          :model-value="store.hintMode"
          @update:model-value="store.toggleHintMode()"
          label="Включить подсказки"
          active-color="#22c55e"
        />
      </div>
      
      <!-- Индикатор активной подсказки -->
      <div v-if="store.activeSource && !store.hasCompatibleNodes" class="px-2 py-1.5 bg-zinc-800/80 rounded-lg border border-dashed border-zinc-600">
        <div class="text-[10px] text-zinc-400 mb-1">Нет подходящих инпутов на canvas'е</div>
        <div class="text-[10px] text-zinc-500">Создайте ноду из списка ниже ↓</div>
      </div>
      <!-- Шаблоны нод -->
      <div 
        v-for="config in nodeConfigsList" 
        :key="config.type"
        class="group flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-800/80 transition-all border"
        :class="[
          isHighlighted(config.type) 
            ? 'bg-zinc-800/60 border-zinc-500 shadow-lg animate-pulse-border' 
            : 'border-transparent hover:border-zinc-700'
        ]"
        :style="isHighlighted(config.type) ? { 
          borderColor: store.activeSource?.color || '#22c55e',
          boxShadow: `0 0 10px ${(store.activeSource?.color || '#22c55e') + '40'}`
        } : {}"
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
import { getAllNodeConfigs, canConnect } from '../data/nodeConfig'
import CustomToggleSwitch from '../components/CustomToggleSwitch.vue'

const store = useBoardStore()

const nodeConfigsList = computed(() => getAllNodeConfigs())

// Проверяем, нужно ли подсвечивать кнопку ноды
const isHighlighted = (nodeType) => {
  if (!store.activeSource) return false
  if (!store.hintMode) return false
  
  const config = getAllNodeConfigs().find(c => c.type === nodeType)
  if (!config?.hasInput) return false
  
  return canConnect(store.activeSource.nodeType, nodeType, config)
}

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

<style scoped>
@keyframes pulse-border {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

.animate-pulse-border {
  animation: pulse-border 1.5s ease-in-out infinite;
}


</style>
