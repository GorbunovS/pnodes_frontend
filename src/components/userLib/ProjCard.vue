<template>
    <div 
        class="w-52 h-32 cursor-pointer border border-blue-400/60 flex flex-col p-3 rounded-xl transition-all duration-300 bg-transparent hover:border-blue-400 hover:bg-zinc-800/20 group relative"
        @click="onCardClick"
    >
        <!-- Верхняя строка с иконками и кнопками -->
        <div class="flex items-start justify-between mb-2">
            <!-- Иконка заглушка (две перекрывающиеся картинки) -->
            <div 
                class="relative w-12 h-10 cursor-pointer hover:scale-105 transition-transform"
                @click.stop="openImageViewer"
                title="Просмотр изображений"
            >
                <!-- Первая картинка (сзади) -->
                <div class="absolute top-0 left-0 w-8 h-8 bg-zinc-600/40 rounded-lg transform -rotate-6"></div>
                <!-- Вторая картинка (спереди) -->
                <div class="absolute top-1 left-2 w-8 h-8 bg-zinc-400/50 rounded-lg"></div>
            </div>
            
            <!-- Кнопки действий -->
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    icon="pi pi-download" 
                    severity="secondary"
                    text
                    size="small"
                    class="!p-1 !w-7 !h-7 text-blue-400 hover:text-blue-300"
                    @click.stop="downloadProject"
                    title="Скачать проект"
                />
                <Button 
                    icon="pi pi-trash" 
                    severity="danger"
                    text
                    size="small"
                    class="!p-1 !w-7 !h-7"
                    @click.stop="confirmDelete"
                    title="Удалить"
                />
            </div>
        </div>
        
        <!-- Название проекта -->
        <div class="text-blue-400 text-xl font-display truncate leading-tight">
            {{ name }}
        </div>
        
        <!-- Дата создания -->
        <div class="text-zinc-400 text-sm mt-1">
            {{ formattedDate }}
        </div>
    </div>

    <!-- Диалог редактирования названия -->
    <Dialog 
        v-model:visible="showEditDialog" 
        header="Переименовать проект"
        modal
        :style="{ width: '350px' }"
        :pt="{
            root: { class: '!bg-zinc-900 !border-zinc-700' },
            header: { class: '!bg-zinc-800 !text-white !border-zinc-700' },
            content: { class: '!bg-zinc-900 !text-zinc-200' },
            footer: { class: '!bg-zinc-800 !border-zinc-700' }
        }"
    >
        <div class="flex flex-col gap-4 py-2">
            <div class="flex flex-col gap-2">
                <label class="text-sm text-zinc-400">Новое название</label>
                <InputText 
                    v-model="editName" 
                    placeholder="Введите название..."
                    class="w-full !bg-zinc-800 !border-zinc-700 !text-white"
                    @keyup.enter="saveName"
                    autofocus
                />
            </div>
        </div>
        
        <template #footer>
            <div class="flex gap-2 justify-end">
                <Button 
                    label="Отмена"
                    severity="secondary"
                    text
                    size="small"
                    @click="showEditDialog = false"
                />
                <Button 
                    label="Сохранить"
                    severity="primary"
                    size="small"
                    @click="saveName"
                    :disabled="!editName.trim()"
                />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSessionStore } from '../../store/sessionStore';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const props = defineProps({
    id: String,
    name: String,
    createdAt: Number
});

const emit = defineEmits(['click', 'delete']);

const sessionStore = useSessionStore();

const formattedDate = computed(() => {
    if (!props.createdAt) return '';
    const date = new Date(props.createdAt);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
});

const onCardClick = () => {
    emit('click', props.id);
};

// Открыть просмотрщик изображений (заглушка)
const openImageViewer = () => {
    // В будущем здесь будет открываться галерея генераций
    console.log('Открыть просмотрщик изображений для проекта:', props.id);
};

// Скачать проект
const downloadProject = () => {
    const data = sessionStore.exportSession(props.id);
    if (!data) return;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.name.replace(/[^a-z0-9а-я]/gi, '_').toLowerCase()}.pnodes.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// Диалог редактирования
const showEditDialog = ref(false);
const editName = ref('');

const openEditDialog = () => {
    editName.value = props.name;
    showEditDialog.value = true;
};

const saveName = () => {
    const newName = editName.value.trim();
    if (!newName) return;
    
    sessionStore.renameSession(props.id, newName);
    showEditDialog.value = false;
};

// Удаление
const confirmDelete = () => {
    if (confirm(`Удалить проект "${props.name}"?\n\nЭто действие нельзя отменить.`)) {
        sessionStore.deleteSession(props.id);
        emit('delete', props.id);
    }
};
</script>
