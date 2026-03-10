<template>
  <Panel 
    header="Библиотека нод"
    class="absolute  top-5 left-5 z-50 border border-zinc-800 text-white backdrop-blur-md shadow-2xl rounded-xl overflow-hidden"
    style="width: 350px; max-height: 80vh;"
  >
    <template #icons>
      <span class="text-[10px] text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-700 mr-2">
        {{ filteredNodesCount }}
      </span>
    </template>

    <div class="flex flex-col h-full overflow-hidden" style="height: calc(80vh - 70px);" @wheel.stop>
      <!-- === ПОИСК === -->
      <div class="p-2 border-b border-zinc-800 shrink-0">
        <div class="relative">
          <i class="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск нод..."
            class="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-8 pr-7 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          >
          <Button
            v-if="searchQuery"
            icon="pi pi-times"
            severity="danger"
            text
            size="small"
            class="!absolute right-1 top-1/2 -translate-y-1/2 !p-1 !w-6 !h-6"
            @click="searchQuery = ''"
          />
        </div>
      </div>

      <!-- === БАЗОВЫЕ НОДЫ === -->
      <div class="p-2 border-b border-zinc-800 shrink-0">
        <div class="text-[10px] text-zinc-500 mb-2 px-1">Базовые</div>
        <div class="grid grid-cols-2 gap-2">
          <div 
            v-for="node in baseNodes" 
            :key="node.type"
            class="group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border"
            :class="[
              isNodeHighlighted(node.type) 
                ? 'bg-zinc-800 border-zinc-500 shadow-lg' 
                : 'bg-zinc-900/30 border-transparent hover:bg-zinc-800/60'
            ]"
            :style="isNodeHighlighted(node.type) ? { 
              borderColor: store.activeSource?.color || '#22c55e',
              boxShadow: `0 0 10px ${(store.activeSource?.color || '#22c55e') + '40'}`
            } : {}"
            @click="createNode(node.type)"
          >
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              :style="{ backgroundColor: node.color + '20', color: node.color }"
            >
              <i :class="node.icon"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-zinc-200 truncate">{{ node.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- === СЕКЦИЯ "МОЖНО ПОДКЛЮЧИТЬ" (когда есть activeSource) === -->
      <div v-if="store.activeSource && compatibleNodes.length > 0" class="p-2 border-b border-zinc-800 bg-zinc-800/20 shrink-0 max-h-40 overflow-y-auto">
        <div class="flex items-center gap-2 mb-2">
          <div 
            class="w-2 h-2 rounded-full animate-pulse"
            :style="{ backgroundColor: store.activeSource?.color || '#22c55e' }"
          ></div>
          <span class="text-[10px] font-medium text-zinc-300">Можно подключить к {{ store.activeSource.nodeType }}</span>
        </div>
        <div class="space-y-1 max-h-32 overflow-y-auto">
          <div 
            v-for="node in compatibleNodes" 
            :key="node.type"
            class="group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border border-dashed"
            :class="[
              'bg-zinc-800/40 border-zinc-600 hover:bg-zinc-700/60 animate-pulse-border'
            ]"
            :style="{ 
              borderColor: store.activeSource?.color || '#22c55e',
              boxShadow: `0 0 8px ${(store.activeSource?.color || '#22c55e') + '30'}`
            }"
            @click="createNode(node.type)"
          >
            <div 
              class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              :style="{ backgroundColor: node.color + '20', color: node.color }"
            >
              <i :class="node.icon" class="text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-zinc-200">{{ node.name }}</div>
              <div class="text-[9px] text-zinc-500">{{ node.categoryName }}</div>
            </div>
            <i class="pi pi-plus text-zinc-500 group-hover:text-zinc-300 text-xs"></i>
          </div>
        </div>
      </div>

      <!-- === РЕЗУЛЬТАТЫ ПОИСКА (если есть запрос) === -->
      <div v-else-if="searchQuery" class="flex-1 overflow-y-auto p-2 space-y-1">
        <div v-if="searchResults.length === 0" class="text-center py-4 text-zinc-500 text-sm">
          Ничего не найдено
        </div>
        <div 
          v-for="node in searchResults" 
          :key="node.type"
          class="group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border"
          :class="[
            isNodeHighlighted(node.type) 
              ? 'bg-zinc-800 border-zinc-500 shadow-lg' 
              : 'bg-zinc-900/30 border-transparent hover:bg-zinc-800/60'
          ]"
          :style="isNodeHighlighted(node.type) ? { 
            borderColor: store.activeSource?.color || '#22c55e',
            boxShadow: `0 0 10px ${(store.activeSource?.color || '#22c55e') + '40'}`
          } : {}"
          @click="!node.disabled && createNode(node.type)"
        >
          <div 
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            :style="{ backgroundColor: node.color + '20', color: node.color }"
          >
            <i :class="node.icon || 'pi pi-tag'"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
              {{ node.name }}
            </div>
            <div class="text-[10px] text-zinc-500">{{ node.categoryName }}</div>
          </div>
          <i 
            v-if="!node.disabled" 
            class="pi pi-plus text-zinc-600 group-hover:text-zinc-400 text-xs shrink-0"
          ></i>
          <i v-else class="pi pi-lock text-zinc-600 text-xs shrink-0"></i>
        </div>
      </div>

      <!-- === КАТЕГОРИИ (по умолчанию) === -->
      <div v-else class="flex-1 overflow-y-auto">
        <div class="p-3">
          <div class="text-[10px] text-zinc-500 mb-2 px-1">Категории</div>
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="category in visibleCategories" 
              :key="category.id"
              class="relative group cursor-pointer"
              @click="selectCategory(category.id)"
            >
              <div 
                class="w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200"
                :class="[
                  selectedCategory === category.id 
                    ? 'bg-zinc-700 ring-2 ring-white' 
                    : 'bg-zinc-800/50 hover:bg-zinc-700/50'
                ]"
              >
                <i 
                  :class="category.icon" 
                  class="text-lg"
                  :style="{ color: category.color }"
                ></i>
                <span class="text-[9px] text-zinc-400 text-center leading-tight px-1 truncate w-full">
                  {{ category.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ноды выбранной категории -->
        <div v-if="selectedCategory" class="px-3 pb-3 space-y-1">
          <!-- Заголовок с кнопками -->
          <div class="flex items-center justify-between px-1 py-1 mb-1">
            <span class="text-xs font-medium text-zinc-400">
              {{ getSelectedCategoryName || 'Личные' }} 
            </span>
            <div class="flex items-center gap-1">
              <!-- Кнопка добавления для категории Личные -->
              <Button 
                v-if="selectedCategory === 'userNodes'"
                icon="pi pi-plus"
                severity="secondary"
                text
                size="small"
                class="!p-1 !w-6 !h-6"
                @click="createUserNode"
                v-tooltip.top="'Создать ноду'"
              />
              <Button 
                icon="pi pi-times"
                severity="danger"
                text
                size="small"
                class="!p-1 !w-6 !h-6"
                @click="selectedCategory = null"
              />
            </div>
          </div>

          <!-- Список нод категории -->
          <template v-if="selectedCategory === 'userNodes'">
            <!-- Пустое состояние -->
            <div v-if="userNodeVirtualConfigs.length === 0" class="text-center py-8">
              <div class="text-sm text-zinc-500 mb-3">У вас пока нет персональных нод</div>
              <Button 
                label="Создать"
                size="small"
                class="!bg-zinc-800 !border-zinc-700"
                @click="createUserNode"
              />
            </div>
            <!-- Список виртуальных конфигов -->
            <div 
              v-for="config in userNodeVirtualConfigs" 
              :key="config.type"
              class="group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border"
              :class="[
                isNodeHighlighted(config.type) 
                  ? 'bg-zinc-800 border-zinc-500 shadow-lg' 
                  : 'bg-zinc-900/30 border-transparent hover:bg-zinc-800/60'
              ]"
              :style="isNodeHighlighted(config.type) ? { 
                borderColor: store.activeSource?.color || '#22c55e',
                boxShadow: `0 0 10px ${(store.activeSource?.color || '#22c55e') + '40'}`
              } : {}"
              @click="createNodeFromConfig(config)"
            >
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :style="{ backgroundColor: config.color + '20', color: config.color }"
              >
                <i :class="config.icon || 'pi pi-user-edit'"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
                  {{ config.name }}
                </div>
                <div class="text-[10px] text-zinc-500">{{ config.tags?.length || 0 }} тегов</div>
              </div>
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                text
                size="small"
                class="!p-1 !w-6 !h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                @click="editUserNodeByConfig(config, $event)"
              />
              <i class="pi pi-plus text-zinc-600 group-hover:text-zinc-400 text-xs shrink-0"></i>
            </div>
          </template>

          <!-- Обычные категории -->
          <template v-else>
            <div 
              v-for="config in nodesInSelectedCategory" 
              :key="config.type"
              class="group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border"
              :class="[
                isNodeHighlighted(config.type) 
                  ? 'bg-zinc-800 border-zinc-500 shadow-lg' 
                  : 'bg-zinc-900/30 border-transparent hover:bg-zinc-800/60'
              ]"
              :style="isNodeHighlighted(config.type) ? { 
                borderColor: store.activeSource?.color || '#22c55e',
                boxShadow: `0 0 10px ${(store.activeSource?.color || '#22c55e') + '40'}`
              } : {}"
              @click="!config.disabled && createNode(config.type)"
            >
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :style="{ backgroundColor: config.color + '20', color: config.color }"
              >
                <i :class="config.icon || 'pi pi-tag'"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
                  {{ config.name }}
                </div>
                <div class="text-[10px] text-zinc-500 truncate" v-if="!config.disabled">
                  {{ getSubTypesShort(config) }}
                </div>
                <div class="text-[10px] text-amber-500" v-else>Скоро</div>
              </div>
              <i 
                v-if="!config.disabled" 
                class="pi pi-plus text-zinc-600 group-hover:text-zinc-400 text-xs shrink-0"
              ></i>
              <i v-else class="pi pi-lock text-zinc-600 text-xs shrink-0"></i>
            </div>
          </template>
        </div>
      </div>

      <!-- === НИЖНЯЯ ПАНЕЛЬ === -->
      <div class="p-2 border-t rounded-xl border-zinc-800 space-y-2 shrink-0 bg-zinc-900/30">
        <!-- Тумблер подсказок -->
        <div class="flex items-center justify-between px-2 py-1.5 bg-zinc-800/30 rounded-lg">
          <span class="text-[11px] text-zinc-400">Подсказки</span>
          <CustomToggleSwitch 
            :model-value="store.hintMode"
            @update:model-value="store.toggleHintMode()"
            label="Подсказки"
            active-color="#9ec8ff"
          />
        </div>

        <!-- Действия -->
        <div class="flex gap-1">
          <Button 
            icon="pi pi-refresh"
            severity="secondary"
            text
            size="small"
            class="flex-1 !justify-center"
            @click="resetToDefault"
            v-tooltip.top="'Сбросить'"
          />
        </div>

        <!-- Хоткеи -->
        <div class="text-[10px] text-zinc-500 space-y-1 px-2">
          <div class="flex justify-between"><span>Ctrl+Click</span><span>Мультиселект</span></div>
          <div class="flex justify-between"><span>Drag</span><span>Рамка выделения</span></div>
          <div class="flex justify-between"><span>Ctrl+Z/Y</span><span>Отмена/Повтор</span></div>
          <div class="flex justify-between"><span>Ctrl+C/V</span><span>Копировать/Вставить</span></div>
          <div class="flex justify-between"><span>Delete</span><span>Удалить</span></div>
        </div>
      </div>
    </div>
  </Panel>

  <!-- Редактор пользовательских нод -->
  <UserNodeEditor
    v-model="showUserNodeEditor"
    :edit-node="editingUserNode"
    @save="onSaveUserNodeTemplate"
    @delete="onDeleteUserNodeTemplate"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Panel, Button } from 'primevue'
import { useBoardStore } from '../store/boardStore'
import { useSessionStore } from '../store/sessionStore'
import { nodeCategories, getNodesByCategory, canConnect, getNodeConfig, nodeTypes } from '../data/nodeConfig'
import CustomToggleSwitch from '../components/CustomToggleSwitch.vue'
import UserNodeEditor from './UserNodeEditor.vue'

const store = useBoardStore()
const sessionStore = useSessionStore()
const selectedCategory = ref(null)
const searchQuery = ref('')

// === ПОЛЬЗОВАТЕЛЬСКИЕ НОДЫ ===
const showUserNodeEditor = ref(false)
const editingUserNode = ref(null)

// Получаем шаблоны пользовательских нод для текущей сессии (реактивно)
const userNodeTemplates = computed(() => {
  // Доступ к кэшу для реактивности
  const cache = sessionStore.userNodeTemplatesCache
  const sessionId = store.currentSessionId
  if (!sessionId) return []
  
  // Если в кэше есть данные - используем их
  if (cache[sessionId]) {
    return cache[sessionId]
  }
  
  // Иначе загружаем из store
  return sessionStore.getUserNodeTemplates(sessionId)
})

// Получаем виртуальные конфиги пользовательских нод (реактивно)
const userNodeVirtualConfigs = computed(() => {
  const configs = sessionStore.userNodeConfigs
  const sessionId = store.currentSessionId
  if (!sessionId) return []
  
  return Object.values(configs[sessionId] || {})
})

// Открыть редактор для создания новой ноды
const createUserNode = () => {
  editingUserNode.value = null
  showUserNodeEditor.value = true
}

// Открыть редактор для редактирования
const editUserNode = (node, event) => {
  if (event) event.stopPropagation()
  editingUserNode.value = node
  showUserNodeEditor.value = true
}

// Метод для вызова извне (через ref)
const openEditorForTemplate = (template) => {
  editingUserNode.value = template
  showUserNodeEditor.value = true
}

// Экспортируем метод для родительского компонента
defineExpose({
  openEditorForTemplate
})

// Сохранить шаблон пользовательской ноды
const onSaveUserNodeTemplate = (nodeData) => {
  // Сохраняем шаблон
  sessionStore.saveUserNodeTemplate(store.currentSessionId, nodeData)
  // Обновляем/создаём виртуальный конфиг
  sessionStore.createUserNodeConfig(store.currentSessionId, nodeData)
}

// Удалить шаблон
const onDeleteUserNodeTemplate = (templateId) => {
  sessionStore.deleteUserNodeTemplate(store.currentSessionId, templateId)
  // Удаляем виртуальный конфиг
  const type = sessionStore.generateUserNodeType(templateId)
  sessionStore.deleteUserNodeConfig(store.currentSessionId, type)
}

// Создать ноду на канвасе из шаблона (из панели)
const createNodeFromTemplate = (template) => {
  const canvasCenterX = 3000
  const canvasCenterY = 2000
  const randomOffset = () => (Math.random() - 0.5) * 100
  
  // Создаём виртуальный конфиг из шаблона
  const userConfig = sessionStore.createUserNodeConfig(store.currentSessionId, template)
  if (!userConfig) return null
  
  // Создаём ноду с виртуальным конфигом
  const customData = {
    tags: [], // Выбранные теги - пустые при создании
    description: template.description || ''
  }
  
  // Создаём ноду с кастомным конфигом
  store.createNode(userConfig.type, canvasCenterX + randomOffset(), canvasCenterY + randomOffset(), customData, true, userConfig)
}

// Создать ноду из виртуального конфига (из списка категории)
const createNodeFromConfig = (config) => {
  const canvasCenterX = 3000
  const canvasCenterY = 2000
  const randomOffset = () => (Math.random() - 0.5) * 100
  
  // Находим шаблон для этого конфига
  const template = userNodeTemplates.value.find(t => t.id === config.templateId)
  if (!template) return
  
  // Создаём ноду с существующим конфигом
  const customData = {
    tags: [], // Выбранные теги - пустые при создании
    description: template.description || ''
  }
  
  store.createNode(config.type, canvasCenterX + randomOffset(), canvasCenterY + randomOffset(), customData, true, config)
}

// Редактировать ноду по виртуальному конфигу
const editUserNodeByConfig = (config, event) => {
  if (event) event.stopPropagation()
  
  // Находим шаблон для этого конфига
  const template = userNodeTemplates.value.find(t => t.id === config.templateId)
  if (!template) return
  
  editingUserNode.value = { ...template }
  showUserNodeEditor.value = true
}

// Базовые ноды
const baseNodes = computed(() => [
  { type: 'composer', name: 'Композитор', icon: 'pi pi-objects-column', color: '#93c5fd', categoryName: 'Базовая' },
  { type: 'result', name: 'Результат', icon: 'pi pi-image', color: '#fca5a5', categoryName: 'Базовая' }
])

// Все доступные ноды для поиска
const allNodes = computed(() => {
  const nodes = []
  Object.values(nodeCategories).forEach(cat => {
    if (cat.disabled) return
    getNodesByCategory(cat.id).forEach(node => {
      nodes.push({
        ...node,
        categoryName: cat.name
      })
    })
  })
  return nodes
})

// Результаты поиска
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return allNodes.value.filter(node => 
    node.name.toLowerCase().includes(query) &&
    !node.disabled
  )
})

// Количество найденных нод
const filteredNodesCount = computed(() => {
  if (searchQuery.value) return searchResults.value.length
  return allNodes.value.filter(n => !n.disabled).length
})

// Совместимые ноды (которые можно подключить к activeSource)
const compatibleNodes = computed(() => {
  if (!store.activeSource) return []
  
  const compatible = []
  
  // Базовые ноды
  baseNodes.value.forEach(node => {
    const config = getNodeConfig(node.type)
    if (config?.hasInput && canConnect(store.activeSource.nodeType, node.type, config)) {
      compatible.push(node)
    }
  })
  
  // Ноды из категорий
  Object.values(nodeCategories).forEach(cat => {
    if (cat.disabled) return
    getNodesByCategory(cat.id).forEach(node => {
      if (!node.disabled && node.hasInput && canConnect(store.activeSource.nodeType, node.type, node)) {
        compatible.push({
          ...node,
          categoryName: cat.name
        })
      }
    })
  })
  return compatible
})

// Категории для отображения
const visibleCategories = computed(() => {
  return Object.values(nodeCategories).filter(cat => {
    if (cat.disabled) return false
    const nodes = getNodesByCategory(cat.id)
    return nodes.some(n => !n.disabled)
  })
})

// Выбор категории
const selectCategory = (categoryId) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
}

// Название выбранной категории
const getSelectedCategoryName = computed(() => {
  const cat = nodeCategories[selectedCategory.value?.toUpperCase()]
  return cat?.name || ''
})

// Ноды в выбранной категории
const nodesInSelectedCategory = computed(() => {
  if (!selectedCategory.value) return []
  const cat = nodeCategories[selectedCategory.value?.toUpperCase()]
  return getNodesByCategory(selectedCategory.value).map(n => ({
    ...n,
    categoryName: cat?.name || ''
  }))
})

// Подсветка ноды
const isNodeHighlighted = (nodeType) => {
  if (!store.activeSource || !store.hintMode) return false
  
  const config = getNodeConfig(nodeType)
  if (!config?.hasInput) return false
  
  return canConnect(store.activeSource.nodeType, nodeType, config)
}

// Текст подтипов
const getSubTypesShort = (config) => {
  if (!config.subTypes) return ''
  const types = Object.values(config.subTypes)
  if (types.length === 0) return ''
  if (types.length <= 2) return types.map(t => t.name).join(' • ')
  return `${types[0].name} • ${types[1].name} +${types.length - 2}`
}

// Создание ноды
const createNode = (type) => {
  const canvasCenterX = 3000
  const canvasCenterY = 2000
  const randomOffset = () => (Math.random() - 0.5) * 100
  
  store.createNode(type, canvasCenterX + randomOffset(), canvasCenterY + randomOffset())
}

const confirmClear = () => {
  if (confirm('Удалить все ноды и соединения?')) {
    store.clearAll()
  }
}

const resetToDefault = () => {
  if (confirm('Сбросить к дефолтному графу?')) {
    store.clearAll()
    store.loadDefault()
  }
}

</script>

<style scoped>
@keyframes pulse-border {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-border {
  animation: pulse-border 1.5s ease-in-out infinite;
}

/* Скрываем скроллбар */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 2px;
}
</style>
