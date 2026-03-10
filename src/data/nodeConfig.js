// === КОНФИГУРАЦИЯ НОД ===
import { 
  lightingPresets, 
  cameraPresets, 
  environmentPresets,
  stylePresets,
  moodPresets
} from './nodePresets.js'
import {
  skinPresets,
  nosePresets,
  eyesPresets,
  mouthPresets,
  hairPresets,
  characterMainPresets
} from './characterPresets.js'

// === РАНГИ НОД (иерархия подключений) ===
// Чем меньше число, тем "ниже" в иерархии
// Нода может принимать входы только от нод с рангом МЕНЬШЕ своего
export const RANKS = {
  PART: 1,      // Части персонажа (skin, nose, etc.)
  ASSEMBLY: 2,  // Сборные ноды (character)
  ELEMENT: 3,   // Элементы сцены (lighting, camera, etc.)
  COMPOSER: 4,  // Композитор
  OUTPUT: 5     // Результат
}

// Карта рангов для каждого типа
const rankMap = {
  // Ранг 1: Части
  skin: RANKS.PART,
  nose: RANKS.PART,
  eyes: RANKS.PART,
  mouth: RANKS.PART,
  hair: RANKS.PART,
  
  // Ранг 2: Сборка
  character: RANKS.ASSEMBLY,
  userNode: RANKS.ASSEMBLY,
  
  // Ранг 3: Элементы
  lighting: RANKS.ELEMENT,
  environment: RANKS.ELEMENT,
  camera: RANKS.ELEMENT,
  lens: RANKS.ELEMENT,
  style: RANKS.ELEMENT,
  mood: RANKS.ELEMENT,
  photo: RANKS.ELEMENT,
  video: RANKS.ELEMENT,
  
  // Ранг 4: Композитор
  composer: RANKS.COMPOSER,
  
  // Ранг 5: Результат и генерация
  result: RANKS.OUTPUT,
  generation: RANKS.OUTPUT
}

// Получить ранг типа
export const getNodeRank = (type) => {
  // Для виртуальных userNode используем ранг ASSEMBLY
  if (type && type.startsWith('userNode_')) {
    return RANKS.ASSEMBLY
  }
  return rankMap[type] || RANKS.ELEMENT
}

// === ТИПЫ НОД (основные категории) ===
export const nodeTypes = {
  LIGHTING: 'lighting',
  ENVIRONMENT: 'environment',
  CAMERA: 'camera',
  LENS: 'lens',
  STYLE: 'style',
  MOOD: 'mood',
  CHARACTER: 'character',
  SKIN: 'skin',
  NOSE: 'nose',
  EYES: 'eyes',
  MOUTH: 'mouth',
  HAIR: 'hair',
  COMPOSER: 'composer',
  RESULT: 'result',
  GENERATION: 'generation',
  USER_NODE: 'userNode'
}

// === КАТЕГОРИИ ДЛЯ UI ===
export const nodeCategories = {
  USER_NODES: {
    id: 'userNodes',
    name: 'Личные',
    icon: 'pi pi-user-edit',
    color: '#f472b6', // розовый (как на макете)
    types: [nodeTypes.USER_NODE],
    isUserCategory: true
  },
  LIGHTING: {
    id: 'lighting',
    name: 'Свет',
    icon: 'pi pi-sun',
    color: '#fbbf24', // янтарный
    types: [nodeTypes.LIGHTING]
  },
  ENVIRONMENT: {
    id: 'environment',
    name: 'Окружение',
    icon: 'pi pi-map',
    color: '#86efac', // светло-зелёный
    types: [nodeTypes.ENVIRONMENT]
  },
  CAMERAS: {
    id: 'cameras',
    name: 'Камеры',
    icon: 'pi pi-camera',
    color: '#f9a8d4', // розовый
    types: [nodeTypes.CAMERA, nodeTypes.LENS]
  },
  STYLE: {
    id: 'style',
    name: 'Стиль',
    icon: 'pi pi-palette',
    color: '#c4b5fd', // фиолетовый
    types: [nodeTypes.STYLE]
  },
  MOOD: {
    id: 'mood',
    name: 'Настроение',
    icon: 'pi pi-heart',
    color: '#fca5a5', // розово-красный
    types: [nodeTypes.MOOD]
  },
  CHARACTER: {
    id: 'character',
    name: 'Персонаж',
    icon: 'pi pi-user',
    color: '#93c5fd', // голубой
    types: [nodeTypes.CHARACTER, nodeTypes.SKIN, nodeTypes.NOSE, nodeTypes.EYES, nodeTypes.MOUTH, nodeTypes.HAIR]
  },
  GENERATION: {
    id: 'generation',
    name: 'Генерация',
    icon: 'pi pi-sparkles',
    color: '#6ee7b7', // мятный
    types: [nodeTypes.GENERATION]
  }
}

// === ПРАВИЛА СОЕДИНЕНИЙ ===
export const connectionRules = {
  [nodeTypes.LIGHTING]: [nodeTypes.COMPOSER],
  [nodeTypes.ENVIRONMENT]: [nodeTypes.COMPOSER],
  [nodeTypes.CAMERA]: [nodeTypes.COMPOSER],
  [nodeTypes.LENS]: [nodeTypes.COMPOSER],
  [nodeTypes.STYLE]: [nodeTypes.COMPOSER],
  [nodeTypes.MOOD]: [nodeTypes.COMPOSER],
  [nodeTypes.CHARACTER]: [nodeTypes.COMPOSER],
  [nodeTypes.USER_NODE]: [nodeTypes.COMPOSER],
  [nodeTypes.SKIN]: [nodeTypes.CHARACTER],
  [nodeTypes.NOSE]: [nodeTypes.CHARACTER],
  [nodeTypes.EYES]: [nodeTypes.CHARACTER],
  [nodeTypes.MOUTH]: [nodeTypes.CHARACTER],
  [nodeTypes.HAIR]: [nodeTypes.CHARACTER],
  [nodeTypes.COMPOSER]: [nodeTypes.RESULT, nodeTypes.GENERATION],
  [nodeTypes.GENERATION]: [] // Output node - no outgoing connections
}

// === ПРОВЕРКА СОЕДИНЕНИЯ ===
export const canConnect = (fromType, toType, toConfig = null) => {
  // Приоритет 1: явный список разрешённых
  if (toConfig?.acceptsFrom) {
    // Проверяем точное совпадение
    if (toConfig.acceptsFrom.includes(fromType)) return true
    // Для userNode_xxx проверяем базовый тип userNode
    if (fromType.startsWith('userNode_') && toConfig.acceptsFrom.includes('userNode')) return true
    // Если acceptsFrom задан, но тип не найден - соединение запрещено
    return false
  }
  
  // Приоритет 2: acceptAnyInput разрешает любой тип
  if (toConfig?.acceptAnyInput) return true
  
  // Приоритет 3: проверка по рангам (иерархия)
  // Нода может принимать только от нод с рангом МЕНЬШЕ своего
  const fromRank = getNodeRank(fromType)
  const toRank = getNodeRank(toType)
  
  if (fromRank && toRank && fromRank < toRank) return true
  
  // Fallback: старые правила (для совместимости)
  const allowed = connectionRules[fromType]
  if (allowed && allowed.includes(toType)) return true
  
  // Для виртуальных userNode проверяем базовый тип
  if (fromType.startsWith('userNode_')) {
    const baseAllowed = connectionRules['userNode']
    if (baseAllowed && baseAllowed.includes(toType)) return true
  }
  
  return false
}

// === КОНФИГИ НОД ===
export const nodeConfigs = {
  // === СВЕТ ===
  [nodeTypes.LIGHTING]: {
    name: 'Свет',
    type: nodeTypes.LIGHTING,
    category: 'lighting',
    icon: 'pi pi-sun',
    color: '#fbbf24',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.LIGHTING,
    maxTags: 5,
    subTypes: {
      artificial: { name: 'Искусственный', tags: lightingPresets.artificial },
      studio: { name: 'Студийный', tags: lightingPresets.studio },
      setup: { name: 'Схемы', tags: lightingPresets.setup },
      direction: { name: 'Направление', tags: lightingPresets.direction },
      quality: { name: 'Качество', tags: lightingPresets.quality },
      natural: { name: 'Естественный', tags: lightingPresets.natural }
    },
    // Объединённые теги для совместимости
    tags: [
      ...lightingPresets.artificial,
      ...lightingPresets.studio,
      ...lightingPresets.setup,
      ...lightingPresets.direction,
      ...lightingPresets.quality,
      ...lightingPresets.natural
    ]
  },
  
  // === ОКРУЖЕНИЕ ===
  [nodeTypes.ENVIRONMENT]: {
    name: 'Окружение',
    type: nodeTypes.ENVIRONMENT,
    category: 'environment',
    icon: 'pi pi-map',
    color: '#86efac',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.ENVIRONMENT,
    maxTags: 3,
    subTypes: {
      studio: { name: 'Студии', tags: environmentPresets.studio },
      interior: { name: 'Интерьеры', tags: environmentPresets.interior },
      exterior: { name: 'Экстерьеры', tags: environmentPresets.exterior },
      special: { name: 'Специальные', tags: environmentPresets.special }
    },
    tags: [
      ...environmentPresets.studio,
      ...environmentPresets.interior,
      ...environmentPresets.exterior,
      ...environmentPresets.special
    ]
  },
  
  // === КАМЕРА ===
  [nodeTypes.CAMERA]: {
    name: 'Камера',
    type: nodeTypes.CAMERA,
    category: 'cameras',
    icon: 'pi pi-camera',
    color: '#f9a8d4',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.CAMERA,
    maxTags: 3,
    subTypes: {
      camera: { name: 'Типы камер', tags: cameraPresets.camera }
    },
    tags: cameraPresets.camera
  },
  
  // === ЛИНЗА ===
  [nodeTypes.LENS]: {
    name: 'Линза',
    type: nodeTypes.LENS,
    category: 'cameras',
    icon: 'pi pi-circle',
    color: '#f472b6',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.LENS,
    maxTags: 2,
    subTypes: {
      lens: { name: 'Оптика', tags: cameraPresets.lens }
    },
    tags: cameraPresets.lens
  },
  
  // === СТИЛЬ ===
  [nodeTypes.STYLE]: {
    name: 'Стиль',
    type: nodeTypes.STYLE,
    category: 'style',
    icon: 'pi pi-palette',
    color: '#c4b5fd',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.STYLE,
    maxTags: 3,
    subTypes: {
      digital: { name: 'Digital', tags: stylePresets.digital },
      traditional: { name: 'Традиционный', tags: stylePresets.traditional },
      stylized: { name: 'Стилизованный', tags: stylePresets.stylized },
      cinematic: { name: 'Кинематографичный', tags: stylePresets.cinematic }
    },
    tags: [
      ...stylePresets.digital,
      ...stylePresets.traditional,
      ...stylePresets.stylized,
      ...stylePresets.cinematic
    ]
  },
  
  // === НАСТРОЕНИЕ ===
  [nodeTypes.MOOD]: {
    name: 'Настроение',
    type: nodeTypes.MOOD,
    category: 'mood',
    icon: 'pi pi-heart',
    color: '#fca5a5',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.MOOD,
    maxTags: 2,
    subTypes: {
      emotion: { name: 'Эмоции', tags: moodPresets.emotion }
    },
    tags: moodPresets.emotion
  },
  
  // === ПЕРСОНАЖ (главная нода) ===
  [nodeTypes.CHARACTER]: {
    name: 'Персонаж',
    type: nodeTypes.CHARACTER,
    category: 'character',
    icon: 'pi pi-user',
    color: '#93c5fd',
    hasDescription: true,
    hasInput: true,
    hasOutput: true,
    acceptAnyInput: true, // Для множественных входов
    acceptsFrom: [nodeTypes.SKIN, nodeTypes.NOSE, nodeTypes.EYES, nodeTypes.MOUTH, nodeTypes.HAIR],
    outputType: nodeTypes.CHARACTER,
    isCharacter: true, // Флаг для свитчей
    maxTags: 3,
    subTypes: {
      gender: { name: 'Пол', tags: characterMainPresets.gender },
      ageGroup: { name: 'Возраст', tags: characterMainPresets.ageGroup },
      build: { name: 'Телосложение', tags: characterMainPresets.build },
      ethnicity: { name: 'Этничность', tags: characterMainPresets.ethnicity }
    },
    tags: [
      ...characterMainPresets.gender,
      ...characterMainPresets.ageGroup,
      ...characterMainPresets.build,
      ...characterMainPresets.ethnicity
    ]
  },
  
  // === КОЖА ===
  [nodeTypes.SKIN]: {
    name: 'Кожа',
    type: nodeTypes.SKIN,
    category: 'character',
    icon: 'pi pi-circle-fill',
    color: '#fdba74',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.SKIN,
    maxTags: 2,
    subTypes: {
      skin: { name: 'Тип кожи', tags: skinPresets }
    },
    tags: skinPresets
  },
  
  // === НОС ===
  [nodeTypes.NOSE]: {
    name: 'Нос',
    type: nodeTypes.NOSE,
    category: 'character',
    icon: 'pi pi-minus',
    color: '#fca5a5',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.NOSE,
    maxTags: 2,
    subTypes: {
      nose: { name: 'Форма носа', tags: nosePresets }
    },
    tags: nosePresets
  },
  
  // === ГЛАЗА ===
  [nodeTypes.EYES]: {
    name: 'Глаза',
    type: nodeTypes.EYES,
    category: 'character',
    icon: 'pi pi-eye',
    color: '#86efac',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.EYES,
    maxTags: 3,
    subTypes: {
      eyes: { name: 'Глаза', tags: eyesPresets }
    },
    tags: eyesPresets
  },
  
  // === ГУБЫ / РОТ ===
  [nodeTypes.MOUTH]: {
    name: 'Рот / Губы',
    type: nodeTypes.MOUTH,
    category: 'character',
    icon: 'pi pi-heart',
    color: '#f472b6',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.MOUTH,
    maxTags: 2,
    subTypes: {
      mouth: { name: 'Губы', tags: mouthPresets }
    },
    tags: mouthPresets
  },
  
  // === ВОЛОСЫ ===
  [nodeTypes.HAIR]: {
    name: 'Волосы',
    type: nodeTypes.HAIR,
    category: 'character',
    icon: 'pi pi-palette',
    color: '#d4d4d8',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.HAIR,
    maxTags: 3,
    subTypes: {
      hair: { name: 'Волосы', tags: hairPresets }
    },
    tags: hairPresets
  },
  
  // === ГЕНЕРАЦИЯ (заглушки) ===
  // === СИСТЕМНЫЕ ===
  [nodeTypes.COMPOSER]: {
    name: 'Композитор',
    type: nodeTypes.COMPOSER,
    icon: 'pi pi-objects-column',
    color: '#93c5fd',
    hasDescription: false,
    hasInput: true,
    inputType: 'any',
    acceptAnyInput: true,
    acceptsFrom: [
      nodeTypes.LIGHTING, 
      nodeTypes.ENVIRONMENT, 
      nodeTypes.CAMERA, 
      nodeTypes.LENS,
      nodeTypes.STYLE, 
      nodeTypes.MOOD,
      nodeTypes.CHARACTER,
      nodeTypes.PHOTO,
      nodeTypes.VIDEO,
      nodeTypes.USER_NODE
    ],
    hasOutput: true,
    outputType: nodeTypes.COMPOSER,
    maxTags: 0,
    isComposer: true
  },
  
  [nodeTypes.RESULT]: {
    name: 'Результат',
    type: nodeTypes.RESULT,
    icon: 'pi pi-image',
    color: '#fca5a5',
    hasDescription: false,
    hasInput: true,
    acceptsFrom: [nodeTypes.COMPOSER],
    hasOutput: false,
    maxTags: 0,
    isResult: true
  },
  
  [nodeTypes.GENERATION]: {
    name: 'Генерация',
    type: nodeTypes.GENERATION,
    category: 'generation',
    icon: 'pi pi-sparkles',
    color: '#10b981', // emerald-500
    hasInput: true,
    acceptsFrom: [nodeTypes.COMPOSER],
    hasOutput: false,
    hasDescription: true,
    isGeneration: true, // Флаг для UI
    maxTags: 0
  },
  
  // === ПОЛЬЗОВАТЕЛЬСКАЯ НОДА ===
  [nodeTypes.USER_NODE]: {
    name: 'Пользовательская',
    type: nodeTypes.USER_NODE,
    category: 'userNodes',
    icon: 'pi pi-user-edit',
    color: '#f472b6', // розовый
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.USER_NODE,
    maxTags: 5,
    isUserNode: true, // Флаг для UI
    // Пользовательские ноды создаются динамически, 
    // поэтому здесь только базовая конфигурация
    tags: []
  }
}

// === ХЕЛПЕРЫ ===
export const getNodeConfig = (type) => nodeConfigs[type] || null

export const getAllNodeConfigs = () => Object.values(nodeConfigs)

export const getCategoryConfigs = () => Object.values(nodeCategories)

export const getNodesByCategory = (categoryId) => {
  return Object.values(nodeConfigs).filter(config => config.category === categoryId)
}
