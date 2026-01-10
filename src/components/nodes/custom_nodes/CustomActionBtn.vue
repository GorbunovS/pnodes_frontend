<template>
  <Button 
    class="w-full" 
    label="Сгенерировать" 
    @click="generate"
  />
</template>

<script setup>
import Button from 'primevue/button'
import { defineEmits } from 'vue'
import { useAiApiStore } from '../../../store/aistore';
const aistore = useAiApiStore()

const generate = ()=> {
    aistore.generateImage()
}

const emit = defineEmits(['generate'])

</script>



<!-- <template>
    <button @click="count">{{ modelValue }}</button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        modelValue: {
            type: Number,
            required: true,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const count = () => {
            emit("update:modelValue", props.modelValue + 1);
        };
        return { count };
    },
});
</script> -->