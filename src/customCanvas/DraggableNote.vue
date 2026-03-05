<template>
  <div class="bg-zinc-800 relative" style="width: 5000px; height: 4000px;">
    <!-- сетка -->
    <div
      class="absolute inset-0 pointer-events-none opacity-20"
      style="
        background-image:
          linear-gradient(to right, #555 1px, transparent 1px),
          linear-gradient(to bottom, #555 1px, transparent 1px);
        background-size: 80px 80px;
      "
    />

    <!-- квадратики -->
    <div
      v-for="item in items"
      :key="item.id"
      class="absolute w-32 h-32 bg-red-600/80 text-white flex items-center justify-center rounded shadow-lg cursor-grab active:cursor-grabbing select-none touch-none"
      :style="{ transform: `translate(${item.x}px, ${item.y}px)` }"
      @pointerdown.self.prevent="startDrag($event, item)"
    >
      {{ item.id }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 'A', x:  800, y:  600 },
  { id: 'B', x: 1600, y: 1000 },
  { id: 'C', x:  500, y: 1800 },
  { id: 'D', x: 2200, y: 1400 }
])

let currentItem = null
let startX = 0
let startY = 0
let startMouseX = 0
let startMouseY = 0

function startDrag(e, item) {
  if (e.button !== 0) return           // только левая кнопка
  e.stopPropagation()                  // чтобы не мешать другим событиям

  currentItem = item
  startX = item.x
  startY = item.y
  startMouseX = e.clientX
  startMouseY = e.clientY

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointercancel', onPointerUp)
}

function onPointerMove(e) {
  if (!currentItem) return

  const dx = e.clientX - startMouseX
  const dy = e.clientY - startMouseY

  currentItem.x = startX + dx
  currentItem.y = startY + dy
}

function onPointerUp() {
  currentItem = null

  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointercancel', onPointerUp)
}
</script>