// Конфигурация провайдеров AI генерации изображений

export const providerTypes = {
  MIDJOURNEY: 'midjourney',
  OPENROUTER: 'openrouter',
  GOOGLE_NANO: 'google_nano',
  OPENAI: 'openai',
  STABILITY: 'stability',
  CUSTOM: 'custom'
}

// Конфигурация каждого провайдера
export const providerConfigs = {
  [providerTypes.MIDJOURNEY]: {
    id: providerTypes.MIDJOURNEY,
    name: 'Midjourney',
    description: 'Генерация через Midjourney API',
    icon: 'pi pi-image',
    color: '#1a1a2e',
    requiresApiKey: true,
    apiKeyLabel: 'Midjourney API Key',
    apiKeyPlaceholder: 'Введите ваш MJ API ключ',
    helpUrl: 'https://docs.midjourney.com/docs/api',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true }
    ],
    supportedOptions: {
      aspectRatio: ['1:1', '16:9', '9:16', '4:3', '3:4', '2:3', '3:2'],
      quality: ['.25', '.5', '1'],
      stylize: { min: 0, max: 1000, step: 50 },
      chaos: { min: 0, max: 100, step: 5 },
      version: ['6', '5.2', '5.1', '5', '4']
    },
    maxPromptLength: 6000
  },
  
  [providerTypes.OPENROUTER]: {
    id: providerTypes.OPENROUTER,
    name: 'OpenRouter',
    description: 'Доступ к множеству моделей через unified API',
    icon: 'pi pi-globe',
    color: '#5b21b6',
    requiresApiKey: true,
    apiKeyLabel: 'OpenRouter API Key',
    apiKeyPlaceholder: 'sk-or-...',
    helpUrl: 'https://openrouter.ai/docs',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true },
      { name: 'model', label: 'Model', type: 'select', required: true, 
        options: [
          { value: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free)' },
          { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus' },
          { value: 'anthropic/claude-3-sonnet', label: 'Claude 3 Sonnet' },
          { value: 'openai/gpt-4o', label: 'GPT-4o' },
          { value: 'meta-llama/llama-3.2-90b-vision-instruct', label: 'Llama 3.2 Vision' }
        ]
      }
    ],
    supportedOptions: {
      temperature: { min: 0, max: 2, step: 0.1 },
      maxTokens: { min: 100, max: 4096, step: 100 }
    },
    maxPromptLength: 8000
  },
  
  [providerTypes.GOOGLE_NANO]: {
    id: providerTypes.GOOGLE_NANO,
    name: 'Google Nano (Imagen)',
    description: 'Google Imagen 3 через Nano API',
    icon: 'pi pi-google',
    color: '#4285f4',
    requiresApiKey: true,
    apiKeyLabel: 'Google AI API Key',
    apiKeyPlaceholder: 'AIza...',
    helpUrl: 'https://ai.google.dev/',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true }
    ],
    supportedOptions: {
      aspectRatio: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      quality: ['standard', 'hd'],
      style: ['photorealistic', 'digital-art', 'anime', 'cinematic']
    },
    maxPromptLength: 4000
  },
  
  [providerTypes.OPENAI]: {
    id: providerTypes.OPENAI,
    name: 'OpenAI DALL-E',
    description: 'DALL-E 2 и DALL-E 3',
    icon: 'pi pi-sparkles',
    color: '#10a37f',
    requiresApiKey: true,
    apiKeyLabel: 'OpenAI API Key',
    apiKeyPlaceholder: 'sk-...',
    helpUrl: 'https://platform.openai.com/docs/guides/images',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true },
      { name: 'model', label: 'Model', type: 'select', required: false,
        options: [
          { value: 'dall-e-3', label: 'DALL-E 3' },
          { value: 'dall-e-2', label: 'DALL-E 2' }
        ]
      }
    ],
    supportedOptions: {
      size: ['1024x1024', '1792x1024', '1024x1792'],
      quality: ['standard', 'hd'],
      style: ['vivid', 'natural']
    },
    maxPromptLength: 4000
  },
  
  [providerTypes.STABILITY]: {
    id: providerTypes.STABILITY,
    name: 'Stability AI',
    description: 'Stable Diffusion через Stability API',
    icon: 'pi pi-palette',
    color: '#6d28d9',
    requiresApiKey: true,
    apiKeyLabel: 'Stability API Key',
    apiKeyPlaceholder: 'sk-...',
    helpUrl: 'https://platform.stability.ai/',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true },
      { name: 'model', label: 'Model', type: 'select', required: false,
        options: [
          { value: 'stable-diffusion-xl-1024-v1-0', label: 'SD XL 1.0' },
          { value: 'stable-diffusion-v1-6', label: 'SD 1.6' },
          { value: 'stable-image-ultra', label: 'Stable Image Ultra' }
        ]
      }
    ],
    supportedOptions: {
      width: [512, 768, 1024, 1536],
      height: [512, 768, 1024, 1536],
      steps: { min: 10, max: 50, step: 5 },
      cfgScale: { min: 1, max: 35, step: 1 }
    },
    maxPromptLength: 10000
  },
  
  [providerTypes.CUSTOM]: {
    id: providerTypes.CUSTOM,
    name: 'Custom (Local/CURL)',
    description: 'Собственный endpoint как в n8n',
    icon: 'pi pi-code',
    color: '#059669',
    requiresApiKey: false,
    fields: [
      { name: 'name', label: 'Название подключения', type: 'text', required: true, placeholder: 'Моя локальная модель' },
      { name: 'baseUrl', label: 'Base URL', type: 'url', required: true, placeholder: 'http://localhost:7860/api/v1' },
      { name: 'apiKey', label: 'API Key (опционально)', type: 'password', required: false, placeholder: 'Оставьте пустым если не требуется' },
      { name: 'method', label: 'HTTP Method', type: 'select', required: true,
        options: [
          { value: 'POST', label: 'POST' },
          { value: 'GET', label: 'GET' }
        ]
      },
      { name: 'headers', label: 'Custom Headers (JSON)', type: 'textarea', required: false, 
        placeholder: '{"Content-Type": "application/json"}' },
      { name: 'bodyTemplate', label: 'Body Template', type: 'textarea', required: true,
        placeholder: '{"prompt": "{{prompt}}", "width": {{width}}, "height": {{height}}}' },
      { name: 'responsePath', label: 'Path to image URL в ответе', type: 'text', required: true,
        placeholder: 'data.0.url или images.0' }
    ],
    supportedOptions: {
      width: { min: 256, max: 2048, step: 64 },
      height: { min: 256, max: 2048, step: 64 }
    },
    maxPromptLength: 10000
  }
}

// Получить список провайдеров для UI
export const getProvidersList = () => {
  return Object.values(providerConfigs).map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    icon: p.icon,
    color: p.color,
    requiresApiKey: p.requiresApiKey
  }))
}

// Получить конфиг провайдера по ID
export const getProviderConfig = (providerId) => {
  return providerConfigs[providerId] || null
}

// Проверить валидность настроек провайдера
export const validateProviderSettings = (providerId, settings) => {
  const config = getProviderConfig(providerId)
  if (!config) return { valid: false, errors: ['Unknown provider'] }
  
  const errors = []
  
  for (const field of config.fields) {
    if (field.required && !settings[field.name]) {
      errors.push(`${field.label} обязательно для заполнения`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Дефолтные опции для провайдера
export const getDefaultOptions = (providerId) => {
  const config = getProviderConfig(providerId)
  if (!config || !config.supportedOptions) return {}
  
  const defaults = {}
  for (const [key, value] of Object.entries(config.supportedOptions)) {
    if (Array.isArray(value)) {
      defaults[key] = value[0]
    } else if (typeof value === 'object' && value.min !== undefined) {
      defaults[key] = value.min
    }
  }
  return defaults
}
