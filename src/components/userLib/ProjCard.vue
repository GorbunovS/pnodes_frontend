<template>
    <div 
        class="w-48 h-32 cursor-pointer border-2 border-blue-400/60 flex flex-col p-3 rounded-2xl transition-all duration-300 bg-zinc-900/50 hover:border-blue-400 hover:bg-zinc-800/50 group relative"
        @click="onCardClick"
    >
        <!-- Верхняя строка с аватаркой и кнопками -->
        <div class="flex items-start justify-between mb-2">
            <!-- Жёлтый круг (аватарка с эмодзи) -->
            <div 
                class="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0 text-xl cursor-pointer hover:scale-110 transition-transform"
                @click.stop="openEmojiPicker"
                title="Сменить эмодзи"
            >
                {{ emoji }}
            </div>
            
            <!-- Кнопки действий -->
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    icon="pi pi-pencil" 
                    severity="secondary"
                    text
                    size="small"
                    class="!p-1 !w-7 !h-7"
                    @click.stop="openEditDialog"
                    title="Переименовать"
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
        <div class="text-blue-400 text-base font-medium truncate leading-tight flex-1">
            {{ name }}
        </div>
        
        <!-- Дата создания -->
        <div class="text-zinc-500 text-xs mt-1">
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

    <!-- Диалог выбора эмодзи -->
    <Dialog 
        v-model:visible="showEmojiDialog" 
        header="Выбрать эмодзи"
        modal
        :style="{ width: '320px' }"
        :pt="{
            root: { class: '!bg-zinc-900 !border-zinc-700' },
            header: { class: '!bg-zinc-800 !text-white !border-zinc-700' },
            content: { class: '!bg-zinc-900 !text-zinc-200' }
        }"
    >
        <div class="grid grid-cols-6 gap-2 py-2">
            <button
                v-for="e in commonEmojis" 
                :key="e"
                class="w-10 h-10 text-2xl rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center"
                :class="{ 'bg-zinc-700 ring-2 ring-blue-400': e === emoji }"
                @click="selectEmoji(e)"
            >
                {{ e }}
            </button>
        </div>
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

const onCardClick = () => {
    emit('click', props.id);
};

const sessionStore = useSessionStore();

// Эмодзи (хранится в localStorage по ID сессии)
const EMOJI_KEY_PREFIX = 'proj_emoji_';
const commonEmojis = ['🎨', '🖼️', '📸', '✨', '🎭', '🎬', '🎮', '📱', '💻', '🎪', '🎨', '🎯', '🎲', '🎸', '🎺', '🎻', '🎹', '🎤', '🎧', '🎮', '🎲', '🎳', '🎯', '🎰', '🎱'];

const emoji = computed(() => {
    const saved = localStorage.getItem(EMOJI_KEY_PREFIX + props.id);
    return saved || '🎨';
});

const formattedDate = computed(() => {
    if (!props.createdAt) return '';
    const date = new Date(props.createdAt);
    return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
});

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

// Диалог эмодзи
const showEmojiDialog = ref(false);

const openEmojiPicker = () => {
    showEmojiDialog.value = true;
};

const selectEmoji = (e) => {
    localStorage.setItem(EMOJI_KEY_PREFIX + props.id, e);
    showEmojiDialog.value = false;
};

// Удаление
const confirmDelete = () => {
    if (confirm(`Удалить проект "${props.name}"?\n\nЭто действие нельзя отменить.`)) {
        sessionStore.deleteSession(props.id);
        emit('delete', props.id);
    }
};
</script>
