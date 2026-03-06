<template>
  <div 
    class="relative w-[240px] min-h-[120px] bg-zinc-900/60 border border-blue-400/40 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    :class="{ 'ring-2 ring-yellow-400': isSource }"
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

    <!-- Входы (слева) -->
    <div 
      v-for="(input, idx) in inputs" 
      :key="'in-'+idx"
      class="port-input absolute left-0 w-5 h-5 bg-green-500 rounded-full cursor-pointer hover:scale-125 transition shadow-lg border-2 border-zinc-900"
      :class="{ 'ring-2 ring-white': isSource }"
      :style="{ top: `${35 + idx * 28}px` }"
      :data-port="'input'"
      :data-idx="idx"
      :data-type="input.type"
      @click.stop="$emit('portClick', $event, 'input', idx, input.type, nodeId)"
    >
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
    </div>

    <!-- Выходы (справа) -->
    <div 
      v-for="(output, idx) in outputs" 
      :key="'out-'+idx"
      class="port-output absolute right-0 w-5 h-5 bg-blue-500 rounded-full cursor-pointer hover:scale-125 transition shadow-lg border-2 border-zinc-900"
      :class="{ 'ring-2 ring-yellow-400 animate-pulse': isSource }"
      :style="{ top: `${35 + idx * 28}px` }"
      :data-port="'output'"
      :data-idx="idx"
      :data-type="output.type"
      @click.stop="$emit('portClick', $event, 'output', idx, output.type, nodeId)"
    >
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nodeId: Number,
  title: String,
  inputs: { type: Array, default: () => [] },
  outputs: { type: Array, default: () => [] },
  data: [Number, String, Object],
  isSource: { type: Boolean, default: false }
})

defineEmits(['portClick'])
</script>

<style scoped>
.port-input, .port-output {
  transform: translateX(-50%);
}
.port-output {
  transform: translateX(50%);
}
</style>
