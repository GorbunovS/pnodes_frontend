import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useHistoryStore } from './historyStore'
import { useSessionStore } from './sessionStore'
import { nodeConfigs, getNodeConfig, nodeTypes, canConnect } from '../data/nodeConfig.js'

      

const CANVAS_WIDTH = 6000
const CANVAS_HEIGHT = 4000

const randomRange = (min, max) => Math.random() * (max - min) + min
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

export const useBoardStore = defineStore('board', () => {
  const historyStore = useHistoryStore()
  const sessionStore = useSessionStore()

  // === STATE ===
  const nodes = ref([])
  const connections = ref([])
  const nextNodeId = ref(1)
  const nextZIndex = ref(1)
  const clipboard = ref(null)
  const selectedNodeIds = ref(new Set())
  const currentSessionId = ref('default')
  
  // === HINTS SYSTEM ===
  const hintMode = ref(true)
  const activeSource = ref(null) // { nodeId, nodeType, color } или null

  // === GETTERS ===
  const getNodeById = (id) => nodes.value.find(n => n.id === id)
  const getSortedNodes = computed(() => [...nodes.value].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)))
  const selectedNodes = computed(() => nodes.value.filter(n => selectedNodeIds.value.has(n.id)))
  const hasSelection = computed(() => selectedNodeIds.value.size > 0)
  const selectedCount = computed(() => selectedNodeIds.value.size)

  // === SELECTION ===
  const selectNode = (nodeId, additive = false) => {
    if (additive) {
      selectedNodeIds.value.has(nodeId) ? selectedNodeIds.value.delete(nodeId) : selectedNodeIds.value.add(nodeId)
    } else {
      selectedNodeIds.value.clear()
      selectedNodeIds.value.add(nodeId)
    }
    selectedNodeIds.value = new Set(selectedNodeIds.value)
  }

  const selectNodesInRect = (x1, y1, x2, y2) => {
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2), maxY = Math.max(y1, y2)
    selectedNodeIds.value.clear()
    nodes.value.forEach(node => {
      if (node.x >= minX && node.x + 320 <= maxX && node.y >= minY && node.y + 200 <= maxY) {
        selectedNodeIds.value.add(node.id)
      }
    })
    selectedNodeIds.value = new Set(selectedNodeIds.value)
  }

  const clearSelection = () => {
    selectedNodeIds.value.clear()
    selectedNodeIds.value = new Set()
  }

  const isSelected = (nodeId) => selectedNodeIds.value.has(nodeId)
  
  // === HINTS ===
  const setActiveSource = (nodeId, nodeType, color) => {
    if (!hintMode.value) return
    activeSource.value = { nodeId, nodeType, color }
  }
  
  const clearActiveSource = () => {
    activeSource.value = null
  }
  
  const toggleHintMode = () => {
    hintMode.value = !hintMode.value
    if (!hintMode.value) clearActiveSource()
  }
  
  // Ноды, у которых есть инпуты, совместимые с активным source
  const compatibleNodesOnCanvas = computed(() => {
    if (!activeSource.value) return []
    return nodes.value.filter(node => {
      const config = node.config
      if (!config?.hasInput) return false
      return canConnect(activeSource.value.nodeType, node.type, config)
    }).map(n => n.id)
  })
  
  // Типы нод, которые можно создать (для подсветки библиотеки)
  const compatibleTypesInLibrary = computed(() => {
    if (!activeSource.value) return []
    const availableTypes = Object.values(nodeTypes)
    return availableTypes.filter(type => {
      const config = getNodeConfig(type)
      if (!config?.hasInput) return false
      // Проверяем может ли этот тип принять соединение от activeSource
      return canConnect(activeSource.value.nodeType, type, config)
    })
  })
  
  // Есть ли совместимые ноды на canvas'е
  const hasCompatibleNodes = computed(() => compatibleNodesOnCanvas.value.length > 0)

  // === HISTORY ===
  const saveState = () => {
    const state = {
      nodes: nodes.value.map(n => ({ id: n.id, type: n.type, x: n.x, y: n.y, zIndex: n.zIndex, data: n.data })),
      connections: connections.value,
      nextNodeId: nextNodeId.value,
      nextZIndex: nextZIndex.value
    }
    historyStore.pushState(state)
    saveToSession()
  }

  // Получить конфиг ноды (включая userNode из сессии)
  const resolveNodeConfig = (nodeType) => {
    // Сначала пробуем стандартный конфиг
    const standardConfig = getNodeConfig(nodeType)
    if (standardConfig) return standardConfig
    
    // Если не нашли и тип начинается с userNode_, ищем в сессии
    if (nodeType.startsWith('userNode_')) {
      return sessionStore.getUserNodeConfig(currentSessionId.value, nodeType)
    }
    
    return null
  }

  const restoreState = (state) => {
    if (!state) return
    nodes.value = state.nodes.map(n => {
      const config = resolveNodeConfig(n.type)
      return { ...n, config }
    })
    connections.value = state.connections || []
    nextNodeId.value = state.nextNodeId || 1
    nextZIndex.value = state.nextZIndex || 1
    clearSelection()
    saveToSession()
  }

  // === NODES ===
  const createNode = (type, x, y, customData = {}, saveHistory = true, customConfig = null) => {
    // Если передан кастомный конфиг (для userNode), используем его
    const config = customConfig || getNodeConfig(type)
    if (!config) return null

    const id = nextNodeId.value++
    const zIndex = nextZIndex.value++

    const node = {
      id,
      type,
      name: config.name,
      x,
      y,
      zIndex,
      config,
      data: { tags: [], description: '', ...customData }
    }

    nodes.value.push(node)
    selectNode(id, false)
    if (saveHistory) saveState()
    return node
  }

  const deleteNode = (nodeId, saveHistory = true) => {
    nodes.value = nodes.value.filter(n => n.id !== nodeId)
    connections.value = connections.value.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    selectedNodeIds.value.delete(nodeId)
    selectedNodeIds.value = new Set(selectedNodeIds.value)
    if (saveHistory) saveState()
  }

  const deleteSelectedNodes = (saveHistory = true) => {
    nodes.value = nodes.value.filter(n => !selectedNodeIds.value.has(n.id))
    connections.value = connections.value.filter(c => !selectedNodeIds.value.has(c.fromNodeId) && !selectedNodeIds.value.has(c.toNodeId))
    clearSelection()
    if (saveHistory) saveState()
  }

  const updateNodePosition = (nodeId, x, y) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) { node.x = x; node.y = y }
  }

  const updateSelectedNodesPosition = (dx, dy) => {
    selectedNodes.value.forEach(node => { node.x += dx; node.y += dy })
  }

  // === Z-INDEX ===
  const bringToFront = (nodeId, saveHistory = true) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) { node.zIndex = nextZIndex.value++; if (saveHistory) saveState() }
  }

  const sendToBack = (nodeId, saveHistory = true) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) { node.zIndex = Math.min(...nodes.value.map(n => n.zIndex || 0)) - 1; if (saveHistory) saveState() }
  }

  // === CONNECTIONS ===
  const createConnection = (fromNodeId, fromOutIdx, toNodeId, toInIdx, saveHistory = true) => {
    const fromNode = getNodeById(fromNodeId)
    const toNode = getNodeById(toNodeId)
    if (!fromNode || !toNode) return false

    // Проверяем совместимость типов
    const fromType = fromNode.type
    const toType = toNode.type
    
    // Используем canConnect из nodeConfig для проверки
    if (!canConnect(fromType, toType, toNode.config)) {
      console.log('Connection rejected:', fromType, '->', toType)
      return false
    }
    
    const exists = connections.value.some(c =>
      c.fromNodeId === fromNodeId && c.fromOutIdx === fromOutIdx &&
      c.toNodeId === toNodeId && c.toInIdx === toInIdx
    )
    if (exists) return false

    // Для обычных нод - удаляем существующие связи к этому input (только одна связь разрешена)
    // Для композитора и нод с acceptAnyInput - разрешаем множественные связи
    const acceptMultiple = toNode.config?.isComposer || toNode.config?.acceptAnyInput
    if (!acceptMultiple) {
      connections.value = connections.value.filter(c => !(c.toNodeId === toNodeId && c.toInIdx === toInIdx))
    }
    
    connections.value.push({ id: generateId(), fromNodeId, fromOutIdx, toNodeId, toInIdx })
    if (saveHistory) saveState()
    return true
  }

  const deleteConnectionsFromOutput = (nodeId, outputIdx, saveHistory = true) => {
    connections.value = connections.value.filter(c => !(c.fromNodeId === nodeId && c.fromOutIdx === outputIdx))
    if (saveHistory) saveState()
  }

  const deleteConnectionsToInput = (nodeId, inputIdx, saveHistory = true) => {
    connections.value = connections.value.filter(c => !(c.toNodeId === nodeId && c.toInIdx === inputIdx))
    if (saveHistory) saveState()
  }

  const deleteConnectionById = (connectionId, saveHistory = true) => {
    connections.value = connections.value.filter(c => c.id !== connectionId)
    if (saveHistory) saveState()
  }

  // === COPY/PASTE ===
  const copySelectedNodes = () => {
    const selected = selectedNodes.value
    if (selected.length === 0) return
    clipboard.value = {
      nodes: selected.map(n => ({ type: n.type, data: JSON.parse(JSON.stringify(n.data)), relX: n.x - selected[0].x, relY: n.y - selected[0].y }))
    }
  }

  const pasteNode = (x, y, saveHistory = true) => {
    if (!clipboard.value) return null
    clearSelection()
    clipboard.value.nodes.forEach((nodeData, i) => {
      const newNode = createNode(nodeData.type, x + nodeData.relX + randomRange(-10, 10), y + nodeData.relY + randomRange(-10, 10), nodeData.data, false)
      if (newNode) selectedNodeIds.value.add(newNode.id)
    })
    selectedNodeIds.value = new Set(selectedNodeIds.value)
    if (saveHistory) saveState()
  }

  // === SESSION ===
  const getSessionKey = (sessionId) => `canvasState_${sessionId || currentSessionId.value}`
  
  const saveToSession = () => {
    const key = getSessionKey()
    localStorage.setItem(key, JSON.stringify({
      nodes: nodes.value.map(n => ({ id: n.id, type: n.type, x: n.x, y: n.y, zIndex: n.zIndex, data: n.data })),
      connections: connections.value,
      nextNodeId: nextNodeId.value,
      nextZIndex: nextZIndex.value
    }))
  }

  const loadFromSession = () => {
    const key = getSessionKey()
    const saved = localStorage.getItem(key)
    
    // Восстанавливаем виртуальные конфиги пользовательских нод
    sessionStore.restoreUserNodeConfigsFromTemplates(currentSessionId.value)
    
    if (!saved) { loadDefault(); return }
    try {
      const state = JSON.parse(saved)
      nodes.value = state.nodes.map(n => ({ ...n, config: resolveNodeConfig(n.type) }))
      connections.value = state.connections || []
      nextNodeId.value = state.nextNodeId || 1
      nextZIndex.value = state.nextZIndex || 1
      clearSelection()
      historyStore.init({ nodes: JSON.parse(JSON.stringify(nodes.value)), connections: JSON.parse(JSON.stringify(connections.value)), nextNodeId: nextNodeId.value, nextZIndex: nextZIndex.value })
    } catch (e) { loadDefault() }
  }
  
  // Загрузить конкретную сессию
  const loadSession = (sessionId) => {
    currentSessionId.value = sessionId
    const key = getSessionKey(sessionId)
    const saved = localStorage.getItem(key)
    
    // Сбрасываем состояние
    nodes.value = []
    connections.value = []
    nextNodeId.value = 1
    nextZIndex.value = 1
    clearSelection()
    
    // Восстанавливаем виртуальные конфиги пользовательских нод
    sessionStore.restoreUserNodeConfigsFromTemplates(sessionId)
    
    if (!saved) {
      // Новая сессия - создаём пустое состояние
      historyStore.init({ nodes: [], connections: [], nextNodeId: 1, nextZIndex: 1 })
      saveToSession()
      return
    }
    
    try {
      const state = JSON.parse(saved)
      nodes.value = state.nodes.map(n => ({ ...n, config: resolveNodeConfig(n.type) }))
      connections.value = state.connections || []
      nextNodeId.value = state.nextNodeId || 1
      nextZIndex.value = state.nextZIndex || 1
      historyStore.init({ nodes: JSON.parse(JSON.stringify(nodes.value)), connections: JSON.parse(JSON.stringify(connections.value)), nextNodeId: nextNodeId.value, nextZIndex: nextZIndex.value })
    } catch (e) {
      console.error('Failed to load session:', e)
      loadDefault()
    }
  }

  const loadDefault = () => {
    const cx = CANVAS_WIDTH / 2, cy = CANVAS_HEIGHT / 2
    // Создаём демо-ноды разных типов
    createNode(nodeTypes.LIGHTING, cx - 200, cy - 100, {}, false)
    createNode(nodeTypes.CAMERA, cx - 200, cy + 50, {}, false)
    createNode(nodeTypes.CHARACTER, cx - 200, cy + 200, {}, false)
    historyStore.init({ nodes: JSON.parse(JSON.stringify(nodes.value)), connections: [], nextNodeId: nextNodeId.value, nextZIndex: nextZIndex.value })
    saveToSession()
  }

  const clearAll = () => { nodes.value = []; connections.value = []; nextNodeId.value = 1; nextZIndex.value = 1; clearSelection(); saveState() }

  // === UNDO/REDO ===
  const undo = () => { const state = historyStore.undo(); if (state) restoreState(state) }
  const redo = () => { const state = historyStore.redo(); if (state) restoreState(state) }

  return {
    nodes, connections,
    selectedNodeIds, selectedNodes, hasSelection, selectedCount,
    getNodeById, getSortedNodes,
    selectNode, selectNodesInRect, clearSelection, isSelected,
    createNode, deleteNode, deleteSelectedNodes,
    updateNodePosition, updateSelectedNodesPosition,
    bringToFront, sendToBack,
    createConnection, deleteConnectionsFromOutput, deleteConnectionsToInput, deleteConnectionById,
    copySelectedNodes, pasteNode,
    loadFromSession, loadSession, clearAll,
    saveState, undo, redo,
    currentSessionId,
    canUndo: () => historyStore.canUndo(),
    canRedo: () => historyStore.canRedo(),
    // hints
    hintMode, activeSource, compatibleNodesOnCanvas, compatibleTypesInLibrary, hasCompatibleNodes,
    setActiveSource, clearActiveSource, toggleHintMode
  }
})
