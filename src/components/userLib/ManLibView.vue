<template>
    <div v-if="userStore.user" class="min-h-[95vh] text-white flex flex-col items-center justify-center gap-50">
        <div class="main-block w-full min-h-[95vh] border-l border-r border-slate-700">
            <div class="tabs">
                <!-- В v4 используется v-model:value, а не activeIndex -->
                <Tabs v-model:value="activeTabValue" scrollable>

                    <!-- ЗАГОЛОВКИ -->
                    <TabList>
                        <Tab value="tab-home">Мои <i class="pi pi-user" /></Tab>
                        <Tab value="tab-public">Опубликованные <i class="pi pi-globe" /></Tab>
                        <Tab value="tab-create">Создать <i class="pi pi-plus" /></Tab>

                        <!-- Динамические заголовки -->
                        <Tab v-for="project in openProjects" :key="project.uniqueId" :value="project.uniqueId">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-file" />
                                <span>{{ project.name }}</span>
                                <i class="pi pi-times hover:bg-gray-200 p-1 border-round cursor-pointer"
                                    style="font-size: 0.8rem" @click.stop="closeProjectTab(project.uniqueId)" />
                            </div>
                        </Tab>
                    </TabList>

                    <!-- КОНТЕНТ -->
                    <TabPanels>
                        <TabPanel value="tab-home">
                            <div class="flex flex-wrap gap-4">
                                <TemplateCardMini v-for="item in templatesMocks" :key="item.id" v-bind="item"
                                    @click="openTemplate(item.id, item.type)" />
                            </div>
                        </TabPanel>

                        <TabPanel value="tab-public">
                            <div v-if="false" class="flex flex-wrap gap-4"></div>
                            <div v-else>Пока нет опубликованных шаблонов</div>
                        </TabPanel>

                        <TabPanel value="tab-create">
                            <div class="flex flex-wrap gap-4">
                                <ProjCard v-for="item in projectTemplates" :key="item.id" v-bind="item"
                                    @click="createNewTemplate(item.type)" />
                            </div>
                        </TabPanel>

                        <!-- !!! ГЛАВНОЕ ИСПРАВЛЕНИЕ !!! -->
                        <!-- Создаем панель ДИНАМИЧЕСКИ для каждого проекта -->
                        <TabPanel v-for="project in openProjects" :key="project.uniqueId" :value="project.uniqueId">
                            <!-- Передаем параметры в компонент -->
                            <NodesView :templateId="project.originalId" :templateMode="project.type" />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
    <AuthPage v-else />
</template>

<script setup>
import { ref } from 'vue';

import { useUserStore } from '../../store/user'; // Проверь путь
import NodesView from '../NodesView.vue'; // Проверь путь
import TemplateCardMini from './TemplateCardMini.vue'; // Проверь путь
import ProjCard from './ProjCard.vue'; // Проверь путь
import AuthPage from '../AuthPage.vue'; // Проверь путь

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const userStore = useUserStore();
const activeTabValue = ref('tab-home');
const openProjects = ref([]);


const openTemplate = (id, type) => {

    const uniqueTabId = `proj_${id}`;


    const existing = openProjects.value.find(p => p.uniqueId === uniqueTabId);

    if (!existing) {
        openProjects.value.push({
            uniqueId: uniqueTabId,
            originalId: id,
            name: `${type} #${id}`,
            type: type
        });
    }


    setTimeout(() => {
        activeTabValue.value = uniqueTabId;
    }, 50);
};

const createNewTemplate = (type) => {

    const tempId = Date.now();
    const uniqueTabId = `new_${tempId}`;

    openProjects.value.push({
        uniqueId: uniqueTabId,
        originalId: tempId, // Или 0, если это совсем новый
        name: `New ${type}`,
        type: type
    });

    setTimeout(() => {
        activeTabValue.value = uniqueTabId;
    }, 50);
}

const closeProjectTab = (uniqueTabId) => {
    const index = openProjects.value.findIndex(p => p.uniqueId === uniqueTabId);
    if (index === -1) return;

    // Логика переключения при закрытии
    if (activeTabValue.value === uniqueTabId) {
        if (index > 0) {

            activeTabValue.value = openProjects.value[index - 1].uniqueId;
        } else {

            activeTabValue.value = 'tab-create';
        }
    }

    openProjects.value.splice(index, 1);
};

const templatesMocks = [
    { id: 1, name: 'Персонаж', date: 'demo', type: 'person' },
    { id: 2, name: 'Селфи', date: 'demo', type: 'selfie' }
];

const projectTemplates = [
    {
        id: 1,
        title: 'person',
        type: 'person',
        description: 'создай шаблон персонажа и используй его в других генерациях',
        available: true
    },
    {
        id: 2,
        title: 'selfie',
        type: 'selfie',
        description: 'шаблон для промптинга реалистичных селфи',
        available: true
    },
    {
        id: 3,
        title: 'fashion',
        type: 'fashion',
        description: 'отлично подходит для генерации фешн презентаций одежды и аксессуаров',
        available: false
    },
    {
        id: 4,
        title: 'cinematic',
        type: 'cinematic',
        description: 'акцентирован на промптинге кинематографичных сцен и кадров расширенный набор освещения/камер/оптики',
        available: false
    }
]

</script>
