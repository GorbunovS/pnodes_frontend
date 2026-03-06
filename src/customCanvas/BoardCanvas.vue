<template>
  <!-- Debug панель с JSON -->
  <div class="fixed top-4 right-4 z-[100] w-80 max-h-[40vh] overflow-auto bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 text-xs font-mono">
    <div class="flex justify-between items-center mb-2">
      <span class="text-zinc-400 font-bold">Debug JSON</span>
      <span class="text-zinc-600">{{ store.nodes.length }} nodes / {{ store.connections.length }} conns</span>
    </div>
    <pre class="text-green-400 whitespace-pre-wrap break-all">{{ debugJson }}</pre>
  </div>

  <div class="relative" style="width: 6000px; height: 4000px;">
    <!-- Сетка -->
    <div class="absolute inset-0 pointer-events-none opacity-15" style="background-image: linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px); background-size: 80px 80px;" />

    <!-- Линии соединений -->
    <svg class="absolute inset-0 pointer-events-none overflow-visible" style="width: 100%; height: 100%;">
      <path
        v-for="conn in store.connections"
        :key="conn.id"
        :d="getPath(conn)"
        stroke="#60a5fa" 
        stroke-width="2.5" 
        fill="none"
        stroke-linecap="round"
        class="drop-shadow-md"
        style="pointer-events: stroke; cursor: pointer;"
        @click="store.deleteConnection(conn.id)"
      />
    </svg>

    <!-- Ноды -->
    <div
      v-for="node in store.nodes"
      :key="node.id"
      class="absolute"
      :style="{ transform: `translate(${node.x}px, ${node.y}px)` }"
      @pointerdown="startNodeDrag($event, node)"
    >
      <DraggableNote
        :node-id="node.id"
        :title="node.name"
        :inputs="node.inputs"
        :outputs="node.outputs"
        :data="node.data"
        :is-source="isSourceNode(node.id)"
        @port-click="handlePortClick"
      >
        <div class="text-zinc-400 text-xs">
          <div v-if="node.template === 'number'" class="flex items-center gap-2">
            <span class="text-blue-400">Значение:</span>
            <input 
              type="number" 
              v-model.number="node.data.value" 
              class="w-16 bg-zinc-800 border border-zinc-700 rounded px-1 text-white text-xs"
              @change="store.recalculate(); store.saveToSession()"
              @pointerdown.stop
            >
          </div>
          <div v-else>
            {{ node.inputs.length }} in / {{ node.outputs.length }} out
          </div>
        </div>
      </DraggableNote>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBoardStore } from '../store/boardStore'
import DraggableNote from './DraggableNote.vue'

const props = defineProps({
  scale: { type: Number, default: 1 },
  panX: { type: Number, default: 0 },
  panY: { type: Number, default: 0 },
})

const emit = defineEmits(['centerCanvas'])

const store = useBoardStore()

// === DEBUG ===
const debugJson = computed(() => {
  return JSON.stringify({
    nodes: store.nodes.map(n => ({ id: n.id, name: n.name, x: Math.round(n.x), y: Math.round(n.y), data: n.data })),
    connections: store.connections
  }, null, 2)
})

// === CLICK СОЕДИНЕНИЯ ===
const clickSource = ref(null) // { nodeId, idx, portType } | null

const isSourceNode = (nodeId) => {
  return clickSource.value?.nodeId === nodeId
}

const handlePortClick = (e, type, idx, portType, nodeId) => {
  console.log('PortClick:', { type, idx, portType, nodeId, currentSource: clickSource.value })
  
  if (!clickSource.value) {
    // Начинаем соединение - только с output
    if (type !== 'output') {
      console.log('Игнорируем: клик не по output')
      return
    }
    
    clickSource.value = { nodeId, idx, portType }
    console.log('Начато соединение от:', clickSource.value)
    
  } else {
    // Завершаем соединение - только на input
    const source = clickSource.value
    
    if (type !== 'input') {
      console.log('Отмена: клик не по input')
      clickSource.value = null
      return
    }
    
    if (nodeId === source.nodeId) {
      console.log('Отмена: соединение само с собой')
      clickSource.value = null
      return
    }
    
    if (portType !== source.portType) {
      console.log('Отмена: несовпадение типов', { source: source.portType, target: portType })
      clickSource.value = null
      return
    }
    
    // Создаём соединение
    console.log('Создаём соединение:', { from: source.nodeId, out: source.idx, to: nodeId, in: idx })
    const result = store.createConnection(source.nodeId, source.idx, nodeId, idx)
    console.log('Результат:', result)
    
    clickSource.value = null
  }
}

// === DRAG НОД ===
let draggedNode = null
let startX = 0, startY = 0, startClientX = 0, startClientY = 0

const startNodeDrag = (e, node) => {
  if (e.button !== 0) return
  if (e.target.closest('[data-port]')) return
  
  e.stopPropagation()
  draggedNode = node
  startX = node.x
  startY = node.y
  startClientX = e.clientX
  startClientY = e.clientY
  document.addEventListener('pointermove', onNodeMove, { passive: false })
  document.addEventListener('pointerup', onNodeUp)
}

const onNodeMove = (e) => {
  if (!draggedNode) return
  e.preventDefault()
  const dx = (e.clientX - startClientX) / props.scale
  const dy = (e.clientY - startClientY) / props.scale
  draggedNode.x = startX + dx
  draggedNode.y = startY + dy
}

const onNodeUp = () => {
  if (draggedNode) {
    store.updateNodePosition(draggedNode.id, draggedNode.x, draggedNode.y)
    store.saveToSession()
  }
  draggedNode = null
  document.removeEventListener('pointermove', onNodeMove)
  document.removeEventListener('pointerup', onNodeUp)
}

// === KEYBOARD ===
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && clickSource.value) {
    console.log('Отмена по Escape')
    clickSource.value = null
  }
}

// === PATH ===
const getPath = (conn) => {
  const fromNode = store.getNodeById(conn.fromNodeId)
  const toNode = store.getNodeById(conn.toNodeId)
  
  if (!fromNode || !toNode) return ''
  
  const fromX = fromNode.x + 240
  const fromY = fromNode.y + 35 + conn.fromOutIdx * 28 + 10
  const toX = toNode.x
  const toY = toNode.y + 35 + conn.toInIdx * 28 + 10
  
  const dx = toX - fromX
  const tension = Math.max(Math.abs(dx) * 0.5, 100)
  
  return `M ${fromX},${fromY} C ${fromX + tension},${fromY} ${toX - tension},${toY} ${toX},${toY}`
}

// === ЦЕНТРИРОВАНИЕ ===
const CANVAS_WIDTH = 6000
const CANVAS_HEIGHT = 4000

const centerCanvas = () => {
  const containerEl = document.querySelector('.board-container')
  if (!containerEl) return
  
  const containerRect = containerEl.getBoundingClientRect()
  const viewportCenterX = containerRect.width / 2
  const viewportCenterY = containerRect.height / 2
  
  const canvasCenterX = CANVAS_WIDTH / 2
  const canvasCenterY = CANVAS_HEIGHT / 2
  
  const targetPanX = viewportCenterX - canvasCenterX * props.scale
  const targetPanY = viewportCenterY - canvasCenterY * props.scale
  
  emit('centerCanvas', { panX: targetPanX, panY: targetPanY })
}

// === LIFECYCLE ===
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  store.loadFromSession()
  
  setTimeout(() => {
    centerCanvas()
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
