// === КОНФИГУРАЦИЯ НОД ===

export const nodeTypes = {
  LIGHTING: 'lighting',
  CAMERA: 'camera', 
  STYLE: 'style',
  ENVIRONMENT: 'environment',
  MOOD: 'mood',
  COMPOSER: 'composer',
  RESULT: 'result'
}

// Какие типы можно соединять друг с другом
export const connectionRules = {
  // Ноды с типами выше могут подключаться к COMPOSER
  [nodeTypes.LIGHTING]: [nodeTypes.COMPOSER],
  [nodeTypes.CAMERA]: [nodeTypes.COMPOSER],
  [nodeTypes.STYLE]: [nodeTypes.COMPOSER],
  [nodeTypes.ENVIRONMENT]: [nodeTypes.COMPOSER],
  [nodeTypes.MOOD]: [nodeTypes.COMPOSER],
  // COMPOSER может подключаться к RESULT
  [nodeTypes.COMPOSER]: [nodeTypes.RESULT]
}

// Проверить можно ли соединить два типа
export const canConnect = (fromType, toType, toConfig = null) => {
  // Композитор принимает любой тип (кроме другого композитора и результата)
  if (toConfig?.acceptAnyInput) {
    return ![nodeTypes.COMPOSER, nodeTypes.RESULT].includes(fromType)
  }
  
  const allowed = connectionRules[fromType]
  return allowed ? allowed.includes(toType) : false
}

// === КОНФИГ НОД ===
export const nodeConfigs = {
  [nodeTypes.LIGHTING]: {
    name: 'Освещение',
    type: nodeTypes.LIGHTING,
    icon: 'pi pi-sun',
    color: '#6ee7b7', // мятный
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.LIGHTING,
    maxTags: 5,
    tags: [
      { id: 'sun_12', name: 'солнце на 12', prompt: 'sun at 12 o\'clock, overhead lighting' },
      { id: 'sun_3', name: 'солнце на 3', prompt: 'sun at 3 o\'clock, side lighting from right' },
      { id: 'sun_9', name: 'солнце на 9', prompt: 'sun at 9 o\'clock, side lighting from left' },
      { id: 'sun_6', name: 'солнце на 6', prompt: 'sun at 6 o\'clock, backlighting' },
      { id: 'softbox', name: 'софтбокс', prompt: 'softbox lighting, soft diffused light' },
      { id: 'natural', name: 'естественный', prompt: 'natural lighting, ambient light' },
      { id: 'dramatic', name: 'драматичный', prompt: 'dramatic lighting, high contrast' },
      { id: 'studio', name: 'студийный', prompt: 'studio lighting, professional setup' },
      { id: 'golden_hour', name: 'золотой час', prompt: 'golden hour lighting, warm sunset glow' },
      { id: 'blue_hour', name: 'синий час', prompt: 'blue hour lighting, cool twilight' },
      { id: 'rim_light', name: 'контровой', prompt: 'rim lighting, edge light silhouette' },
      { id: 'butterfly', name: 'бабочка', prompt: 'butterfly lighting, glamour setup' }
    ]
  },
  
  [nodeTypes.CAMERA]: {
    name: 'Камера',
    type: nodeTypes.CAMERA,
    icon: 'pi pi-camera',
    color: '#f9a8d4', // розовый
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.CAMERA,
    maxTags: 4,
    tags: [
      { id: 'fisheye', name: 'рыбкин глаз', prompt: 'fisheye lens, ultra wide angle' },
      { id: 'anamorphic', name: 'анаморфный', prompt: 'anamorphic lens, cinematic aspect ratio' },
      { id: 'wide', name: 'широкоугольный', prompt: 'wide angle lens, 24mm' },
      { id: 'telephoto', name: 'телеобъектив', prompt: 'telephoto lens, 85mm, shallow depth of field' },
      { id: 'macro', name: 'макро', prompt: 'macro lens, extreme close-up' },
      { id: 'bokeh', name: 'боке', prompt: 'strong bokeh, blurred background' },
      { id: 'tilt_shift', name: 'тилт-шифт', prompt: 'tilt-shift effect, miniature look' },
      { id: 'vintage', name: 'винтаж', prompt: 'vintage lens, soft glow, chromatic aberration' }
    ]
  },
  
  [nodeTypes.STYLE]: {
    name: 'Стиль',
    type: nodeTypes.STYLE,
    icon: 'pi pi-palette',
    color: '#c4b5fd', // фиолетовый
    hasDescription: true,
    hasInput: false,
    hasOutput: true,
    outputType: nodeTypes.STYLE,
    maxTags: 3,
    tags: [
      { id: 'cinematic', name: 'кинематографичный', prompt: 'cinematic, film grain, color graded' },
      { id: 'anime', name: 'аниме', prompt: 'anime style, manga illustration' },
      { id: 'photorealistic', name: 'фотореализм', prompt: 'photorealistic, hyper detailed, 8k' },
      { id: 'oil_painting', name: 'масло', prompt: 'oil painting, traditional art, visible brushstrokes' },
      { id: 'watercolor', name: 'акварель', prompt: 'watercolor painting, soft edges, paper texture' },
      { id: 'sketch', name: 'скетч', prompt: 'pencil sketch, line art, monochrome' },
      { id: '3d_render', name: '3D рендер', prompt: '3D render, octane, blender, perfect lighting' },
      { id: 'pixel_art', name: 'пиксель-арт', prompt: 'pixel art, retro game style, limited palette' }
    ]
  },
  
  [nodeTypes.COMPOSER]: {
    name: 'Композитор',
    type: nodeTypes.COMPOSER,
    icon: 'pi pi-objects-column',
    color: '#93c5fd', // голубой
    hasDescription: false,
    hasInput: true,
    inputType: 'any', // Принимает любой тип
    acceptAnyInput: true, // Флаг для проверки соединений
    hasOutput: true,
    outputType: nodeTypes.COMPOSER,
    maxTags: 0,
    isComposer: true
  },
  
  [nodeTypes.RESULT]: {
    name: 'Результат',
    type: nodeTypes.RESULT,
    icon: 'pi pi-image',
    color: '#fca5a5', // красный
    hasDescription: false,
    hasInput: true,
    inputTypes: [nodeTypes.COMPOSER],
    hasOutput: false,
    maxTags: 0
  }
}

// Получить конфиг по типу
export const getNodeConfig = (type) => nodeConfigs[type] || null

// Получить все конфиги для панели (все кроме результата)
export const getAllNodeConfigs = () => Object.values(nodeConfigs).filter(c => c.type !== nodeTypes.RESULT)
