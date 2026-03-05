<template>
  <div
    class="w-full h-screen bg-zinc-950 overflow-hidden relative touch-none select-none"
    @wheel.prevent="onWheel"
    @mousedown.middle.prevent="startPan"
    @mousemove="onMouseMove"
    @mouseup.middle="stopPan"
    @mouseleave="stopPan"
  >
    <div
      ref="dragContainer"
      class="absolute will-change-transform origin-top-left transition-transform duration-150 ease-out"
      :style="{
        transform: `translate(${x}px, ${y}px) scale(${scale})`
      }"
    >
      <BoardCanvas :scale="scale" />
    </div>

    <div class="absolute top-4 left-4 text-white font-mono z-20 pointer-events-none">
      x: {{ Math.round(x) }} • y: {{ Math.round(y) }} • zoom: {{ scale.toFixed(2) }}
    </div>

    <div class="absolute bottom-4 left-4 text-white/70 text-sm z-20 pointer-events-none">
      Средняя кнопка + движение → пан • Колёсико → зум
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BoardCanvas from './BoardCanvas.vue'

const x = ref(0)
const y = ref(0)
const scale = ref(1)

// ─── Плавность уже добавлена через CSS transition ───────────────
// duration-150 = 150 мс, ease-out — приятная остановка

// ─── Границы (минимальный видимый кусок канваса) ─────────────────
const MIN_SCALE = 0.38
const MAX_SCALE = 7
const CANVAS_WIDTH = 6000
const CANVAS_HEIGHT = 4000
const MIN_VISIBLE = 200  // минимум 200px канваса всегда видно (можно увеличить)

const bounds = computed(() => {
  const w = window.innerWidth
  const h = window.innerHeight

  // Учитываем текущий масштаб
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

// ─── Пан (средняя кнопка) ────────────────────────────────────────
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

  // Ограничиваем сразу во время движения (плавно)
  clampPosition()
}

const stopPan = (e) => {
  if (!isPanning) return
  isPanning = false
  e.currentTarget.style.cursor = ''
  clampPosition() // финальная проверка
}

// ─── Зум колёсиком (к точке под курсором) ─────────────────────────
const onWheel = (e) => {
  e.preventDefault()

  const rect = e.currentTarget.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const mouseCanvasX = (mouseX - x.value) / scale.value
  const mouseCanvasY = (mouseY - y.value) / scale.value

  const delta = e.deltaY > 0 ? -0.12 : 0.12
  const zoomFactor = 1 + delta

  // Новый масштаб с жёсткими границами
  let newScale = scale.value * zoomFactor
  newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))

  // Корректировка позиции под курсор
  x.value = mouseX - mouseCanvasX * newScale
  y.value = mouseY - mouseCanvasY * newScale

  scale.value = newScale

  // Ограничение по границам канваса (как было раньше)
  clampPosition()
}
</script>