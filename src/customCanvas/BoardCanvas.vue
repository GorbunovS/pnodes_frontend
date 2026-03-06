<template>
  <!-- Debug панель -->
  <div class="fixed top-4 right-4 z-[100] w-64 max-h-[30vh] overflow-auto bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 text-xs font-mono">
    <div class="flex justify-between items-center mb-2">
      <span class="text-zinc-400 font-bold">Debug</span>
      <span class="text-zinc-600">{{ store.selectedCount }} selected</span>
    </div>
    <div class="text-zinc-500 text-[10px] mb-1">
      Ctrl+Click: мультиселект | Drag: рамка | Ctrl+C/V: копи | Delete: удалить
    </div>
    <pre class="text-green-400 whitespace-pre-wrap break-all text-[10px]">{{ debugJson }}</pre>
  </div>

  <div 
    class="relative" 
    style="width: 6000px; height: 4000px;"
    @pointerdown="onCanvasPointerDown"
  >
    <!-- Сетка -->
    <div class="absolute inset-0 pointer-events-none opacity-15" style="background-image: linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px); background-size: 80px 80px;" />

    <!-- Рамка выделения -->
    <div
      v-if="selectionRect"
      class="absolute border-2 border-blue-400 bg-blue-400/10 pointer-events-none"
      :style="{
        left: selectionRect.x + 'px',
        top: selectionRect.y + 'px',
        width: selectionRect.width + 'px',
        height: selectionRect.height + 'px'
      }"
    />

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
      />
    </svg>

    <!-- Ноды -->
    <div
      v-for="node in store.getSortedNodes"
      :key="node.id"
      class="absolute"
      :style="{ 
        transform: `translate(${node.x}px, ${node.y}px)`,
        zIndex: node.zIndex || 1
      }"
      @pointerdown="onNodePointerDown($event, node)"
    >
      <DraggableNote
        :node-id="node.id"
        :title="node.name"
        :inputs="node.inputs"
        :outputs="node.outputs"
        :data="node.data"
        :is-source="isSourceNode(node.id)"
        :source-port-idx="clickSource?.idx"
        :is-selected="store.isSelected(node.id)"
        :z-index="node.zIndex"
        :connections="store.connections"
        @port-click="handlePortClick"
        @delete-input-connection="handleDeleteInputConnection"
        @delete-output-connections="handleDeleteOutputConnections"
      >
        <div class="text-zinc-400 text-xs">
          <div v-if="node.template === 'number'" class="flex items-center gap-2">
            <span class="text-blue-400">Значение:</span>
            <input 
              type="number" 
              v-model.number="node.data.value" 
              class="w-16 bg-zinc-800 border border-zinc-700 rounded px-1 text-white text-xs"
              @change="onDataChange"
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
    selected: Array.from(store.selectedNodeIds),
    canUndo: store.canUndo(),
    canRedo: store.canRedo(),
    nodes: store.nodes.length,
    connections: store.connections.length
  }, null, 2)
})

// === SELECTION RECT ===
const selectionRect = ref(null)
const isSelecting = ref(false)
const selectStart = ref({ x: 0, y: 0 })

// === CLICK CONNECTION ===
const clickSource = ref(null)
const isMultiSelect = ref(false)

const isSourceNode = (nodeId) => clickSource.value?.nodeId === nodeId

// === POINTER EVENTS ===
const onCanvasPointerDown = (e) => {
  // Если клик по ноде - не начинаем рамку
  if (e.target.closest('[data-id]')) return
  
  // Если не Ctrl - сбрасываем выделение
  isMultiSelect.value = e.ctrlKey || e.metaKey
  if (!isMultiSelect.value) {
    store.clearSelection()
  }
  
  // Начинаем рамку выделения
  const canvasContainer = document.querySelector('.board-container')
  if (!canvasContainer) return
  
  const rect = canvasContainer.getBoundingClientRect()
  const x = (e.clientX - rect.left - props.panX) / props.scale
  const y = (e.clientY - rect.top - props.panY) / props.scale
  
  selectStart.value = { x, y }
  isSelecting.value = true
  selectionRect.value = { x, y, width: 0, height: 0 }
  
  document.addEventListener('pointermove', onSelectMove)
  document.addEventListener('pointerup', onSelectUp)
}

const onSelectMove = (e) => {
  if (!isSelecting.value) return
  
  const canvasContainer = document.querySelector('.board-container')
  if (!canvasContainer) return
  
  const rect = canvasContainer.getBoundingClientRect()
  const x = (e.clientX - rect.left - props.panX) / props.scale
  const y = (e.clientY - rect.top - props.panY) / props.scale
  
  selectionRect.value = {
    x: Math.min(selectStart.value.x, x),
    y: Math.min(selectStart.value.y, y),
    width: Math.abs(x - selectStart.value.x),
    height: Math.abs(y - selectStart.value.y)
  }
}

const onSelectUp = () => {
  if (!isSelecting.value) return
  
  // Выделяем ноды в рамке
  if (selectionRect.value.width > 10 || selectionRect.value.height > 10) {
    store.selectNodesInRect(
      selectionRect.value.x,
      selectionRect.value.y,
      selectionRect.value.x + selectionRect.value.width,
      selectionRect.value.y + selectionRect.value.height
    )
  }
  
  isSelecting.value = false
  selectionRect.value = null
  document.removeEventListener('pointermove', onSelectMove)
  document.removeEventListener('pointerup', onSelectUp)
}

// === NODE DRAG & SELECT ===
let draggedNode = null
let dragStartPos = { x: 0, y: 0 }
let dragStartMouse = { x: 0, y: 0 }
let isDragging = false

const onNodePointerDown = (e, node) => {
  if (e.button !== 0) return
  if (e.target.closest('[data-port]')) return
  
  e.stopPropagation()
  
  isMultiSelect.value = e.ctrlKey || e.metaKey
  
  // Если не в мультиселекте и нода не выделена - сбрасываем
  if (!isMultiSelect.value && !store.isSelected(node.id)) {
    store.selectNode(node.id, false)
  } else if (isMultiSelect.value) {
    // Ctrl+клик - добавляем/убираем из выделения
    store.selectNode(node.id, true)
    return // Не начинаем drag при Ctrl+клик
  } else if (store.isSelected(node.id) && store.selectedCount > 1) {
    // Клик по выделенной ноде в группе - начинаем групповой drag
    store.selectNode(node.id, false)
  }
  
  // Начинаем drag
  isDragging = true
  draggedNode = node
  dragStartPos = { x: node.x, y: node.y }
  dragStartMouse = { x: e.clientX, y: e.clientY }
  
  document.addEventListener('pointermove', onNodeDragMove)
  document.addEventListener('pointerup', onNodeDragUp)
}

const onNodeDragMove = (e) => {
  if (!isDragging) return
  e.preventDefault()
  
  const dx = (e.clientX - dragStartMouse.x) / props.scale
  const dy = (e.clientY - dragStartMouse.y) / props.scale
  
  if (store.selectedCount > 1 && store.isSelected(draggedNode.id)) {
    // Двигаем все выделенные ноды
    store.updateSelectedNodesPosition(dx - (draggedNode.x - dragStartPos.x), dy - (draggedNode.y - dragStartPos.y))
    // Обновляем стартовую позицию для следующего кадра
    dragStartPos = { x: draggedNode.x, y: draggedNode.y }
    dragStartMouse = { x: e.clientX, y: e.clientY }
  } else {
    // Двигаем одну ноду
    draggedNode.x = dragStartPos.x + dx
    draggedNode.y = dragStartPos.y + dy
  }
}

const onNodeDragUp = () => {
  if (!isDragging) return
  
  // Сохраняем позиции
  if (store.selectedCount > 1) {
    store.selectedNodes.forEach(n => store.updateNodePosition(n.id, n.x, n.y))
  } else if (draggedNode) {
    store.updateNodePosition(draggedNode.id, draggedNode.x, draggedNode.y)
  }
  
  store.saveState()
  
  isDragging = false
  draggedNode = null
  document.removeEventListener('pointermove', onNodeDragMove)
  document.removeEventListener('pointerup', onNodeDragUp)
}

// === CONNECTIONS ===
const handlePortClick = (e, type, idx, portType, nodeId) => {
  if (!clickSource.value) {
    if (type !== 'output') return
    clickSource.value = { nodeId, idx, portType }
    if (!store.isSelected(nodeId)) {
      store.selectNode(nodeId, false)
    }
  } else {
    const source = clickSource.value
    
    if (type !== 'input') {
      clickSource.value = null
      return
    }
    
    if (nodeId === source.nodeId) {
      clickSource.value = null
      return
    }
    
    if (portType !== source.portType) {
      clickSource.value = null
      return
    }
    
    store.createConnection(source.nodeId, source.idx, nodeId, idx)
    clickSource.value = null
  }
}

const handleDeleteInputConnection = (nodeId, inputIdx) => {
  store.deleteConnectionsToInput(nodeId, inputIdx)
}

const handleDeleteOutputConnections = (nodeId, outputIdx) => {
  store.deleteConnectionsFromOutput(nodeId, outputIdx)
}

// === DATA CHANGE ===
const onDataChange = () => {
  store.recalculate()
  store.saveState()
}

// === KEYBOARD ===
const handleKeyDown = (e) => {
  // Escape - отмена соединения или выделения
  if (e.key === 'Escape') {
    if (clickSource.value) {
      clickSource.value = null
    } else {
      store.clearSelection()
    }
    return
  }

  if (e.ctrlKey || e.metaKey) {
    // Undo/Redo
    if ((e.key === 'z' || e.key === 'я' || e.code === 'KeyZ') && !e.shiftKey) {
      e.preventDefault()
      store.undo()
      return
    }
    if (e.key === 'y' || e.key === 'н' || e.code === 'KeyY' || ((e.key === 'z' || e.key === 'я' || e.code === 'KeyZ') && e.shiftKey)) {
      e.preventDefault()
      store.redo()
      return
    }
    
    // Z-index
    if ((e.key === '[' || e.key === 'х') && store.hasSelection) {
      e.preventDefault()
      store.selectedNodes.forEach(n => store.sendToBack(n.id, false))
      store.saveState()
      return
    }
    if ((e.key === ']' || e.key === 'ъ') && store.hasSelection) {
      e.preventDefault()
      store.selectedNodes.forEach(n => store.bringToFront(n.id, false))
      store.saveState()
      return
    }
    
    // Copy
    if ((e.key === 'c' || e.key === 'с' || e.code === 'KeyC') && store.hasSelection) {
      e.preventDefault()
      store.copySelectedNodes()
      return
    }
    
    // Paste
    if (e.key === 'v' || e.key === 'м' || e.code === 'KeyV') {
      e.preventDefault()
      const canvasCenterX = 3000
      const canvasCenterY = 2000
      store.pasteNode(canvasCenterX, canvasCenterY)
      return
    }
  }
  
  // Delete selected
  if ((e.key === 'Delete' || e.key === 'Backspace') && store.hasSelection) {
    store.deleteSelectedNodes()
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

// === CENTER ===
const centerCanvas = () => {
  const containerEl = document.querySelector('.board-container')
  if (!containerEl) return
  
  const containerRect = containerEl.getBoundingClientRect()
  const targetPanX = (containerRect.width / 2) - 3000 * props.scale
  const targetPanY = (containerRect.height / 2) - 2000 * props.scale
  
  emit('centerCanvas', { panX: targetPanX, panY: targetPanY })
}

// === LIFECYCLE ===
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  store.loadFromSession()
  setTimeout(centerCanvas, 100)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
