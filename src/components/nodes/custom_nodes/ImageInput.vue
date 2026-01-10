<!-- components/nodes/custom_nodes/ImageInput.vue -->
<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAiApiStore } from "../../../store/aistore";
const aistore = useAiApiStore()

const { result } = storeToRefs(aistore);


const props = defineProps({
  modelValue: { type: [String, Object], default: null }, 
});

const emit = defineEmits(["update:modelValue"]);


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
  >
    <img v-if="result" :src="result" class="preview-img" />
    
    <div v-else class="placeholder">
      <i class="pi pi-image" style="font-size: 1.5rem; margin-bottom: 0.5rem; opacity: 0.7;"></i>
      <span> Результат генерации </span>
    </div>


    

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
  outline: none; 
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
