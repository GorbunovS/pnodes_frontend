<template>
  <div class="fixed bottom-4 right-4 z-50 w-48 h-32 bg-zinc-900/90 border border-zinc-700 rounded-lg overflow-hidden">
    <div class="absolute top-1 left-2 text-[10px] text-zinc-500 font-mono">Миникарта</div>
    <svg class="w-full h-full" viewBox="0 0 6000 4000" preserveAspectRatio="xMidYMid meet">
      <!-- Ноды -->
      <rect
        v-for="node in nodes"
        :key="node.id"
        :x="node.x"
        :y="node.y"
        width="240"
        height="80"
        fill="#3b82f6"
        fill-opacity="0.6"
        rx="4"
      />
      <!-- Вьюпорт -->
      <rect
        :x="viewportX"
        :y="viewportY"
        :width="viewportWidth / scale"
        :height="viewportHeight / scale"
        fill="none"
        stroke="#fbbf24"
        stroke-width="20"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nodes: Array,
  panX: Number,
  panY: Number,
  scale: Number,
  viewportWidth: Number,
  viewportHeight: Number
})

const viewportX = computed(() => -props.panX / props.scale)
const viewportY = computed(() => -props.panY / props.scale)
</script>
