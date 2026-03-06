<template>
  <!-- ОБЫЧНАЯ НОДА С ТЕГАМИ -->
  <div 
    v-if="!isComposer"
    ref="nodeRef"
    class="relative w-[320px] backdrop-blur-md transition-all flex flex-col"
    :class="[
      isSelected ? 'ring-2 ring-white' : '',
      isSource ? 'animate-pulse' : ''
    ]"
    :style="{ 
      zIndex: zIndex || 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      border: `2px solid ${nodeColor}`,
      borderRadius: '1rem 1rem 0 1rem',
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

    <!-- Output порт (ромб) -->
    <div 
      v-if="hasOutput"
      class="absolute -right-3 -bottom-3 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :class="{ 'animate-pulse': isSource }"
      :style="{ 
        backgroundColor: hasOutputConnection ? '#eab308' : nodeColor,
        border: '2px solid #18181b'
      }"
      :data-port="'output'"
      data-idx="0"
      :data-type="outputType"
      @pointerdown.stop="onOutputPointerDown"
      @click.stop="onOutputClick"
    >
      <div class="w-2 h-2 bg-white rounded-full -rotate-45"></div>
    </div>

    <!-- Input порт (круг) -->
    <div 
      v-if="hasInput"
      class="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full cursor-pointer transition flex items-center justify-center border-2 border-zinc-900"
      :class="[hasInputConnection ? 'bg-yellow-500 hover:bg-red-500' : 'bg-green-500 hover:scale-110']"
      :data-port="'input'"
      data-idx="0"
      :data-type="inputType"
      @click.stop="onInputClick"
      @mouseenter="hoveredInput = true"
      @mouseleave="hoveredInput = false"
    >
      <span v-if="hasInputConnection && hoveredInput" class="text-white text-xs font-bold">−</span>
      <div v-else class="w-2 h-2 bg-white rounded-full"></div>
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
    v-else
    ref="nodeRef"
    class="relative w-[340px] backdrop-blur-md transition-all flex flex-col"
    :class="[
      isSelected ? 'ring-2 ring-white' : '',
      isSource ? 'animate-pulse' : ''
    ]"
    :style="{ 
      zIndex: zIndex || 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      border: `2px solid ${nodeColor}`,
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
    
    <!-- Input порт (ромб слева) -->
    <div 
      v-if="hasInput"
      class="absolute -left-3 top-8 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :style="{ 
        backgroundColor: hasInputConnection ? '#eab308' : nodeColor,
        border: '2px solid #18181b'
      }"
      :data-port="'input'"
      data-idx="0"
      :data-type="inputType"
      @pointerdown.stop="onInputPointerDown"
      @click.stop="onInputClick"
    >
      <div class="w-2 h-2 bg-white rounded-full -rotate-45"></div>
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

    <!-- Output порт (ромб справа снизу) -->
    <div 
      v-if="hasOutput"
      class="absolute -right-3 -bottom-3 w-6 h-6 rotate-45 cursor-crosshair transition flex items-center justify-center"
      :class="{ 'animate-pulse': isSource }"
      :style="{ 
        backgroundColor: hasOutputConnection ? '#eab308' : nodeColor,
        border: '2px solid #18181b'
      }"
      :data-port="'output'"
      data-idx="0"
      :data-type="outputType"
      @pointerdown.stop="onOutputPointerDown"
      @click.stop="onOutputClick"
    >
      <div class="w-2 h-2 bg-white rounded-full -rotate-45"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import ToggleSwitch from 'primevue/toggleswitch'

const props = defineProps({
  // Общие пропсы
  nodeId: Number,
  title: String,
  nodeColor: { type: String, default: '#6ee7b7' },
  isSelected: { type: Boolean, default: false },
  isSource: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1 },
  hasInputConnection: { type: Boolean, default: false },
  hasOutputConnection: { type: Boolean, default: false },
  
  // Тип ноды
  isComposer: { type: Boolean, default: false },
  
  // Для обычной ноды
  tags: { type: Array, default: () => [] },
  maxTags: { type: Number, default: 5 },
  hasDescription: { type: Boolean, default: true },
  
  // Для композитора
  connectedNodes: { type: Array, default: () => [] },
  
  // Порты
  hasInput: { type: Boolean, default: false },
  hasOutput: { type: Boolean, default: true },
  inputType: { type: String, default: 'prompt' },
  outputType: { type: String, default: 'prompt' },
  
  // v-model
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
  'update:modelValue',
  'portClick',
  'portMouseDown',
  'deleteInputConnection',
  'focusChange'
])

// === ОБЫЧНАЯ НОДА ===
const localTags = ref(props.modelValue.tags || [])
const localDescription = ref(props.modelValue.description || '')
const showTagModal = ref(false)
const searchQuery = ref('')
const hoveredInput = ref(false)

// === КОМПОЗИТОР ===
const localEnabledSources = ref(props.modelValue.enabledSources || {})
const localResolution = ref(props.modelValue.resolution || { width: 1920, height: 1080 })
const localMasterPrompt = ref(props.modelValue.masterPrompt || '')

// Синхронизация
watch(() => props.modelValue, (newVal) => {
  if (!props.isComposer) {
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
  if (props.hasInputConnection && hoveredInput.value) {
    emit('deleteInputConnection', props.nodeId, 0)
  } else {
    emit('portClick', e, 'input', 0, props.inputType, props.nodeId)
  }
}
const onOutputPointerDown = (e) => emit('portMouseDown', e, 'output', 0, props.outputType, props.nodeId)
const onOutputClick = (e) => {
  if (e.ctrlKey || e.metaKey) return
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

defineExpose({ generatePrompt })
</script>

<style scoped>
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
</style>
