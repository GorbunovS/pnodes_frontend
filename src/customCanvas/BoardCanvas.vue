<template>
  <div 
    class="relative"
    :class="{
      'is-dragging-connection': isDraggingConnection,
      'is-compatible': isCompatibleTarget === true,
      'is-incompatible': isCompatibleTarget === false
    }"
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
    <svg 
      class="absolute inset-0 overflow-visible" 
      style="width: 100%; height: 100%; pointer-events: none;"
      :key="`svg-${props.scale}-${props.panX}-${props.panY}`"
    >
      <defs>
        <linearGradient
          v-for="conn in store.connections"
          :key="`grad-${conn.id}`"
          :id="`gradient-${conn.id}`"
          gradientUnits="userSpaceOnUse"
          :x1="getGradientCoords(conn).x1"
          :y1="getGradientCoords(conn).y1"
          :x2="getGradientCoords(conn).x2"
          :y2="getGradientCoords(conn).y2"
        >
          <stop offset="0%" :stop-color="getConnectionColor(conn)" />
          <stop offset="100%" :stop-color="getConnectionTargetColor(conn)" />
        </linearGradient>
      </defs>
      <!-- Видимая линия связи (без pointer-events) -->
      <path
        v-for="conn in store.connections"
        :key="`${conn.id}-${props.scale}-${props.panX}-${props.panY}`"
        :d="getPath(conn)"
        :stroke="`url(#gradient-${conn.id})`"
        stroke-width="4"
        fill="none"
        stroke-linecap="round"
        style="pointer-events: none;"
      />
      <!-- Видимая тонкая линия поверх -->
      <path
        v-for="conn in store.connections"
        :key="`visible-${conn.id}-${props.scale}-${props.panX}-${props.panY}`"
        :d="getPath(conn)"
        :stroke="`url(#gradient-${conn.id})`"
        stroke-width="1.5" 
        fill="none"
        stroke-linecap="round"
        class="drop-shadow-md"
        style="pointer-events: none;"
      />
      
      <!-- Невидимая толстая линия для ховера (проще попасть) -->
      <path
        v-for="conn in store.connections"
        :key="`hit-${conn.id}`"
        :d="getPath(conn)"
        stroke="transparent"
        stroke-width="20"
        fill="none"
        class="cursor-pointer"
        style="pointer-events: stroke;"
        @mouseenter="hoveredConnection = conn"
        @mouseleave="clearHovered"
        @click="(e) => onConnectionClick(e, conn)"
      />
    </svg>

    <!-- Кнопка удаления связи (по центру) -->
    <div
      v-if="hoveredConnection"
      v-motion
      :initial="{ scale: 0, opacity: 0 }"
      :enter="{ scale: 1, opacity: 1 }"
      :leave="{ scale: 0, opacity: 0 }"
      :duration="150"
      class="absolute z-50"
      :style="{
        left: getConnectionMidpoint(hoveredConnection).x + 'px',
        top: getConnectionMidpoint(hoveredConnection).y + 'px',
        transform: 'translate(-50%, -50%)'
      }"
      @mouseenter="keepHovered"
      @mouseleave="clearHovered"
    >
      <button
        class="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center shadow-lg hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 text-zinc-400 transition-all duration-150 cursor-pointer"
        @click="deleteConnection(hoveredConnection.id)"
        title="Удалить связь"
      >
        <i class="pi pi-trash text-xs"></i>
      </button>
    </div>

    <!-- SVG слой для подсказок соединений (drag line + звёздочки) -->
    <svg 
      v-if="isDraggingConnection"
      class="absolute inset-0 overflow-visible pointer-events-none z-40"
      style="width: 100%; height: 100%;"
    >
      <!-- Пунктирная линия от output к цели -->
      <path
        :d="dragLinePath"
        :stroke="dragLineColor"
        stroke-width="2"
        stroke-dasharray="8,4"
        fill="none"
        opacity="0.6"
      />
      
      <!-- Звёздочки летящие по траектории -->
      <g v-if="dragLinePath && isCompatibleTarget !== false">
        <text
          v-for="(star, i) in flyingStars"
          :key="i"
          :x="star.x"
          :y="star.y"
          :font-size="STAR_CONFIG.size"
          fill="white"
          opacity="0.9"
          style="text-shadow: 0 0 8px currentColor;"
        >
          ✦
        </text>
      </g>
    </svg>

    <!-- Курсор запрещено (когда нельзя подключиться) -->
    <div
      v-if="isDraggingConnection && isCompatibleTarget === false"
      class="absolute pointer-events-none z-50"
      :style="{
        left: (mousePos.x - 10) + 'px',
        top: (mousePos.y - 10) + 'px'
      }"
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" stroke="#ef4444" stroke-width="2" fill="none"/>
        <line x1="5" y1="5" x2="15" y2="15" stroke="#ef4444" stroke-width="2"/>
      </svg>
    </div>

    <!-- Ноды -->
    <div
      v-for="node in store.getSortedNodes"
      :key="node.id"
      class="absolute cursor-move"
      :style="{ 
        transform: `translate(${node.x}px, ${node.y}px)`,
        zIndex: node.zIndex || 1
      }"
      @pointerdown="onNodePointerDown($event, node)"
    >
      <NodesTemplate
        :node-id="node.id"
        :node-type="node.type"
        :title="node.config?.name || node.name"
        :node-color="node.config?.color || '#6ee7b7'"
        :tags="node.config?.tags || node.data?.tags || []"
        :is-composer="node.config?.isComposer ?? false"
        :is-result="node.config?.isResult ?? false"
        :is-character="node.config?.isCharacter ?? false"
        :is-generation="node.config?.isGeneration ?? false"
        :is-user-node="node.config?.isUserNode ?? false"
        :user-node-name="node.data?.userNodeName || node.config?.name"
        :user-node-color="node.data?.userNodeColor || node.config?.color"
        :user-node-max-tags="node.data?.userNodeMaxTags || node.config?.maxTags || 5"
        :max-tags="node.config?.maxTags || node.data?.userNodeMaxTags || 5"
        :has-description="node.config?.hasDescription ?? true"
        :has-output="node.config?.hasOutput ?? true"
        :has-input="node.config?.hasInput ?? false"
        :accepts-from="node.config?.acceptsFrom"
        :accept-any-input="node.config?.acceptAnyInput ?? false"
        :output-type="node.config?.outputType"
        :has-output-connection="hasOutputConnection(node.id, 0)"
        :has-input-connection="hasInputConnection(node.id, 0)"
        :is-selected="store.isSelected(node.id)"
        :is-source="isSourceNode(node.id)"
        :z-index="node.zIndex"
        :connected-nodes="(node.config?.isComposer || node.type === 'character') ? getConnectedNodes(node.id) : []"
        :composer-data="node.config?.isResult ? getComposerDataForResult(node.id) : (node.config?.isGeneration ? getComposerDataForGeneration(node.id) : null)"
        :input-prompt="node.config?.isGeneration ? getPromptForGeneration(node.id) : ''"
        :node-data="node.data"
        :config="node.config"
        v-model="node.data"
        @port-click="handlePortClick"
        @port-mouse-down="handlePortMouseDown"
        @delete-output-connections="handleDeleteOutputConnections"
        @delete-input-connections="handleDeleteInputConnections"
        @focus-change="onNodeFocusChange"
        @edit-user-node="onEditUserNode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBoardStore } from '../store/boardStore'
import { useSessionStore } from '../store/sessionStore'
import { canConnect } from '../data/nodeConfig'
import NodesTemplate from './NodesTemplate.vue'

// ═══════════════════════════════════════════════════════════════
// 🎨 НАСТРОЙКИ АНИМАЦИИ ЗВЁЗДОЧЕК (Connection Preview)
// Изменяйте эти параметры для настройки визуального эффекта
// ═══════════════════════════════════════════════════════════════
const STAR_CONFIG = {
  // Количество звёздочек (3-8 рекомендуется)
  count: 5,
  
  // Размер шрифта звёздочки в px
  size: 12,
  
  // Скорость движения по пути (0.001 - 0.05)
  // Меньше = медленнее
  pathSpeed: 0.005,
  
  // Скорость вращения по спирали (оборотов в секунду)
  spiralSpeed: 3,
  
  // Радиус спирали в px
  spiralRadius: 8,
  
  // Амплитуда пульсации радиуса (0 = нет пульсации)
  radiusPulse: 3,
  
  // Сжатие спирали вдоль пути (0.0 - 1.0)
  // 1.0 = круг, 0.5 = эллипс
  spiralFlatten: 0.6,
  
  // Амплитуда завитков вдоль пути
  pathTwist: 5,
  
  // Фазовое смещение между звёздочками (0.0 - 1.0)
  phaseOffset: 0.2
}

const props = defineProps({
  scale: { type: Number, default: 1 },
  panX: { type: Number, default: 0 },
  panY: { type: Number, default: 0 },
  sessionId: { type: String, default: 'default' }
})

const emit = defineEmits(['centerCanvas', 'editUserNode'])

const store = useBoardStore()
const sessionStore = useSessionStore()

// Флаг фокуса на инпуте любой ноды
const isInputFocused = ref(false)

// === DRAG СОЕДИНЕНИЯ (подсказки) ===
const isDraggingConnection = ref(false)
const dragSourceNode = ref(null)
const dragSourcePos = ref({ x: 0, y: 0 })
const mousePos = ref({ x: 0, y: 0 })
const hoveredTargetNode = ref(null)
const hoveredTargetPort = ref(null)
const isCompatibleTarget = ref(null) // null = неизвестно, true/false

// Инициализация звёздочек на основе конфига
const initFlyingStars = () => {
  return Array.from({ length: STAR_CONFIG.count }, (_, i) => ({
    x: 0, 
    y: 0, 
    progress: i * STAR_CONFIG.phaseOffset
  }))
}
const flyingStars = ref(initFlyingStars())
let starsAnimationId = null

// Цвет линии в зависимости от совместимости
const dragLineColor = computed(() => {
  if (isCompatibleTarget.value === false) return '#ef4444' // красный
  if (isCompatibleTarget.value === true) return '#22c55e'  // зелёный
  return dragSourceNode.value?.config?.color || '#22c55e'
})

// Путь пунктирной линии
const dragLinePath = computed(() => {
  if (!dragSourceNode.value) return ''
  
  const fromX = dragSourcePos.value.x
  const fromY = dragSourcePos.value.y
  const toX = mousePos.value.x
  const toY = mousePos.value.y
  
  const dx = toX - fromX
  const tension = Math.max(Math.abs(dx) * 0.5, 100)
  
  return `M ${fromX},${fromY} C ${fromX + tension},${fromY} ${toX - tension},${toY} ${toX},${toY}`
})

// Обновление позиций звёздочек (спиральное движение)
const updateFlyingStars = () => {
  if (!isDraggingConnection.value || !dragLinePath.value) {
    flyingStars.value.forEach(star => { star.x = 0; star.y = 0 })
    return
  }
  
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  pathElement.setAttribute('d', dragLinePath.value)
  const totalLength = pathElement.getTotalLength()
  
  // Глобальное время для синхронизации спирали
  const time = Date.now() / 1000
  
  flyingStars.value.forEach((star, i) => {
    // Обновляем прогресс по пути
    star.progress += STAR_CONFIG.pathSpeed
    if (star.progress > 1) star.progress = 0
    
    // Добавляем смещение для каждой звёздочки
    const offsetProgress = (star.progress + i * STAR_CONFIG.phaseOffset) % 1
    const currentLength = offsetProgress * totalLength
    
    // Точка на кривой
    const point = pathElement.getPointAtLength(currentLength)
    
    // Точка немного впереди для вычисления направления
    const delta = 2
    const nextPoint = pathElement.getPointAtLength(Math.min(currentLength + delta, totalLength))
    const prevPoint = pathElement.getPointAtLength(Math.max(currentLength - delta, 0))
    
    // Вектор направления кривой
    const dx = nextPoint.x - prevPoint.x
    const dy = nextPoint.y - prevPoint.y
    
    // Нормализованный вектор направления
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const tx = dx / len
    const ty = dy / len
    
    // Нормаль (перпендикуляр) - поворот на 90°
    const nx = -ty
    const ny = tx
    
    // Спиральное движение с настраиваемыми параметрами
    const spiralTime = time * STAR_CONFIG.spiralSpeed + i * 2.1
    const spiralRadius = STAR_CONFIG.spiralRadius + Math.sin(time + i) * STAR_CONFIG.radiusPulse
    const spiralOffset = Math.sin(spiralTime) * spiralRadius
    const normalOffset = Math.cos(spiralTime) * spiralRadius * STAR_CONFIG.spiralFlatten
    
    // Дополнительное вращение вдоль пути (завиток)
    const pathTwist = Math.sin(offsetProgress * Math.PI * 2 + time * 2) * STAR_CONFIG.pathTwist
    
    star.x = point.x + nx * (spiralOffset + pathTwist) + tx * normalOffset
    star.y = point.y + ny * (spiralOffset + pathTwist) + ty * normalOffset
  })
  
  if (isDraggingConnection.value) {
    starsAnimationId = requestAnimationFrame(updateFlyingStars)
  }
}

// Старт анимации звёздочек
const startStarsAnimation = () => {
  if (starsAnimationId) cancelAnimationFrame(starsAnimationId)
  updateFlyingStars()
}

// Стоп анимации звёздочек
const stopStarsAnimation = () => {
  if (starsAnimationId) {
    cancelAnimationFrame(starsAnimationId)
    starsAnimationId = null
  }
}

const onNodeFocusChange = (focused) => {
  isInputFocused.value = focused
}

// === USER NODE EDIT ===
const onEditUserNode = (nodeId) => {
  const node = store.getNodeById(nodeId)
  if (!node || !node.config?.isUserNode) return
  
  // Получаем templateId из конфига ноды
  const templateId = node.config?.templateId
  if (!templateId) return
  
  // Ищем существующий шаблон
  const existingTemplate = sessionStore.getUserNodeTemplates(store.currentSessionId).find(t => t.id === templateId)
  if (!existingTemplate) return
  
  // Отправляем существующий шаблон для редактирования
  emit('editUserNode', { ...existingTemplate })
}

// === УПРАВЛЕНИЕ СВЯЗЯМИ ===
const hoveredConnection = ref(null)
let hoverTimeout = null

// Получить середину связи (для позиционирования кнопки удаления)
const getConnectionMidpoint = (conn) => {
  const fromNode = store.getNodeById(conn.fromNodeId)
  const toNode = store.getNodeById(conn.toNodeId)
  
  if (!fromNode || !toNode) return { x: 0, y: 0 }
  
  const isFromComposer = fromNode.config?.isComposer
  const isFromResult = fromNode.config?.isResult
  const fromWidth = isFromComposer ? 340 : (isFromResult ? 380 : 320)
  
  const x1 = fromNode.x + fromWidth
  const y1 = fromNode.y
  const x2 = toNode.x
  const y2 = toNode.y
  
  // Для кубической Безье берём точку при t=0.5
  const dx = x2 - x1
  const tension = Math.max(Math.abs(dx) * 0.5, 100)
  
  // Координаты контрольных точек
  const cp1x = x1 + tension
  const cp1y = y1
  const cp2x = x2 - tension
  const cp2y = y2
  
  // Точка на кривой Безье при t=0.5
  const t = 0.5
  const mt = 1 - t
  
  const x = mt * mt * mt * x1 + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * x2
  const y = mt * mt * mt * y1 + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * y2
  
  return { x, y }
}

// Удержание ховера для кнопки
const keepHovered = () => {
  if (hoverTimeout) clearTimeout(hoverTimeout)
}

// Очистка ховера с задержкой
const clearHovered = () => {
  hoverTimeout = setTimeout(() => {
    hoveredConnection.value = null
  }, 100)
}

// Удаление связи
const deleteConnection = (connectionId) => {
  store.deleteConnectionById(connectionId)
  hoveredConnection.value = null
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
    
    // Специальная обработка для персонажа
    if (fromNode.type === 'character') {
      const charData = fromNode.data
      const basePrompt = charData?.prompt || ''
      const enabledParts = charData?.enabledParts || {}
      const description = charData?.description || ''
      
      // Собираем промпты от частей лица (только включённые)
      const faceParts = getConnectedNodes(fromNode.id)
      const partsPrompts = faceParts
        .filter(part => enabledParts[part.nodeId] !== false)
        .map(part => part.prompt)
        .filter(Boolean)
      
      const fullPrompt = [basePrompt, ...partsPrompts, description].filter(Boolean).join(', ')
      
      return {
        nodeId: fromNode.id,
        name: fromNode.config?.name || fromNode.name,
        color: fromNode.config?.color || '#6ee7b7',
        type: fromNode.type,
        prompt: fullPrompt,
        tags: basePrompt,
        description: description,
        faceParts: partsPrompts,
        characterData: {
          gender: charData?.gender,
          age: charData?.age,
          height: charData?.height,
          weight: charData?.weight
        }
      }
    }
    
    const tagsPrompt = fromNode.data?.tags?.map(t => t.prompt).join(', ') || ''
    const description = fromNode.data?.description || ''
    return {
      nodeId: fromNode.id,
      name: fromNode.config?.name || fromNode.name,
      color: fromNode.config?.color || '#6ee7b7',
      type: fromNode.type,
      jsonType: fromNode.config?.jsonType, // Тип для JSON (для userNode)
      prompt: [tagsPrompt, description].filter(Boolean).join(', '),
      tags: tagsPrompt,
      description: description
    }
  }).filter(Boolean)
}

const getComposerDataForResult = (resultNodeId) => {
  // Находим подключенный композитор
  const connection = store.connections.find(c => c.toNodeId === resultNodeId)
  if (!connection) return null
  
  const composerNode = store.getNodeById(connection.fromNodeId)
  if (!composerNode) return null
  
  // Собираем данные из композитора
  const enabledSources = composerNode.data?.enabledSources || {}
  const resolution = composerNode.data?.resolution || { width: 1920, height: 1080 }
  const masterPrompt = composerNode.data?.masterPrompt || ''
  const composerDescription = composerNode.data?.description || ''
  
  // Получаем подключенные ноды композитора
  const sourceNodes = getConnectedNodes(composerNode.id)
  const enabledNodes = sourceNodes.filter(source => enabledSources[source.nodeId] !== false)
  
  // Строим структуру: массив объектов с динамическими ключами (поддержка дубликатов)
  // Подсчитываем количество каждого типа для создания уникальных ключей
  const typeCounts = {}
  const sources = enabledNodes.map((node) => {
    // Определяем ключ для JSON: для userNode используем jsonType, для остальных - type
    const typeKey = node.jsonType || node.type
    
    // Увеличиваем счетчик для этого типа
    typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1
    // Создаем ключ: тип или тип_номер (если дубликат)
    const key = typeCounts[typeKey] === 1 ? typeKey : `${typeKey}_${typeCounts[typeKey] - 1}`
    
    // Возвращаем объект с динамическим ключом
    return {
      [key]: {
        value: node.tags,
        description: node.description,
        ...(node.characterData && { characterData: node.characterData })
      }
    }
  })
  
  // Корневая структура — композитор
  const resultStructure = {
    composer: {
      description: composerDescription,
      masterPrompt: masterPrompt,
      sources: sources
    },
    resolution
  }
  
  // Формируем строковый промпт для текстового режима
  const textPrompt = enabledNodes
    .map(source => source.prompt)
    .filter(Boolean)
    .concat(masterPrompt)
    .join(', ')
  
  return {
    prompt: textPrompt,
    structuredPrompts: resultStructure,
    resolution
  }
}

// Получить промпт для generation ноды из подключенной ноды
const getPromptForGeneration = (generationNodeId) => {
  const connection = store.connections.find(c => c.toNodeId === generationNodeId)
  if (!connection) return ''
  
  const fromNode = store.getNodeById(connection.fromNodeId)
  if (!fromNode) return ''
  
  // Если подключен композитор, берем его полный промпт
  if (fromNode.config?.isComposer) {
    const composerData = getComposerDataForResult(fromNode.id)
    return composerData?.prompt || ''
  }
  
  // Для character ноды
  if (fromNode.type === 'character') {
    const charData = fromNode.data
    const basePrompt = charData?.prompt || ''
    const enabledParts = charData?.enabledParts || {}
    const description = charData?.description || ''
    
    // Собираем части лица
    const faceParts = getConnectedNodes(fromNode.id)
    const partsPrompts = faceParts
      .filter(part => enabledParts[part.nodeId] !== false)
      .map(part => part.prompt)
      .filter(Boolean)
    
    return [basePrompt, ...partsPrompts, description].filter(Boolean).join(', ')
  }
  
  // Для обычных нод с тегами
  const tagsPrompt = fromNode.data?.tags?.map(t => t.prompt).join(', ') || ''
  const description = fromNode.data?.description || ''
  return [tagsPrompt, description].filter(Boolean).join(', ')
}

// Получить composerData для Generation ноды (через подключенный композитор)
const getComposerDataForGeneration = (generationNodeId) => {
  const connection = store.connections.find(c => c.toNodeId === generationNodeId)
  if (!connection) return null
  
  const composerNode = store.getNodeById(connection.fromNodeId)
  if (!composerNode || !composerNode.config?.isComposer) return null
  
  // Собираем данные напрямую из композитора (как в getComposerDataForResult, но без поиска соединения)
  const enabledSources = composerNode.data?.enabledSources || {}
  const resolution = composerNode.data?.resolution || { width: 1920, height: 1080 }
  const masterPrompt = composerNode.data?.masterPrompt || ''
  const composerDescription = composerNode.data?.description || ''
  
  // Получаем подключенные ноды композитора
  const sourceNodes = getConnectedNodes(composerNode.id)
  const enabledNodes = sourceNodes.filter(source => enabledSources[source.nodeId] !== false)
  
  // Строим структуру с динамическими ключами (поддержка дубликатов)
  const typeCounts = {}
  const sources = enabledNodes.map((node) => {
    // Определяем ключ для JSON: для userNode используем jsonType, для остальных - type
    const typeKey = node.jsonType || node.type
    
    typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1
    const key = typeCounts[typeKey] === 1 ? typeKey : `${typeKey}_${typeCounts[typeKey] - 1}`
    return {
      [key]: {
        value: node.tags,
        description: node.description,
        ...(node.characterData && { characterData: node.characterData })
      }
    }
  })
  
  // Формируем текстовый промпт
  const textPrompt = enabledNodes
    .map(source => source.prompt)
    .filter(Boolean)
    .concat(masterPrompt)
    .join(', ')
  
  // Структурированный результат
  const resultStructure = {
    composer: {
      description: composerDescription,
      masterPrompt: masterPrompt,
      sources: sources
    },
    resolution
  }
  
  return {
    prompt: textPrompt,
    structuredPrompts: resultStructure,
    resolution
  }
}

const getConnectionColor = (conn) => {
  const fromNode = store.getNodeById(conn.fromNodeId)
  return fromNode?.config?.color || '#6ee7b7'
}

const getConnectionTargetColor = (conn) => {
  const toNode = store.getNodeById(conn.toNodeId)
  return toNode?.config?.color || '#93c5fd'
}

const getGradientCoords = (conn) => {
  const fromNode = store.getNodeById(conn.fromNodeId)
  const toNode = store.getNodeById(conn.toNodeId)
  
  if (!fromNode || !toNode) return { x1: 0, y1: 0, x2: 0, y2: 0 }
  
  const isFromComposer = fromNode.config?.isComposer
  const isFromResult = fromNode.config?.isResult
  const fromWidth = isFromComposer ? 340 : (isFromResult ? 380 : 320)
  
  const x1 = fromNode.x + fromWidth
  const y1 = fromNode.y
  const x2 = toNode.x
  const y2 = toNode.y
  
  return { x1, y1, x2, y2 }
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
  
  // Если активен drag соединения и кликнули на пустое место - отменяем
  if (isDraggingConnection.value && !e.target.closest('[data-port]')) {
    stopDragConnection()
    clickSource.value = null
    store.clearActiveSource()
    return
  }
  
  // Сбрасываем подсказки при клике на пустое место
  if (!e.target.closest('[data-id]')) {
    store.clearActiveSource()
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
    
    const node = store.getNodeById(nodeId)
    if (node) {
      // Активируем подсказки
      store.setActiveSource(nodeId, node.type, node.config?.color || '#6ee7b7')
      
      // Запускаем drag режим с визуальными подсказками
      startDragConnection(node, e)
    }
    
    clickSource.value = { nodeId, idx, portType }
    if (!store.isSelected(nodeId)) store.selectNode(nodeId, false)
  } else {
    const source = clickSource.value
    
    if (type !== 'input' || nodeId === source.nodeId) {
      stopDragConnection()
      clickSource.value = null
      store.clearActiveSource()
      return
    }
    
    // Проверяем совместимость типов
    const fromNode = store.getNodeById(source.nodeId)
    const toNode = store.getNodeById(nodeId)
    
    if (!fromNode || !toNode) {
      stopDragConnection()
      clickSource.value = null
      store.clearActiveSource()
      return
    }
    
    const fromType = fromNode.config?.outputType || fromNode.type
    const toType = toNode.type
    
    if (!canConnect(fromType, toType, toNode.config)) {
      console.log('Cannot connect', fromType, 'to', toType)
      stopDragConnection()
      clickSource.value = null
      store.clearActiveSource()
      return
    }
    
    store.createConnection(source.nodeId, source.idx, nodeId, idx)
    stopDragConnection()
    clickSource.value = null
    store.clearActiveSource()
  }
}

// Старт drag соединения с подсказками
const startDragConnection = (node, e) => {
  isDraggingConnection.value = true
  dragSourceNode.value = node
  
  // Определяем позицию output порта
  const isComposer = node.config?.isComposer
  const isResult = node.config?.isResult
  const fromWidth = isComposer ? 340 : (isResult ? 380 : 320)
  
  dragSourcePos.value = {
    x: node.x + fromWidth,
    y: node.y
  }
  
  // Обновляем позицию мыши
  updateMousePos(e)
  
  // Добавляем глобальные обработчики
  document.addEventListener('mousemove', onDragConnectionMove)
  document.addEventListener('mouseup', onDragConnectionEnd)
  document.addEventListener('keydown', onDragConnectionKeyDown)
  
  // Запускаем анимацию звёздочек
  startStarsAnimation()
}

// Обновление позиции мыши
const updateMousePos = (e) => {
  const canvasContainer = document.querySelector('.board-container')
  if (!canvasContainer) return
  
  const rect = canvasContainer.getBoundingClientRect()
  mousePos.value = {
    x: (e.clientX - rect.left - props.panX) / props.scale,
    y: (e.clientY - rect.top - props.panY) / props.scale
  }
}

// Движение мыши при drag
const onDragConnectionMove = (e) => {
  updateMousePos(e)
  
  // Проверяем, над каким портом находимся
  checkHoveredPort()
}

// Проверка порта под курсором
const checkHoveredPort = () => {
  // Получаем позицию мыши на экране
  const canvasContainer = document.querySelector('.board-container')
  if (!canvasContainer) return
  
  const rect = canvasContainer.getBoundingClientRect()
  const mouseX = mousePos.value.x * props.scale + props.panX + rect.left
  const mouseY = mousePos.value.y * props.scale + props.panY + rect.top
  
  // Ищем элемент под курсором
  const elements = document.elementsFromPoint(mouseX, mouseY)
  
  // Ищем input порт
  for (const el of elements) {
    if (el.dataset?.port === 'input') {
      const nodeId = parseInt(el.closest('[data-id]')?.dataset?.id)
      if (nodeId && nodeId !== dragSourceNode.value?.id) {
        const node = store.getNodeById(nodeId)
        if (node) {
          hoveredTargetNode.value = node
          hoveredTargetPort.value = el
          
          // Проверяем совместимость
          const fromType = dragSourceNode.value?.config?.outputType || dragSourceNode.value?.type
          isCompatibleTarget.value = canConnect(fromType, node.type, node.config)
          return
        }
      }
    }
  }
  
  // Не нашли порт
  hoveredTargetNode.value = null
  hoveredTargetPort.value = null
  isCompatibleTarget.value = null
}

// Конец drag (отпускание мыши)
const onDragConnectionEnd = () => {
  // Убираем глобальные обработчики, но не останавливаем drag сразу
  // Он остановится при click на input порт или при отмене
  document.removeEventListener('mousemove', onDragConnectionMove)
  document.removeEventListener('mouseup', onDragConnectionEnd)
}

// Отмена по Escape
const onDragConnectionKeyDown = (e) => {
  if (e.key === 'Escape') {
    stopDragConnection()
    clickSource.value = null
    store.clearActiveSource()
  }
}

// Полная остановка drag
const stopDragConnection = () => {
  isDraggingConnection.value = false
  dragSourceNode.value = null
  hoveredTargetNode.value = null
  hoveredTargetPort.value = null
  isCompatibleTarget.value = null
  stopStarsAnimation()
  document.removeEventListener('mousemove', onDragConnectionMove)
  document.removeEventListener('mouseup', onDragConnectionEnd)
  document.removeEventListener('keydown', onDragConnectionKeyDown)
}

const handlePortMouseDown = () => {
  // Обработка в handlePortClick
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
  
  // Определяем тип ноды для правильных размеров
  const isFromComposer = fromNode.config?.isComposer
  const isFromResult = fromNode.config?.isResult
  const isToComposer = toNode.config?.isComposer
  const isToResult = toNode.config?.isResult
  
  // Размеры нод
  const fromWidth = isFromComposer ? 340 : (isFromResult ? 380 : 320)
  
  // Output: правый верхний угол (x + width, y)
  const fromX = fromNode.x + fromWidth
  const fromY = fromNode.y
  
  // Input: левый верхний угол (x, y)
  const toX = toNode.x
  const toY = toNode.y
  
  const dx = toX - fromX
  const tension = Math.max(Math.abs(dx) * 0.5, 100)
  
  return `M ${fromX},${fromY} C ${fromX + tension},${fromY} ${toX - tension},${toY} ${toX},${toY}`
}

// === KEYBOARD ===
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (clickSource.value) {
      clickSource.value = null
      store.clearActiveSource()
    } else {
      store.clearSelection()
    }
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

<style scoped>
/* Подсветка портов при drag соединения - ТОЛЬКО при наведении */

/* Совместимый порт - зелёное свечение */
.is-dragging-connection.is-compatible :deep([data-port="input"]:hover) {
  filter: drop-shadow(0 0 4px #22c55e) drop-shadow(0 0 8px rgba(34, 197, 94, 0.5)) brightness(1.15) !important;
  transform: rotate(45deg) scale(1.25) !important;
}

/* Несовместимый порт - красное свечение */
.is-dragging-connection.is-incompatible :deep([data-port="input"]:hover) {
  filter: drop-shadow(0 0 4px #ef4444) drop-shadow(0 0 8px rgba(239, 68, 68, 0.5)) brightness(1.1) !important;
  transform: rotate(45deg) scale(1.1) !important;
  cursor: not-allowed !important;
}
</style>
