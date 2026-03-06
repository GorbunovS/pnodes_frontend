import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useHistoryStore } from './historyStore'

const CANVAS_WIDTH = 6000
const CANVAS_HEIGHT = 4000

const randomRange = (min, max) => Math.random() * (max - min) + min
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

export const nodeTemplates = {
  number: {
    name: 'Число',
    inputs: [],
    outputs: [{ type: 'number' }],
    compute: (inputs, data) => data?.value || 0,
    defaultData: { value: 5 }
  },
  doubler: {
    name: 'Удвоитель',
    inputs: [{ type: 'number' }],
    outputs: [{ type: 'number' }],
    compute: (inputs) => (inputs[0] || 0) * 2
  },
  adder: {
    name: 'Сумматор',
    inputs: [{ type: 'number' }, { type: 'number' }],
    outputs: [{ type: 'number' }],
    compute: (inputs) => (inputs[0] || 0) + (inputs[1] || 0)
  },
  tripler: {
    name: 'Утроитель',
    inputs: [{ type: 'number' }],
    outputs: [{ type: 'number' }],
    compute: (inputs) => (inputs[0] || 0) * 3
  },
  output: {
    name: 'Вывод',
    inputs: [{ type: 'number' }],
    outputs: [],
    compute: (inputs) => inputs[0] || 0
  }
}

export const useBoardStore = defineStore('board', () => {
  const historyStore = useHistoryStore()

  // === STATE ===
  const nodes = ref([])
  const connections = ref([])
  const nextNodeId = ref(1)
  const nextZIndex = ref(1)
  const clipboard = ref(null)
  const selectedNodeIds = ref(new Set()) // Теперь множество для мультиселекта

  // === GETTERS ===
  const getNodeById = (id) => nodes.value.find(n => n.id === id)
  const getSortedNodes = computed(() => [...nodes.value].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)))
  const selectedNodes = computed(() => nodes.value.filter(n => selectedNodeIds.value.has(n.id)))
  const hasSelection = computed(() => selectedNodeIds.value.size > 0)
  const selectedCount = computed(() => selectedNodeIds.value.size)

  // === SELECTION ===
  const selectNode = (nodeId, additive = false) => {
    if (additive) {
      // Ctrl+клик - добавляем/удаляем из выделения
      if (selectedNodeIds.value.has(nodeId)) {
        selectedNodeIds.value.delete(nodeId)
      } else {
        selectedNodeIds.value.add(nodeId)
      }
    } else {
      // Обычный клик - заменяем выделение
      selectedNodeIds.value.clear()
      selectedNodeIds.value.add(nodeId)
    }
    // Триггерим реактивность
    selectedNodeIds.value = new Set(selectedNodeIds.value)
  }

  const selectNodesInRect = (x1, y1, x2, y2) => {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)

    selectedNodeIds.value.clear()
    nodes.value.forEach(node => {
      if (node.x >= minX && node.x + 240 <= maxX &&
          node.y >= minY && node.y + 120 <= maxY) {
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

  // === HISTORY ===
  const saveState = () => {
    const state = {
      nodes: nodes.value.map(n => ({
        id: n.id,
        name: n.name,
        x: n.x,
        y: n.y,
        zIndex: n.zIndex,
        inputs: n.inputs,
        outputs: n.outputs,
        data: n.data,
        template: n.template
      })),
      connections: connections.value,
      nextNodeId: nextNodeId.value,
      nextZIndex: nextZIndex.value
    }
    historyStore.pushState(state)
    saveToSession()
  }

  const restoreState = (state) => {
    if (!state) return
    nodes.value = state.nodes.map(n => {
      const template = nodeTemplates[n.template]
      return { ...n, compute: template?.compute || (() => 0) }
    })
    connections.value = state.connections || []
    nextNodeId.value = state.nextNodeId || 1
    nextZIndex.value = state.nextZIndex || 1
    clearSelection()
    recalculate()
    saveToSession()
  }

  // === NODES ===
  const createNode = (templateKey, x, y, customData = {}, saveHistory = true) => {
    const template = nodeTemplates[templateKey]
    if (!template) return null

    const id = nextNodeId.value++
    const zIndex = nextZIndex.value++

    const node = {
      id, name: template.name, x, y, zIndex,
      inputs: template.inputs.map(i => ({ ...i })),
      outputs: template.outputs.map(o => ({ ...o })),
      data: template.defaultData ? { ...template.defaultData, ...customData } : 0,
      compute: template.compute,
      template: templateKey
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
    const idsToDelete = Array.from(selectedNodeIds.value)
    nodes.value = nodes.value.filter(n => !selectedNodeIds.value.has(n.id))
    connections.value = connections.value.filter(c => 
      !selectedNodeIds.value.has(c.fromNodeId) && !selectedNodeIds.value.has(c.toNodeId)
    )
    clearSelection()
    if (saveHistory) saveState()
  }

  const updateNodePosition = (nodeId, x, y) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) { node.x = x; node.y = y }
  }

  // Обновить позиции всех выделенных нод (для мультидрага)
  const updateSelectedNodesPosition = (dx, dy) => {
    selectedNodes.value.forEach(node => {
      node.x += dx
      node.y += dy
    })
  }

  // === Z-INDEX ===
  const bringToFront = (nodeId, saveHistory = true) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) { node.zIndex = nextZIndex.value++; if (saveHistory) saveState() }
  }

  const sendToBack = (nodeId, saveHistory = true) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) { 
      const minZ = Math.min(...nodes.value.map(n => n.zIndex || 0))
      node.zIndex = minZ - 1
      if (saveHistory) saveState()
    }
  }

  // === CONNECTIONS ===
  const createConnection = (fromNodeId, fromOutIdx, toNodeId, toInIdx, saveHistory = true) => {
    const exists = connections.value.some(c =>
      c.fromNodeId === fromNodeId && c.fromOutIdx === fromOutIdx &&
      c.toNodeId === toNodeId && c.toInIdx === toInIdx
    )
    if (exists) return false

    connections.value = connections.value.filter(c => !(c.toNodeId === toNodeId && c.toInIdx === toInIdx))
    connections.value.push({ id: generateId(), fromNodeId, fromOutIdx, toNodeId, toInIdx })
    recalculate()
    if (saveHistory) saveState()
    return true
  }

  const deleteConnection = (connectionId, saveHistory = true) => {
    connections.value = connections.value.filter(c => c.id !== connectionId)
    recalculate()
    if (saveHistory) saveState()
  }

  const deleteConnectionsFromOutput = (nodeId, outputIdx, saveHistory = true) => {
    connections.value = connections.value.filter(c => !(c.fromNodeId === nodeId && c.fromOutIdx === outputIdx))
    recalculate()
    if (saveHistory) saveState()
  }

  const deleteConnectionsToInput = (nodeId, inputIdx, saveHistory = true) => {
    connections.value = connections.value.filter(c => !(c.toNodeId === nodeId && c.toInIdx === inputIdx))
    recalculate()
    if (saveHistory) saveState()
  }

  // === COPY/PASTE ===
  const copyNode = (nodeId) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (!node) return
    clipboard.value = {
      template: node.template,
      data: JSON.parse(JSON.stringify(node.data)),
      inputs: JSON.parse(JSON.stringify(node.inputs)),
      outputs: JSON.parse(JSON.stringify(node.outputs)),
      name: node.name
    }
  }

  const copySelectedNodes = () => {
    const selected = selectedNodes.value
    if (selected.length === 0) return
    
    // Копируем все выделенные ноды
    clipboard.value = {
      type: 'multi',
      nodes: selected.map(n => ({
        template: n.template,
        data: JSON.parse(JSON.stringify(n.data)),
        inputs: JSON.parse(JSON.stringify(n.inputs)),
        outputs: JSON.parse(JSON.stringify(n.outputs)),
        name: n.name,
        // Сохраняем относительные позиции для групповой вставки
        relX: n.x - selected[0].x,
        relY: n.y - selected[0].y
      }))
    }
  }

  const pasteNode = (x, y, saveHistory = true) => {
    if (!clipboard.value) return null

    if (clipboard.value.type === 'multi') {
      // Вставка нескольких нод
      clearSelection()
      const newNodes = []
      clipboard.value.nodes.forEach((nodeData, i) => {
        const newNode = createNode(
          nodeData.template,
          x + nodeData.relX + randomRange(-10, 10),
          y + nodeData.relY + randomRange(-10, 10),
          nodeData.data,
          false
        )
        if (newNode) {
          newNodes.push(newNode)
          selectedNodeIds.value.add(newNode.id)
        }
      })
      selectedNodeIds.value = new Set(selectedNodeIds.value)
      if (saveHistory) saveState()
      return newNodes[0]
    } else {
      // Вставка одной ноды
      const newNode = createNode(
        clipboard.value.template,
        x + randomRange(-30, 30),
        y + randomRange(-30, 30),
        clipboard.value.data,
        false
      )
      if (newNode && saveHistory) saveState()
      return newNode
    }
  }

  // === RECALCULATE ===
  const recalculate = () => {
    const visited = new Set()
    const order = []
    
    const visit = (node) => {
      if (visited.has(node.id)) return
      visited.add(node.id)
      connections.value.filter(c => c.toNodeId === node.id).forEach(c => {
        const fromNode = nodes.value.find(n => n.id === c.fromNodeId)
        if (fromNode) visit(fromNode)
      })
      order.push(node)
    }
    
    nodes.value.forEach(visit)
    order.forEach(node => {
      const inputs = node.inputs.map((_, idx) => {
        const conn = connections.value.find(c => c.toNodeId === node.id && c.toInIdx === idx)
        if (conn) {
          const fromNode = nodes.value.find(n => n.id === conn.fromNodeId)
          return fromNode ? fromNode.data : 0
        }
        return 0
      })
      node.data = node.compute(inputs, node.data)
    })
  }

  // === SESSION ===
  const saveToSession = () => {
    const state = {
      nodes: nodes.value.map(n => ({ id: n.id, name: n.name, x: n.x, y: n.y, zIndex: n.zIndex, inputs: n.inputs, outputs: n.outputs, data: n.data, template: n.template })),
      connections: connections.value,
      nextNodeId: nextNodeId.value,
      nextZIndex: nextZIndex.value
    }
    sessionStorage.setItem('boardState', JSON.stringify(state))
  }

  const loadFromSession = () => {
    const saved = sessionStorage.getItem('boardState')
    if (!saved) { loadDefaultGraph(); return }
    try {
      const state = JSON.parse(saved)
      nodes.value = state.nodes.map(n => {
        const template = nodeTemplates[n.template]
        return { ...n, compute: template?.compute || (() => 0) }
      })
      connections.value = state.connections || []
      nextNodeId.value = state.nextNodeId || 1
      nextZIndex.value = state.nextZIndex || 1
      clearSelection()
      recalculate()
      historyStore.init({ nodes: JSON.parse(JSON.stringify(nodes.value)), connections: JSON.parse(JSON.stringify(connections.value)), nextNodeId: nextNodeId.value, nextZIndex: nextZIndex.value })
    } catch (e) { console.error('Failed to load:', e); loadDefaultGraph() }
  }

  const loadDefaultGraph = () => {
    const cx = CANVAS_WIDTH / 2, cy = CANVAS_HEIGHT / 2
    const n1 = createNode('number', cx - 300 + randomRange(-30, 30), cy - 100 + randomRange(-30, 30), { value: 5 }, false)
    const n2 = createNode('doubler', cx + randomRange(-30, 30), cy - 100 + randomRange(-30, 30), {}, false)
    const n3 = createNode('output', cx + 300 + randomRange(-30, 30), cy - 100 + randomRange(-30, 30), {}, false)
    const n4 = createNode('number', cx - 300 + randomRange(-30, 30), cy + 100 + randomRange(-30, 30), { value: 10 }, false)
    const n5 = createNode('tripler', cx + randomRange(-30, 30), cy + 100 + randomRange(-30, 30), {}, false)
    const n6 = createNode('output', cx + 300 + randomRange(-30, 30), cy + 100 + randomRange(-30, 30), {}, false)
    if (n1 && n2) createConnection(n1.id, 0, n2.id, 0, false)
    if (n2 && n3) createConnection(n2.id, 0, n3.id, 0, false)
    if (n4 && n5) createConnection(n4.id, 0, n5.id, 0, false)
    if (n5 && n6) createConnection(n5.id, 0, n6.id, 0, false)
    historyStore.init({ nodes: JSON.parse(JSON.stringify(nodes.value)), connections: JSON.parse(JSON.stringify(connections.value)), nextNodeId: nextNodeId.value, nextZIndex: nextZIndex.value })
    saveToSession()
  }

  const clearAll = () => {
    nodes.value = []; connections.value = []; nextNodeId.value = 1; nextZIndex.value = 1
    clearSelection()
    saveState()
  }

  // === UNDO/REDO ===
  const undo = () => { const state = historyStore.undo(); if (state) restoreState(state) }
  const redo = () => { const state = historyStore.redo(); if (state) restoreState(state) }

  return {
    nodes, connections, nodeTemplates,
    selectedNodeIds, selectedNodes, hasSelection, selectedCount,
    getNodeById, getSortedNodes,
    selectNode, selectNodesInRect, clearSelection, isSelected,
    createNode, deleteNode, deleteSelectedNodes,
    updateNodePosition, updateSelectedNodesPosition,
    bringToFront, sendToBack,
    createConnection, deleteConnection, deleteConnectionsFromOutput, deleteConnectionsToInput,
    copyNode, copySelectedNodes, pasteNode,
    recalculate, loadFromSession, loadDefaultGraph, clearAll,
    saveToSession, saveState, undo, redo,
    canUndo: () => historyStore.canUndo(),
    canRedo: () => historyStore.canRedo()
  }
})
