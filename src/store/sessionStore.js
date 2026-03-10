import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getNodeConfig } from '../data/nodeConfig.js'

const SESSIONS_LIST_KEY = 'pnodes_sessions_list'
const SESSION_DATA_PREFIX = 'pnodes_session_data_'
const USER_NODE_TEMPLATES_PREFIX = 'pnodes_user_nodes_'
const USER_NODE_CONFIGS_PREFIX = 'pnodes_user_configs_'

// Генерация ID для сессии
const generateSessionId = () => `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Генерация имени сессии
const generateSessionName = (index) => `Проект ${index + 1}`

export const useSessionStore = defineStore('session', () => {
  // === STATE ===
  // Список сохранённых проектов (отображаются в разделе "Мои")
  const savedSessions = ref([])
  // Список открытых вкладок (ID сессий которые сейчас открыты в табах)
  const openTabs = ref([])
  // Текущая активная сессия (текущая открытая вкладка)
  const currentSessionId = ref(null)
  // Флаг несохранённых изменений для каждой сессии
  const unsavedChanges = ref(new Set())
  // Шаблоны пользовательских нод (реактивный кэш)
  const userNodeTemplatesCache = ref({}) // { sessionId: templates[] }
  // Виртуальные конфиги пользовательских нод (как nodeConfigs, но для сессии)
  const userNodeConfigs = ref({}) // { sessionId: { type: config } }

  // === GETTERS ===
  const hasUnsavedChanges = computed(() => (sessionId) => unsavedChanges.value.has(sessionId))
  const getSessionById = (id) => savedSessions.value.find(s => s.id === id)
  const currentSession = computed(() => getSessionById(currentSessionId.value))
  const getOpenTabsSessions = computed(() => openTabs.value.map(id => getSessionById(id)).filter(Boolean))

  // === USER NODE TEMPLATES ===
  // Получить шаблоны пользовательских нод для сессии
  const getUserNodeTemplates = (sessionId) => {
    if (!sessionId) return []
    
    // Возвращаем из кэша если есть
    if (userNodeTemplatesCache.value[sessionId]) {
      return userNodeTemplatesCache.value[sessionId]
    }
    
    // Загружаем из localStorage
    const key = `${USER_NODE_TEMPLATES_PREFIX}${sessionId}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const templates = JSON.parse(saved)
        userNodeTemplatesCache.value[sessionId] = templates
        return templates
      } catch (e) {
        console.error('Failed to load user node templates:', e)
        return []
      }
    }
    return []
  }

  // Сохранить шаблон пользовательской ноды
  const saveUserNodeTemplate = (sessionId, template) => {
    if (!sessionId) return false
    const key = `${USER_NODE_TEMPLATES_PREFIX}${sessionId}`
    const templates = [...getUserNodeTemplates(sessionId)]
    
    // Deep copy template с копированием tags
    const templateCopy = {
      ...template,
      tags: template.tags?.map(t => ({ ...t })) || []
    }
    
    // Проверяем, существует ли уже шаблон с таким id
    const existingIndex = templates.findIndex(t => t.id === template.id)
    if (existingIndex >= 0) {
      // Обновляем существующий
      templates[existingIndex] = { ...templateCopy, updatedAt: Date.now() }
    } else {
      // Добавляем новый
      templates.push({ ...templateCopy, createdAt: Date.now(), updatedAt: Date.now() })
    }
    
    // Обновляем кэш и localStorage
    userNodeTemplatesCache.value[sessionId] = templates
    localStorage.setItem(key, JSON.stringify(templates))
    return true
  }

  // Удалить шаблон пользовательской ноды
  const deleteUserNodeTemplate = (sessionId, templateId) => {
    if (!sessionId) return false
    const key = `${USER_NODE_TEMPLATES_PREFIX}${sessionId}`
    const templates = getUserNodeTemplates(sessionId).filter(t => t.id !== templateId)
    
    // Обновляем кэш и localStorage
    userNodeTemplatesCache.value[sessionId] = templates
    localStorage.setItem(key, JSON.stringify(templates))
    return true
  }

  // Очистить все шаблоны для сессии
  const clearUserNodeTemplates = (sessionId) => {
    if (!sessionId) return false
    const key = `${USER_NODE_TEMPLATES_PREFIX}${sessionId}`
    localStorage.removeItem(key)
    delete userNodeTemplatesCache.value[sessionId]
    return true
  }

  // === ВИРТУАЛЬНЫЕ КОНФИГИ ПОЛЬЗОВАТЕЛЬСКИХ НОД ===
  // Генерация уникального типа для пользовательской ноды
  const generateUserNodeType = (templateId) => {
    // Если ID уже содержит userNode_, не дублируем
    if (templateId.startsWith('userNode_')) {
      return templateId
    }
    return `userNode_${templateId}`
  }

  // Сохранить все конфиги сессии в localStorage
  const saveUserNodeConfigsToStorage = (sessionId) => {
    if (!sessionId) return
    const key = `${USER_NODE_CONFIGS_PREFIX}${sessionId}`
    const configs = userNodeConfigs.value[sessionId] || {}
    localStorage.setItem(key, JSON.stringify(configs))
  }

  // Загрузить все конфиги сессии из localStorage
  const loadUserNodeConfigsFromStorage = (sessionId) => {
    if (!sessionId) return {}
    const key = `${USER_NODE_CONFIGS_PREFIX}${sessionId}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load user node configs:', e)
      }
    }
    return {}
  }

  // Восстановить виртуальные конфиги из шаблонов (при загрузке сессии)
  const restoreUserNodeConfigsFromTemplates = (sessionId) => {
    if (!sessionId) return
    
    // Сначала пробуем загрузить из localStorage
    const savedConfigs = loadUserNodeConfigsFromStorage(sessionId)
    if (Object.keys(savedConfigs).length > 0) {
      userNodeConfigs.value[sessionId] = savedConfigs
      return
    }
    
    // Если нет в localStorage, создаём из шаблонов
    const templates = getUserNodeTemplates(sessionId)
    if (templates.length > 0) {
      userNodeConfigs.value[sessionId] = {}
      templates.forEach(template => {
        createUserNodeConfig(sessionId, template, false) // false = не сохранять в storage
      })
      // Сохраняем все разом
      saveUserNodeConfigsToStorage(sessionId)
    }
  }

  // Создать/обновить виртуальный конфиг из шаблона
  const createUserNodeConfig = (sessionId, template, saveToStorage = true) => {
    if (!sessionId) return null
    
    const type = generateUserNodeType(template.id)
    
    // Структура конфига как у обычной ноды
    const config = {
      name: template.name,
      type: type,
      category: 'userNodes',
      icon: 'pi pi-user-edit',
      color: template.color,
      hasDescription: true,
      hasInput: false,
      hasOutput: true,
      outputType: type,
      maxTags: template.maxTags,
      tags: template.tags?.map(t => ({ ...t })) || [],
      isUserNode: true,
      templateId: template.id,
      jsonType: template.jsonType || 'custom' // Тип для JSON (для нейронки)
    }
    
    // Инициализируем хранилище для сессии если нужно
    if (!userNodeConfigs.value[sessionId]) {
      userNodeConfigs.value[sessionId] = {}
    }
    
    // Сохраняем конфиг
    userNodeConfigs.value[sessionId][type] = config
    
    // Сохраняем в localStorage если нужно
    if (saveToStorage) {
      saveUserNodeConfigsToStorage(sessionId)
    }
    
    return config
  }

  // Получить конфиг пользовательской ноды
  const getUserNodeConfig = (sessionId, type) => {
    if (!sessionId || !type) return null
    // Если конфига нет в кэше, пробуем загрузить из storage
    if (!userNodeConfigs.value[sessionId]?.[type]) {
      const savedConfigs = loadUserNodeConfigsFromStorage(sessionId)
      if (savedConfigs[type]) {
        if (!userNodeConfigs.value[sessionId]) {
          userNodeConfigs.value[sessionId] = {}
        }
        userNodeConfigs.value[sessionId][type] = savedConfigs[type]
      }
    }
    return userNodeConfigs.value[sessionId]?.[type] || null
  }

  // Получить все конфиги пользовательских нод для сессии
  const getAllUserNodeConfigs = (sessionId) => {
    if (!sessionId) return []
    // Убедимся что конфиги загружены
    if (!userNodeConfigs.value[sessionId]) {
      restoreUserNodeConfigsFromTemplates(sessionId)
    }
    return Object.values(userNodeConfigs.value[sessionId] || {})
  }

  // Удалить конфиг пользовательской ноды
  const deleteUserNodeConfig = (sessionId, type) => {
    if (!sessionId || !type) return false
    if (userNodeConfigs.value[sessionId]) {
      delete userNodeConfigs.value[sessionId][type]
      saveUserNodeConfigsToStorage(sessionId)
    }
    return true
  }

  // === LOAD/SAVE LIST ===
  const loadSessionsList = () => {
    const saved = localStorage.getItem(SESSIONS_LIST_KEY)
    if (saved) {
      try {
        savedSessions.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load sessions list:', e)
        savedSessions.value = []
      }
    }
  }

  const saveSessionsList = () => {
    localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(savedSessions.value))
  }

  // === EXPORT SESSION ===
  // Экспорт сессии в JSON (на основе логики copy/paste)
  const exportSession = (sessionId, options = {}) => {
    const sessionMeta = getSessionById(sessionId)
    if (!sessionMeta) {
      // Если нет в savedSessions, ищем в openTabs
      const openTabId = openTabs.value.find(id => id === sessionId)
      if (!openTabId) return null
      // Возвращаем базовую структуру для открытой вкладки без метаданных
      return {
        nodes: [],
        connections: [],
        nextNodeId: 1,
        nextZIndex: 1,
        viewport: { panX: 0, panY: 0, zoom: 0.8 }
      }
    }

    // Загружаем полные данные сессии
    const sessionData = localStorage.getItem(`${SESSION_DATA_PREFIX}${sessionId}`)
    if (!sessionData) return null

    const parsed = JSON.parse(sessionData)
    
    // Формируем экспортируемый пакет
    const exportPackage = {
      version: '1.0',
      exportedAt: Date.now(),
      meta: {
        name: sessionMeta.name,
        createdAt: sessionMeta.createdAt,
        modifiedAt: sessionMeta.modifiedAt
      },
      // Данные воркфлоу (как в copy/paste, но все ноды)
      workflow: {
        nodes: parsed.nodes?.map(n => ({
          type: n.type,
          x: n.x,
          y: n.y,
          data: JSON.parse(JSON.stringify(n.data))
        })) || [],
        connections: parsed.connections || []
      },
      // Viewport (опционально)
      viewport: parsed.viewport || { panX: 0, panY: 0, zoom: 0.8 }
    }

    // Если нужно включить историю
    if (options.includeHistory && parsed.history) {
      exportPackage.history = parsed.history
    }

    return exportPackage
  }

  // === IMPORT SESSION ===
  // Импорт сессии из JSON
  const importSession = (importData, options = {}) => {
    try {
      // Парсим если строка
      const data = typeof importData === 'string' ? JSON.parse(importData) : importData

      // Проверяем версию
      if (!data.version || data.version !== '1.0') {
        console.warn('Unknown session version:', data.version)
      }

      // Создаём новую сессию
      const sessionId = generateSessionId()
      const sessionName = options.name || data.meta?.name || generateSessionName(savedSessions.value.length)

      // Восстанавливаем ноды с конфигами
      const nodes = data.workflow?.nodes?.map((n, index) => {
        const config = getNodeConfig(n.type)
        return {
          id: index + 1,
          type: n.type,
          x: n.x,
          y: n.y,
          zIndex: index + 1,
          config,
          data: n.data || { tags: [], description: '' }
        }
      }) || []

      // Восстанавливаем связи
      const connections = data.workflow?.connections?.map((c, index) => ({
        id: `conn_${index}_${Date.now()}`,
        fromNodeId: c.fromNodeId,
        fromOutIdx: c.fromOutIdx || 0,
        toNodeId: c.toNodeId,
        toInIdx: c.toInIdx || 0
      })) || []

      // Сохраняем данные сессии
      const sessionData = {
        nodes,
        connections,
        nextNodeId: nodes.length + 1,
        nextZIndex: nodes.length + 1,
        viewport: data.viewport || { panX: 0, panY: 0, zoom: 0.8 }
      }

      localStorage.setItem(`${SESSION_DATA_PREFIX}${sessionId}`, JSON.stringify(sessionData))

      // Добавляем в список
      const newSession = {
        id: sessionId,
        name: sessionName,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        isSaved: true,
        nodeCount: nodes.length,
        connectionCount: connections.length
      }

      savedSessions.value.push(newSession)
      saveSessionsList()

      return { success: true, sessionId, session: newSession }
    } catch (error) {
      console.error('Failed to import session:', error)
      return { success: false, error: error.message }
    }
  }

  // === CREATE NEW SESSION ===
  const createSession = (name = null) => {
    const sessionId = generateSessionId()
    const sessionName = name || generateSessionName(savedSessions.value.length)

    // Создаём пустые данные
    const sessionData = {
      nodes: [],
      connections: [],
      nextNodeId: 1,
      nextZIndex: 1,
      viewport: { panX: 0, panY: 0, zoom: 0.8 }
    }

    localStorage.setItem(`${SESSION_DATA_PREFIX}${sessionId}`, JSON.stringify(sessionData))

    const newSession = {
      id: sessionId,
      name: sessionName,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      isSaved: true,
      nodeCount: 0,
      connectionCount: 0,
      lastGeneration: null
    }

    savedSessions.value.push(newSession)
    saveSessionsList()

    // Добавляем в открытые вкладки
    if (!openTabs.value.includes(sessionId)) {
      openTabs.value.push(sessionId)
    }

    return { sessionId, session: newSession }
  }

  // === SAVE SESSION DATA ===
  const saveSessionData = (sessionId, data) => {
    const sessionMeta = getSessionById(sessionId)
    
    // Сохраняем данные в любом случае (даже если нет в метаданных)
    const saveData = {
      nodes: data.nodes || [],
      connections: data.connections || [],
      nextNodeId: data.nextNodeId || 1,
      nextZIndex: data.nextZIndex || 1,
      viewport: data.viewport || { panX: 0, panY: 0, zoom: 0.8 }
    }

    localStorage.setItem(`${SESSION_DATA_PREFIX}${sessionId}`, JSON.stringify(saveData))

    // Обновляем метаданные только если сессия есть в сохранённых
    if (sessionMeta) {
      sessionMeta.modifiedAt = Date.now()
      sessionMeta.nodeCount = saveData.nodes.length
      sessionMeta.connectionCount = saveData.connections.length
      sessionMeta.isSaved = true
      
      // Убираем из несохранённых
      unsavedChanges.value.delete(sessionId)
      
      saveSessionsList()
    }
    
    return true
  }

  // === LOAD SESSION DATA ===
  const loadSessionData = (sessionId) => {
    const data = localStorage.getItem(`${SESSION_DATA_PREFIX}${sessionId}`)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Failed to parse session data:', e)
      return null
    }
  }

  // === DELETE SESSION ===
  const deleteSession = (sessionId) => {
    // Удаляем данные
    localStorage.removeItem(`${SESSION_DATA_PREFIX}${sessionId}`)
    localStorage.removeItem(`canvasViewport_${sessionId}`)
    localStorage.removeItem(`${USER_NODE_TEMPLATES_PREFIX}${sessionId}`)
    
    // Удаляем из списка сохранённых
    savedSessions.value = savedSessions.value.filter(s => s.id !== sessionId)
    // Удаляем из открытых вкладок
    openTabs.value = openTabs.value.filter(id => id !== sessionId)
    unsavedChanges.value.delete(sessionId)
    
    saveSessionsList()
  }

  // === RENAME SESSION ===
  const renameSession = (sessionId, newName) => {
    const session = getSessionById(sessionId)
    if (session) {
      session.name = newName
      session.modifiedAt = Date.now()
      saveSessionsList()
      return true
    }
    // Если нет в сохранённых, но есть в открытых - создаём метаданные
    if (openTabs.value.includes(sessionId)) {
      const newSession = {
        id: sessionId,
        name: newName,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        isSaved: false,
        nodeCount: 0,
        connectionCount: 0,
        lastGeneration: null
      }
      savedSessions.value.push(newSession)
      saveSessionsList()
      return true
    }
    return false
  }

  // === DUPLICATE SESSION ===
  const duplicateSession = (sessionId, newName = null) => {
    const exportData = exportSession(sessionId)
    if (!exportData) return null

    const meta = getSessionById(sessionId)
    const name = newName || `${meta?.name || 'Проект'} (копия)`

    return importSession(exportData, { name })
  }

  // === MARK AS UNSAVED ===
  const markAsUnsaved = (sessionId) => {
    unsavedChanges.value.add(sessionId)
    const session = getSessionById(sessionId)
    if (session) {
      session.isSaved = false
    }
  }

  // === OPEN/CLOSE TABS ===
  const openTab = (sessionId) => {
    if (!openTabs.value.includes(sessionId)) {
      openTabs.value.push(sessionId)
    }
    currentSessionId.value = sessionId
  }

  const closeTab = (sessionId) => {
    openTabs.value = openTabs.value.filter(id => id !== sessionId)
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = openTabs.value.length > 0 ? openTabs.value[openTabs.value.length - 1] : null
    }
  }

  // === SET CURRENT SESSION ===
  const setCurrentSession = (sessionId) => {
    currentSessionId.value = sessionId
  }

  // === DOWNLOAD SESSION AS FILE ===
  const downloadSession = (sessionId) => {
    const exportData = exportSession(sessionId)
    if (!exportData) return false

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const session = getSessionById(sessionId)
    const filename = `${session.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pnodes.json`

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
    return true
  }

  // === LOAD SESSION FROM FILE ===
  const loadFromFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          const result = importSession(data, { name: file.name.replace('.pnodes.json', '') })
          resolve(result)
        } catch (error) {
          resolve({ success: false, error: error.message })
        }
      }
      reader.onerror = () => resolve({ success: false, error: 'Failed to read file' })
      reader.readAsText(file)
    })
  }

  // Загружаем список при инициализации
  loadSessionsList()

  return {
    // State
    savedSessions,
    openTabs,
    currentSessionId,
    unsavedChanges,
    // Getters
    hasUnsavedChanges,
    currentSession,
    getSessionById,
    getOpenTabsSessions,
    // Actions
    createSession,
    saveSessionData,
    loadSessionData,
    deleteSession,
    renameSession,
    duplicateSession,
    exportSession,
    importSession,
    downloadSession,
    loadFromFile,
    loadSessionsList,
    saveSessionsList,
    markAsUnsaved,
    setCurrentSession,
    openTab,
    closeTab,
    // Update last generation
    updateLastGeneration: (sessionId, imageUrl) => {
      const session = getSessionById(sessionId)
      if (session) {
        session.lastGeneration = imageUrl
        session.modifiedAt = Date.now()
        saveSessionsList()
      }
    },
    // User node templates
    getUserNodeTemplates,
    saveUserNodeTemplate,
    deleteUserNodeTemplate,
    clearUserNodeTemplates,
    // Reactive cache for templates
    userNodeTemplatesCache,
    // User node virtual configs
    userNodeConfigs,
    generateUserNodeType,
    createUserNodeConfig,
    getUserNodeConfig,
    getAllUserNodeConfigs,
    deleteUserNodeConfig,
    restoreUserNodeConfigsFromTemplates
  }
})
