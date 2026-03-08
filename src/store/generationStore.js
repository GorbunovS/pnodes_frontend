import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { providerConfigs, getProviderConfig, providerTypes } from '../data/providersConfig.js'

// Store для управления генерациями изображений
export const useGenerationStore = defineStore('generation', () => {
  // === STATE ===
  const apiKeys = ref({}) // { providerId: { ...settings } }
  const generationTasks = ref([]) // Активные и завершённые задачи
  const generationHistory = ref([]) // История (localStorage)
  const isGenerating = ref(false)
  const currentTask = ref(null)

  // === GETTERS ===
  const hasApiKeys = computed(() => Object.keys(apiKeys.value).length > 0)
  
  const getConnectedProviders = computed(() => {
    return Object.entries(apiKeys.value).map(([id, settings]) => ({
      id,
      ...providerConfigs[id],
      settings
    }))
  })
  
  const getProviderById = (id) => apiKeys.value[id] || null
  
  const isProviderConnected = (id) => !!apiKeys.value[id]
  
  const getTaskById = (taskId) => generationTasks.value.find(t => t.id === taskId)
  
  const pendingTasks = computed(() => 
    generationTasks.value.filter(t => t.status === 'pending' || t.status === 'processing')
  )
  
  const completedTasks = computed(() =>
    generationTasks.value.filter(t => t.status === 'completed')
  )

  // === API KEYS MANAGEMENT ===
  const saveApiKey = (providerId, settings) => {
    apiKeys.value[providerId] = {
      ...settings,
      savedAt: new Date().toISOString()
    }
    saveToLocalStorage()
  }
  
  const removeApiKey = (providerId) => {
    delete apiKeys.value[providerId]
    saveToLocalStorage()
  }
  
  const updateApiKey = (providerId, newSettings) => {
    if (apiKeys.value[providerId]) {
      apiKeys.value[providerId] = {
        ...apiKeys.value[providerId],
        ...newSettings,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }

  // === GENERATION TASKS ===
  const createTask = (providerId, prompt, options = {}) => {
    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      providerId,
      prompt,
      options,
      status: 'pending', // pending, processing, completed, failed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      result: null,
      error: null,
      progress: 0,
      imageUrl: null
    }
    
    generationTasks.value.unshift(task)
    saveToLocalStorage()
    return task
  }
  
  const updateTask = (taskId, updates) => {
    const task = generationTasks.value.find(t => t.id === taskId)
    if (task) {
      Object.assign(task, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      saveToLocalStorage()
    }
    return task
  }
  
  const deleteTask = (taskId) => {
    generationTasks.value = generationTasks.value.filter(t => t.id !== taskId)
    saveToLocalStorage()
  }
  
  const clearCompletedTasks = () => {
    generationTasks.value = generationTasks.value.filter(t => 
      t.status === 'pending' || t.status === 'processing'
    )
    saveToLocalStorage()
  }

  // === GENERATION API CALLS ===
  
  // OpenAI DALL-E генерация
  const generateOpenAI = async (task, apiKey, model = 'dall-e-3') => {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt: task.prompt,
        n: 1,
        size: task.options.size || '1024x1024',
        quality: task.options.quality || 'standard',
        style: task.options.style || 'vivid',
        response_format: 'url'
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API error')
    }
    
    const data = await response.json()
    return {
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt
    }
  }
  
  // Stability AI генерация
  const generateStability = async (task, apiKey, model = 'stable-diffusion-xl-1024-v1-0') => {
    const formData = new FormData()
    formData.append('prompt', task.prompt)
    formData.append('width', String(task.options.width || 1024))
    formData.append('height', String(task.options.height || 1024))
    formData.append('steps', String(task.options.steps || 30))
    formData.append('cfg_scale', String(task.options.cfgScale || 7))
    formData.append('samples', '1')
    
    const response = await fetch(`https://api.stability.ai/v1/generation/${model}/text-to-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Stability API error')
    }
    
    const data = await response.json()
    // Stability возвращает base64
    const base64Image = data.artifacts[0]?.base64
    return {
      imageUrl: `data:image/png;base64,${base64Image}`,
      seed: data.artifacts[0]?.seed
    }
  }
  
  // Google Nano/Imagen генерация
  const generateGoogle = async (task, apiKey) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{ prompt: task.prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: task.options.aspectRatio || '1:1'
        }
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Google API error')
    }
    
    const data = await response.json()
    // Google возвращает base64
    const base64Image = data.predictions[0]?.bytesBase64Encoded
    return {
      imageUrl: `data:image/png;base64,${base64Image}`
    }
  }
  
  // OpenRouter Text генерация (чат/текстовые модели)
  const generateOpenRouterText = async (task, settings) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PNodes Generator'
      },
      body: JSON.stringify({
        model: settings.model || 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: `Generate an image description based on this prompt and describe what would be visible: ${task.prompt}. Start with "The image shows:"`
          }
        ],
        temperature: task.options.temperature || 0.7,
        max_tokens: task.options.maxTokens || 1000
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenRouter API error')
    }
    
    const data = await response.json()
    return {
      textResponse: data.choices[0]?.message?.content,
      model: data.model
    }
  }
  
  // OpenRouter Images генерация через chat completions с modalities
  const generateOpenRouterImages = async (task, settings) => {
    // Фикс: заменяем старый неверный ID на правильный
    let modelId = settings.model || 'bytedance-seed/seedream-4.5'
    if (modelId === 'bytedance/seedream-4.5') {
      modelId = 'bytedance-seed/seedream-4.5'
    }
    
    console.log('[OpenRouter Images] Starting generation with model:', modelId)
    console.log('[OpenRouter Images] Prompt:', task.prompt.substring(0, 100) + '...')
    
    // Контроллер для таймаута
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 минуты таймаут
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PNodes Generator'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'user',
              content: task.prompt
            }
          ],
          modalities: ['image']
        })
      })
      
      clearTimeout(timeoutId)
      console.log('[OpenRouter Images] Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const responseText = await response.text()
        console.error('[OpenRouter Images] Error response:', responseText.substring(0, 500))
        
        let errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`
        
        try {
          const errorJson = JSON.parse(responseText)
          errorMessage = errorJson.error?.message || errorJson.message || errorMessage
          console.error('[OpenRouter Images] Parsed error:', errorJson)
        } catch (e) {
          if (responseText.includes('<!DOCTYPE')) {
            errorMessage = `OpenRouter returned HTML: ${response.status}. The model may not support image generation.`
          }
        }
        
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log('[OpenRouter Images] Full response:', JSON.stringify(data, null, 2))
      
      // Извлекаем URL изображения - проверяем разные форматы
      let imageUrl = null
      
      if (data.choices && data.choices[0]) {
        const message = data.choices[0].message
        console.log('[OpenRouter Images] Message:', message)
        
        // Формат 1: choices[0].message.images[0].image_url.url (Seedream и др.)
        if (message.images && message.images.length > 0) {
          const img = message.images[0]
          if (img.image_url && img.image_url.url) {
            imageUrl = img.image_url.url
            console.log('[OpenRouter Images] Found in images[0].image_url.url:', imageUrl.substring(0, 100))
          } else if (img.url) {
            imageUrl = img.url
            console.log('[OpenRouter Images] Found in images[0].url')
          }
        }
        
        // Формат 2: choices[0].message.image_url (стандарт OpenAI)
        if (!imageUrl && message.image_url) {
          imageUrl = message.image_url.url || message.image_url
          console.log('[OpenRouter Images] Found image_url:', imageUrl.substring(0, 100))
        }
        
        // Формат 3: content с base64 или URL
        if (!imageUrl && message.content) {
          console.log('[OpenRouter Images] Content:', message.content.substring(0, 200))
          if (message.content.startsWith('http')) {
            imageUrl = message.content
          } else if (message.content.startsWith('data:image')) {
            imageUrl = message.content
          }
        }
        
        // Формат 4: content как JSON с изображением
        if (!imageUrl && message.content) {
          try {
            const contentJson = JSON.parse(message.content)
            if (contentJson.image_url) imageUrl = contentJson.image_url
            if (contentJson.url) imageUrl = contentJson.url
          } catch (e) {
            // Не JSON
          }
        }
      }
      
      // Формат 5: data[0].url (альтернативный)
      if (!imageUrl && data.data && data.data[0]) {
        imageUrl = data.data[0].url || data.data[0].b64_json
        console.log('[OpenRouter Images] Found in data[0]:', imageUrl ? 'yes' : 'no')
      }
      
      // Формат 6: images массив на корневом уровне
      if (!imageUrl && data.images && data.images[0]) {
        imageUrl = data.images[0].url || data.images[0]
        console.log('[OpenRouter Images] Found in root images array')
      }
      
      if (!imageUrl) {
        console.warn('[OpenRouter Images] No image URL found. Available fields:', Object.keys(data))
        throw new Error('Image URL not found in response. Check console for full response structure.')
      }
      
      return {
        imageUrl: imageUrl,
        revisedPrompt: data.choices?.[0]?.message?.content
      }
      
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout (2 minutes). The model may be overloaded.')
      }
      throw error
    }
  }
  
  // Custom/local endpoint генерация
  const generateCustom = async (task, settings) => {
    const { baseUrl, apiKey, method, headers, bodyTemplate, responsePath } = settings
    
    // Подстановка переменных в шаблон
    const body = bodyTemplate
      .replace(/\{\{prompt\}\}/g, task.prompt)
      .replace(/\{\{width\}\}/g, task.options.width || 1024)
      .replace(/\{\{height\}\}/g, task.options.height || 1024)
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
      ...(headers && JSON.parse(headers))
    }
    
    const response = await fetch(baseUrl, {
      method: method || 'POST',
      headers: requestHeaders,
      body: method === 'GET' ? undefined : body
    })
    
    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Извлечение URL из ответа по пути (например "data.0.url")
    const getValueByPath = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc?.[part], obj)
    }
    
    const imageUrl = getValueByPath(data, responsePath || 'data.0.url')
    
    if (!imageUrl) {
      throw new Error('Image URL not found in response')
    }
    
    return { imageUrl }
  }
  
  // Midjourney генерация (через сторонний API или прокси)
  const generateMidjourney = async (task, settings) => {
    // Midjourney требует асинхронного polling
    // Это заглушка - нужен MJ API прокси
    throw new Error('Midjourney generation requires external API setup. Please use ImagineAPI.dev or similar service.')
  }

  // === MAIN GENERATION FUNCTION ===
  const generateImage = async (providerId, prompt, options = {}) => {
    const provider = apiKeys.value[providerId]
    if (!provider) {
      throw new Error(`Provider ${providerId} not configured`)
    }
    
    const task = createTask(providerId, prompt, options)
    currentTask.value = task
    isGenerating.value = true
    
    try {
      updateTask(task.id, { status: 'processing', progress: 10 })
      
      let result
      
      switch (providerId) {
        case providerTypes.OPENAI:
          result = await generateOpenAI(task, provider.apiKey, provider.model)
          break
          
        case providerTypes.STABILITY:
          result = await generateStability(task, provider.apiKey, provider.model)
          break
          
        case providerTypes.GOOGLE_NANO:
          result = await generateGoogle(task, provider.apiKey)
          break
          
        case providerTypes.OPENROUTER_TEXT:
          result = await generateOpenRouterText(task, provider)
          break
          
        case providerTypes.OPENROUTER_IMAGES:
          result = await generateOpenRouterImages(task, provider)
          break
          
        case providerTypes.CUSTOM:
          result = await generateCustom(task, provider)
          break
          
        case providerTypes.MIDJOURNEY:
          result = await generateMidjourney(task, provider)
          break
          
        default:
          throw new Error(`Unknown provider: ${providerId}`)
      }
      
      updateTask(task.id, {
        status: 'completed',
        progress: 100,
        imageUrl: result.imageUrl,
        result
      })
      
      // Добавляем в историю
      addToHistory(task)
      
      return task
      
    } catch (error) {
      console.error('[Generation] Task failed:', {
        taskId: task.id,
        provider: providerId,
        model: provider.model,
        error: error.message,
        stack: error.stack
      })
      
      updateTask(task.id, {
        status: 'failed',
        error: error.message,
        progress: 0
      })
      throw error
      
    } finally {
      isGenerating.value = false
      currentTask.value = null
    }
  }

  // === HISTORY ===
  const addToHistory = (task) => {
    const historyItem = {
      id: task.id,
      providerId: task.providerId,
      prompt: task.prompt,
      imageUrl: task.imageUrl,
      createdAt: task.createdAt,
      options: task.options
    }
    generationHistory.value.unshift(historyItem)
    
    // Ограничиваем историю 50 элементами
    if (generationHistory.value.length > 50) {
      generationHistory.value = generationHistory.value.slice(0, 50)
    }
    
    saveToLocalStorage()
  }
  
  const clearHistory = () => {
    generationHistory.value = []
    saveToLocalStorage()
  }
  
  const deleteFromHistory = (taskId) => {
    generationHistory.value = generationHistory.value.filter(h => h.id !== taskId)
    saveToLocalStorage()
  }

  // === LOCAL STORAGE ===
  const STORAGE_KEY = 'pnodes_generation_store'
  
  const saveToLocalStorage = () => {
    const data = {
      apiKeys: apiKeys.value,
      generationHistory: generationHistory.value,
      generationTasks: generationTasks.value.slice(0, 10) // Храним только последние 10 задач
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
  
  const loadFromLocalStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        apiKeys.value = parsed.apiKeys || {}
        generationHistory.value = parsed.generationHistory || []
        generationTasks.value = parsed.generationTasks || []
        
        // Миграция: исправляем старый неверный ID модели на правильный
        for (const [providerId, settings] of Object.entries(apiKeys.value)) {
          if (settings.model === 'bytedance/seedream-4.5') {
            console.log('[Migration] Fixing model ID for', providerId)
            settings.model = 'bytedance-seed/seedream-4.5'
          }
        }
      }
    } catch (e) {
      console.error('Failed to load generation store:', e)
    }
  }
  
  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY)
    apiKeys.value = {}
    generationHistory.value = []
    generationTasks.value = []
  }

  // === INITIALIZATION ===
  loadFromLocalStorage()

  return {
    // State
    apiKeys,
    generationTasks,
    generationHistory,
    isGenerating,
    currentTask,
    
    // Getters
    hasApiKeys,
    getConnectedProviders,
    pendingTasks,
    completedTasks,
    
    // Actions
    saveApiKey,
    removeApiKey,
    updateApiKey,
    getProviderById,
    isProviderConnected,
    
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    clearCompletedTasks,
    
    generateImage,
    
    clearHistory,
    deleteFromHistory,
    
    loadFromLocalStorage,
    saveToLocalStorage,
    clearLocalStorage
  }
})
