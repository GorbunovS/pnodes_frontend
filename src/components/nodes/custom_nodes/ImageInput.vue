<!-- components/nodes/custom_nodes/ImageInput.vue -->
<script setup>
import { computed, ref, onMounted } from "vue";

// Baklava передает value через modelValue
const props = defineProps({
  modelValue: { type: [String, Object], default: null }, // Может прийти null или строка base64
});

const emit = defineEmits(["update:modelValue"]);
const fileInput = ref(null);

const imageData = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const processFile = (file) => {
  if (!file || !file.type?.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageData.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleFileChange = (e) => processFile(e.target.files?.[0]);

const handleDrop = (e) => {
    e.preventDefault();
    processFile(e.dataTransfer.files?.[0]);
};

// Paste обрабатываем глобально на уровне ноды? 
// Нет, лучше ловить на div, но для этого нужен фокус.
// Можно добавить tabindex="0"
const handlePaste = (e) => {
  const items = e.clipboardData?.items || [];
  for (const item of items) {
    if (item.type.includes("image")) {
      processFile(item.getAsFile());
      break;
    }
  }
};
</script>

<template>
  <div 
    class="image-uploader"
    tabindex="0"
    @paste="handlePaste"
    @click="fileInput?.click()"
    @dragover.prevent
    @drop="handleDrop"
  >
    <img v-if="imageData" :src="imageData" class="preview-img" />
    
    <div v-else class="placeholder">
      <i class="pi pi-image" style="font-size: 1.5rem; margin-bottom: 0.5rem; opacity: 0.7;"></i>
      <span>Paste / Drag / Click</span>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="handleFileChange" />
    
    <!-- Кнопка очистки -->
    <button v-if="imageData" @click.stop="imageData = null" class="clear-btn">
      ✕
    </button>
  </div>
</template>

<style scoped>
.image-uploader {
  width: 100%;
  height: 200px; /* Фиксированная высота для картинки */
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px dashed #555;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  outline: none; /* Убираем синюю обводку фокуса */
}

.image-uploader:hover, .image-uploader:focus {
  border-color: #888;
  background-color: rgba(0, 0, 0, 0.3);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
  font-size: 0.8rem;
  pointer-events: none;
}

.hidden-input {
  display: none;
}

.clear-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0,0,0,0.6);
  border: none;
  color: white;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.clear-btn:hover {
  background: rgba(200, 50, 50, 0.8);
}
</style>
