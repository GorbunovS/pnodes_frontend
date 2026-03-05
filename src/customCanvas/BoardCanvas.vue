<template>
  <div class="bg-zinc-900 relative" style="width: 6000px; height: 4000px;">
    <!-- сетка -->
    <div
      class="absolute inset-0 pointer-events-none opacity-15"
      style="
        background-image:
          linear-gradient(to right, #444 1px, transparent 1px),
          linear-gradient(to bottom, #444 1px, transparent 1px);
        background-size: 80px 80px;
      "
    />

    <!-- квадратики -->
    <div
      v-for="item in items"
      :key="item.id"
      class="absolute w-40 h-40 bg-red-700/70 text-white font-bold text-2xl flex items-center justify-center rounded-lg shadow-2xl cursor-grab active:cursor-grabbing select-none touch-none"
      :style="{
        transform: `translate(${item.x}px, ${item.y}px)`,
        willChange: 'transform'
      }"
      @pointerdown="startDrag($event, item)"
    >
      {{ item.id }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'



// Предполагаем, что scale приходит из родителя (BoardViewer)
const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
})

const items = ref([
  { id: 'A', x: 1200, y:  800 },
  { id: 'B', x: 2200, y: 1400 },
  { id: 'C', x:  800, y: 2200 },
  { id: 'D', x: 2800, y: 1800 }
])

let draggedItem = null
let startX = 0
let startY = 0
let startClientX = 0
let startClientY = 0

const startDrag = (e, item) => {
  if (e.button !== 0) return
  e.stopPropagation()

  draggedItem = item
  startX = item.x
  startY = item.y
  startClientX = e.clientX
  startClientY = e.clientY

  document.addEventListener('pointermove', onMove, { passive: false })
  document.addEventListener('pointerup', onUp)
  document.addEventListener('pointercancel', onUp)
}

const onMove = (e) => {
  if (!draggedItem) return
  e.preventDefault()

  // Самое важное исправление ↓
  const dx = (e.clientX - startClientX) / props.scale
  const dy = (e.clientY - startClientY) / props.scale

  draggedItem.x = startX + dx
  draggedItem.y = startY + dy
}

const onUp = () => {
  draggedItem = null

  document.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerup', onUp)
  document.removeEventListener('pointercancel', onUp)
}
</script>