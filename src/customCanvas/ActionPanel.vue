<template>
  <div class="fixed top-5 left-80 z-50 flex flex-col gap-2">
    <!-- Основные действия -->
    <Toolbar class="!bg-zinc-900/90 !border-zinc-700 !rounded-lg !p-2">
      <template #start>
        <div class="flex items-center gap-1">
          <Button 
            icon="pi pi-undo" 
            severity="secondary" 
            text 
            size="small"
            :disabled="!store.canUndo()"
            @click="store.undo()"
            v-tooltip.left="'Отменить (Ctrl+Z)'"
          />
          <Button 
            icon="pi pi-redo" 
            severity="secondary" 
            text 
            size="small"
            :disabled="!store.canRedo()"
            @click="store.redo()"
            v-tooltip.left="'Повторить (Ctrl+Y)'"
          />
          <Divider layout="vertical" class="!mx-1" />
          <Button 
            icon="pi pi-copy" 
            severity="secondary" 
            text 
            size="small"
            :disabled="!store.selectedNodeId"
            @click="copyNode"
            v-tooltip.left="'Копировать (Ctrl+C)'"
          />
          <Button 
            icon="pi pi-clone" 
            severity="secondary" 
            text 
            size="small"
            @click="pasteNode"
            v-tooltip.left="'Вставить (Ctrl+V)'"
          />
          <Divider layout="vertical" class="!mx-1" />
          <Button 
            icon="pi pi-arrow-down" 
            severity="secondary" 
            text 
            size="small"
            :disabled="!store.selectedNodeId"
            @click="store.bringToFront(store.selectedNodeId)"
            v-tooltip.left="'На передний план (Ctrl+])'"
          />
          <Button 
            icon="pi pi-arrow-up" 
            severity="secondary" 
            text 
            size="small"
            :disabled="!store.selectedNodeId"
            @click="store.sendToBack(store.selectedNodeId)"
            v-tooltip.left="'На задний план (Ctrl+[)'"
          />
        </div>
      </template>
      
      <template #end>
        <Button 
          icon="pi pi-trash" 
          severity="danger" 
          text 
          size="small"
          :disabled="!store.selectedNodeId"
          @click="deleteNode"
          v-tooltip.left="'Удалить (Delete)'"
        />
      </template>
    </Toolbar>

    <!-- Инфо о выбранной ноде -->
    <div v-if="store.selectedNode" class="bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 text-xs">
      <div class="text-zinc-400 mb-1">Выбрано:</div>
      <div class="text-white font-medium">{{ store.selectedNode.name }}</div>
      <div class="text-zinc-500 mt-1">z-index: {{ store.selectedNode.zIndex }}</div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'
import Divider from 'primevue/divider'
import { useBoardStore } from '../store/boardStore'

const store = useBoardStore()

const copyNode = () => {
  if (store.selectedNodeId) {
    store.copyNode(store.selectedNodeId)
  }
}

const pasteNode = () => {
  const canvasCenterX = 3000
  const canvasCenterY = 2000
  store.pasteNode(canvasCenterX, canvasCenterY)
}

const deleteNode = () => {
  if (store.selectedNodeId && confirm('Удалить выбранную ноду?')) {
    store.deleteNode(store.selectedNodeId)
  }
}
</script>
