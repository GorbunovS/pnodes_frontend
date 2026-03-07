// === КОНФИГУРАЦИЯ НОД ===
import { 
  lightingPresets, 
  cameraPresets, 
  environmentPresets,
  stylePresets,
  moodPresets,
  characterPresets,
  generationPresets
} from './nodePresets.js'

// === ТИПЫ НОД (основные категории) ===
export const nodeTypes = {
  // Категория: Свет
  LIGHTING: 'lighting',
  
  // Категория: Окружение  
  ENVIRONMENT: 'environment',
  
  // Категория: Камеры
  CAMERA: 'camera',
  LENS: 'lens',
  
  // Категория: Стиль
  STYLE: 'style',
  
  // Категория: Настроение
  MOOD: 'mood',
  
  // Категория: Персонаж (заглушки)
  CHARACTER_TEMPLATE: 'character_template',
  FACE_CONSTRUCTOR: 'face_constructor',
  
  // Категория: Генерация (заглушки)
  PHOTO: 'photo',
  VIDEO: 'video',
  
  // Системные
  COMPOSER: 'composer',
  RESULT: 'result'
}

// === КАТЕГОРИИ ДЛЯ UI ===
export const nodeCategories = {
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
    types: [nodeTypes.CHARACTER_TEMPLATE, nodeTypes.FACE_CONSTRUCTOR],
    disabled: true // Пока не готово
  },
  GENERATION: {
    id: 'generation',
    name: 'Генерация',
    icon: 'pi pi-sparkles',
    color: '#6ee7b7', // мятный
    types: [nodeTypes.PHOTO, nodeTypes.VIDEO],
    disabled: true // Пока не готово
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
  [nodeTypes.CHARACTER_TEMPLATE]: [nodeTypes.COMPOSER],
  [nodeTypes.FACE_CONSTRUCTOR]: [nodeTypes.COMPOSER],
  [nodeTypes.PHOTO]: [nodeTypes.COMPOSER],
  [nodeTypes.VIDEO]: [nodeTypes.COMPOSER],
  [nodeTypes.COMPOSER]: [nodeTypes.RESULT]
}

// === ПРОВЕРКА СОЕДИНЕНИЯ ===
export const canConnect = (fromType, toType, toConfig = null) => {
  if (toConfig?.acceptAnyInput) return true
  if (toConfig?.acceptsFrom) return toConfig.acceptsFrom.includes(fromType)
  
  const allowed = connectionRules[fromType]
  return allowed ? allowed.includes(toType) : false
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
  
  // === ПЕРСОНАЖ (заглушки) ===
  [nodeTypes.CHARACTER_TEMPLATE]: {
    name: 'Шаблон персонажа',
    type: nodeTypes.CHARACTER_TEMPLATE,
    category: 'character',
    icon: 'pi pi-user',
    color: '#93c5fd',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.CHARACTER_TEMPLATE,
    maxTags: 0,
    disabled: true,
    tags: [],
    subTypes: {
      template: { name: 'Шаблоны', tags: characterPresets.template }
    }
  },
  
  [nodeTypes.FACE_CONSTRUCTOR]: {
    name: 'Конструктор лица',
    type: nodeTypes.FACE_CONSTRUCTOR,
    category: 'character',
    icon: 'pi pi-face-smile',
    color: '#93c5fd',
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.FACE_CONSTRUCTOR,
    maxTags: 0,
    disabled: true,
    tags: [],
    subTypes: {
      face_constructor: { name: 'Лицо', tags: characterPresets.face_constructor }
    }
  },
  
  // === ГЕНЕРАЦИЯ (заглушки) ===
  [nodeTypes.PHOTO]: {
    name: 'Фото',
    type: nodeTypes.PHOTO,
    category: 'generation',
    icon: 'pi pi-image',
    color: '#6ee7b7',
    hasDescription: false,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.PHOTO,
    maxTags: 0,
    disabled: true,
    tags: [],
    subTypes: {
      photo: { name: 'Фото', tags: generationPresets.photo }
    }
  },
  
  [nodeTypes.VIDEO]: {
    name: 'Видео',
    type: nodeTypes.VIDEO,
    category: 'generation',
    icon: 'pi pi-video',
    color: '#6ee7b7',
    hasDescription: false,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.VIDEO,
    maxTags: 0,
    disabled: true,
    tags: [],
    subTypes: {
      video: { name: 'Видео', tags: generationPresets.video }
    }
  },
  
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
      nodeTypes.CHARACTER_TEMPLATE,
      nodeTypes.FACE_CONSTRUCTOR,
      nodeTypes.PHOTO,
      nodeTypes.VIDEO
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
  }
}

// === ХЕЛПЕРЫ ===
export const getNodeConfig = (type) => nodeConfigs[type] || null

export const getAllNodeConfigs = () => Object.values(nodeConfigs)

export const getCategoryConfigs = () => Object.values(nodeCategories)

export const getNodesByCategory = (categoryId) => {
  return Object.values(nodeConfigs).filter(config => config.category === categoryId)
}
