<template>
  <Toast />
  <div v-if="userStore.user" class="w-[100%] h-[90vh] relative overflow-hidden">
    <!-- Режим: {{ currentMode }}/id: {{ route.params.templateId }} -->
    <BaklavaEditor :view-model="baklava">
      <template #palette>
        <Panel header="Библиотека нод"
          class="absolute top-20 left-5 w-80 max-h-[calc(100vh-2.5rem)] flex flex-col z-50 border border-zinc-800 text-white backdrop-blur-md shadow-2xl rounded-xl">
          <template #icons>
            <span class="text-[10px] text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-700 mr-2">{{ nodes.length
            }} кат.</span>
          </template>

          <div class="p-2">
            <!-- selectionMode="single" и @nodeSelect="onNodeSelect" делают всю магию -->
            <Tree :value="nodes" v-model:expandedKeys="expandedKeys" :filter="true" filterMode="lenient"
              selectionMode="single" class="w-full !bg-transparent !border-none !p-0" @nodeSelect="onNodeSelect">
              <template #node="{ node }">
                <div v-if="node.data?.type"
                  class="group flex items-center justify-between w-full cursor-pointer py-1.5 px-1 hover:bg-zinc-800 rounded transition-all">

                  <div class="flex items-center">
                    <div
                      class="flex items-center justify-center w-6 h-6 rounded bg-zinc-800 group-hover:bg-zinc-700 mr-3 transition-colors border border-zinc-700/50">

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

    <Panel header="Промт-превью"
      class="absolute flex flex-col right-2.5 bottom-2.5 z-[100] w-1/3 max-h-1/2 overflow-auto p-3 rounded-xl border border-zinc-800 bg-black/80 text-white text-xs backdrop-blur-md shadow-2xl"
      toggleable>
      <pre class="h-80 overflow-auto  font-mono text-xs">{{ exportedJson }}</pre>
      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div class="flex items-center gap-2">
            <Button raised label="Копировать" @click="copyJson" severity="primary" icon="pi pi-copy" rounded text
              size="small"></Button>
            <Button @click="saveProject" raised icon="pi pi-bookmark" severity="secondary" rounded text size="small"
              class="!text-zinc-400 hover:!text-white"></Button>
              <Button label="Сгенерировать(beta)"></Button>
          </div>
          <span class="text-zinc-600 font-mono">{{ exportedJson.length }} chars</span>
        </div>
      </template>
    </Panel>
  </div>
  <AuthPage v-else />
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue"; // убрал defineProps из импорта (он макрос)
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

import { mouthPresets, eyePresets, hairPresets, lightingPresets, nosePresets, skinPresets } from "./nodes/presets";
import { characterType, environmentType, lightType, skinType, noseType, mouthType, eyeType, hairType } from "./nodes/types";
import { CompositionNode, EnvironmentNode, CharacterNode, LightingNode, CharacterFullNode, SkinNode, NoseNode, MouthNode, EyesNode, HairNode, ResultNode } from "../components/nodes/nodes";
import { exportSceneTemplateFromBaklavaState } from "../utils/exportScene";
import { exportPersonTemplateFromBaklavaState } from "../utils/exportPerson";
import { PROJECTS_MOCK } from "../data/ProjMocks";

const userStore = useUserStore();
const toast = useToast();
const route = useRoute();

const baklava = useBaklava();
const editor = baklava.editor;

const nodeInterfaceTypes = new BaklavaInterfaceTypes(editor, { viewPlugin: baklava });
nodeInterfaceTypes.addTypes(characterType, environmentType, lightType, skinType, noseType, mouthType, eyeType, hairType);

editor.registerNodeType(CompositionNode);
editor.registerNodeType(CharacterNode);
editor.registerNodeType(CharacterFullNode);
editor.registerNodeType(LightingNode);
editor.registerNodeType(EnvironmentNode)
editor.registerNodeType(SkinNode);
editor.registerNodeType(NoseNode);
editor.registerNodeType(MouthNode);
editor.registerNodeType(EyesNode);
editor.registerNodeType(HairNode);
editor.registerNodeType(ResultNode);

// --- ИСПРАВЛЕНИЕ 1: Правильные типы Props ---
const props = defineProps({
  templateId: {
    type: Number,
    default: 0
  }, 
  templateMode: {
    type: String,
    default: 'default'
  }
})

const getJson = () => {
    // Получаем объект состояния
    const state = editor.save();
    
    // Превращаем в строку (если нужно скопировать или отправить на бэк)
    const jsonString = JSON.stringify(state, null, 2); 
    
    console.log(jsonString);
    return jsonString;
}

const currentMode = ref(props.templateMode); 

const tick = ref(0);
const expandedKeys = ref({ 'scene': true, 'char_simple_group': true, 'char_advanced_group': true, 'equip': true });

const loadProjectFromMock = () => {

  const projectId = props.templateId;
  const projectData = PROJECTS_MOCK[projectId];

  if (projectData) {
    // toast.add({ severity: 'success', summary: 'Success', detail: 'Проект загружен', life: 1000 });
    try {
      editor.load(projectData);
      showToast("done");
      console.log(`Проект ${projectId} успешно загружен`);
    } catch (e) {
      console.error("Ошибка при загрузке проекта:", e);
      showToast("error");
    }
  } else {
    console.warn(projectId, "Проект с таким ID не найден в моках");
  }
};

const copyJson = async () => {
  getJson();
  try {
    
    await copyToClipboard(exportedJson.value);
    showToast("done");
  } catch (error) {
    console.error(error);
    showToast("error");
  }
}

const showToast = (arg) => {
  if (arg === "done") {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Готово', life: 1000 });
  } else if (arg === "error") {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ошибка', life: 1000 });
  }
};

const allNodeGroups = {
  composition: {
    key: 'scene',
    label: 'Сцена',
    icon: 'pi pi-globe',
    children: [
      { key: 'comp', label: 'Композиция', icon: 'pi pi-image', data: { type: CompositionNode } },
      { key: 'env', label: 'Окружение', icon: 'pi pi-plus', data: { type: EnvironmentNode } }
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
  environments: {
    key: 'env',
    label: 'Окружение',
    icons: 'pi pi-sun',
    children: [
      { key: 'env', label: 'Окружени', icon: 'pi pi-plus', data: { type: EnvironmentNode } }
    ]
  }, 
  other: {
    key: 'other',
    label: 'Другое',
    icon: 'pi pi-sun',
    children: [
     {key:'result',label:'Результат',icon:'pi pi-plus',data:{type:ResultNode}}
    ]
  }
};

const nodes = computed(() => {
  // --- ИСПРАВЛЕНИЕ 3: Используем props.templateMode вместо props.mode ---
  console.log('nodes recomputed, currentMode:', props.templateMode);
  
  if (props.templateMode === 'default') {
    return [allNodeGroups.advanced_char];
  }
  if (props.templateMode === 'person') {
    return [allNodeGroups.advanced_char];
  }
  if (props.templateMode === 'selfie') {
    return [
      allNodeGroups.composition,
      allNodeGroups.simple_char,
      allNodeGroups.equipment,
      allNodeGroups.other
    ]
  }
  return [
    allNodeGroups.composition,
    allNodeGroups.simple_char,
    allNodeGroups.advanced_char,
    allNodeGroups.equipment
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
    const hasFullChar = state.nodes.some(n => n.type === "CharacterFullNode");
    if (hasFullChar) {
      const out = exportPersonTemplateFromBaklavaState(state, {
        skinPresets, nosePresets, mouthPresets, eyePresets, hairPresets
      });
      return JSON.stringify(out, null, 2);
    } else {
      const out = exportSceneTemplateFromBaklavaState(state, { lightingPresets });
      return JSON.stringify(out, null, 2);
    }
  } catch (e) {
    return JSON.stringify({ error: "Export failed", details: e.message }, null, 2);
  }
});


watch(() => props.templateId, (newId) => {
    console.log('Template ID changed to:', newId);
    if (newId !== undefined) {
        loadProjectFromMock();
    }
});


watch(() => props.templateMode, (newMode) => {
    console.log('Template Mode changed to:', newMode);
    currentMode.value = newMode;
    // computed свойство 'nodes' обновится автоматически, так как зависит от props.templateMode
});

onMounted(() => {

  currentMode.value = props.templateMode;
  setInterval(() => tick.value++, 250);
  loadProjectFromMock();
  
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
