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
        "x": 542.7285619194977,
        "y": 243.99214438589195
      },
      "scaling": 0.7141296416717565
    },
    "graphTemplates": []
  },
  2: {
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
            "x": 852.9380039710927,
            "y": 155.67137926868446
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
            "x": 610.446877905825,
            "y": 667.851627530491
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
        "x": 117.17583313036222,
        "y": 32.15247077904287
      },
      "scaling": 0.7871834207644934
    },
     "graphTemplates": []

  }
}