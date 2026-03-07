<template>
    <div v-if="userStore.user" class="min-h-[95vh] overflow-y-hidden text-white flex flex-col items-center justify-center gap-50">
        <div class="main-block w-full min-h-[95vh] border-l border-r border-slate-700">
            <div class="tabs">
                <Tabs v-model:value="activeTabValue" scrollable>
                    <!-- ЗАГОЛОВКИ -->
                    <TabList>
                        <Tab value="tab-home">Мои <i class="pi pi-user" /></Tab>
                        <Tab value="tab-public">Опубликованные <i class="pi pi-globe" /></Tab>
                        
                        <!-- Кнопка Создать - не вкладка, а кнопка -->
                        <div 
                            class="flex items-center gap-2 px-4 py-2 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors rounded-lg mx-1"
                            @click="createNewSession"
                        >
                            <span>Создать</span>
                            <i class="pi pi-plus" />
                        </div>

                        <!-- Динамические заголовки сессий -->
                        <Tab v-for="session in sessions" :key="session.id" :value="session.id">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-file" />
                                <span>{{ session.name }}</span>
                                <i class="pi pi-times hover:bg-gray-200 p-1 border-round cursor-pointer"
                                    style="font-size: 0.8rem" @click.stop="closeSession(session.id)" />
                            </div>
                        </Tab>
                    </TabList>

                    <!-- КОНТЕНТ -->
                    <TabPanels>
                        <TabPanel value="tab-home">
                            <div class="flex flex-wrap gap-4">
                                <TemplateCardMini v-for="item in templatesMocks" :key="item.id" v-bind="item"
                                    @click="openTemplate(item.id)" />
                            </div>
                        </TabPanel>

                        <TabPanel value="tab-public">
                            <div class="flex flex-col items-center justify-center h-96 text-zinc-500">
                                <i class="pi pi-inbox text-4xl mb-4 opacity-50"></i>
                                <p class="text-lg">Вы пока не опубликовали ничего</p>
                            </div>
                        </TabPanel>

                        <!-- Динамические панели для каждой сессии -->
                        <TabPanel v-for="session in sessions" :key="session.id" :value="session.id">
                            <BoardViewer :session-id="session.id" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
    <AuthPage v-else />
</template>

<script setup>
import { ref, watch } from 'vue';

import { useUserStore } from '../../store/user';
import TemplateCardMini from './TemplateCardMini.vue';
import AuthPage from '../AuthPage.vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import BoardViewer from '../../customCanvas/BoardViewer.vue';

const userStore = useUserStore();
const activeTabValue = ref('tab-home');
const sessions = ref([]);

// Загрузка сессий из localStorage при старте
const loadSessions = () => {
    const saved = localStorage.getItem('canvasSessions');
    if (saved) {
        try {
            sessions.value = JSON.parse(saved);
        } catch (e) {
            console.log('Failed to load sessions');
        }
    }
};

// Сохранение сессий
const saveSessions = () => {
    localStorage.setItem('canvasSessions', JSON.stringify(sessions.value));
};

// Создать новую сессию
const createNewSession = () => {
    const sessionId = `session_${Date.now()}`;
    const sessionNumber = sessions.value.length + 1;
    
    const newSession = {
        id: sessionId,
        name: `Проект ${sessionNumber}`,
        createdAt: Date.now()
    };
    
    sessions.value.push(newSession);
    saveSessions();
    
    // Инициализируем пустое состояние для новой сессии
    localStorage.setItem(`canvasState_${sessionId}`, JSON.stringify({
        nodes: [],
        connections: [],
        nextNodeId: 1,
        nextZIndex: 1
    }));
    
    // Переключаемся на новую сессию
    activeTabValue.value = sessionId;
};

// Открыть существующий шаблон
const openTemplate = (id) => {
    // Проверяем, не открыт ли уже
    const existing = sessions.value.find(s => s.id === `template_${id}`);
    if (existing) {
        activeTabValue.value = existing.id;
        return;
    }
    
    const sessionId = `template_${id}`;
    const newSession = {
        id: sessionId,
        name: `Шаблон ${id}`,
        createdAt: Date.now(),
        templateId: id
    };
    
    sessions.value.push(newSession);
    saveSessions();
    
    activeTabValue.value = sessionId;
};

// Закрыть сессию
const closeSession = (sessionId) => {
    const index = sessions.value.findIndex(s => s.id === sessionId);
    if (index === -1) return;
    
    // Переключение при закрытии
    if (activeTabValue.value === sessionId) {
        if (index > 0) {
            activeTabValue.value = sessions.value[index - 1].id;
        } else {
            activeTabValue.value = 'tab-home';
        }
    }
    
    // Удаляем сессию и её данные
    sessions.value.splice(index, 1);
    localStorage.removeItem(`canvasState_${sessionId}`);
    localStorage.removeItem(`canvasViewport_${sessionId}`);
    saveSessions();
};

// Загружаем сессии при монтировании
loadSessions();

// Демо-шаблоны для вкладки "Мои"
const templatesMocks = [
    { id: 1, name: 'Персонаж', date: 'demo' },
    { id: 2, name: 'Селфи', date: 'demo' },
    { id: 3, name: 'Новый год', date: 'demo' },
];

watch(() => activeTabValue.value, (newValue) => {
    console.log('Active tab:', newValue);
});
</script>
