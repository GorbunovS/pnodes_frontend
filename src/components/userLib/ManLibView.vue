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

                        <!-- Динамические заголовки открытых вкладок -->
                        <Tab v-for="session in openTabsSessions" :key="session.id" :value="session.id">
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
                        <!-- Вкладка "Мои" - список сохранённых проектов -->
                        <TabPanel value="tab-home">
                            <div class="flex flex-wrap gap-4 p-4">
                                <ProjCard 
                                    v-for="session in savedSessions" 
                                    :key="session.id" 
                                    :id="session.id"
                                    :name="session.name"
                                    :createdAt="session.createdAt"
                                    @click="openSession(session.id)"
                                />
                                <!-- Пустое состояние -->
                                <div v-if="savedSessions.length === 0" class="flex flex-col items-center justify-center w-full h-64 text-zinc-500">
                                    <i class="pi pi-folder-open text-4xl mb-4 opacity-50"></i>
                                    <p class="text-lg">Нет сохранённых проектов</p>
                                    <p class="text-sm text-zinc-600">Нажмите "Создать" или сохраните текущую сессию</p>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel value="tab-public">
                            <div class="flex flex-col items-center justify-center h-96 text-zinc-500">
                                <i class="pi pi-inbox text-4xl mb-4 opacity-50"></i>
                                <p class="text-lg">Вы пока не опубликовали ничего</p>
                            </div>
                        </TabPanel>

                        <!-- Динамические панели для каждой открытой вкладки -->
                        <TabPanel v-for="session in openTabsSessions" :key="session.id" :value="session.id">
                            <!-- Рендерим только активный таб, иначе данные из разных сессий смешаются -->
                            <BoardViewer v-if="activeTabValue === session.id" :session-id="session.id" />
                            <div v-else class="flex flex-col items-center justify-center h-96 text-zinc-600">
                                <i class="pi pi-folder text-4xl mb-4 opacity-30"></i>
                                <p>Проект свёрнут</p>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
    <AuthPage v-else />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../store/user';
import { useSessionStore } from '../../store/sessionStore';
import ProjCard from './ProjCard.vue';
import AuthPage from '../AuthPage.vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import BoardViewer from '../../customCanvas/BoardViewer.vue';

const userStore = useUserStore();
const sessionStore = useSessionStore();
const { savedSessions, openTabs, currentSessionId } = storeToRefs(sessionStore);

const activeTabValue = ref('tab-home');

// Вычисляем сессии для открытых вкладок
const openTabsSessions = computed(() => {
    return openTabs.value.map(id => sessionStore.getSessionById(id)).filter(Boolean);
});

// Создать новую сессию
const createNewSession = () => {
    const result = sessionStore.createSession();
    
    // Инициализируем пустое состояние для новой сессии
    localStorage.setItem(`canvasState_${result.sessionId}`, JSON.stringify({
        nodes: [],
        connections: [],
        nextNodeId: 1,
        nextZIndex: 1
    }));
    
    // Переключаемся на новую вкладку
    activeTabValue.value = result.sessionId;
};

// Открыть существующую сессию (из карточки)
const openSession = (sessionId) => {
    sessionStore.openTab(sessionId);
    activeTabValue.value = sessionId;
};

// Закрыть вкладку сессии
const closeSession = (sessionId) => {
    const index = openTabs.value.indexOf(sessionId);
    
    // Переключение при закрытии
    if (activeTabValue.value === sessionId) {
        if (index > 0) {
            activeTabValue.value = openTabs.value[index - 1];
        } else if (openTabs.value.length > 1) {
            activeTabValue.value = openTabs.value[1]; // первый после удалённого
        } else {
            activeTabValue.value = 'tab-home';
        }
    }
    
    // Закрываем вкладку через стор
    sessionStore.closeTab(sessionId);
};

watch(() => activeTabValue.value, (newValue) => {
    console.log('Active tab:', newValue);
    if (newValue && newValue !== 'tab-home' && newValue !== 'tab-public') {
        sessionStore.setCurrentSession(newValue);
    }
});
</script>
