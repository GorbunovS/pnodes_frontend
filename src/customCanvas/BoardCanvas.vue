<template>
  <div 
    class="relative" 
    style="width: 6000px; height: 4000px;"
    @pointerdown="onCanvasPointerDown"
  >
    <!-- Сетка -->
    <div class="absolute inset-0 pointer-events-none opacity-10" 
      style="background-image: linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px); background-size: 80px 80px;" 
    />

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
    <svg class="absolute inset-0 overflow-visible" style="width: 100%; height: 100%; pointer-events: none;">
      <path
        v-for="conn in store.connections"
        :key="conn.id"
        :d="getPath(conn)"
        :stroke="getConnectionColor(conn)"
        stroke-width="6"
        fill="none"
        stroke-linecap="round"
        class="connection-line cursor-pointer"
        style="pointer-events: stroke;"
        @click="(e) => onConnectionClick(e, conn)"
      />
      <!-- Видимая тонкая линия поверх -->
      <path
        v-for="conn in store.connections"
        :key="'visible-' + conn.id"
        :d="getPath(conn)"
        :stroke="getConnectionColor(conn)"
        stroke-width="2.5" 
        fill="none"
        stroke-linecap="round"
        class="drop-shadow-md"
        style="pointer-events: none;"
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
      <NodesTemplate
        :node-id="node.id"
        :title="node.config?.name || node.name"
        :node-color="node.config?.color || '#6ee7b7'"
        :tags="node.config?.tags || []"
        :is-composer="node.config?.isComposer ?? false"
        :max-tags="node.config?.maxTags || 5"
        :has-description="node.config?.hasDescription ?? true"
        :has-output="node.config?.hasOutput ?? true"
        :has-input="node.config?.hasInput ?? false"
        :output-type="node.config?.outputType"
        :has-output-connection="hasOutputConnection(node.id, 0)"
        :has-input-connection="hasInputConnection(node.id, 0)"
        :is-selected="store.isSelected(node.id)"
        :is-source="isSourceNode(node.id)"
        :z-index="node.zIndex"
        :connected-nodes="node.config?.isComposer ? getConnectedNodes(node.id) : []"
        v-model="node.data"
        @port-click="handlePortClick"
        @port-mouse-down="handlePortMouseDown"
        @delete-output-connections="handleDeleteOutputConnections"
        @delete-input-connections="handleDeleteInputConnections"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBoardStore } from '../store/boardStore'
import { canConnect } from '../data/nodeConfig'
import NodesTemplate from './NodesTemplate.vue'

const props = defineProps({
  scale: { type: Number, default: 1 },
  panX: { type: Number, default: 0 },
  panY: { type: Number, default: 0 },
})

const emit = defineEmits(['centerCanvas'])

const store = useBoardStore()

// Флаг фокуса на инпуте любой ноды
const isInputFocused = ref(false)

const onNodeFocusChange = (focused) => {
  isInputFocused.value = focused
}

const hasOutputConnection = (nodeId, idx) => {
  return store.connections.some(c => c.fromNodeId === nodeId && c.fromOutIdx === idx)
}

const hasInputConnection = (nodeId, idx) => {
  return store.connections.some(c => c.toNodeId === nodeId && c.toInIdx === idx)
}

// Получить подключённые ноды для композитора
const getConnectedNodes = (composerNodeId) => {
  const connections = store.connections.filter(c => c.toNodeId === composerNodeId)
  return connections.map(conn => {
    const fromNode = store.getNodeById(conn.fromNodeId)
    if (!fromNode) return null
    return {
      nodeId: fromNode.id,
      name: fromNode.config?.name || fromNode.name,
      color: fromNode.config?.color || '#6ee7b7',
      type: fromNode.type,
      prompt: fromNode.data?.tags?.map(t => t.prompt).join(', ') || ''
    }
  }).filter(Boolean)
}

const getConnectionColor = (conn) => {
  const fromNode = store.getNodeById(conn.fromNodeId)
  return fromNode?.preset?.color || '#6ee7b7'
}

// === SELECTION ===
const selectionRect = ref(null)
const isSelecting = ref(false)
const selectStart = ref({ x: 0, y: 0 })
const clickSource = ref(null)

const isSourceNode = (nodeId) => clickSource.value?.nodeId === nodeId

const onCanvasPointerDown = (e) => {
  // Блокируем среднюю кнопку мыши (колесико) - она для пана
  if (e.button === 1) {
    e.stopPropagation()
    return
  }
  
  if (e.target.closest('[data-id]')) return
  
  if (!(e.ctrlKey || e.metaKey)) store.clearSelection()
  
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

// === NODE DRAG ===
let draggedNode = null
let dragStartPos = { x: 0, y: 0 }
let dragStartMouse = { x: 0, y: 0 }
let isDragging = false

const onNodePointerDown = (e, node) => {
  // Только левая кнопка мыши, не средняя (колесико)
  if (e.button !== 0) return
  
  // Не начинаем drag если есть фокус на инпуте
  if (isInputFocused.value) return
  
  // Drag только по пустому фону - не по тегам, кнопкам, полям, портам
  const target = e.target
  if (
    target.closest('[data-port]') ||
    target.closest('button') ||
    target.closest('textarea') ||
    target.closest('input') ||
    target.closest('.pi') ||
    target.closest('.cursor-pointer') ||
    target.closest('.rounded-full') ||
    target.closest('.p-dialog')
  ) {
    return
  }
  
  e.stopPropagation()
  
  const isMulti = e.ctrlKey || e.metaKey
  
  if (!isMulti && !store.isSelected(node.id)) {
    store.selectNode(node.id, false)
  } else if (isMulti) {
    store.selectNode(node.id, true)
    return
  }
  
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
    store.updateSelectedNodesPosition(dx - (draggedNode.x - dragStartPos.x), dy - (draggedNode.y - dragStartPos.y))
    dragStartPos = { x: draggedNode.x, y: draggedNode.y }
    dragStartMouse = { x: e.clientX, y: e.clientY }
  } else {
    draggedNode.x = dragStartPos.x + dx
    draggedNode.y = dragStartPos.y + dy
  }
}

const onNodeDragUp = () => {
  if (!isDragging) return
  
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
    if (!store.isSelected(nodeId)) store.selectNode(nodeId, false)
  } else {
    const source = clickSource.value
    
    if (type !== 'input' || nodeId === source.nodeId) {
      clickSource.value = null
      return
    }
    
    // Проверяем совместимость типов
    const fromNode = store.getNodeById(source.nodeId)
    const toNode = store.getNodeById(nodeId)
    
    if (!fromNode || !toNode) {
      clickSource.value = null
      return
    }
    
    const fromType = fromNode.config?.outputType || fromNode.type
    const toType = toNode.type
    
    if (!canConnect(fromType, toType, toNode.config)) {
      console.log('Cannot connect', fromType, 'to', toType)
      clickSource.value = null
      return
    }
    
    store.createConnection(source.nodeId, source.idx, nodeId, idx)
    clickSource.value = null
  }
}

const handlePortMouseDown = () => {
  // Для drag соединения
}

const handleDeleteOutputConnections = (nodeId, outputIdx) => {
  store.deleteConnectionsFromOutput(nodeId, outputIdx)
}

const handleDeleteInputConnections = (nodeId, inputIdx) => {
  store.deleteConnectionsToInput(nodeId, inputIdx)
}

// === PATH ===
const getPath = (conn) => {
  const fromNode = store.getNodeById(conn.fromNodeId)
  const toNode = store.getNodeById(conn.toNodeId)
  
  if (!fromNode || !toNode) return ''
  
  // Output: ромб в правом нижнем углу
  const fromX = fromNode.x + 320 + 12 // центр ромба (320 + половина 24)
  const fromY = fromNode.y + 200 + 12 // примерно высота ноды + смещение ромба
  
  // Input: ромб в верхнем левом углу (для композитора) или слева (для обычных)
  const isComposer = toNode.config?.isComposer
  const toX = toNode.x - 12 // левый край - половина ромба
  const toY = isComposer ? toNode.y - 12 : toNode.y + 100 // сверху для композитора
  
  const dx = toX - fromX
  const tension = Math.max(Math.abs(dx) * 0.5, 100)
  
  return `M ${fromX},${fromY} C ${fromX + tension},${fromY} ${toX - tension},${toY} ${toX},${toY}`
}

// === KEYBOARD ===
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (clickSource.value) clickSource.value = null
    else store.clearSelection()
    return
  }

  if (e.ctrlKey || e.metaKey) {
    if ((e.key === 'z' || e.key === 'я' || e.code === 'KeyZ') && !e.shiftKey) {
      e.preventDefault()
      store.undo()
      return
    }
    if (e.key === 'y' || e.key === 'н' || e.code === 'KeyY' || ((e.key === 'z' || e.key === 'я') && e.shiftKey)) {
      e.preventDefault()
      store.redo()
      return
    }
    if ((e.key === 'c' || e.key === 'с' || e.code === 'KeyC') && store.hasSelection) {
      e.preventDefault()
      store.copySelectedNodes()
      return
    }
    if (e.key === 'v' || e.key === 'м' || e.code === 'KeyV') {
      e.preventDefault()
      store.pasteNode(3000, 2000)
      return
    }
  }
  
  // Удаление только по Delete (не Backspace!) и только когда нет фокуса на инпуте
  if (e.key === 'Delete' && store.hasSelection && !isInputFocused.value) {
    store.deleteSelectedNodes()
  }
}

const onConnectionClick = (e, conn) => {
  // Ctrl+Click на линии - удалить связь
  if (e.ctrlKey || e.metaKey) {
    e.stopPropagation()
    e.preventDefault()
    store.deleteConnectionById(conn.id)
  }
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

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  store.loadFromSession()
  setTimeout(centerCanvas, 100)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
