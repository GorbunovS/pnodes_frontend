<template>
  <Dialog
    v-model:visible="visible"
    :header="isEdit ? 'Редактировать ноду' : 'Создать ноду'"
    modal
    :style="{ width: '420px' }"
    :pt="{
      root: { class: '!bg-zinc-900/95 !border-zinc-700 !backdrop-blur-md', style: 'font-family: Inter, system-ui, sans-serif;' },
      header: { class: '!bg-zinc-800/80 !border-zinc-700 !p-4' },
      content: { class: '!bg-transparent !p-4' }
    }"
    @hide="onHide"
  >
    <div class="space-y-4">
      <!-- Название ноды -->
      <div>
        <label class="text-xs text-zinc-500 mb-1.5 block">Название ноды</label>
        <InputText
          v-model="nodeName"
          placeholder="визуальные эффекты"
          class="w-full !bg-black !border-zinc-700 !text-white"
          :pt="{ root: { class: '!rounded-xl' } }"
        />
      </div>

      <!-- Тип для JSON (для нейронки) -->
      <div>
        <label class="text-xs text-zinc-500 mb-1.5 block">
          Тип для JSON 
          <span class="text-zinc-600 text-[10px]">(латиницей, без пробелов)</span>
        </label>
        <InputText
          v-model="jsonType"
          placeholder="visual_effects"
          class="w-full !bg-black !border-zinc-700 !text-white"
          :pt="{ root: { class: '!rounded-xl' } }"
          @input="jsonType = jsonType.toLowerCase().replace(/[^a-z0-9_]/g, '_')"
        />
        <div class="text-[10px] text-zinc-600 mt-1">
          Будет использовано в промпте: { "{{ jsonType || 'custom' }}": { "value": "..." } }
        </div>
      </div>

      <!-- Макс. вариантов -->
      <div>
        <label class="text-xs text-zinc-500 mb-1.5 block">Макс. вариантов</label>
        <InputNumber
          v-model="maxVariants"
          :min="1"
          :max="10"
          class="w-24"
          :pt="{
            root: { class: '!bg-black !border-zinc-700 !rounded-xl' },
            input: { class: '!text-white !text-center' }
          }"
        />
      </div>

      <!-- Тэг-промпты -->
      <div>
        <label class="text-xs text-zinc-500 mb-1.5 block">Добавьте тэг-промпты</label>
        
        <!-- Список существующих тегов -->
        <div v-if="tags.length > 0" class="space-y-2 mb-3">
          <div
            v-for="(tag, index) in tags"
            :key="index"
            class="bg-black rounded-xl p-3 space-y-2"
          >
            <div class="flex items-center gap-2">
              <InputText
                v-model="tag.name"
                placeholder="название"
                class="flex-1 !bg-zinc-900 !border-zinc-700 !text-white !text-sm"
                :pt="{ root: { class: '!rounded-lg' } }"
              />
              <Button
                icon="pi pi-minus"
                severity="danger"
                text
                size="small"
                class="!w-8 !h-8"
                @click="removeTag(index)"
              />
            </div>
            <InputText
              v-model="tag.prompt"
              placeholder="Промпт"
              class="w-full !bg-zinc-900 !border-zinc-700 !text-zinc-400 !text-sm"
              :pt="{ root: { class: '!rounded-lg' } }"
            />
          </div>
        </div>

        <!-- Кнопка добавления тега -->
        <Button
          label="Добавить тег"
          icon="pi pi-plus"
          text
          class="w-full !justify-center !text-zinc-400 hover:!text-white"
          @click="addTag"
        />
      </div>

      <!-- Выбор цвета -->
      <div>
        <label class="text-xs text-zinc-500 mb-1.5 block">Цвет</label>
        <div class="flex items-center gap-3">
          <input
            v-model="nodeColor"
            type="color"
            class="w-12 h-8 rounded-lg cursor-pointer bg-transparent border-0"
          >
          <span class="text-sm text-zinc-300">{{ nodeColor }}</span>
        </div>
      </div>

      <!-- Дополнительное описание (для самой ноды) -->
      <div>
        <label class="text-xs text-zinc-500 mb-1.5 block">Описание (опционально)</label>
        <Textarea
          v-model="nodeDescription"
          placeholder="дополнительно"
          :rows="3"
          class="w-full"
          :pt="{
            root: { 
              class: 'w-full bg-black rounded-xl p-3 text-sm text-zinc-300 placeholder-zinc-600 resize-none border-0 focus:ring-1 focus:ring-zinc-500',
              style: { border: `1px solid ${nodeColor}40` }
            }
          }"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <Button
          v-if="isEdit"
          label="Удалить"
          severity="danger"
          text
          class="mr-auto"
          @click="onDelete"
        />
        <Button
          label="Отмена"
          severity="secondary"
          text
          @click="visible = false"
        />
        <Button
          label="Сохранить"
          :disabled="!canSave"
          :style="{ backgroundColor: nodeColor, borderColor: nodeColor, color: '#000' }"
          @click="onSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editNode: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'delete'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.editNode)

// Данные формы
const nodeName = ref('')
const jsonType = ref('') // Тип для JSON (для нейронки)
const maxVariants = ref(3)
const nodeColor = ref('#f472b6')
const nodeDescription = ref('')
const tags = ref([])

// Можно ли сохранить
const canSave = computed(() => {
  return nodeName.value.trim().length > 0 && tags.value.length > 0
})

// Добавить тег
const addTag = () => {
  tags.value.push({
    name: '',
    prompt: '',
    id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  })
}

// Удалить тег
const removeTag = (index) => {
  tags.value.splice(index, 1)
}

// Сброс формы
const resetForm = () => {
  nodeName.value = ''
  jsonType.value = ''
  maxVariants.value = 3
  nodeColor.value = '#f472b6'
  nodeDescription.value = ''
  tags.value = []
}

// Заполнить форму для редактирования
const fillForm = (node) => {
  if (!node) return
  nodeName.value = node.name || ''
  jsonType.value = node.jsonType || ''
  maxVariants.value = node.maxTags || 3
  nodeColor.value = node.color || '#f472b6'
  nodeDescription.value = node.description || ''
  tags.value = node.tags?.map(t => ({ ...t })) || []
}

// Сохранить
const onSave = () => {
  const nodeData = {
    id: props.editNode?.id || `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 3)}`,
    name: nodeName.value.trim(),
    jsonType: jsonType.value.trim() || 'custom', // Тип для JSON (для нейронки)
    type: 'userNode',
    category: 'userNodes',
    icon: 'pi pi-user-edit',
    color: nodeColor.value,
    maxTags: maxVariants.value,
    description: nodeDescription.value,
    tags: tags.value.filter(t => t.name.trim()).map(t => ({
      id: t.id || `tag_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: t.name.trim(),
      prompt: t.prompt.trim()
    }))
  }

  emit('save', nodeData)
  visible.value = false
}

// Удалить
const onDelete = () => {
  if (props.editNode) {
    emit('delete', props.editNode.id)
  }
  visible.value = false
}

// При закрытии
const onHide = () => {
  resetForm()
}

// Следим за изменением editNode
watch(() => props.editNode, (newNode) => {
  if (newNode) {
    fillForm(newNode)
  } else {
    resetForm()
  }
}, { immediate: true })

// Следим за открытием диалога
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && !props.editNode) {
    resetForm()
    // Добавляем один пустой тег по умолчанию
    if (tags.value.length === 0) {
      addTag()
    }
  }
})
</script>

<style scoped>
/* Скрываем стандартный input color */
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
  padding: 0;
  background: none;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 8px;
}
</style>
