<template>
  <!-- ОБЫЧНАЯ НОДА С ТЕГАМИ -->
  <div 
    v-if="!isComposer && !isResult"
    ref="nodeRef"
    class="relative w-[320px] backdrop-blur-md transition-all flex flex-col group"
    :class="[
      isSelected ? 'ring-2 ring-white' : '',
      isSource ? 'animate-pulse' : ''
    ]"
    :style="{ 
      zIndex: zIndex || 1,
      backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
      border: `2px solid ${isSelected ? nodeColor : nodeColor + '99'}`,
      borderRadius: '1rem',
      boxShadow: isSource ? `${nodeColor} 0 0 20px` : 'none'
    }"
    :data-id="nodeId"
  >
    <!-- Название ноды - сверху справа -->
    <div 
      class="absolute -top-3 right-4 px-2 py-0.5 text-xs font-medium rounded-full z-10"
      :style="{ backgroundColor: nodeColor, color: '#000' }"
    >
      {{ title }}
    </div>
    
    <!-- Выбранные теги -->
    <div class="px-4 pt-5 pb-2 flex flex-wrap gap-2 min-h-[50px]">
      <div 
        v-for="tag in selectedTags" 
        :key="tag.id"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-black cursor-pointer hover:opacity-80 transition bg-white"
        @click="removeTag(tag)"
      >
        {{ tag.name }}
        <i class="pi pi-times text-xs"></i>
      </div>
      
      <span v-if="selectedTags.length === 0" class="text-zinc-500 text-sm py-1.5">
        Выберите теги...
      </span>
    </div>
    
    <!-- Разделитель -->
    <div class="h-px bg-zinc-600 mx-4 my-2 shrink-0"></div>
    
    <!-- Доступные теги -->
    <div class="px-4 flex flex-wrap gap-2">
      <div 
        v-for="tag in visibleAvailableTags" 
        :key="tag.id"
        class="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm cursor-pointer transition hover:opacity-80 text-white"
        style="background-color: #838383;"
        @click="addTag(tag)"
      >
        {{ tag.name }}
        <i class="pi pi-plus text-xs"></i>
      </div>
    </div>
    
    <!-- Кнопка + ещё -->
    <div class="px-4 py-2">
      <Button 
        :label="remainingSlots > 0 ? `+ ещё ${remainingCount} (${localTags.length}/${maxTags})` : `Лимит: ${maxTags}`"
        text
        size="small"
        class="w-full !text-zinc-500 !justify-center hover:!text-zinc-300"
        :disabled="remainingSlots <= 0"
        @click="showTagModal = true"
      />
    </div>
    
    <!-- Дополнительное описание -->
    <div class="px-4 pb-4">
      <textarea
        v-model="localDescription"
        placeholder="дополнительно"
        class="w-full h-20 bg-black/80 rounded-xl p-3 text-sm text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-500"
        :style="{ border: `1px solid ${nodeColor}40` }"
        @pointerdown.stop
        @focus="onInputFocus"
        @blur="onInputBlur"
      ></textarea>
    </div>

    <!-- Output порт (ромб в правом верхнем углу) -->
    <div 
      v-if="hasOutput"
      class="absolute -right-3 -top-3 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :style="{ 
        backgroundColor: hasOutputConnection ? nodeColor : '#18181b',
        border: `2px solid ${nodeColor}`,
        opacity: '1'
      }"
      :data-port="'output'"
      data-idx="0"
      :data-type="outputType"
      @pointerdown.stop="onOutputPointerDown"
      @click.stop="onOutputClick"
    >
      <!-- Активный: маленький ромбик внутри -->
      <div 
        v-if="isSource"
        class="w-2 h-2 -rotate-45"
        :style="{ backgroundColor: nodeColor }"
      ></div>
    </div>

    <!-- Input порт (ромб в левом верхнем углу) -->
    <div 
      v-if="hasInput"
      class="absolute -left-3 -top-3 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :class="{ 'input-pulse': isInputCompatible }"
      :style="{ 
        backgroundColor: hasInputConnection ? nodeColor : '#18181b',
        border: `2px solid ${isInputCompatible ? pulseColor : nodeColor}`,
        opacity: '1',
        boxShadow: isInputCompatible ? `0 0 15px ${pulseColor}, 0 0 30px ${pulseColor}80` : 'none'
      }"
      :data-port="'input'"
      data-idx="0"
      :data-type="inputType"
      @click.stop="onInputClick"
    >
    </div>

    <!-- Модал всех тегов -->
    <Dialog 
      v-model:visible="showTagModal" 
      :header="title"
      modal
      :style="{ width: '360px' }"
      :pt="{
        root: { class: '!bg-zinc-900/95 !border-zinc-700 !backdrop-blur-md' },
        header: { class: '!bg-zinc-800/80 !border-zinc-700 !p-4' },
        content: { class: '!bg-transparent !p-4' }
      }"
    >
      <div class="mb-4">
        <InputText 
          v-model="searchQuery"
          placeholder="Поиск тегов..."
          class="w-full !bg-zinc-800 !border-zinc-700 !text-white"
          :pt="{ root: { class: '!rounded-lg' } }"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </div>

      <div v-if="selectedInModal.length > 0" class="mb-4">
        <div class="text-xs text-zinc-500 mb-2">Выбрано:</div>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="tag in selectedInModal" 
            :key="tag.id"
            class="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-black cursor-pointer bg-white"
            @click="toggleTagInModal(tag)"
          >
            {{ tag.name }}
            <i class="pi pi-check text-xs"></i>
          </div>
        </div>
      </div>

      <div v-if="remainingSlots <= 0" class="text-zinc-500 text-center py-4">
        Достигнут лимит тегов ({{ maxTags }})
      </div>
      <div v-else class="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
        <div 
          v-for="tag in filteredAvailableTags" 
          :key="tag.id"
          class="px-3 py-2 rounded-lg text-sm cursor-pointer transition hover:opacity-80 text-white"
          style="background-color: #838383;"
          @click="toggleTagInModal(tag)"
        >
          {{ tag.name }}
        </div>
      </div>

      <template #footer>
        <Button 
          label="Готово" 
          @click="showTagModal = false; searchQuery = ''"
          :style="{ backgroundColor: nodeColor, borderColor: nodeColor, color: '#000' }"
        />
      </template>
    </Dialog>
  </div>

  <!-- КОМПОЗИТОР -->
  <div 
    v-else-if="isComposer"
    ref="nodeRef"
    class="relative w-[340px] backdrop-blur-md transition-all flex flex-col group"
    :class="[
      isSelected ? 'ring-2 ring-white' : '',
      isSource ? 'animate-pulse' : ''
    ]"
    :style="{ 
      zIndex: zIndex || 1,
      backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
      border: `2px solid ${isSelected ? nodeColor : nodeColor + '99'}`,
      borderRadius: '1rem',
      boxShadow: isSource ? `${nodeColor} 0 0 20px` : 'none'
    }"
    :data-id="nodeId"
  >
    <!-- Название ноды - сверху справа -->
    <div 
      class="absolute -top-3 right-4 px-2 py-0.5 text-xs font-medium rounded-full z-10"
      :style="{ backgroundColor: nodeColor, color: '#000' }"
    >
      {{ title }}
    </div>
    
    <!-- Input порт (ромб в левом верхнем углу) -->
    <div 
      v-if="hasInput"
      class="absolute -left-3 -top-3 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :class="{ 'input-pulse': isInputCompatible }"
      :style="{ 
        backgroundColor: hasInputConnection ? nodeColor : '#18181b',
        border: `2px solid ${isInputCompatible ? pulseColor : nodeColor}`,
        opacity: '1',
        boxShadow: isInputCompatible ? `0 0 15px ${pulseColor}, 0 0 30px ${pulseColor}80` : 'none'
      }"
      :data-port="'input'"
      data-idx="0"
      :data-type="inputType"
      @click.stop="onInputClick"
    >
    </div>

    <!-- Источники (свитчи подключённых нод) -->
    <div class="px-4 pt-5 pb-2">
      <div class="text-xs text-zinc-500 mb-2 uppercase tracking-wider">источники</div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="source in connectedSources" 
          :key="source.nodeId"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-black"
          :style="{ backgroundColor: source.color }"
        >
          {{ source.name }}
          <ToggleSwitch 
            v-model="source.enabled"
            @change="onSourceToggle"
            class="custom-switch"
            :pt="{
              root: { 
                class: 'w-10 h-5 rounded-lg border-0',
                style: { backgroundColor: 'rgba(0,0,0,0.3)' }
              },
              slider: { 
                class: 'rounded-md shadow-none',
                style: { 
                  backgroundColor: source.enabled ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  borderRadius: '4px',
                  width: '14px',
                  height: '14px',
                  margin: '3px'
                }
              }
            }"
          />
        </div>
        
        <span v-if="connectedSources.length === 0" class="text-zinc-500 text-sm py-1">
          Подключите ноды...
        </span>
      </div>
    </div>
    
    <!-- Разрешение -->
    <div class="px-4 py-2">
      <div class="text-xs text-zinc-500 mb-2 uppercase tracking-wider">разрешение</div>
      <div class="flex items-center gap-3">
        <div class="flex-1 flex items-center gap-2 bg-black/60 rounded-lg px-3 py-2">
          <i class="pi pi-arrow-up-down text-zinc-500 text-xs"></i>
          <input 
            v-model.number="localResolution.height"
            type="number"
            class="w-full bg-transparent text-white text-sm text-center focus:outline-none"
            placeholder="1080"
            @pointerdown.stop
          >
        </div>
        <span class="text-zinc-500 font-medium">×</span>
        <div class="flex-1 flex items-center gap-2 bg-black/60 rounded-lg px-3 py-2">
          <i class="pi pi-arrow-left-right text-zinc-500 text-xs"></i>
          <input 
            v-model.number="localResolution.width"
            type="number"
            class="w-full bg-transparent text-white text-sm text-center focus:outline-none"
            placeholder="1920"
            @pointerdown.stop
          >
        </div>
      </div>
    </div>
    
    <!-- Мастер промпт -->
    <div class="px-4 pb-4">
      <div class="text-xs text-zinc-500 mb-2 uppercase tracking-wider">мастер промпт</div>
      <textarea
        v-model="localMasterPrompt"
        placeholder="дополнительные инструкции..."
        class="w-full h-24 bg-black/80 rounded-xl p-3 text-sm text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-500"
        :style="{ border: `1px solid ${nodeColor}40` }"
        @pointerdown.stop
        @focus="onInputFocus"
        @blur="onInputBlur"
      ></textarea>
    </div>

    <!-- Output порт (ромб в правом верхнем углу) -->
    <div 
      v-if="hasOutput"
      class="absolute -right-3 -top-3 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :style="{ 
        backgroundColor: hasOutputConnection ? nodeColor : '#18181b',
        border: `2px solid ${nodeColor}`,
        opacity: '1'
      }"
      :data-port="'output'"
      data-idx="0"
      :data-type="outputType"
      @click.stop="onOutputClick"
    >
      <!-- Активный: маленький ромбик внутри -->
      <div 
        v-if="isSource"
        class="w-2 h-2 -rotate-45"
        :style="{ backgroundColor: nodeColor, opacity: '1' }"
      ></div>
    </div>
  </div>

  <!-- RESULT НОДА -->
  <div 
    v-else-if="isResult"
    ref="nodeRef"
    class="relative w-[380px] backdrop-blur-md transition-all flex flex-col group"
    :class="[
      isSelected ? 'ring-2 ring-white' : '',
      isSource ? 'animate-pulse' : ''
    ]"
    :style="{ 
      zIndex: zIndex || 1,
      backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
      border: `2px solid ${isSelected ? nodeColor : nodeColor + '99'}`,
      borderRadius: '1rem',
      boxShadow: isSource ? `${nodeColor} 0 0 20px` : 'none'
    }"
    :data-id="nodeId"
  >
    <!-- Название ноды - сверху справа -->
    <div 
      class="absolute -top-3 right-4 px-2 py-0.5 text-xs font-medium rounded-full z-10"
      :style="{ backgroundColor: nodeColor, color: '#000' }"
    >
      {{ title }}
    </div>
    
    <!-- Input порт (ромб в левом верхнем углу) -->
    <div 
      v-if="hasInput"
      ref="inputPortRef"
      class="absolute -left-3 -top-3 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :class="{ 'input-pulse': isInputCompatible }"
      :style="{ 
        backgroundColor: hasInputConnection ? nodeColor : '#18181b',
        border: `2px solid ${isInputCompatible ? pulseColor : nodeColor}`,
        opacity: '1',
        boxShadow: isInputCompatible ? `0 0 15px ${pulseColor}, 0 0 30px ${pulseColor}80` : 'none'
      }"
      :data-port="'input'"
      data-idx="0"
      :data-type="inputType"
      @click.stop="onInputClick"
    >
    </div>

    <!-- Промпт предпросмотр -->
    <div class="px-4 pt-5 pb-4">
      <div class="flex items-center justify-between mb-2">
        <div class="text-xs text-zinc-500 uppercase tracking-wider">итоговый промпт</div>
        
        <!-- Свитч режима -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-zinc-500">{{ isJsonMode ? 'JSON' : 'Текст' }}</span>
          <ToggleSwitch 
            v-model="isJsonMode"
            class="custom-switch"
            :pt="{
              root: { 
                class: 'w-8 h-4 rounded-lg border-0',
                style: { backgroundColor: 'rgba(0,0,0,0.3)' }
              },
              slider: { 
                class: 'rounded-md shadow-none',
                style: { 
                  backgroundColor: isJsonMode ? nodeColor : 'rgba(255,255,255,0.5)',
                  borderRadius: '3px',
                  width: '10px',
                  height: '10px',
                  margin: '3px'
                }
              }
            }"
          />
        </div>
      </div>
      
      <div v-if="!hasInputConnection" class="text-zinc-500 text-sm py-8 text-center">
        Подключите композитор...
      </div>
      
      <div v-else-if="!displayPrompt" class="text-zinc-500 text-sm py-8 text-center">
        Нет данных от композитора
      </div>
      
      <div v-else>
        <textarea
          :value="displayPrompt"
          readonly
          class="w-full h-32 bg-black/60 rounded-xl p-3 text-sm text-zinc-200 resize-none focus:outline-none font-mono"
          :style="{ border: `1px solid ${nodeColor}40` }"
          @pointerdown.stop
        ></textarea>
        
        <!-- Инфо о разрешении -->
        <div v-if="connectedComposerResolution" class="mt-3 flex items-center gap-2 text-xs text-zinc-400">
          <i class="pi pi-image"></i>
          <span>{{ connectedComposerResolution.width }} × {{ connectedComposerResolution.height }}</span>
        </div>
        
        <!-- Кнопка копировать -->
        <Button 
          :label="isJsonMode ? 'Копировать JSON' : 'Копировать промпт'"
          icon="pi pi-copy"
          size="small"
          class="w-full mt-3"
          :style="{ backgroundColor: nodeColor, borderColor: nodeColor, color: '#000' }"
          @click="copyPrompt"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import ToggleSwitch from 'primevue/toggleswitch'
import { useBoardStore } from '../store/boardStore.js'
import { canConnect } from '../data/nodeConfig.js'
import { useMotion } from '@vueuse/motion'

const props = defineProps({
  // Общие пропсы
  nodeId: Number,
  nodeType: String,
  title: String,
  nodeColor: { type: String, default: '#6ee7b7' },
  isSelected: { type: Boolean, default: false },
  isSource: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1 },
  hasInputConnection: { type: Boolean, default: false },
  hasOutputConnection: { type: Boolean, default: false },
  
  // Тип ноды
  isComposer: { type: Boolean, default: false },
  isResult: { type: Boolean, default: false },
  
  // Для обычной ноды
  tags: { type: Array, default: () => [] },
  maxTags: { type: Number, default: 5 },
  hasDescription: { type: Boolean, default: true },
  
  // Для композитора
  connectedNodes: { type: Array, default: () => [] },
  
  // Для результата
  composerData: { type: Object, default: null },
  
  // Порты
  hasInput: { type: Boolean, default: false },
  hasOutput: { type: Boolean, default: true },
  inputType: { type: String, default: 'prompt' },
  outputType: { type: String, default: 'prompt' },
  acceptsFrom: { type: Array, default: null },
  acceptAnyInput: { type: Boolean, default: false },
  
  // v-model
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
  'update:modelValue',
  'portClick',
  'portMouseDown',
  'deleteInputConnections',
  'deleteOutputConnections',
  'focusChange'
])

// === HINTS SYSTEM ===
const store = useBoardStore()

// Проверяем, может ли инпут этой ноды принять соединение от активного source
const isInputCompatible = computed(() => {
  if (!store.hintMode || !store.activeSource || !props.hasInput) return false
  if (props.nodeId === store.activeSource.nodeId) return false // Нельзя подключить саму к себе
  if (props.hasInputConnection && !props.isComposer) return false // Уже подключен (кроме композитора)
  
  const toConfig = {
    hasInput: props.hasInput,
    isComposer: props.isComposer,
    acceptsFrom: props.acceptsFrom,
    acceptAnyInput: props.acceptAnyInput
  }
  
  return canConnect(store.activeSource.nodeType, props.nodeType, toConfig)
})

// Цвет для пульсации
const pulseColor = computed(() => store.activeSource?.color || props.nodeColor)

// === MOTION для анимации портов ===
const inputPortRef = ref(null)
const { variant } = useMotion(inputPortRef, {
  initial: { scale: 1, opacity: 1 },
  pulse: { 
    scale: 1.3, 
    opacity: 0.8,
    transition: {
      duration: 500,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut'
    }
  }
})

// Запускаем/останавливаем анимацию
watch(isInputCompatible, (compatible) => {
  if (compatible) {
    variant.value = 'pulse'
  } else {
    variant.value = 'initial'
  }
}, { immediate: true })

// === ОБЫЧНАЯ НОДА ===
const localTags = ref(props.modelValue.tags || [])
const localDescription = ref(props.modelValue.description || '')
const showTagModal = ref(false)
const searchQuery = ref('')

// === КОМПОЗИТОР ===
const localEnabledSources = ref(props.modelValue.enabledSources || {})
const localResolution = ref(props.modelValue.resolution || { width: 1920, height: 1080 })
const localMasterPrompt = ref(props.modelValue.masterPrompt || '')

// === RESULT ===
const isJsonMode = ref(props.modelValue.jsonMode || false)

// === REFS для нод и портов ===
const nodeRef = ref(null)
const outputPortRef = ref(null)
// inputPortRef объявлен выше для useMotion

// === Методы для получения позиций портов ===
const getOutputPortPosition = () => {
  const portEl = outputPortRef.value
  if (!portEl) return null
  
  const rect = portEl.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

const getInputPortPosition = () => {
  const portEl = inputPortRef.value
  if (!portEl) return null
  
  const rect = portEl.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

const connectedComposerPrompt = computed(() => {
  return props.composerData?.prompt || ''
})

const connectedComposerResolution = computed(() => {
  return props.composerData?.resolution || null
})

const displayPrompt = computed(() => {
  if (!props.composerData) return ''
  
  if (isJsonMode.value) {
    // Выводим структуру как есть
    return JSON.stringify(props.composerData.structuredPrompts || {}, null, 2)
  }
  
  return connectedComposerPrompt.value
})

watch(isJsonMode, (val) => {
  emit('update:modelValue', { ...props.modelValue, jsonMode: val })
})

const copyPrompt = () => {
  const textToCopy = displayPrompt.value
  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy)
  }
}

// Синхронизация
watch(() => props.modelValue, (newVal) => {
  if (props.isResult) {
    isJsonMode.value = newVal.jsonMode || false
  } else if (!props.isComposer) {
    localTags.value = newVal.tags || []
    localDescription.value = newVal.description || ''
  } else {
    localEnabledSources.value = newVal.enabledSources || {}
    localResolution.value = newVal.resolution || { width: 1920, height: 1080 }
    localMasterPrompt.value = newVal.masterPrompt || ''
  }
}, { deep: true })

watch([localTags, localDescription], () => {
  if (!props.isComposer) {
    emit('update:modelValue', { tags: localTags.value, description: localDescription.value })
  }
}, { deep: true })

watch([localEnabledSources, localResolution, localMasterPrompt], () => {
  if (props.isComposer) {
    emit('update:modelValue', {
      enabledSources: localEnabledSources.value,
      resolution: localResolution.value,
      masterPrompt: localMasterPrompt.value
    })
  }
}, { deep: true })

// === ОБЫЧНАЯ НОДА: вычисляемые ===
const selectedTags = computed(() => localTags.value)

const availableTags = computed(() => {
  const selectedIds = new Set(localTags.value.map(t => t.id))
  return props.tags.filter(t => !selectedIds.has(t.id))
})

const visibleAvailableTags = computed(() => availableTags.value.slice(0, 4))

const remainingCount = computed(() => availableTags.value.length)
const remainingSlots = computed(() => props.maxTags - localTags.value.length)

const selectedInModal = computed(() => localTags.value)

const filteredAvailableTags = computed(() => {
  const selectedIds = new Set(localTags.value.map(t => t.id))
  const query = searchQuery.value.toLowerCase()
  return props.tags.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(query)
    const notSelected = !selectedIds.has(t.id)
    return matchesSearch && notSelected
  })
})

// === КОМПОЗИТОР: вычисляемые ===
const connectedSources = computed(() => {
  return props.connectedNodes.map(node => ({
    ...node,
    enabled: localEnabledSources.value[node.nodeId] !== false
  }))
})

// === МЕТОДЫ ===
const canAddMore = () => localTags.value.length < props.maxTags

const addTag = (tag) => {
  if (!localTags.value.find(t => t.id === tag.id) && canAddMore()) {
    localTags.value.push(tag)
  }
}

const removeTag = (tag) => {
  localTags.value = localTags.value.filter(t => t.id !== tag.id)
}

const toggleTagInModal = (tag) => {
  const exists = localTags.value.find(t => t.id === tag.id)
  if (exists) {
    removeTag(tag)
  } else if (canAddMore()) {
    addTag(tag)
  }
}

const onSourceToggle = () => {
  const newEnabled = {}
  connectedSources.value.forEach(source => {
    newEnabled[source.nodeId] = source.enabled
  })
  localEnabledSources.value = newEnabled
}

const onInputFocus = () => emit('focusChange', true)
const onInputBlur = () => emit('focusChange', false)

// === ПОРТЫ ===
const onInputPointerDown = (e) => emit('portMouseDown', e, 'input', 0, props.inputType, props.nodeId)
const onInputClick = (e) => {
  // Ctrl+Click на input - удалить все связи к этому input
  if (e.ctrlKey || e.metaKey && props.hasInputConnection) {
    e.stopPropagation()
    e.preventDefault()
    emit('deleteInputConnections', props.nodeId, 0)
    return
  }
  emit('portClick', e, 'input', 0, props.inputType, props.nodeId)
}
const onOutputPointerDown = (e) => emit('portMouseDown', e, 'output', 0, props.outputType, props.nodeId)
const onOutputClick = (e) => {
  // Ctrl+Click на output - удалить все связи этого output
  if (e.ctrlKey || e.metaKey) {
    e.stopPropagation()
    e.preventDefault()
    emit('deleteOutputConnections', props.nodeId, 0)
    return
  }
  emit('portClick', e, 'output', 0, props.outputType, props.nodeId)
}

// === ГЕНЕРАЦИЯ ПРОМПТА ===
const generatePrompt = () => {
  if (props.isComposer) {
    const enabledPrompts = connectedSources.value
      .filter(s => s.enabled)
      .map(s => s.prompt)
      .filter(Boolean)
    const master = localMasterPrompt.value.trim()
    return {
      prompt: [...enabledPrompts, master].filter(Boolean).join(', '),
      resolution: localResolution.value
    }
  } else {
    const tagPrompts = localTags.value.map(t => t.prompt).join(', ')
    const desc = localDescription.value.trim()
    return [tagPrompts, desc].filter(Boolean).join(', ')
  }
}

defineExpose({ 
  generatePrompt, 
  getOutputPortPosition, 
  getInputPortPosition 
})
</script>

<style scoped>
[data-id]:hover {
  opacity: 0.85 !important;
}

/* Кастомный свитч - трек темнее, тумблер белый прямоугольный */
:deep(.custom-switch) {
  background-color: rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
  width: 40px !important;
  height: 20px !important;
  border: none !important;
}

:deep(.custom-switch .p-toggleswitch-slider) {
  background-color: rgba(255, 255, 255, 0.6) !important;
  border-radius: 4px !important;
  width: 14px !important;
  height: 14px !important;
  top: 3px !important;
  left: 3px !important;
  box-shadow: none !important;
}

:deep(.custom-switch.p-toggleswitch-checked .p-toggleswitch-slider) {
  background-color: #ffffff !important;
  transform: translateX(20px) !important;
}

/* Скрываем стандартный handle (черный круглый) */
:deep(.custom-switch .p-toggleswitch-handle) {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #52525b;
  border-radius: 3px;
}

/* Анимация пульсации для подсказок */
@keyframes input-pulse {
  0%, 100% {
    transform: rotate(45deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) scale(1.3);
    opacity: 0.8;
  }
}

.input-pulse {
  animation: input-pulse 1s ease-in-out infinite !important;
  z-index: 100 !important;
}
</style>
