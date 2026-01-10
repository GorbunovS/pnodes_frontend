import {
  allowMultipleConnections,
  defineNode,
  NodeInterface,
  TextInputInterface,
  NumberInterface,
  SelectInterface,
  EditorComponent,
} from "baklavajs";
import { markRaw } from "vue";
import ImageInput from "./custom_nodes/ImageInput.vue";
import CustomActionBtn from "./custom_nodes/CustomActionBtn.vue";
import Button from "primevue/button";
import {
  setType,
  setTypeForMultipleConnections,
} from "@baklavajs/interface-types";

import {
  characterType,
  environmentType,
  lightType,
  skinType,
  cameraType,
  mouthType,
  noseType,
  hairType,
  eyeType,
} from "./types";
import { mouthPresets, eyePresets, hairPresets, lightingPresets, nosePresets, skinPresets, envPresets } from "./presets";



function makeSelect(name, defaultValue, items) {
  const options = items.map((item) => ({
    text: item.label,
    value: item.id,
  }));

  return new SelectInterface(name, defaultValue, options).setPort(false);
}

export const CompositionNode = defineNode({
  type: "CompositionNode",
  title: "Сцена (Composition)",
  inputs: {
    camera: () =>
      new NodeInterface("Камера", [])
        .use(allowMultipleConnections)
        .use(setTypeForMultipleConnections, cameraType),

    light: () =>
      new NodeInterface("Свет", [])
        .use(allowMultipleConnections)
        .use(setTypeForMultipleConnections, lightType),

    environment: () =>
      new NodeInterface("Окружение", [])
        .use(allowMultipleConnections)
        .use(setTypeForMultipleConnections, environmentType),

    character: () =>
      new NodeInterface("Персонажи", [])
        .use(allowMultipleConnections)
        .use(setTypeForMultipleConnections, characterType),

    use_photo_reference: () =>
      new SelectInterface("Фото референс", false, [
        { text: "Без референса", value: false },
        { text: "Использовать фото‑референс", value: true },
      ]).setPort(false),

    description: () =>
      new TextInputInterface("Описание", "Базовая сцена").setPort(false),
  },
});

export const LightingNode = defineNode({
  type: "LightingNode",
  title: "Свет (presets)",
  inputs: {
    type_preset: () => makeSelect("Тип света", "natural", lightingPresets.type),

    setup_preset: () =>
      makeSelect("Схема/Источник", "window_light_soft", lightingPresets.setup),

    direction_preset: () =>
      makeSelect("Направление", "frontal_up_45", lightingPresets.direction),

    quality_preset: () =>
      makeSelect("Качество теней", "soft_diffused", lightingPresets.quality),
    description: () => new TextInputInterface("Описание").setPort(false),
  },
  outputs: {
    light: () => new NodeInterface("Light", null).use(setType, lightType),
  },
});

export const EnvironmentNode = defineNode({
    type: "EnvironmentNode",
    title: "Окружение (presets)",
    inputs: {
        scene_type: () => new TextInputInterface("Место", "Фото студия (лофт)", envPresets.sceneType).setPort(false),
        background_mood: () => makeSelect("Фон / Настроение", "soft_depth_of_field", envPresets.backgroundMood),
        camera_framing: () => makeSelect("Кадрирование", "portrait_midshot", envPresets.cameraFraming),
        description: () => new TextInputInterface("Описание").setPort(false),
    },
    outputs: {
        environment: () => new NodeInterface("Окружение", null).use(setType, environmentType),
    },
  
});
export const CharacterNode = defineNode({
  type: "CharacterNode",
  title: "Персонаж",
  inputs: {
    gender: () =>
      new SelectInterface("Пол", "Male", ["Male", "Female"]).setPort(false),
    age: () => new NumberInterface("Возраст", 25).setPort(false),
    height: () => new NumberInterface("Рост (см)", 175).setPort(false),
    weight: () => new NumberInterface("Вес (кг)", 70).setPort(false),

    clothing: () => new TextInputInterface("Одежда", "{ОДЕЖДА}").setPort(false),
    emotion: () => new TextInputInterface("Эмоция", "{ЭМОЦИЯ}").setPort(false),
    pose: () =>
      new TextInputInterface(
        "Поза",
        "looking into camera, slight head tilt"
      ).setPort(false),
    action: () =>
      new TextInputInterface("Действие", "taking a selfie").setPort(false),

    description: () =>
      new TextInputInterface("Описание", "Главный герой").setPort(false),
  },
  outputs: {
    character: () =>
      new NodeInterface("Character", null).use(setType, characterType),
  },
});

export const CharacterFullNode = defineNode({
  type: "CharacterFullNode",
  title: "Персонаж2",
  inputs: {
    gender: () =>
      new SelectInterface("Пол", "Male", ["Male", "Female"]).setPort(false),
    age: () => new NumberInterface("Возраст", 25).setPort(false),
    height: () => new NumberInterface("Рост (см)", 175).setPort(false),
    weight: () => new NumberInterface("Вес (кг)", 70).setPort(false),
    skin: () =>
      new NodeInterface("Кожа", [])
        .use(allowMultipleConnections)
        .use(setTypeForMultipleConnections, skinType),
    nose: () => new NodeInterface("Нос", null).use(setType, noseType),
    mouth: () => new NodeInterface("Рот", null).use(setType, mouthType),
    eyes: () => new NodeInterface("Глаза", null).use(setType, eyeType),
    hair: () => new NodeInterface("Волосы", null).use(setType, hairType),
    description: () =>
      new TextInputInterface("Описание", "Родинка в виде сердца").setPort(
        false
      ),
  },
});

export const SkinNode = defineNode({
  type: "SkinNode",
  title: "Кожа (presets)",
  inputs: {
    type_preset: () =>
      makeSelect("Тип", "high_density_unretouched_matte", skinPresets.type),
    texture_preset: () =>
      makeSelect("Текстура", "subtle_texture", skinPresets.texture),
  },
  outputs: {
    skin: () => new NodeInterface("Кожа", null).use(setType, skinType),
  },
});

export const NoseNode = defineNode({
  type: "NoseNode",
  title: "Нос",
  inputs: {
    type_preset: () =>
      makeSelect("Тип формы", "straight_grecian", nosePresets.type),

    // Детали (Переносица + Кончик)
    bridge_preset: () =>
      makeSelect("Переносица", "straight_bridge", nosePresets.bridge),
    tip_preset: () => makeSelect("Кончик", "rounded_soft", nosePresets.tip),
    details: () => new TextInputInterface("Доп. детали", "").setPort(false),
  },
  outputs: {
    nose: () => new NodeInterface("Нос", null).use(setType, noseType),
  },
});

export const MouthNode = defineNode({
  type: "MouthNode",
  title: "Рот / Губы",
  inputs: {
    shape_preset: () => makeSelect("Форма", "heart_shaped", mouthPresets.shape),
    fullness_preset: () =>
      makeSelect("Объем", "full_plump", mouthPresets.fullness),
    cupids_bow: () =>
      makeSelect("Арка Купидона", "defined_sharp", mouthPresets.cupids_bow),
    corners: () =>
      makeSelect("Уголки губ", "neutral_straight", mouthPresets.corners),
    details: () =>
      new TextInputInterface(
        "Детали (цвет/пирсинг)",
        "muted matte lips"
      ).setPort(false),
  },
  outputs: {
    mouth: () => new NodeInterface("Рот", null).use(setType, mouthType),
  },
});

export const EyesNode = defineNode({
  type: "EyesNode",
  title: "Глаза",
  inputs: {

    shape_preset: () => makeSelect("Форма разреза", "almond_shaped", eyePresets.shape),
    size_preset: () => makeSelect("Размер", "medium_balanced", eyePresets.size),


    color_preset: () => makeSelect("Цвет глаз", "hazel_green", eyePresets.color),

    lashes_preset: () => makeSelect("Ресницы", "natural_sparse", eyePresets.lashes),


    details: () => new TextInputInterface("Макияж/Детали", "barely-there eye makeup").setPort(false),
  },
  outputs: {
    eyes: () => new NodeInterface("Глаза", null).use(setType, eyeType),
  },
});


export const HairNode = defineNode({
  type: "HairNode",
  title: "Волосы",
  inputs: {
    style_preset: () => makeSelect("Причёска", "long_loose", hairPresets.style),
    texture_preset: () => makeSelect("Текстура", "straight_silky", hairPresets.texture),
    color_preset: () => makeSelect("Цвет", "dark_brunette", hairPresets.color),
    condition_preset: () => makeSelect("Состояние", "messy_bedhead", hairPresets.condition),
    details: () => new TextInputInterface("Детали (корни/аксессуары)", "natural dark roots, loose strands").setPort(false),
  },
  outputs: {
    hair: () => new NodeInterface("Волосы", null).use(setType, hairType),
  },
});

export const ResultNode = defineNode({
  type: "ResultNode",
  title: "Результат (Генерация)",
  width: 1350,
  inputs: {
    image: () => new NodeInterface("Изображение", null)
      .setPort(false)
      .setComponent(markRaw(ImageInput)),
    
    aiModel: () => new SelectInterface("AI Model", "gpt-image(lowQ)", [
     "gpt-image(lowQ)"
    ]).setPort(false),
    popa: () => new NodeInterface("My Interface", 10).setComponent(markRaw(CustomActionBtn)),

    // generate: () => new NodeInterface("Генерация", null)
    //   .setPort(false)
    //   .setComponent(markRaw(CustomActionBtn)),
  },
  

});
