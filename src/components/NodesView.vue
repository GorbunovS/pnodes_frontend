<template>

  <Dialog 
    v-model:visible="tokenDialog" 
    header="Введите API токен GenAPI.ru" 
    modal 
    :style="{ width: '450px' }"
    :closable="false"
  >
    <div class="p-4 space-y-4">
      <p class="text-sm text-zinc-400">
        Получите токен в личном кабинете <strong>gen-api.ru</strong>
      </p>
      
      <div class="flex flex-col gap-2">
        <label class="text-xs font-medium">API Токен</label>
        <InputText 
          v-model="newToken"
          placeholder="sk-..."
          class="w-full p-3 text-sm border border-zinc-700 rounded-lg bg-zinc-900/50"
          autofocus
        />
      </div>
      
      <div class="flex gap-3 pt-4">
        <Button 
          label="Отмена" 
          text 
          severity="secondary"
          @click="tokenDialog = false"
          class="flex-1"
        />
        <Button 
          label="Сохранить и генерировать" 
          @click="saveToken"
          :loading="newToken.length < 5"
          :disabled="!newToken.trim()"
          severity="primary"
          class="flex-1"
          autofocus
        />
      </div>
    </div>
  </Dialog>

  <Toast />
  <div v-if="userStore.user" class="w-[100%] h-[90vh] relative overflow-hidden">
    <BaklavaEditor :view-model="baklava">
      <template #palette>
        <Panel 
          header="Библиотека нод"
          class="absolute top-20 left-5 w-80 max-h-[calc(100vh-2.5rem)] flex flex-col z-50 border border-zinc-800 text-white backdrop-blur-md shadow-2xl rounded-xl"
        >
          <template #icons>
            <span class="text-[10px] text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-700 mr-2">{{ nodes.length }} кат.</span>
          </template>

          <div class="p-2">
            <Tree 
              :value="nodes" 
              v-model:expandedKeys="expandedKeys" 
              :filter="true" 
              filterMode="lenient"
              selectionMode="single" 
              class="w-full !bg-transparent !border-none !p-0" 
              @nodeSelect="onNodeSelect"
            >
              <template #node="{ node }">
                <div v-if="node.data?.type"
                  class="group flex items-center justify-between w-full cursor-pointer py-1.5 px-1 hover:bg-zinc-800 rounded transition-all">
                  <div class="flex items-center">
                    <div class="flex items-center justify-center w-6 h-6 rounded bg-zinc-800 group-hover:bg-zinc-700 mr-3 transition-colors border border-zinc-700/50">
                    </div>
                    <span class="text-zinc-300 text-sm font-medium group-hover:text-white">{{ node.label }}</span>
                  </div>
                </div>

                <div v-else class="font-bold text-zinc-500 py-2 text-[10px] uppercase tracking-widest mt-1 ml-1">
                  {{ node.label }}
                </div>
              </template>
            </Tree>
          </div>
        </Panel>
      </template>
    </BaklavaEditor>
<!-- 
    <Panel 
      header="Результат последней генерации (beta)" 
      class="absolute flex flex-col right-2.5 top-2.5 z-[100] w-1/5 max-h-1/2 overflow-auto p-3 rounded-xl border border-zinc-800 bg-black/80 text-white text-xs backdrop-blur-md shadow-2xl"
    >
      <Image :src="imageResult" width="250" preview></Image>
    </Panel> -->

    <Panel 
      header="Промт-превью"
      class="absolute flex flex-col right-2.5 bottom-2.5 z-[100] w-1/3 max-h-1/2 overflow-x-hidden p-3 rounded-xl border border-zinc-800 bg-black/80 text-white text-xs backdrop-blur-md shadow-2xl"
      toggleable
    >
      <pre class="p-2 h-60 overflow-x-hidden font-mono text-xs">{{ exportedJson }}</pre>
      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div class="flex items-center gap-2">
            <Button raised label="Копировать" @click="copyJson" severity="primary" icon="pi pi-copy" rounded text size="small"></Button>
            <Button @click="saveProject" raised icon="pi pi-bookmark" severity="secondary" rounded text size="small" class="!text-zinc-400 hover:!text-white"></Button>
          </div>
          <span class="text-zinc-600 font-mono">{{ exportedJson.length }} chars</span>
        </div>
      </template>
    </Panel>
  </div>

  <AuthPage v-else />
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '../store/user';
import AuthPage from './AuthPage.vue';
import Toast from 'primevue/toast';
import { BaklavaEditor, useBaklava } from "baklavajs";
import { Panel } from "primevue";
import Button from "primevue/button";
import Tree from 'primevue/tree';
import "@baklavajs/themes/dist/syrup-dark.css";
import { BaklavaInterfaceTypes } from "@baklavajs/interface-types";
import { copyToClipboard } from "../utils/helpers";
import { useAiApiStore } from "../store/aistore";

import { mouthPresets, eyePresets, hairPresets, lightingPresets, nosePresets, skinPresets } from "./nodes/presets";
import { styleTypes, characterType, environmentType, lightType, skinType, noseType, mouthType, eyeType, hairType, cameraType } from "./nodes/types";
import { CompositionNode, EnvironmentNode, CharacterNode, LightingNode, CameraNode, CharacterFullNode, SkinNode, NoseNode, MouthNode, EyesNode, HairNode, ResultNode, StyleNode } from "../components/nodes/nodes";
import { exportSceneTemplateFromBaklavaState } from "../utils/exportScene";
import { exportPersonTemplateFromBaklavaState } from "../utils/exportPerson";
import { exportUniversalFromBaklavaState } from "../utils/exportUniversal";
import { PROJECTS_MOCK } from "../data/ProjMocks";
import {Dialog} from "primevue";
import InputText from 'primevue/inputtext';
import { label } from "@primeuix/themes/aura/metergroup";
import { icon } from "@primeuix/themes/aura/avatar";
import { date } from "@primeuix/themes/aura/datepicker";



const userStore = useUserStore();
const toast = useToast();
const route = useRoute();
const aistore = useAiApiStore();


const tokenDialog = ref(false);
const newToken = ref('');

const baklava = useBaklava();
const viewModel = baklava.viewModel;     
const editor = baklava.editor;


const imageResult = computed(() => aistore.result);

const nodeInterfaceTypes = new BaklavaInterfaceTypes(editor, { viewPlugin: baklava });
nodeInterfaceTypes.addTypes(styleTypes, characterType, environmentType, lightType, skinType, noseType, mouthType, eyeType, hairType,cameraType);

editor.registerNodeType(CompositionNode);
editor.registerNodeType(CharacterNode);
editor.registerNodeType(CharacterFullNode);
editor.registerNodeType(LightingNode);
editor.registerNodeType(EnvironmentNode);
editor.registerNodeType(SkinNode);
editor.registerNodeType(NoseNode);
editor.registerNodeType(MouthNode);
editor.registerNodeType(EyesNode);
editor.registerNodeType(HairNode);
editor.registerNodeType(ResultNode);
editor.registerNodeType(CameraNode);
editor.registerNodeType(StyleNode);

const props = defineProps({
  templateId: { type: Number, default: 0 },
  templateMode: { type: String, default: 'default' },
  isOpen:{
    type: Boolean, default: false
  }
});



const getJson = () => {
  const state = editor.save();
  return JSON.stringify(state, null, 2);
};

const generate = async () => {
  if (!aistore.gen_token) {
    tokenDialog.value = true
    return
  }
  try {
    const promptText = exportedJson.value   
    await aistore.generateImage(promptText, { width: 1024, height: 1024 })
    toast.add({ severity: 'success', summary: 'Генерация запущена!', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Ошибка генерации', detail: err.message, life: 5000 })
  }
}

const saveToken = () => {
  if (!newToken.value.trim()) {
    toast.add({ severity: 'warn', summary: 'Введите токен!', life: 3000 });
    return;
  }

  localStorage.setItem('ai_api_token', newToken.value);
  aistore.gen_token = newToken.value;
  
  tokenDialog.value = false;
  newToken.value = '';
  
  toast.add({ severity: 'success', summary: 'Токен сохранен!', detail: 'Можете генерировать!', life: 3000 });
  
  generate();
};

onMounted(() => {
  const savedToken = localStorage.getItem('ai_api_token');
  if (savedToken && aistore.gen_token !== savedToken) {
    aistore.gen_token = savedToken;
  }
});

const currentMode = ref(props.templateMode);
const tick = ref(0);
const expandedKeys = ref({ 
  'scene': false, 
  'char_simple_group': false, 
  'char_advanced_group': false, 
  'equip': false 
});

const loadProjectFromMock = () => {
  const projectId = props.templateId;
  const projectData = PROJECTS_MOCK[projectId];

  if (projectData) {
    try {
      editor.load(projectData);
      toast.add({ severity: 'success', summary: 'Проект загружен', life: 1000 });
    } catch (e) {
      console.error("Ошибка при загрузке проекта:", e);
      toast.add({ severity: 'error', summary: 'Ошибка загрузки проекта', life: 2000 });
    }
  }
};

const copyJson = async () => {
  try {
    await copyToClipboard(exportedJson.value);
    toast.add({ severity: 'success', summary: 'Скопировано', life: 1000 });
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Не удалось скопировать', life: 2000 });
  }
};

const allNodeGroups = {
  composition: {
    key: 'scene',
    label: 'Сцена',
    icon: 'pi pi-globe',
    children: [
      { key: 'comp', label: 'Композиция', icon: 'pi pi-image', data: { type: CompositionNode } },
      { key: 'env', label: 'Окружение', icon: 'pi pi-plus', data: { type: EnvironmentNode } },
      {key:'camera', label: 'Камера', icon: 'pi pi-plus', data:{type:CameraNode}}
    ]
  },
    other: {
    key: 'other',
    label: 'Результат',
    children: [
      { key: 'result', label: 'Результат', icon: 'pi pi-plus', data: { type: ResultNode } }
    ]
  },
  simple_char: {
    key: 'char_simple_group',
    label: 'Простой персонаж',
    icon: 'pi pi-user',
    children: [
      { key: 'char_basic', label: 'Персонаж (Basic)', icon: 'pi pi-user', data: { type: CharacterNode } }
    ]
  },
  advanced_char: {
    key: 'char_advanced_group',
    label: 'Конструктор Лица',
    icon: 'pi pi-id-card',
    children: [
      { key: 'char_full', label: 'Мастер Персонаж', icon: 'pi pi-user', data: { type: CharacterFullNode } },
      { key: 'skin', label: 'Кожа', icon: 'pi pi-plus', data: { type: SkinNode } },
      { key: 'nose', label: 'Нос', icon: 'pi pi-plus', data: { type: NoseNode } },
      { key: 'mouth', label: 'Рот', icon: 'pi pi-plus', data: { type: MouthNode } },
      { key: 'eyes', label: 'Глаза', icon: 'pi pi-plus', data: { type: EyesNode } },
      { key: 'hair', label: 'Волосы', icon: 'pi pi-plus', data: { type: HairNode } },
      
    ]
  },
  equipment: {
    key: 'equip',
    label: 'Оборудование',
    icon: 'pi pi-sun',
    children: [
      { key: 'light', label: 'Источник света', icon: 'pi pi-plus', data: { type: LightingNode } }
    ]
  },
  styleTypes: {
    key:'style',
    label: 'Стили',
    icon:'pi pi-pen',
    children:[
      { key: 'style', label: 'Стили', icon: 'pi pi-plus', data: { type: StyleNode } }
    ]
  },

};

const nodes = computed(() => {
  if ( props.templateMode === 'person') {
    return [allNodeGroups.advanced_char,allNodeGroups.other];
  }
 if (props.templateMode === 'default') {
  [
      allNodeGroups.composition,
      allNodeGroups.other,

  ]
 }

  if (props.templateMode === 'selfie') {
    return [
      allNodeGroups.composition,
      allNodeGroups.simple_char,
      allNodeGroups.equipment,
      allNodeGroups.other
    ];
  }
  return [
    allNodeGroups.composition,
    allNodeGroups.other,
    allNodeGroups.simple_char,
    allNodeGroups.advanced_char,
    allNodeGroups.equipment,
    allNodeGroups.styleTypes,
    
  ];
});

const onNodeSelect = (node) => {
  if (node.data && node.data.type) {
    const instance = new node.data.type();
    editor.graph.addNode(instance);

    if (!instance.position) instance.position = { x: 0, y: 0 };
    instance.position.x = 500 + (Math.random() * 50);
    instance.position.y = 300 + (Math.random() * 50);
  }
};

const graph = computed(() => editor.graph);

const exportedJson = computed(() => {
  void tick.value;
  try {
    const state = graph.value.save();
    const out = exportUniversalFromBaklavaState(state);
    return JSON.stringify(out, null, 2);
  } catch (e) {
    return JSON.stringify({ error: "Export failed", details: e.message }, null, 2);
  }
});



watch(() => props.templateId, (newId) => {
  if (newId !== undefined) {
    loadProjectFromMock();
  }
});

watch(()=> exportedJson.value, (newPromt) =>{
  aistore.updatePromt(newPromt) 
}
);

watch(()=> props.isOpen, () => {
 if( props.isOpen){
   aistore.updatePromt(exportedJson.value)
 }
})

watch(() => props.templateMode, (newMode) => {
  currentMode.value = newMode;
});

onMounted(() => {
  currentMode.value = props.templateMode;
  setInterval(() => tick.value++, 250);
  loadProjectFromMock();
  aistore.updatePromt(exportedJson.value)
  
});


</script>

<style>
.baklava-node-interface[data-interface-type="character"] .__port {
  background-color: rgb(210, 251, 210);
}
.baklava-node-interface[data-interface-type="environment"] .__port {
  background-color: rgb(255, 207, 207);
}
.baklava-node-interface[data-interface-type="light"] .__port {
  background-color: rgb(240, 0, 240);
}
.baklava-node-interface[data-interface-type="skin"] .__port {
  background-color: rgb(0, 195, 255);
}
</style>