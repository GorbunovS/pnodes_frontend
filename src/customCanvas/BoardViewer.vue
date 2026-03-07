<template>
  <div
    ref="boardContainer"
    class="board-container w-full h-screen bg-zinc-950 overflow-hidden relative touch-none select-none font-[Inter]"
    style="font-family: 'Inter', system-ui, sans-serif;"
    @wheel.prevent="onWheel"
    @mousedown.middle.prevent="startPan"
    @mousemove="onMouseMove"
    @mouseup.middle="stopPan"
    @mouseleave="stopPan"
  >
    <!-- Панель нод -->
    <NodePanel />

    <div
      ref="dragContainer"
      class="absolute will-change-transform origin-top-left transition-transform duration-150 ease-out"
      style="font-family: inherit;"
      :style="{
        transform: `translate(${x}px, ${y}px) scale(${scale})`
      }"
    >
      <BoardCanvas 
        :pan-x="x" 
        :pan-y="y" 
        :scale="scale" 
        @center-canvas="onCenterCanvas"
      />
    </div>

    <div class="absolute top-4 left-80 text-white font-mono z-20 pointer-events-none ml-4">
      x: {{ Math.round(x) }} • y: {{ Math.round(y) }} • zoom: {{ scale.toFixed(2) }}
    </div>

    <div class="absolute bottom-4 left-4 text-white/70 text-sm z-20 pointer-events-none">
      Средняя кнопка + движение → пан • Колёсико → зум • Drag/Click порты → соединить
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BoardCanvas from './BoardCanvas.vue'
import NodePanel from './NodePanel.vue'

const x = ref(0)
const y = ref(0)
const scale = ref(0.8)

// Загрузка позиции из localStorage
onMounted(() => {
  const savedViewport = localStorage.getItem('canvasViewport')
  if (savedViewport) {
    try {
      const { panX, panY, zoom } = JSON.parse(savedViewport)
      x.value = panX
      y.value = panY
      scale.value = zoom
      clampPosition()
    } catch (e) {
      console.log('Failed to load viewport')
    }
  }
})

// Сохранение позиции при изменении
watch([x, y, scale], () => {
  localStorage.setItem('canvasViewport', JSON.stringify({
    panX: x.value,
    panY: y.value,
    zoom: scale.value
  }))
}, { debounce: 100 })

const onCenterCanvas = ({ panX, panY }) => {
  x.value = panX
  y.value = panY
}

// Границы
const MIN_SCALE = 0.38
const MAX_SCALE = 1
const CANVAS_WIDTH = 6000
const CANVAS_HEIGHT = 4000
const MIN_VISIBLE = 200

const bounds = computed(() => {
  const w = window.innerWidth
  const h = window.innerHeight
  const visibleW = w / scale.value
  const visibleH = h / scale.value

  return {
    minX: w - (CANVAS_WIDTH * scale.value) + MIN_VISIBLE,
    maxX: -MIN_VISIBLE,
    minY: h - (CANVAS_HEIGHT * scale.value) + MIN_VISIBLE,
    maxY: -MIN_VISIBLE
  }
})

function clampPosition() {
  const b = bounds.value
  x.value = Math.max(b.minX, Math.min(b.maxX, x.value))
  y.value = Math.max(b.minY, Math.min(b.maxY, y.value))
}

// Pan
let isPanning = false
let startMouseX = 0
let startMouseY = 0
let startPanX = 0
let startPanY = 0

const startPan = (e) => {
  isPanning = true
  startMouseX = e.clientX
  startMouseY = e.clientY
  startPanX = x.value
  startPanY = y.value
  e.currentTarget.style.cursor = 'grabbing'
}

const onMouseMove = (e) => {
  if (!isPanning) return
  const dx = e.clientX - startMouseX
  const dy = e.clientY - startMouseY
  x.value = startPanX + dx
  y.value = startPanY + dy
  clampPosition()
}

const stopPan = (e) => {
  if (!isPanning) return
  isPanning = false
  e.currentTarget.style.cursor = ''
  clampPosition()
}

// Zoom
const onWheel = (e) => {
  e.preventDefault()
  const rect = e.currentTarget.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const mouseCanvasX = (mouseX - x.value) / scale.value
  const mouseCanvasY = (mouseY - y.value) / scale.value

  const delta = e.deltaY > 0 ? -0.12 : 0.12
  const zoomFactor = 1 + delta
  let newScale = scale.value * zoomFactor
  newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))

  x.value = mouseX - mouseCanvasX * newScale
  y.value = mouseY - mouseCanvasY * newScale
  scale.value = newScale
  clampPosition()
}
</script>
