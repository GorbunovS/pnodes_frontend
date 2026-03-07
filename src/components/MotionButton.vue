<template>
  <button
    ref="btnRef"
    class="relative px-4 py-2 rounded-lg font-medium transition-colors"
    :class="props.class"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useMotion } from '@vueuse/motion'

const props = defineProps({
  class: { type: String, default: '' },
  hoverScale: { type: Number, default: 1.05 },
  tapScale: { type: Number, default: 0.95 }
})

const emit = defineEmits(['click'])

const btnRef = ref(null)

// Анимации с помощью @vueuse/motion
useMotion(btnRef, {
  initial: { scale: 1 },
  enter: { scale: 1 },
  hovered: { scale: props.hoverScale },
  tapped: { scale: props.tapScale }
})
</script>
