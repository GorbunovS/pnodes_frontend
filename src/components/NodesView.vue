<template>
  <Toast/>
  <div class="w-screen h-[90vh]  relative overflow-auto">
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
            <Button raised label="Копировать" @click="copyJson" severity="primary" icon="pi pi-copy" rounded text size="small"
              ></Button>
            <Button raised icon="pi pi-bookmark" severity="secondary" rounded text size="small"
              class="!text-zinc-400 hover:!text-white"></Button>
          </div>
          <span class="text-zinc-600 font-mono">{{ exportedJson.length }} chars</span>
        </div>
      </template>
    </Panel>

  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();

import { BaklavaEditor, useBaklava } from "baklavajs";
import { Panel } from "primevue";
import Button from "primevue/button";
import Tree from 'primevue/tree';
import SelectButton from 'primevue/selectbutton';
import { mouthPresets, eyePresets, hairPresets, lightingPresets, nosePresets, skinPresets } from "./nodes/presets";
import "@baklavajs/themes/dist/syrup-dark.css";
import { BaklavaInterfaceTypes } from "@baklavajs/interface-types";
import { copyToClipboard } from "../utils/helpers";

import { characterType, environmentType, lightType, skinType, noseType, mouthType, eyeType, hairType } from "./nodes/types";
import { CompositionNode, CharacterNode, LightingNode, CharacterFullNode, SkinNode, NoseNode, MouthNode, EyesNode, HairNode } from "../components/nodes/nodes";


import { exportSceneTemplateFromBaklavaState } from "../utils/exportScene";
import { exportPersonTemplateFromBaklavaState } from "../utils/exportPerson";

const baklava = useBaklava();
const editor = baklava.editor;


const nodeInterfaceTypes = new BaklavaInterfaceTypes(editor, { viewPlugin: baklava });
nodeInterfaceTypes.addTypes(characterType, environmentType, lightType, skinType, noseType, mouthType, eyeType, hairType);


const modes = [
  { label: 'Полный режим', value: 'all' },
  { label: 'Конструктор Персоны', value: 'person' },
  { label: 'Сцена', value: 'scene' }
];


const currentMode = ref('person');

const copyJson = async ()  => {
  try { 
    await copyToClipboard(exportedJson.value);
    showToast("done");
  }
  catch (error) {
    console.error(error);
     showToast("error");
  }
}


const showToast = (arg) => {
  if (arg === "done") {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Промт скопирован', life: 1000 });
  }
  else if (arg === "error") {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 1000 });
  }
  
};

onMounted(() => {
  setInterval(() => tick.value++, 250);
});

const allNodeGroups = {
  composition: {
    key: 'scene',
    label: 'Сцена',
    icon: 'pi pi-globe',
    children: [
      { key: 'comp', label: 'Композиция', icon: 'pi pi-image', data: { type: CompositionNode } }
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
      { key: 'nose', label: 'Нос', icon: 'pi pi-plus', data: { type: NoseNode } }, // Иконки условные
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
  }
};


const nodes = computed(() => {
  if (currentMode.value === 'person') {

    return [allNodeGroups.advanced_char];
  }

  if (currentMode.value === 'scene') {

    return [
      allNodeGroups.composition,
      allNodeGroups.simple_char,
      allNodeGroups.equipment
    ];
  }


  return [
    allNodeGroups.composition,
    allNodeGroups.simple_char,
    allNodeGroups.advanced_char,
    allNodeGroups.equipment
  ];
});

const expandedKeys = ref({ 'scene': true, 'char_simple_group': true, 'char_advanced_group': true, 'equip': true });


const onNodeSelect = (node) => {
  if (node.data && node.data.type) {
    const instance = new node.data.type();
    editor.graph.addNode(instance);


    if (!instance.position) instance.position = { x: 0, y: 0 };
    instance.position.x = 500 + (Math.random() * 50);
    instance.position.y = 300 + (Math.random() * 50);
  }
};

const tick = ref(0);
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

</script>

<style>
/* Только оригинальные стили для портов */
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
