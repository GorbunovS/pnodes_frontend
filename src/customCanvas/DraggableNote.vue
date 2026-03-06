<template>
  <div 
    class="relative w-[240px] min-h-[120px] bg-zinc-900/60 border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all"
    :class="[
      isSource ? 'ring-2 ring-yellow-400 border-yellow-400/60' : 'border-blue-400/40',
      isSelected ? 'ring-2 ring-blue-400' : ''
    ]"
    :style="{ zIndex: zIndex || 1 }"
    :data-id="nodeId"
  >
    <!-- Заголовок -->
    <div class="px-3 py-2 border-b border-blue-400/20 text-blue-200 text-sm font-medium flex justify-between items-center">
      <span>{{ title }}</span>
      <span v-if="data !== undefined" class="text-xs text-blue-400 font-mono">{{ typeof data === 'object' ? data.value : data }}</span>
    </div>
    
    <!-- Контент -->
    <div class="p-3 min-h-[60px]">
      <slot></slot>
    </div>

    <!-- Входы (слева) с минусом для удаления связи -->
    <div 
      v-for="(input, idx) in inputs" 
      :key="'in-'+idx"
      class="port-input absolute left-0 w-5 h-5 rounded-full cursor-pointer transition shadow-lg border-2 border-zinc-900 flex items-center justify-center"
      :class="[
        hasInputConnection(idx) ? 'bg-yellow-500 hover:bg-red-500' : 'bg-green-500 hover:scale-125',
        isSource ? 'ring-2 ring-white' : ''
      ]"
      :style="{ top: `${35 + idx * 28}px` }"
      :data-port="'input'"
      :data-idx="idx"
      :data-type="input.type"
      @click.stop="onInputClick($event, idx, input.type)"
      @mouseenter="hoveredInput = idx"
      @mouseleave="hoveredInput = null"
    >
      <!-- Минус при наведении на связанный input -->
      <span 
        v-if="hasInputConnection(idx) && hoveredInput === idx" 
        class="text-white text-xs font-bold pointer-events-none"
      >
        −
      </span>
      <!-- Точка по умолчанию -->
      <div v-else class="w-2 h-2 bg-white rounded-full pointer-events-none"></div>
    </div>

    <!-- Выходы (справа) с минусом для удаления связи -->
    <div 
      v-for="(output, idx) in outputs" 
      :key="'out-'+idx"
      class="port-output absolute right-0 w-5 h-5 rounded-full cursor-pointer transition shadow-lg border-2 border-zinc-900 flex items-center justify-center"
      :class="[
        hasOutputConnection(idx) ? 'bg-yellow-500 hover:bg-red-500' : 'bg-blue-500 hover:scale-125',
        isSource && sourcePortIdx === idx ? 'ring-2 ring-yellow-400 animate-pulse' : ''
      ]"
      :style="{ top: `${35 + idx * 28}px` }"
      :data-port="'output'"
      :data-idx="idx"
      :data-type="output.type"
      @click.stop="onOutputClick($event, idx, output.type)"
      @mouseenter="hoveredOutput = idx"
      @mouseleave="hoveredOutput = null"
    >
      <!-- Минус при наведении на связанный output -->
      <span 
        v-if="hasOutputConnection(idx) && hoveredOutput === idx" 
        class="text-white text-xs font-bold pointer-events-none"
      >
        −
      </span>
      <!-- Точка по умолчанию -->
      <div v-else class="w-2 h-2 bg-white rounded-full pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  nodeId: Number,
  title: String,
  inputs: { type: Array, default: () => [] },
  outputs: { type: Array, default: () => [] },
  data: [Number, String, Object],
  isSource: { type: Boolean, default: false },
  sourcePortIdx: { type: Number, default: null },
  isSelected: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1 },
  connections: { type: Array, default: () => [] }
})

const emit = defineEmits(['portClick', 'deleteInputConnection', 'deleteOutputConnection'])

const hoveredInput = ref(null)
const hoveredOutput = ref(null)

const hasInputConnection = (idx) => {
  return props.connections.some(c => c.toNodeId === props.nodeId && c.toInIdx === idx)
}

const hasOutputConnection = (idx) => {
  return props.connections.some(c => c.fromNodeId === props.nodeId && c.fromOutIdx === idx)
}

const onInputClick = (e, idx, portType) => {
  // Если есть связь и наведены - удаляем связь
  if (hasInputConnection(idx) && hoveredInput.value === idx) {
    emit('deleteInputConnection', props.nodeId, idx)
  } else {
    // Иначе продолжаем соединение (только если уже начали)
    emit('portClick', e, 'input', idx, portType, props.nodeId)
  }
}

const onOutputClick = (e, idx, portType) => {
  // Если есть связь и наведены - удаляем связь
  if (hasOutputConnection(idx) && hoveredOutput.value === idx) {
    emit('deleteOutputConnection', props.nodeId, idx)
  } else {
    // Иначе начинаем/продолжаем соединение
    emit('portClick', e, 'output', idx, portType, props.nodeId)
  }
}
</script>

<style scoped>
.port-input, .port-output {
  transform: translateX(-50%);
}
.port-output {
  transform: translateX(50%);
}
</style>
