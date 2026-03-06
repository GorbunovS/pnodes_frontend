import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CANVAS_WIDTH = 6000
const CANVAS_HEIGHT = 4000

// Генератор случайных чисел
const randomRange = (min, max) => Math.random() * (max - min) + min

// Генератор ID
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

// Шаблоны нод
const nodeTemplates = {
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
  // === STATE ===
  const nodes = ref([])
  const connections = ref([])
  const nextNodeId = ref(1)

  // === GETTERS ===
  const getNodeById = (id) => nodes.value.find(n => n.id === id)
  
  const getInputValue = computed(() => (nodeId, inputIdx) => {
    const conn = connections.value.find(c => c.toNodeId === nodeId && c.toInIdx === inputIdx)
    if (!conn) return 0
    const fromNode = nodes.value.find(n => n.id === conn.fromNodeId)
    return fromNode ? fromNode.data : 0
  })

  // === ACTIONS ===
  
  // Создать ноду из шаблона
  const createNode = (templateKey, x, y, customData = {}) => {
    const template = nodeTemplates[templateKey]
    if (!template) return null

    const id = nextNodeId.value++
    const node = {
      id,
      name: template.name,
      x,
      y,
      inputs: template.inputs.map(i => ({ ...i })),
      outputs: template.outputs.map(o => ({ ...o })),
      data: template.defaultData ? { ...template.defaultData, ...customData } : 0,
      compute: template.compute,
      template: templateKey
    }

    nodes.value.push(node)
    saveToSession()
    return node
  }

  // Удалить ноду
  const deleteNode = (nodeId) => {
    nodes.value = nodes.value.filter(n => n.id !== nodeId)
    connections.value = connections.value.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    saveToSession()
  }

  // Обновить позицию ноды
  const updateNodePosition = (nodeId, x, y) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      node.x = x
      node.y = y
    }
  }

  // Создать соединение
  const createConnection = (fromNodeId, fromOutIdx, toNodeId, toInIdx) => {
    // Проверяем что такого соединения ещё нет
    const exists = connections.value.some(c => 
      c.fromNodeId === fromNodeId && 
      c.fromOutIdx === fromOutIdx &&
      c.toNodeId === toNodeId && 
      c.toInIdx === toInIdx
    )
    if (exists) return false

    // Удаляем старое соединение на этот input если есть
    connections.value = connections.value.filter(c => 
      !(c.toNodeId === toNodeId && c.toInIdx === toInIdx)
    )

    connections.value.push({
      id: generateId(),
      fromNodeId,
      fromOutIdx,
      toNodeId,
      toInIdx
    })

    recalculate()
    saveToSession()
    return true
  }

  // Удалить соединение
  const deleteConnection = (connectionId) => {
    connections.value = connections.value.filter(c => c.id !== connectionId)
    recalculate()
    saveToSession()
  }

  // Пересчитать все значения
  const recalculate = () => {
    const visited = new Set()
    const order = []
    
    const visit = (node) => {
      if (visited.has(node.id)) return
      visited.add(node.id)
      
      connections.value
        .filter(c => c.toNodeId === node.id)
        .forEach(c => {
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

  // Сохранить в sessionStorage
  const saveToSession = () => {
    const state = {
      nodes: nodes.value.map(n => ({
        id: n.id,
        name: n.name,
        x: n.x,
        y: n.y,
        inputs: n.inputs,
        outputs: n.outputs,
        data: n.data,
        template: n.template
      })),
      connections: connections.value,
      nextNodeId: nextNodeId.value
    }
    sessionStorage.setItem('boardState', JSON.stringify(state))
  }

  // Загрузить из sessionStorage
  const loadFromSession = () => {
    const saved = sessionStorage.getItem('boardState')
    if (!saved) {
      loadDefaultGraph()
      return
    }

    try {
      const state = JSON.parse(saved)
      
      // Восстанавливаем ноды с функциями compute
      nodes.value = state.nodes.map(n => {
        const template = nodeTemplates[n.template]
        return {
          ...n,
          compute: template?.compute || (() => 0)
        }
      })
      
      connections.value = state.connections || []
      nextNodeId.value = state.nextNodeId || 1
      
      recalculate()
    } catch (e) {
      console.error('Failed to load from session:', e)
      loadDefaultGraph()
    }
  }

  // Загрузить дефолтный граф
  const loadDefaultGraph = () => {
    const centerX = CANVAS_WIDTH / 2
    const centerY = CANVAS_HEIGHT / 2

    // Создаём ноды вокруг центра с рандомизацией
    const n1 = createNode('number', centerX - 300 + randomRange(-30, 30), centerY - 100 + randomRange(-30, 30), { value: 5 })
    const n2 = createNode('doubler', centerX + randomRange(-30, 30), centerY - 100 + randomRange(-30, 30))
    const n3 = createNode('output', centerX + 300 + randomRange(-30, 30), centerY - 100 + randomRange(-30, 30))
    
    const n4 = createNode('number', centerX - 300 + randomRange(-30, 30), centerY + 100 + randomRange(-30, 30), { value: 10 })
    const n5 = createNode('tripler', centerX + randomRange(-30, 30), centerY + 100 + randomRange(-30, 30))
    const n6 = createNode('output', centerX + 300 + randomRange(-30, 30), centerY + 100 + randomRange(-30, 30))

    // Создаём соединения
    if (n1 && n2) createConnection(n1.id, 0, n2.id, 0)
    if (n2 && n3) createConnection(n2.id, 0, n3.id, 0)
    if (n4 && n5) createConnection(n4.id, 0, n5.id, 0)
    if (n5 && n6) createConnection(n5.id, 0, n6.id, 0)
  }

  // Очистить всё
  const clearAll = () => {
    nodes.value = []
    connections.value = []
    nextNodeId.value = 1
    saveToSession()
  }

  return {
    nodes,
    connections,
    nodeTemplates,
    getNodeById,
    getInputValue,
    createNode,
    deleteNode,
    updateNodePosition,
    createConnection,
    deleteConnection,
    recalculate,
    loadFromSession,
    loadDefaultGraph,
    clearAll,
    saveToSession
  }
})
