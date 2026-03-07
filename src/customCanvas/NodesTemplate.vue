<template>
  <!-- ОБЫЧНАЯ НОДА С ТЕГАМИ -->
  <div 
    v-if="!isComposer && !isResult && !isCharacter"
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
      <Textarea
        v-model="localDescription"
        placeholder="дополнительно"
        :rows="3"
        class="w-full"
        :pt="{
          root: { 
            class: 'w-full bg-black/80 rounded-xl p-3 text-sm text-zinc-300 placeholder-zinc-600 resize-none border-0 focus:ring-1 focus:ring-zinc-500',
            style: { border: `1px solid ${nodeColor}40` }
          }
        }"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
    </div>

    <!-- Output порт (ромб в правом верхнем углу) -->
    <div 
      v-if="hasOutput"
      class="absolute -right-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125"
      :class="{ 'hover:shadow-lg': !isSource }"
      :style="{ 
        backgroundColor: hasOutputConnection ? nodeColor : '#18181b',
        border: `2px solid ${nodeColor}`,
        opacity: '1',
        boxShadow: isSource ? `0 0 10px ${nodeColor}` : 'none'
      }"
      :data-port="'output'"
      data-idx="0"
      :data-type="outputType"
      @pointerdown.stop="onOutputPointerDown"
      @click.stop="onOutputClick"
      @dblclick.stop="onOutputDblClick"
    >
      <!-- Активный: маленький ромбик внутри -->
      <div 
        v-if="isSource"
        class="w-2 h-2"
        :style="{ backgroundColor: nodeColor }"
      ></div>
    </div>

    <!-- Input порт (ромб в левом верхнем углу) -->
    <div 
      v-if="hasInput"
      class="absolute -left-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125 hover:shadow-lg"
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
      @dblclick.stop="onInputDblClick"
    >
    </div>

    <!-- Модал всех тегов -->
    <Dialog 
      v-model:visible="showTagModal" 
      :header="title"
      modal
      :style="{ width: '360px' }"
      :pt="{
        root: { class: '!bg-zinc-900/95 !border-zinc-700 !backdrop-blur-md', style: 'font-family: Inter, system-ui, sans-serif;' },
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

  <!-- НОДА ПЕРСОНАЖА (специальный шаблон) -->
  <div 
    v-else-if="isCharacter"
    ref="nodeRef"
    class="relative w-[300px] backdrop-blur-md transition-all flex flex-col group"
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
      class="absolute -left-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125 hover:shadow-lg"
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
      @dblclick.stop="onInputDblClick"
    >
    </div>

    <!-- Параметры персонажа -->
    <div class="p-4 pt-5 space-y-2" @wheel.stop @mousedown.stop>
      <!-- Пол (PrimeVue Select) -->
      <div class="bg-zinc-800/60 rounded-lg px-3 py-2.5">
        <Select
          v-model="characterGender"
          :options="genderOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          :pt="{
            root: { class: '!border-none !bg-transparent' },
            input: { class: '!text-zinc-200 !text-base !py-1 !px-0' },
            dropdown: { class: '!text-zinc-400 !w-8' }
          }"
        />
      </div>

      <!-- Возраст -->
      <div class="bg-zinc-800/60 rounded-lg px-3 py-2.5 flex items-center justify-between">
        <button 
          class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
          @click="characterAge = Math.max(0, characterAge - 1)"
        >
          <i class="pi pi-chevron-left text-xs"></i>
        </button>
        <div class="flex flex-col items-center">
          <span class="text-[11px] text-zinc-400 uppercase tracking-wider">Возраст</span>
          <span class="text-base text-zinc-200 font-mono">{{ characterAge }}</span>
        </div>
        <button 
          class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
          @click="characterAge = Math.min(120, characterAge + 1)"
        >
          <i class="pi pi-chevron-right text-xs"></i>
        </button>
      </div>

      <!-- Рост -->
      <div class="bg-zinc-800/60 rounded-lg px-3 py-2.5 flex items-center justify-between">
        <button 
          class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
          @click="characterHeight = Math.max(50, characterHeight - 5)"
        >
          <i class="pi pi-chevron-left text-xs"></i>
        </button>
        <div class="flex flex-col items-center">
          <span class="text-[11px] text-zinc-400 uppercase tracking-wider">Рост (см)</span>
          <span class="text-base text-zinc-200 font-mono">{{ characterHeight }}</span>
        </div>
        <button 
          class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
          @click="characterHeight = Math.min(250, characterHeight + 5)"
        >
          <i class="pi pi-chevron-right text-xs"></i>
        </button>
      </div>

      <!-- Вес -->
      <div class="bg-zinc-800/60 rounded-lg px-3 py-2.5 flex items-center justify-between">
        <button 
          class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
          @click="characterWeight = Math.max(20, characterWeight - 5)"
        >
          <i class="pi pi-chevron-left text-xs"></i>
        </button>
        <div class="flex flex-col items-center">
          <span class="text-[11px] text-zinc-400 uppercase tracking-wider">Вес (кг)</span>
          <span class="text-base text-zinc-200 font-mono">{{ characterWeight }}</span>
        </div>
        <button 
          class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
          @click="characterWeight = Math.min(300, characterWeight + 5)"
        >
          <i class="pi pi-chevron-right text-xs"></i>
        </button>
      </div>

      <!-- Части лица со свитчами (как в Композиторе) -->
      <div v-if="connectedNodes && connectedNodes.length > 0" class="pt-2 border-t border-zinc-700/50">
        <div class="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider">Части лица</div>
        <div class="space-y-2">
          <div 
            v-for="(part, index) in characterConnectedSources" 
            :key="part.nodeId"
            class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-black"
            :style="{ backgroundColor: part.color }"
          >
            <span>
              {{ part.name }}
              <span v-if="hasCharacterDuplicateType(part.type)" class="text-[10px] opacity-60 ml-1">#{{ index + 1 }}</span>
            </span>
            <ToggleSwitch 
              v-model="part.enabled"
              @change="onCharacterPartToggle"
              class="custom-switch"
              :pt="{
                root: { 
                  class: 'w-10 h-5 rounded-lg border-0',
                  style: { backgroundColor: 'rgba(0,0,0,0.3)' }
                },
                slider: { 
                  class: 'rounded-md shadow-none',
                  style: { 
                    backgroundColor: part.enabled ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    borderRadius: '4px',
                    width: '14px',
                    height: '14px',
                    margin: '3px'
                  }
                }
              }"
            />
          </div>
        </div>
      </div>

      <!-- Дополнительное описание -->
      <div class="pt-2 border-t border-zinc-700/50">
        <Textarea
          v-model="localDescription"
          placeholder="дополнительно"
          :rows="3"
          class="w-full"
          :pt="{
            root: { 
              class: 'w-full bg-black/80 rounded-xl p-3 text-sm text-zinc-300 placeholder-zinc-600 resize-none border-0 focus:ring-1 focus:ring-zinc-500',
              style: { border: `1px solid ${nodeColor}40` }
            }
          }"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </div>

      <!-- Параметры (промпт) -->
      <div class="pt-2 border-t border-zinc-700/50">
        <div class="text-[11px] text-zinc-500 mb-1.5">Параметры:</div>
        <div class="text-sm text-zinc-300 font-mono bg-zinc-900/50 rounded-lg p-2.5 leading-relaxed">
          {{ characterPrompt }}
        </div>
      </div>
    </div>

    <!-- Output порт (ромб в правом верхнем углу) -->
    <div 
      v-if="hasOutput"
      class="absolute -right-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125 hover:shadow-lg"
      :style="{ 
        backgroundColor: hasOutputConnection ? nodeColor : '#18181b',
        border: `2px solid ${nodeColor}`,
        opacity: '1',
        boxShadow: isSource ? `0 0 10px ${nodeColor}` : 'none'
      }"
      :data-port="'output'"
      data-idx="0"
      :data-type="outputType"
      @pointerdown.stop="onOutputPointerDown"
      @click.stop="onOutputClick"
      @dblclick.stop="onOutputDblClick"
    >
      <div 
        v-if="isSource"
        class="w-2 h-2"
        :style="{ backgroundColor: nodeColor }"
      ></div>
    </div>
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
      class="absolute -left-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125 hover:shadow-lg"
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
      @dblclick.stop="onInputDblClick"
    >
    </div>

    <!-- Источники (свитчи подключённых нод) -->
    <div class="px-4 pt-5 pb-2">
      <div class="text-xs text-zinc-500 mb-2 uppercase tracking-wider">источники</div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="(source, index) in connectedSources" 
          :key="source.nodeId"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-black"
          :style="{ backgroundColor: source.color }"
          :title="source.name + ' #' + (index + 1)"
        >
          {{ source.name }}
          <span v-if="hasDuplicateType(source.type)" class="text-[10px] opacity-60">#{{ index + 1 }}</span>
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
      <Textarea
        v-model="localMasterPrompt"
        placeholder="дополнительные инструкции..."
        :rows="4"
        class="w-full"
        :pt="{
          root: { 
            class: 'w-full bg-black/80 rounded-xl p-3 text-sm text-zinc-300 placeholder-zinc-600 resize-none border-0 focus:ring-1 focus:ring-zinc-500',
            style: { border: `1px solid ${nodeColor}40` }
          }
        }"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
    </div>

    <!-- Output порт (ромб в правом верхнем углу) -->
    <div 
      v-if="hasOutput"
      class="absolute -right-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125 hover:shadow-lg"
      :style="{ 
        backgroundColor: hasOutputConnection ? nodeColor : '#18181b',
        border: `2px solid ${nodeColor}`,
        opacity: '1',
        boxShadow: isSource ? `0 0 10px ${nodeColor}` : 'none'
      }"
      :data-port="'output'"
      data-idx="0"
      :data-type="outputType"
      @click.stop="onOutputClick"
      @dblclick.stop="onOutputDblClick"
    >
      <!-- Активный: маленький ромбик внутри -->
      <div 
        v-if="isSource"
        class="w-2 h-2"
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
      class="absolute -left-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125 hover:shadow-lg"
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
      @dblclick.stop="onInputDblClick"
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
          ref="promptTextarea"
          :value="displayPrompt"
          readonly
          class="w-full h-32 bg-black/60 rounded-xl p-3 text-sm text-zinc-200 resize-none focus:outline-none font-mono overflow-auto cursor-text"
          :style="{ border: `1px solid ${nodeColor}40` }"
          @wheel="onTextareaWheel"
          @mousedown.stop
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

  <!-- GENERATION НОДА -->
  <div 
    v-else-if="isGeneration"
    ref="nodeRef"
    class="relative w-[400px] backdrop-blur-md transition-all flex flex-col group"
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
      class="absolute -left-3 -top-3 w-6 h-6 cursor-crosshair flex items-center justify-center transition-all duration-200 ease-out hover:scale-125 hover:shadow-lg"
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
      @dblclick.stop="onInputDblClick"
    >
    </div>

    <!-- Контент ноды генерации -->
    <div class="px-4 pt-5 pb-4">
      <!-- Заголовок секции -->
      <div class="flex items-center justify-between mb-4">
        <div class="text-xs text-zinc-500 uppercase tracking-wider">Генерация изображения</div>
        <Tag 
          v-if="generationStatus" 
          :value="generationStatusText"
          :severity="generationStatusSeverity"
          class="text-xs"
        />
      </div>

      <!-- Выбор провайдера -->
      <div class="mb-4">
        <label class="text-xs text-zinc-400 mb-1.5 block">Провайдер</label>
        <Select
          v-model="selectedProviderId"
          :options="availableProviders"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите провайдера"
          class="w-full"
          :pt="{
            root: { class: '!bg-zinc-800 !border-zinc-700' },
            input: { class: '!text-white' },
            panel: { class: '!bg-zinc-800 !border-zinc-700' },
            item: { class: '!text-white hover:!bg-zinc-700' }
          }"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
        
        <!-- Предупреждение если нет подключенных провайдеров -->
        <div v-if="availableProviders.length === 0" class="mt-2 text-xs text-amber-400">
          <i class="pi pi-exclamation-triangle mr-1"></i>
          Нет подключённых провайдеров. 
          <a href="#/profile" class="underline hover:text-amber-300">Добавить в профиле</a>
        </div>
      </div>

      <!-- Промпт preview (readonly) -->
      <div class="mb-4">
        <label class="text-xs text-zinc-400 mb-1.5 block">Промпт</label>
        <Textarea
          :value="inputPrompt"
          readonly
          :rows="3"
          class="w-full"
          :pt="{
            root: { class: '!bg-black/50 !border-zinc-700 !text-zinc-400 text-sm' }
          }"
          placeholder="Подключите ноду с промптом..."
        />
      </div>

      <!-- Опции генерации (если провайдер выбран) -->
      <div v-if="selectedProviderConfig" class="mb-4 space-y-3">
        <div class="text-xs text-zinc-500 uppercase tracking-wider">Настройки</div>
        
        <!-- Aspect Ratio -->
        <div v-if="selectedProviderConfig.supportedOptions?.aspectRatio">
          <label class="text-xs text-zinc-400 mb-1 block">Соотношение сторон</label>
          <Select
            v-model="generationOptions.aspectRatio"
            :options="selectedProviderConfig.supportedOptions.aspectRatio"
            class="w-full"
            :pt="{
              root: { class: '!bg-zinc-800 !border-zinc-700' },
              input: { class: '!text-white text-sm' }
            }"
          />
        </div>

        <!-- Quality -->
        <div v-if="selectedProviderConfig.supportedOptions?.quality">
          <label class="text-xs text-zinc-400 mb-1 block">Качество</label>
          <Select
            v-model="generationOptions.quality"
            :options="selectedProviderConfig.supportedOptions.quality"
            class="w-full"
            :pt="{
              root: { class: '!bg-zinc-800 !border-zinc-700' },
              input: { class: '!text-white text-sm' }
            }"
          />
        </div>

        <!-- Size/Resolution -->
        <div v-if="selectedProviderConfig.supportedOptions?.size" class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-zinc-400 mb-1 block">Размер</label>
            <Select
              v-model="generationOptions.size"
              :options="selectedProviderConfig.supportedOptions.size"
              class="w-full"
              :pt="{
                root: { class: '!bg-zinc-800 !border-zinc-700' },
                input: { class: '!text-white text-sm' }
              }"
            />
          </div>
        </div>
      </div>

      <!-- Кнопка генерации -->
      <Button
        :label="generationButtonText"
        :icon="generationButtonIcon"
        :loading="isGenerating"
        :disabled="!canGenerate"
        class="w-full"
        :style="{ backgroundColor: nodeColor, borderColor: nodeColor, color: '#000' }"
        @click="onGenerate"
      />

      <!-- Результат -->
      <div v-if="generationResult" class="mt-4">
        <div class="text-xs text-zinc-500 uppercase tracking-wider mb-2">Результат</div>
        <div class="relative rounded-xl overflow-hidden bg-zinc-900">
          <img 
            :src="generationResult.imageUrl" 
            class="w-full h-auto max-h-64 object-contain"
            alt="Generated"
          />
          <div class="absolute bottom-2 right-2 flex gap-2">
            <Button
              icon="pi pi-download"
              size="small"
              text
              severity="secondary"
              @click="downloadImage"
            />
            <Button
              icon="pi pi-external-link"
              size="small"
              text
              severity="secondary"
              @click="openImage"
            />
          </div>
        </div>
      </div>

      <!-- Ошибка -->
      <div v-if="generationError" class="mt-4 bg-red-900/30 border border-red-700 rounded-lg p-3">
        <div class="flex items-center gap-2 text-red-400 text-sm">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ generationError }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import { useBoardStore } from '../store/boardStore.js'
import { useGenerationStore } from '../store/generationStore.js'
import { canConnect } from '../data/nodeConfig.js'
import { getProviderConfig, getDefaultOptions } from '../data/providersConfig.js'
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
  isCharacter: { type: Boolean, default: false },
  isGeneration: { type: Boolean, default: false },
  
  // Для обычной ноды
  tags: { type: Array, default: () => [] },
  maxTags: { type: Number, default: 5 },
  hasDescription: { type: Boolean, default: true },
  
  // Для композитора
  connectedNodes: { type: Array, default: () => [] },
  
  // Для результата
  composerData: { type: Object, default: null },
  
  // Для generation
  inputPrompt: { type: String, default: '' },
  
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

// === ОБЩИЕ ДАННЫЕ (для всех нод) ===
const localDescription = ref(props.modelValue.description || '')

// === GENERATION STORE & DATA ===
const generationStore = useGenerationStore()
const selectedProviderId = ref(props.modelValue.selectedProvider || '')
const generationOptions = ref(props.modelValue.generationOptions || {})
const generationResult = ref(props.modelValue.generationResult || null)
const generationStatus = ref(props.modelValue.generationStatus || 'idle') // idle, pending, processing, completed, failed
const generationError = ref(props.modelValue.generationError || null)
const inputPrompt = ref(props.modelValue.inputPrompt || '')

// Данные для generation ноды
const availableProviders = computed(() => generationStore.getConnectedProviders)
const selectedProviderConfig = computed(() => {
  if (!selectedProviderId.value) return null
  return getProviderConfig(selectedProviderId.value)
})

const isGenerating = computed(() => generationStore.isGenerating)

const generationStatusText = computed(() => {
  switch (generationStatus.value) {
    case 'pending': return 'В очереди'
    case 'processing': return 'Генерация...'
    case 'completed': return 'Готово'
    case 'failed': return 'Ошибка'
    default: return ''
  }
})

const generationStatusSeverity = computed(() => {
  switch (generationStatus.value) {
    case 'completed': return 'success'
    case 'failed': return 'error'
    case 'processing': return 'warning'
    case 'pending': return 'info'
    default: return 'secondary'
  }
})

const generationButtonText = computed(() => {
  if (isGenerating.value) return 'Генерация...'
  if (generationStatus.value === 'completed') return 'Сгенерировать снова'
  return 'Сгенерировать'
})

const generationButtonIcon = computed(() => {
  if (isGenerating.value) return 'pi pi-spinner pi-spin'
  return 'pi pi-sparkles'
})

const canGenerate = computed(() => {
  return selectedProviderId.value && 
         inputPrompt.value && 
         !isGenerating.value &&
         availableProviders.value.length > 0
})

// Инициализация дефолтных опций при смене провайдера
watch(selectedProviderId, (newId) => {
  if (newId) {
    const defaults = getDefaultOptions(newId)
    generationOptions.value = { ...defaults, ...generationOptions.value }
  }
}, { immediate: true })

// Обновление промпта из входящего соединения
watch(() => props.inputPrompt, (newPrompt) => {
  if (newPrompt !== undefined && newPrompt !== inputPrompt.value) {
    inputPrompt.value = newPrompt
  }
}, { immediate: true })

// Синхронизация данных generation
watch([selectedProviderId, generationOptions, generationResult, generationStatus, generationError, inputPrompt], () => {
  if (props.isGeneration) {
    emit('update:modelValue', {
      ...props.modelValue,
      selectedProvider: selectedProviderId.value,
      generationOptions: generationOptions.value,
      generationResult: generationResult.value,
      generationStatus: generationStatus.value,
      generationError: generationError.value,
      inputPrompt: inputPrompt.value
    })
  }
}, { deep: true })

const onGenerate = async () => {
  if (!canGenerate.value) return
  
  generationStatus.value = 'processing'
  generationError.value = null
  
  try {
    const task = await generationStore.generateImage(
      selectedProviderId.value,
      inputPrompt.value,
      generationOptions.value
    )
    
    generationResult.value = {
      imageUrl: task.imageUrl,
      taskId: task.id,
      createdAt: task.createdAt
    }
    generationStatus.value = 'completed'
  } catch (error) {
    generationError.value = error.message
    generationStatus.value = 'failed'
  }
}

const downloadImage = () => {
  if (!generationResult.value?.imageUrl) return
  const link = document.createElement('a')
  link.href = generationResult.value.imageUrl
  link.download = `generated-${Date.now()}.png`
  link.target = '_blank'
  link.click()
}

const openImage = () => {
  if (!generationResult.value?.imageUrl) return
  window.open(generationResult.value.imageUrl, '_blank')
}

// === ДАННЫЕ ПЕРСОНАЖА ===
const characterGender = ref(props.modelValue.gender || 'male')
const characterAge = ref(props.modelValue.age || 25)
const characterHeight = ref(props.modelValue.height || 175)
const characterWeight = ref(props.modelValue.weight || 70)
const localEnabledParts = ref(props.modelValue.enabledParts || {})

// Собранные части лица со свитчами
const characterConnectedSources = computed(() => {
  return props.connectedNodes.map(node => ({
    ...node,
    enabled: localEnabledParts.value[node.nodeId] !== false
  }))
})

// Проверка дубликатов типов для персонажа
const hasCharacterDuplicateType = (type) => {
  const types = props.connectedNodes.map(n => n.type)
  return types.filter(t => t === type).length > 1
}

const onCharacterPartToggle = () => {
  const newEnabled = {}
  characterConnectedSources.value.forEach(part => {
    newEnabled[part.nodeId] = part.enabled
  })
  localEnabledParts.value = newEnabled
  
  emit('update:modelValue', { 
    ...props.modelValue, 
    enabledParts: newEnabled 
  })
}

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Androgynous', value: 'androgynous' }
]

// Сформировать промпт персонажа
const characterPrompt = computed(() => {
  const parts = []
  
  // Пол
  if (characterGender.value === 'male') parts.push('male character')
  else if (characterGender.value === 'female') parts.push('female character')
  else parts.push('androgynous character')
  
  // Возраст
  if (characterAge.value < 13) parts.push('child')
  else if (characterAge.value < 20) parts.push('teenager')
  else if (characterAge.value < 30) parts.push('young adult')
  else if (characterAge.value < 50) parts.push('adult')
  else parts.push('elderly')
  
  // Рост/вес для детализации
  parts.push(`${characterHeight.value}cm height`)
  parts.push(`${characterWeight.value}kg build`)
  
  return parts.join(', ')
})

// Синхронизация данных персонажа
watch([characterGender, characterAge, characterHeight, characterWeight], () => {
  if (props.isCharacter) {
    emit('update:modelValue', {
      ...props.modelValue,
      gender: characterGender.value,
      age: characterAge.value,
      height: characterHeight.value,
      weight: characterWeight.value,
      prompt: characterPrompt.value
    })
  }
}, { deep: true })

// Отдельный watch для description с debounce
let descTimeout
watch(localDescription, (newVal) => {
  if (props.isCharacter) {
    clearTimeout(descTimeout)
    descTimeout = setTimeout(() => {
      emit('update:modelValue', {
        ...props.modelValue,
        description: newVal
      })
    }, 100)
  }
})

// Синхронизация извне
watch(() => props.modelValue.description, (newDesc) => {
  if (props.isCharacter && newDesc !== undefined && newDesc !== localDescription.value) {
    localDescription.value = newDesc
  }
}, { immediate: true })

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

// === REFS для Result ===
const promptTextarea = ref(null)

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

// Обработчик wheel для textarea в Result - позволяет скроллить текст, но не блокирует зум канвы
const onTextareaWheel = (e) => {
  const textarea = promptTextarea.value
  if (!textarea) return
  
  const isScrollingUp = e.deltaY < 0
  const isScrollingDown = e.deltaY > 0
  const isAtTop = textarea.scrollTop === 0
  const isAtBottom = textarea.scrollTop + textarea.clientHeight >= textarea.scrollHeight
  
  // Если скроллим внутри textarea и есть куда скроллить - останавливаем всплытие
  // Иначе позволяем событию дойти до канвы для зума
  if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
    e.stopPropagation()
  }
}

// Синхронизация
watch(() => props.modelValue, (newVal) => {
  if (props.isResult) {
    isJsonMode.value = newVal.jsonMode || false
  } else if (props.isCharacter) {
    // Для персонажа localDescription синхронизируется отдельным watch
    characterGender.value = newVal.gender || 'male'
    characterAge.value = newVal.age || 25
    characterHeight.value = newVal.height || 175
    characterWeight.value = newVal.weight || 70
    localEnabledParts.value = newVal.enabledParts || {}
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
  if (!props.isComposer && !props.isCharacter && !props.isResult) {
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

// Проверка есть ли дубликаты типа (для отображения индекса)
const hasDuplicateType = (type) => {
  const types = props.connectedNodes.map(n => n.type)
  return types.filter(t => t === type).length > 1
}

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
const onOutputDblClick = () => {
  // Двойной клик на output - удалить все связи
  emit('deleteOutputConnections', props.nodeId, 0)
}
const onInputDblClick = () => {
  // Двойной клик на input - удалить все связи
  if (props.hasInputConnection) {
    emit('deleteInputConnections', props.nodeId, 0)
  }
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

/* Порты - всегда ромбы */
[data-port] {
  transform: rotate(45deg) !important;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out;
}

[data-port]:hover {
  transform: rotate(45deg) scale(1.25) !important;
  z-index: 100;
}

/* Пульсация для совместимых инпутов - всегда ромб */
@keyframes input-pulse {
  0%, 100% {
    transform: rotate(45deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) scale(1.3);
    opacity: 0.9;
  }
}

.input-pulse {
  animation: input-pulse 1s ease-in-out infinite !important;
  z-index: 100 !important;
}

/* Ховер во время пульсации - сохраняем ромб */
.input-pulse:hover {
  transform: rotate(45deg) scale(1.3) !important;
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
