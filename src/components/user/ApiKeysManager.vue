<script setup>
import { ref, computed } from 'vue'
import { useGenerationStore } from '../../store/generationStore.js'
import { getProvidersList, getProviderConfig, validateProviderSettings } from '../../data/providersConfig.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'

const store = useGenerationStore()

const showAddDialog = ref(false)
const selectedProvider = ref(null)
const formData = ref({})
const formErrors = ref([])
const showPassword = ref({})

const providers = computed(() => getProvidersList())
const connectedProviders = computed(() => store.getConnectedProviders)

const openAddDialog = (provider) => {
  selectedProvider.value = provider
  const config = getProviderConfig(provider.id)
  
  // Инициализируем форму дефолтными значениями
  formData.value = {}
  config.fields.forEach(field => {
    if (field.type === 'select' && field.options) {
      formData.value[field.name] = field.options[0]?.value || ''
    } else {
      formData.value[field.name] = ''
    }
  })
  
  formErrors.value = []
  showAddDialog.value = true
}

const openEditDialog = (provider) => {
  selectedProvider.value = {
    id: provider.id,
    name: provider.name,
    color: provider.color,
    icon: provider.icon
  }
  
  const existing = store.getProviderById(provider.id)
  formData.value = { ...existing }
  formErrors.value = []
  showAddDialog.value = true
}

const saveProvider = () => {
  const validation = validateProviderSettings(selectedProvider.value.id, formData.value)
  
  if (!validation.valid) {
    formErrors.value = validation.errors
    return
  }
  
  store.saveApiKey(selectedProvider.value.id, formData.value)
  showAddDialog.value = false
  selectedProvider.value = null
  formData.value = {}
}

const removeProvider = (providerId) => {
  if (confirm('Удалить это подключение?')) {
    store.removeApiKey(providerId)
  }
}

const togglePasswordVisibility = (fieldName) => {
  showPassword.value[fieldName] = !showPassword.value[fieldName]
}

const getFieldComponent = (field) => {
  switch (field.type) {
    case 'select': return Select
    case 'textarea': return Textarea
    case 'number': return InputNumber
    default: return InputText
  }
}

const testConnection = async () => {
  // TODO: Реализовать тестирование подключения
  alert('Тестирование подключения будет реализовано позже')
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-2xl text-white" style="font-family: 'SoyuzGroteskBold', sans-serif;">API Подключения</h3>
        <p class="text-zinc-400 text-sm mt-1" style="font-family: 'Inter', sans-serif;">
          Настройте подключения к AI сервисам для генерации изображений
        </p>
      </div>
    </div>

    <!-- Connected Providers -->
    <div v-if="connectedProviders.length > 0" class="mb-8">
      <h4 class="text-sm text-zinc-500 uppercase tracking-wider mb-4" style="font-family: 'SoyuzGroteskBold', sans-serif;">
        Подключённые сервисы
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="provider in connectedProviders" 
          :key="provider.id"
          class="bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 flex items-start gap-4"
        >
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            :style="{ backgroundColor: provider.color + '20', color: provider.color }"
          >
            <i :class="provider.icon"></i>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-white text-lg" style="font-family: 'SoyuzGroteskBold', sans-serif;">{{ provider.name }}</span>
              <Tag severity="success" value="Подключено" class="text-xs" />
            </div>
            <p class="text-zinc-400 text-sm mt-1" style="font-family: 'Inter', sans-serif;">
              {{ provider.settings.apiKey ? '••••' + provider.settings.apiKey.slice(-4) : 'Custom endpoint' }}
            </p>
            <p v-if="provider.settings.model" class="text-zinc-500 text-xs mt-1" style="font-family: 'Inter', sans-serif;">
              {{ provider.settings.model }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              text 
              size="small"
              severity="secondary"
              @click="openEditDialog(provider)"
            />
            <Button 
              icon="pi pi-trash" 
              text 
              size="small"
              severity="danger"
              @click="removeProvider(provider.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <Divider v-if="connectedProviders.length > 0" />

    <!-- Available Providers -->
    <div>
      <h4 class="text-sm text-zinc-500 uppercase tracking-wider mb-4" style="font-family: 'SoyuzGroteskBold', sans-serif;">
        Доступные сервисы
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="provider in providers" 
          :key="provider.id"
          class="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 transition-colors group relative"
          :class="{ 
            'opacity-50 cursor-not-allowed': provider.disabled,
            'hover:border-zinc-600 cursor-pointer': !provider.disabled && !store.isProviderConnected(provider.id),
            'opacity-50': store.isProviderConnected(provider.id)
          }"
          @click="!provider.disabled && !store.isProviderConnected(provider.id) && openAddDialog(provider)"
        >
          <!-- Badge "СКОРО" для disabled провайдеров -->
          <div 
            v-if="provider.disabled" 
            class="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold"
            style="font-family: 'Inter', sans-serif;"
          >
            СКОРО
          </div>
          
          <div class="flex items-start gap-3">
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              :style="{ backgroundColor: provider.color + '20', color: provider.color }"
            >
              <i :class="provider.icon"></i>
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-white" style="font-family: 'SoyuzGroteskBold', sans-serif;">{{ provider.name }}</span>
                <i v-if="store.isProviderConnected(provider.id)" class="pi pi-check-circle text-green-500 text-sm"></i>
              </div>
              <p class="text-zinc-400 text-xs mt-1 line-clamp-2" style="font-family: 'Inter', sans-serif;">
                {{ provider.description }}
              </p>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-zinc-800">
            <span class="text-xs text-zinc-500" style="font-family: 'Inter', sans-serif;">
              <i class="pi pi-key mr-1"></i>
              {{ provider.requiresApiKey ? 'Требуется API ключ' : 'Без API ключа' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog 
      v-model:visible="showAddDialog" 
      :header="selectedProvider?.name || 'Добавить подключение'"
      modal
      :style="{ width: '480px' }"
      :pt="{
        root: { class: '!bg-zinc-900 !border-zinc-700' },
        header: { class: '!bg-zinc-800/50 !border-zinc-700' },
        content: { class: '!bg-transparent' }
      }"
    >
      <div v-if="selectedProvider" class="space-y-4">
        <!-- Description -->
        <p class="text-zinc-400 text-sm">
          {{ getProviderConfig(selectedProvider.id)?.description }}
        </p>
        
        <!-- Help Link -->
        <a 
          v-if="getProviderConfig(selectedProvider.id)?.helpUrl"
          :href="getProviderConfig(selectedProvider.id).helpUrl"
          target="_blank"
          class="text-blue-400 text-xs hover:underline flex items-center gap-1"
        >
          <i class="pi pi-external-link"></i>
          Как получить API ключ
        </a>

        <!-- Form Fields -->
        <div 
          v-for="field in getProviderConfig(selectedProvider.id)?.fields" 
          :key="field.name"
          class="space-y-1"
        >
          <label class="text-sm text-zinc-300">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
          
          <div class="relative">
            <!-- Password field with toggle -->
            <template v-if="field.type === 'password'">
              <InputText
                v-model="formData[field.name]"
                :type="showPassword[field.name] ? 'text' : 'password'"
                :placeholder="field.placeholder"
                class="w-full !bg-zinc-800 !border-zinc-700 !text-white"
                :class="{ '!pr-10': true }"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                @click="togglePasswordVisibility(field.name)"
              >
                <i :class="showPassword[field.name] ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </template>
            
            <!-- Select field -->
            <Select
              v-else-if="field.type === 'select'"
              v-model="formData[field.name]"
              :options="field.options"
              optionLabel="label"
              optionValue="value"
              :placeholder="field.placeholder || 'Выберите...'"
              class="w-full"
              :pt="{
                root: { class: '!bg-zinc-800 !border-zinc-700' },
                input: { class: '!text-white' },
                panel: { class: '!bg-zinc-800 !border-zinc-700' },
                item: { class: '!text-white hover:!bg-zinc-700' }
              }"
            />
            
            <!-- Textarea field -->
            <Textarea
              v-else-if="field.type === 'textarea'"
              v-model="formData[field.name]"
              :placeholder="field.placeholder"
              :rows="3"
              class="w-full"
              :pt="{
                root: { class: '!bg-zinc-800 !border-zinc-700 !text-white' }
              }"
            />
            
            <!-- Default input -->
            <InputText
              v-else
              v-model="formData[field.name]"
              :type="field.type || 'text'"
              :placeholder="field.placeholder"
              class="w-full !bg-zinc-800 !border-zinc-700 !text-white"
            />
          </div>
        </div>

        <!-- Errors -->
        <div v-if="formErrors.length > 0" class="bg-red-900/30 border border-red-700 rounded-lg p-3">
          <div class="flex items-center gap-2 text-red-400 text-sm mb-1">
            <i class="pi pi-exclamation-circle"></i>
            <span>Ошибки валидации:</span>
          </div>
          <ul class="text-red-400 text-xs list-disc list-inside">
            <li v-for="error in formErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4">
          <Button 
            label="Сохранить" 
            class="flex-1"
            @click="saveProvider"
          />
          <Button 
            label="Тест" 
            severity="secondary"
            text
            @click="testConnection"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
