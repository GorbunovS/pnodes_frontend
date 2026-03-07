<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out focus:outline-none"
    :class="modelValue ? 'bg-[#9ec8ff]' : 'bg-zinc-600'"
    :style="modelValue ? { backgroundColor: activeColor } : {}"
    @click="toggle"
  >
    <span class="sr-only">{{ label }}</span>
    <span
      class="pointer-events-none inline-block h-3.5 w-3.5 transform rounded-md shadow ring-0 transition duration-200 ease-in-out"
      :class="[
        modelValue ? 'translate-x-5 bg-moon-white' : 'translate-x-1.5 bg-zinc-400'
      ]"
      style="margin-top: 3px;"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  activeColor: { type: String, default: '#9ec8ff' } // Зелёный по умолчанию
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
/* Лунно-белый цвет для тумблера */
.bg-moon-white {
  background-color: #f5f5f0;
}
</style>
