export const PROJECTS_MOCK = {
  1: {
  "graph": {
    "id": "c13c85d0-00e0-4ae4-89fa-af330610bd9a",
    "nodes": [
      {
        "type": "CharacterFullNode",
        "id": "4db81c21-9fee-4e20-98e3-17f9c740ccfd",
        "title": "Персонаж2",
        "inputs": {
          "gender": {
            "id": "2ef3b6d6-5c12-4b76-b0a0-71dc45a7dc09",
            "value": "Male"
          },
          "age": {
            "id": "c81baa19-7527-493a-bb27-1183a3964069",
            "value": 25
          },
          "height": {
            "id": "ec35967e-7c46-4a9b-a83f-86a6a4c813c8",
            "value": 175
          },
          "weight": {
            "id": "4a70afc7-32a5-4a6f-ad65-4b3eefafe65b",
            "value": 70
          },
          "skin": {
            "id": "be56122a-6f67-4a2f-af14-c79ca890b150",
            "value": []
          },
          "nose": {
            "id": "8ccf037f-5f73-400d-a563-423946688b09",
            "value": null
          },
          "mouth": {
            "id": "75a6c58e-44ca-4bd4-8398-be260a44e6d2",
            "value": null
          },
          "eyes": {
            "id": "ee9cb0cb-aa00-42b1-9ee7-24173725cae4",
            "value": null
          },
          "hair": {
            "id": "9237c970-6c8c-4524-b1dd-5eeb6a77d03d",
            "value": null
          },
          "description": {
            "id": "67d7397b-dce3-4447-8af1-c0a2feaa6075",
            "value": "Родинка в виде сердца"
          }
        },
        "outputs": {},
        "position": {
          "x": 1100.6188440334977,
          "y": 428.93589767103066
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "SkinNode",
        "id": "4d029dbe-4788-4022-84f7-29f19bc287a7",
        "title": "Кожа (presets)",
        "inputs": {
          "type_preset": {
            "id": "b10c7aea-5b15-4315-897e-39bb23d77df7",
            "value": "high_density_unretouched_matte"
          },
          "texture_preset": {
            "id": "27f42d0c-87a5-4bc2-8e4a-9022dce75390",
            "value": "subtle_texture"
          }
        },
        "outputs": {
          "skin": {
            "id": "938f5394-a39a-450f-a2ef-6d1523d8292c",
            "value": null
          }
        },
        "position": {
          "x": 830.6571521389515,
          "y": 343.3958835192215
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "NoseNode",
        "id": "b0bf42c3-1692-42e0-b00c-75fd0054375c",
        "title": "Нос",
        "inputs": {
          "type_preset": {
            "id": "b28930ee-1d53-4843-9db9-7de89d539f4f",
            "value": "straight_grecian"
          },
          "bridge_preset": {
            "id": "15f0cdf8-a6f9-483e-9ec0-125f50db0f0c",
            "value": "straight_bridge"
          },
          "tip_preset": {
            "id": "5f031b23-11e4-4969-9f55-bde63fda4dfa",
            "value": "rounded_soft"
          },
          "details": {
            "id": "b80b275c-afc4-47ca-a9a2-704b55a67186",
            "value": ""
          }
        },
        "outputs": {
          "nose": {
            "id": "2054c1b1-90d0-42bb-8d4e-69c8d1ccdb41",
            "value": null
          }
        },
        "position": {
          "x": 607.0222763865763,
          "y": 342.023085550215
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "MouthNode",
        "id": "e5e320c9-7f65-45de-aeb5-f0d893c0f584",
        "title": "Рот / Губы",
        "inputs": {
          "shape_preset": {
            "id": "c1f12908-16b4-415d-a108-973346357716",
            "value": "heart_shaped"
          },
          "fullness_preset": {
            "id": "31bdc0fb-665d-4b67-9fa7-72d1c89f3730",
            "value": "full_plump"
          },
          "cupids_bow": {
            "id": "3775d82b-2c0d-4339-8185-e2eed7c34df5",
            "value": "defined_sharp"
          },
          "corners": {
            "id": "0e37598e-94e0-4505-acff-f389ad379791",
            "value": "neutral_straight"
          },
          "details": {
            "id": "5932abaf-0921-4eaf-942e-ac78525757f2",
            "value": "muted matte lips"
          }
        },
        "outputs": {
          "mouth": {
            "id": "1559945c-83e4-4cd3-85e4-544f143d8e15",
            "value": null
          }
        },
        "position": {
          "x": 614.5874479104399,
          "y": 663.3676113184304
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "EyesNode",
        "id": "08cae54a-e61e-4f3c-84a1-30e031f28a4d",
        "title": "Глаза",
        "inputs": {
          "shape_preset": {
            "id": "74f0cae5-28fd-4ec6-83ec-8373dde13cf3",
            "value": "almond_shaped"
          },
          "size_preset": {
            "id": "e51f6614-ca9c-4bc7-b4f4-7fcada450566",
            "value": "medium_balanced"
          },
          "color_preset": {
            "id": "5785bfad-8030-4d7c-bf60-73662b1783ed",
            "value": "hazel_green"
          },
          "lashes_preset": {
            "id": "e5e6a72d-0513-4d42-8187-39786fffd9a7",
            "value": "natural_sparse"
          },
          "details": {
            "id": "4bec58f8-d795-46b8-b23b-0889d81d6cf2",
            "value": "barely-there eye makeup"
          }
        },
        "outputs": {
          "eyes": {
            "id": "f142b95d-524a-41e8-9303-0c1cbf1ddba3",
            "value": null
          }
        },
        "position": {
          "x": 606.8038314751025,
          "y": 1024.2715996254547
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "HairNode",
        "id": "140f78a1-835d-4584-ac10-e2b9d0934b27",
        "title": "Волосы",
        "inputs": {
          "style_preset": {
            "id": "fb797f4b-ba0a-4527-9903-5131169a76a5",
            "value": "long_loose"
          },
          "texture_preset": {
            "id": "fd5eca03-361c-4f71-8591-9155913b7d18",
            "value": "straight_silky"
          },
          "color_preset": {
            "id": "d12d8a41-dd20-4562-80fe-b508e1efb6e1",
            "value": "dark_brunette"
          },
          "condition_preset": {
            "id": "c21f34c7-49b9-4dce-8e04-85992bcf2f6d",
            "value": "messy_bedhead"
          },
          "details": {
            "id": "15cfa79e-2217-495b-9d40-5ee8a2c2987a",
            "value": "natural dark roots, loose strands"
          }
        },
        "outputs": {
          "hair": {
            "id": "0b305c8a-4dfc-4ecb-b123-6af99fbaf5fe",
            "value": null
          }
        },
        "position": {
          "x": 855.56942297171,
          "y": 1023.8506105909938
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "ResultNode",
        "id": "57be5b32-af84-4784-a45c-e4a94600b041",
        "title": "Результат (Генерация)",
        "inputs": {
          "image": {
            "id": "45ca73b0-498e-4a0b-a005-11f9a313e324",
            "value": ""
          },
          "aiModel": {
            "id": "aa626b88-c795-44f1-9b94-d27cc3847c73",
            "value": "Nano Banano"
          },
          "description": {
            "id": "b3953ff2-572b-453c-b2d3-850ecfa2c88f",
            "value": "Это результаты генерации с помощью нашего конструктора "
          }
        },
        "outputs": {},
        "position": {
          "x": 1371.9628540162637,
          "y": 320.0827671833743
        },
        "width": 200,
        "twoColumn": false
      }
    ],
    "connections": [
      {
        "id": "2191879a-80d9-49e9-a2f1-079a098f9ef5",
        "from": "938f5394-a39a-450f-a2ef-6d1523d8292c",
        "to": "be56122a-6f67-4a2f-af14-c79ca890b150"
      },
      {
        "id": "8ffd5b73-89ef-4b57-a1ee-555cd617f50d",
        "from": "2054c1b1-90d0-42bb-8d4e-69c8d1ccdb41",
        "to": "8ccf037f-5f73-400d-a563-423946688b09"
      },
      {
        "id": "b3513b9d-dd64-44ab-8451-02a6cc2188c5",
        "from": "1559945c-83e4-4cd3-85e4-544f143d8e15",
        "to": "75a6c58e-44ca-4bd4-8398-be260a44e6d2"
      },
      {
        "id": "82a05d64-4f40-443e-9dde-3bd4e61ad525",
        "from": "f142b95d-524a-41e8-9303-0c1cbf1ddba3",
        "to": "ee9cb0cb-aa00-42b1-9ee7-24173725cae4"
      },
      {
        "id": "83921e71-36be-4bab-90c3-3f1f6c7b3945",
        "from": "0b305c8a-4dfc-4ecb-b123-6af99fbaf5fe",
        "to": "9237c970-6c8c-4524-b1dd-5eeb6a77d03d"
      }
    ],
    "inputs": [],
    "outputs": [],
    "panning": {
      "x": 242.3773209154818,
      "y": -22.201987294461162
    },
    "scaling": 1.067105595170848
  },
  "graphTemplates": []
},
  2:{
  "graph": {
    "id": "01275cd2-0bd4-40f9-8446-81ce1f347386",
    "nodes": [
      {
        "type": "CompositionNode",
        "id": "b01152e7-e3f6-4080-add7-4215687a3fa2",
        "title": "Сцена (Composition)",
        "inputs": {
          "camera": {
            "id": "d9788dc5-0bd6-4e8d-8d74-879754093815",
            "value": []
          },
          "light": {
            "id": "a36abca0-a350-4666-bd28-8bcddedb9f04",
            "value": []
          },
          "environment": {
            "id": "558ef70f-7f75-444b-9c63-5469efa05ace",
            "value": []
          },
          "character": {
            "id": "3d8939c8-9dad-43b1-83a1-533360be3781",
            "value": []
          },
          "use_photo_reference": {
            "id": "4ba0c3cd-64ab-42fe-9bde-517f15a38b74",
            "value": false
          },
          "description": {
            "id": "fd5dbd02-d4e9-4cea-9943-2097bc88c5db",
            "value": "Базовая сцена"
          }
        },
        "outputs": {},
        "position": {
          "x": 967.2696802055772,
          "y": 207.75580955328292
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "EnvironmentNode",
        "id": "ac556cee-1ac6-4cad-b7ec-f3d9afad8aa2",
        "title": "Окружение (presets)",
        "inputs": {
          "scene_type": {
            "id": "94b97c27-33ee-460f-8205-a29ef2b098da",
            "value": "studio_clean_minimal"
          },
          "background_mood": {
            "id": "a4f85ef2-c181-4145-b5e7-46eb93dc4508",
            "value": "soft_depth_of_field"
          },
          "camera_framing": {
            "id": "df4ee431-e39b-476d-8ff3-b046346d56e9",
            "value": "portrait_midshot"
          },
          "description": {
            "id": "192ccfbf-4a6c-48da-a897-074f9124e435"
          }
        },
        "outputs": {
          "environment": {
            "id": "fb2e0dbe-a22a-420f-ae23-4b049bf92675",
            "value": null
          }
        },
        "position": {
          "x": 387.8082574368701,
          "y": 125.74689120551568
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "CharacterNode",
        "id": "6771c91f-480b-4830-8fad-fae0ad3690e5",
        "title": "Персонаж",
        "inputs": {
          "gender": {
            "id": "5e3a3b42-a07d-4d24-973b-28cc2fdf4f50",
            "value": "Female"
          },
          "age": {
            "id": "6619f26f-f38d-4fba-a311-2d7334d1c987",
            "value": 110
          },
          "height": {
            "id": "2a99e6f9-0e96-415a-9e10-6d8830b8b1b5",
            "value": 175
          },
          "weight": {
            "id": "c9a601e5-e07d-41a0-a9db-ad96e8d49ed9",
            "value": 70
          },
          "clothing": {
            "id": "69136577-77b5-4ead-bbfc-af7ea6892052",
            "value": "{ОДЕЖДА}"
          },
          "emotion": {
            "id": "d3b794bd-4e32-45a8-a1b6-fdf329ba036b",
            "value": "{ЭМОЦИЯ}"
          },
          "pose": {
            "id": "14829d98-3eb1-435a-a15a-bdee7b8257b6",
            "value": "looking into camera, slight head tilt"
          },
          "action": {
            "id": "e0a6f11c-f6b8-4b3a-a4de-4d103d83f09c",
            "value": "taking a selfie"
          },
          "description": {
            "id": "5ea5d0e4-7cd0-4d74-9271-c81e11b196ef",
            "value": "Главный герой"
          }
        },
        "outputs": {
          "character": {
            "id": "55bb67c8-d8f2-4b7e-b074-3b47c8cd80fa",
            "value": null
          }
        },
        "position": {
          "x": 390.1091242895725,
          "y": 446.4493293678511
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "LightingNode",
        "id": "57a27d01-a659-4dfe-8cb5-edd40b9c3f70",
        "title": "Свет (presets)",
        "inputs": {
          "type_preset": {
            "id": "3123314e-21f5-4f2b-a695-77347b494942",
            "value": "natural"
          },
          "setup_preset": {
            "id": "08de8a62-80ad-4958-b4c2-49fa21543845",
            "value": "window_light_soft"
          },
          "direction_preset": {
            "id": "62f35eb4-2a6c-4afc-9862-730b8a2fada9",
            "value": "frontal_up_45"
          },
          "quality_preset": {
            "id": "a1413fac-d12e-4b88-af25-c6769472d6de",
            "value": "soft_diffused"
          },
          "description": {
            "id": "9eb851fc-46ec-4d02-b70c-7f3ad26db898"
          }
        },
        "outputs": {
          "light": {
            "id": "15567b88-8c7d-4bdc-9ac6-71066fda5747",
            "value": null
          }
        },
        "position": {
          "x": 614.2579337803078,
          "y": 699.6104264845144
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "ResultNode",
        "id": "4b44f5f0-43b5-435e-9b5c-9e3bca1bffb0",
        "title": "Результат (Генерация)",
        "inputs": {
          "image": {
            "id": "09ba5150-8403-49b5-a9f8-a186a9655057",
            "value": ""
          },
          "aiModel": {
            "id": "fed65c67-b5e6-48fe-90b9-c68b69c92edb",
            "value": "Nano Banano"
          },
          "description": {
            "id": "b090a776-b475-40e0-8d86-521106c0202c",
            "value": ""
          }
        },
        "outputs": {},
        "position": {
          "x": 1197.6290190825252,
          "y": 209.98898785740815
        },
        "width": 200,
        "twoColumn": false
      }
    ],
    "connections": [
      {
        "id": "42f90f9d-aed8-42bd-b3a2-a6f770dcb060",
        "from": "fb2e0dbe-a22a-420f-ae23-4b049bf92675",
        "to": "558ef70f-7f75-444b-9c63-5469efa05ace"
      },
      {
        "id": "df3e2730-02b8-4cc4-a089-e9ea7f285720",
        "from": "55bb67c8-d8f2-4b7e-b074-3b47c8cd80fa",
        "to": "3d8939c8-9dad-43b1-83a1-533360be3781"
      },
      {
        "id": "b86bb349-dad4-4871-9300-8b7ddcebf81b",
        "from": "15567b88-8c7d-4bdc-9ac6-71066fda5747",
        "to": "a36abca0-a350-4666-bd28-8bcddedb9f04"
      }
    ],
    "inputs": [],
    "outputs": [],
    "panning": {
      "x": 160.35954701174302,
      "y": 35.75954815728588
    },
    "scaling": 1.2813510270625315
  },
  "graphTemplates": []
},
3: {
  "graph": {
    "id": "579a0490-d926-45f8-8769-0f864d206ee1",
    "nodes": [
      {
        "type": "CompositionNode",
        "id": "eaad338b-a33a-4e8f-9e88-a37ddd1cf3f6",
        "title": "Сцена (Composition)",
        "inputs": {
          "camera": {
            "id": "f8db0918-4446-473a-afb2-538b037543b3",
            "value": []
          },
          "light": {
            "id": "ed1a8b68-7b39-48eb-9919-5dc4c01b0325",
            "value": []
          },
          "environment": {
            "id": "6991bc67-6e35-4f96-8c50-b154f908ce3d",
            "value": []
          },
          "character": {
            "id": "6cb73ca6-441e-46e0-9991-e70f4e2cd4c8",
            "value": []
          },
          "use_photo_reference": {
            "id": "f9093ba8-2bbf-4380-897e-b709ef970d76",
            "value": true
          },
          "description": {
            "id": "bfd20b0c-411b-4545-9b95-62221ccaa625",
            "value": "Основной фокус на герое с рефернса "
          }
        },
        "outputs": {},
        "position": {
          "x": 1437.1311844421557,
          "y": 139.09473418061881
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "EnvironmentNode",
        "id": "a242f268-0ed5-4cc7-9cad-a75da1e03584",
        "title": "Окружение (presets)",
        "inputs": {
          "scene_type": {
            "id": "a2496ccd-96a7-48ea-98a0-627ead8a7758",
            "value": "Семейное застолье на новый год"
          },
          "background_mood": {
            "id": "792b4dd9-8654-46e2-b8bf-fd7680b0298a",
            "value": "soft_depth_of_field"
          },
          "camera_framing": {
            "id": "63716a8a-acaf-44f0-8d11-65c4fa7037b5",
            "value": "off_center_rule_of_thirds"
          },
          "description": {
            "id": "05ab4084-7444-4215-bb9f-927189af15b4",
            "value": "Отмечают новый год с семьёй"
          }
        },
        "outputs": {
          "environment": {
            "id": "8c4b82cf-7f38-405d-b273-1b04559cff96",
            "value": null
          }
        },
        "position": {
          "x": 662.9625399057716,
          "y": 183.70123026503848
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "CharacterNode",
        "id": "088dd4e4-80e1-46b3-9ca8-ac9fd57dfabc",
        "title": "Отец",
        "inputs": {
          "gender": {
            "id": "ebae61ea-aec2-4f2c-8df5-aff8cb6b2121",
            "value": "Male"
          },
          "age": {
            "id": "3ea0fc03-25b6-40b0-91a5-8e2e3e676ad9",
            "value": 55
          },
          "height": {
            "id": "51e74972-a8e2-4da3-98a7-98644c7a7b2c",
            "value": 175
          },
          "weight": {
            "id": "e3189e8e-eae8-4b86-9f0b-06413b3d42a6",
            "value": 70
          },
          "clothing": {
            "id": "5689378c-7e6b-4d7c-8c4b-b7f1b54bd2d0",
            "value": "Рубашка в клетку "
          },
          "emotion": {
            "id": "6b31a05a-074c-4659-8a93-e58dc4f4f6bf",
            "value": "Радуется"
          },
          "pose": {
            "id": "0657c874-c585-4593-a9b0-0673f5b657fc",
            "value": "Толкает тост, держит в руке бокал, преобнимает главного героя "
          },
          "action": {
            "id": "420e5e29-f649-49d9-a70f-2d72caacfb45",
            "value": ""
          },
          "description": {
            "id": "ae18a013-0bac-452c-82ad-60e357a2ea4d",
            "value": "Отец главного героя"
          }
        },
        "outputs": {
          "character": {
            "id": "0e1d1f29-c1b4-43f2-85e5-0cc7ef7a76ad",
            "value": null
          }
        },
        "position": {
          "x": 670.2933905747993,
          "y": 508.0723185755257
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "CharacterNode",
        "id": "941a67a4-2dd5-4ba2-9d7a-55eaf336c6aa",
        "title": "Персонаж",
        "inputs": {
          "gender": {
            "id": "dd751873-1d8a-4905-a165-26cc68b15365",
            "value": "Female"
          },
          "age": {
            "id": "7918ea31-6278-4f48-a1de-81f1e26b259f",
            "value": 48
          },
          "height": {
            "id": "c7fc1766-031d-4205-8ed5-04338fc61a62",
            "value": 160
          },
          "weight": {
            "id": "ee84bbc2-1d86-4733-bfe4-9b7093e2fb92",
            "value": 57
          },
          "clothing": {
            "id": "1cb9bf8b-18c4-4933-8969-c2c7bcacd908",
            "value": "Нарядное синее платье"
          },
          "emotion": {
            "id": "3dc6efd0-f12b-4f08-98cc-a52fa3dc238c",
            "value": "{ЭМОЦИЯ}"
          },
          "pose": {
            "id": "083e4ee2-16f1-45d5-a14c-e583844ffc7d",
            "value": "looking into camera, slight head tilt"
          },
          "action": {
            "id": "8d6e9808-6229-42fd-b86d-f1b5f8382bcc",
            "value": "Режет курицу что бы раздать гостям"
          },
          "description": {
            "id": "f116ae1f-60de-45e1-953d-5e3f002edeef",
            "value": "Мама главного героя"
          }
        },
        "outputs": {
          "character": {
            "id": "7578c538-77cd-47bf-9cd4-6b8793679e31",
            "value": null
          }
        },
        "position": {
          "x": 435.1306408018411,
          "y": 523.1528306613789
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "LightingNode",
        "id": "1a912edd-7c44-4a64-be4b-3cb6c6a7a6c4",
        "title": "Свет (presets)",
        "inputs": {
          "type_preset": {
            "id": "0923d110-89f4-44f7-a253-ae319ef214e7",
            "value": "natural"
          },
          "setup_preset": {
            "id": "2f3e7818-7655-4259-a96c-1a00d3c75e7e",
            "value": "open_shade"
          },
          "direction_preset": {
            "id": "54d9ef71-5020-462d-bb47-f2dc086551c1",
            "value": "frontal_up_45"
          },
          "quality_preset": {
            "id": "9b2da882-2d2a-49f3-bd05-e907d7b97cc9",
            "value": "soft_diffused"
          },
          "description": {
            "id": "08545dbe-e5b8-48e6-95c4-6d639de389d4",
            "value": "Квартиру освещает основной свет от люстры на потолке "
          }
        },
        "outputs": {
          "light": {
            "id": "f1c5fc06-7e7d-40f5-b84b-384ef7a49774",
            "value": null
          }
        },
        "position": {
          "x": 889.6108899825894,
          "y": 750.7726912072802
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "LightingNode",
        "id": "064e4190-80ad-4be0-93c3-1c8d8dade7fb",
        "title": "Свет (presets)",
        "inputs": {
          "type_preset": {
            "id": "36fad8bf-f1a8-49f1-b915-04311f1c70d7",
            "value": "studio"
          },
          "setup_preset": {
            "id": "32afea55-ef22-4a19-bb18-16c824d45754",
            "value": "butterfly_paramount"
          },
          "direction_preset": {
            "id": "deb3aeaa-17ff-4a30-9cd1-8e9c9ed395fd",
            "value": "frontal_up_45"
          },
          "quality_preset": {
            "id": "2f0e4843-9f26-4fe2-8ca6-0ad2e3d63ad6",
            "value": "balanced"
          },
          "description": {
            "id": "ddd25bcf-a315-422a-9c5c-15b28f67e0c3",
            "value": "Дополнительная студийная подсветка как будто снимаем сериал"
          }
        },
        "outputs": {
          "light": {
            "id": "c1b5ad0b-de5c-4699-9b7f-5f64a6349d0b",
            "value": null
          }
        },
        "position": {
          "x": 1111.4370061020652,
          "y": 746.828325232245
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "ResultNode",
        "id": "1f58e3dd-a516-4fcd-8a2c-22e7a392e7f8",
        "title": "Исходное изображение гл. героя",
        "inputs": {
          "image": {
            "id": "2d53ac36-bb64-4a39-841c-310b5c5e4c6f",
            "value": ""
          },
          "aiModel": {
            "id": "6707b742-512f-4adf-8891-583335a95f2b",
            "value": "Nano Banano"
          },
          "description": {
            "id": "a3361451-20c4-488e-a659-aef9e9066041",
            "value": "Ранее заготовленный портрет"
          }
        },
        "outputs": {},
        "position": {
          "x": 1694.7966228739683,
          "y": 135.8830593885196
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "ResultNode",
        "id": "2797a477-78d9-4f0e-aa65-166d1c1d4cb0",
        "title": "Результат (Генерация)",
        "inputs": {
          "image": {
            "id": "c2ff8b99-8f83-4531-b0c6-155f9855d89b",
            "value": ""
          },
          "aiModel": {
            "id": "b111187d-46ba-45fa-b879-a4440458007f",
            "value": "Nano Banano"
          },
          "description": {
            "id": "de5ccd41-8295-4362-b59f-6e1239d8d8fc",
            "value": "Лучший результат "
          }
        },
        "outputs": {},
        "position": {
          "x": 1694.9991695790636,
          "y": 583.9736136430172
        },
        "width": 200,
        "twoColumn": false
      },
      {
        "type": "ResultNode",
        "id": "23657ea3-f77f-4feb-8200-308d183125f1",
        "title": "Результат (Генерация)",
        "inputs": {
          "image": {
            "id": "f9696e6f-fc87-4bd7-940d-7f2e02aeb4cd",
            "value": ""
          },
          "aiModel": {
            "id": "3fe3e4fa-cf4e-4ce1-8597-4f7d629f0f28",
            "value": "Nano Banano"
          },
          "description": {
            "id": "0585c540-67c5-4b83-8627-923e79ffc99d",
            "value": ""
          }
        },
        "outputs": {},
        "position": {
          "x": 2057.5681989960185,
          "y": 583.2091593799744
        },
        "width": 200,
        "twoColumn": false
      }
    ],
    "connections": [
      {
        "id": "317bdc27-c4d0-4545-9c9c-a78158f88ff6",
        "from": "8c4b82cf-7f38-405d-b273-1b04559cff96",
        "to": "6991bc67-6e35-4f96-8c50-b154f908ce3d"
      },
      {
        "id": "7b491751-bae6-486f-897b-0124de555de7",
        "from": "0e1d1f29-c1b4-43f2-85e5-0cc7ef7a76ad",
        "to": "6cb73ca6-441e-46e0-9991-e70f4e2cd4c8"
      },
      {
        "id": "06aaadde-6765-45e8-81b9-56e1f34f1336",
        "from": "7578c538-77cd-47bf-9cd4-6b8793679e31",
        "to": "6cb73ca6-441e-46e0-9991-e70f4e2cd4c8"
      },
      {
        "id": "1d8806a0-605c-498e-b844-3099211c0b89",
        "from": "f1c5fc06-7e7d-40f5-b84b-384ef7a49774",
        "to": "ed1a8b68-7b39-48eb-9919-5dc4c01b0325"
      },
      {
        "id": "b5b75cb1-5eb0-4b36-8e22-604724cc2db0",
        "from": "c1b5ad0b-de5c-4699-9b7f-5f64a6349d0b",
        "to": "ed1a8b68-7b39-48eb-9919-5dc4c01b0325"
      }
    ],
    "inputs": [],
    "outputs": [],
    "panning": {
      "x": 88.59774079977095,
      "y": 103.98717562079557
    },
    "scaling": 1.1975558524294536
  },
  "graphTemplates": []
}
};

