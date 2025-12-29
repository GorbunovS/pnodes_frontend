<template>
  <div 
     class="relative flex h-52 w-100 flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 shadow-lg transition-transform transition-opacity"
    :class="[
      gradientClasses,
      available 
        ? 'hover:scale-[1.02] cursor-pointer opacity-100' 
        : 'opacity-50 cursor-not-allowed grayscale-[0.2]'
    ]"
  >
  
    <div class="flex items-start gap-4">
      <!-- Иконка 'i' в черном круге -->
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black">
        <span class="font-serif text-2xl font-bold italic text-white">i</span>
      </div>
      
      <!-- Текст описания (маленький, сверху) -->
      <p class="mt-1 max-w-[85%] text-lg font-medium leading-tight text-white/90">
        {{ description }}
      </p>
    </div>

    <!-- Нижняя часть: Крупный заголовок -->
    <div class="flex justify-end">
      <h2 class=" text-5xl font-black text-black lowercase">
        {{ title }}
      </h2>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Тип карточки для выбора цвета градиента
  type: {
    type: String,
    default: 'default', 
    validator: (value) => ['person', 'selfie', 'fashion', 'cinematic', 'default'].includes(value)
  },
  available: {
    type: Boolean,
    default: false
  }
});

// Подбираем градиент под каждый тип (примерно как на скрине)
const gradientClasses = computed(() => {
  switch (props.type) {
    case 'person':
      return 'from-[#82f4e2] to-[#99c5ff]'; // Мятный -> Голубой
    case 'selfie':
      return 'from-[#8cf7d9] to-[#92baff]'; // Чуть зеленее -> Синий
    case 'fashion':
      return 'from-[#99ebf0] to-[#9cbbf0]'; // Голубой -> Светло-синий
    case 'cinematic':
      return 'from-[#85fadd] to-[#9ec8ff]'; // Яркая бирюза -> Синий
    default:
      return 'from-blue-200 to-blue-400';
  }
});
</script>

<style scoped>
/* Если у тебя подключен кастомный шрифт (на скрине похоже на что-то широкое типа 'Soyuz Grotesk' или 'Neue Machina') */
h2 {
    font-family: 'SoyuzGroteskBold', sans-serif; /* Твой шрифт из прошлых сообщений */
}
</style>
