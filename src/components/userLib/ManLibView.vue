<template>
    <div v-if="userStore.user" class="min-h-[95vh] text-white flex flex-col items-center justify-center gap-50 ">
        <div class="main-block w-[50%] min-h-[95vh]  border-l border-r border-slate-700 ">
            <div class="tabs ">
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Мои <i class="pi pi-user" /> </Tab>
                        <Tab value="1">Опубликованные <i class="pi pi-globe" /></Tab>
                        <Tab value="2">Создать <i class="pi pi-plus" /></Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <p class="m-0">
                            <div class="flex flex-wrap gap-4">
                                <TemplateCardMini v-for="item in templatesMocks" :key="item.id" v-bind="item" @click="openTemplate(item.id, item.type)" />
                            </div>
                            </p>
                        </TabPanel>
                        <TabPanel value="1">
                            <p class="m-0">
                            <div v-if="publickMock" class="flex flex-wrap gap-4"></div>
                            <div v-else> Пока нет опубликованных шаблонов</div>
                            </p>
                        </TabPanel>
                        <TabPanel value="2">
                            <p class="m-0">
                            <div class="flex flex-wrap gap-4">
                                <ProjCard v-for="item in projectTemplates" :key="item.id" v-bind="item" @click="createNewTemplate(item)"/>
                            </div>
                            </p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    </div>
      <AuthPage v-else />
</template>

<script setup>

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import TemplateCardMini from './TemplateCardMini.vue';
import ProjCard from './ProjCard.vue';
import { useRouter } from 'vue-router';
import AuthPage from '../AuthPage.vue';
import { useUserStore } from '../../store';

const userStore = useUserStore()
const router = useRouter();



const createNewTemplate = (item) => {
    if (item.available === false) return
    else {
    router.push('/prompting/1')
    }
}

const openTemplate = (id, type) => {
  router.push(`/prompting/${id}/${type}`);
};


const templatesMocks = [
    {
        id: 1,
        name: 'Персонаж',
        date: '22/03',
        type: 'hero'
    }, 
    {
        id: 2,
        name: 'Селфи',
        date: '22/03',
        type: 'selfie'
    }

]

const projectTemplates = [
    {
        id: 1,
        title: 'hero',
        type: 'hero',
        description: 'создай шаблон персонажа и используй его в других генерациях',
        available: true
    },
    {
        id: 2,
        title: 'selfie',
        type: 'selfie',
        description: 'шаблон для промптинга реалистичных селфи',
        available: false
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
