<template>
    <div class="min-h-[95vh] text-white flex flex-col items-center justify-center gap-50 ">
        <div class="main-block w-[50%] min-h-[95vh]  border-l border-r border-slate-700 ">
            <div class="tabs ">
                <Tabs value="0">
                    <TabList>
                        <Tab value="0">Мои <i class="pi pi-user" /> </Tab>
                        <Tab value="1">Опубликованные <i class="pi pi-globe" /></Tab>

                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <p class="m-0">
                            <div class="flex flex-wrap gap-4">
                                <TemplateCardMini v-for="item in templatesMocks" :key="item.id" v-bind="item" />
                            </div>
                            </p>
                        </TabPanel>
                        <TabPanel value="1">
                            <p class="m-0">
                            </p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
        </div>
</template>

<script setup>

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import TemplateCardMini from './TemplateCardMini.vue';

const templatesMocks = [
    {
        id: 1,
        name: "Геральд",
        date: "22/03",
        type: "HERO"
    },
    {
        id: 2,
        name: "Я",
        date: "22/03",
        type: "SELFIE"
    },
    {
        id: 3,
        name: "Бенжи",
        date: "22/03",
        type: "HERO"
    },
    {
        id: 4,
        name: "Нолан",
        date: "22/03",
        type: "CINEMATIC"
    }
]

</script>
