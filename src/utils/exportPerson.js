
function findNodesByOutputInterfaceIds(state, interfaceIdsSet) {
  return state.nodes.filter(n =>
    Object.values(n.outputs || {}).some(out => out && interfaceIdsSet.has(out.id))
  );
}

function getConnectedNodeToInput(state, node, inputKey) {
  const input = node.inputs?.[inputKey];
  if (!input?.id) return null;

  const conns = state.connections.filter(c => c.to === input.id);
  if (!conns.length) return null;
  const fromId = conns[0].from;
  return state.nodes.find(n => 
    Object.values(n.outputs || {}).some(out => out.id === fromId)
  );
}


const getVal = (node, key, def) => node?.inputs?.[key]?.value ?? def;

export function exportPersonTemplateFromBaklavaState(state, { skinPresets, nosePresets, mouthPresets, eyePresets, hairPresets } = {}) {
  const charNode = state.nodes.find(n => n.type === "CharacterFullNode");

  if (!charNode) {
    return {
      error: "CharacterFullNode не найден",
      availableNodeTypes: [...new Set(state.nodes.map(n => n.type))],
    };
  }


  const skinNode = getConnectedNodeToInput(state, charNode, "skin");
  const noseNode = getConnectedNodeToInput(state, charNode, "nose");
  const mouthNode = getConnectedNodeToInput(state, charNode, "mouth");
  const eyesNode = getConnectedNodeToInput(state, charNode, "eyes");
  const hairNode = getConnectedNodeToInput(state, charNode, "hair");


  const gender = getVal(charNode, "gender", "female");
  const age = getVal(charNode, "age", 25);
  const role = "fashion_agency_model";
  const desc = getVal(charNode, "description", "");

  // --- SKIN ---
  // Если ноды нет, ставим дефолты
  const skinTypeID = getVal(skinNode, "type_preset", "high_density_unretouched_matte");
  const skinTexID = getVal(skinNode, "texture_preset", "subtle_texture");
  
  // Здесь можно маппить ID на Label, если нужно, используя переданные presets
  // Но для промпта часто лучше ID или специальное поле description, если оно есть в пресете
  
  // --- NOSE ---
  const noseType = getVal(noseNode, "type_preset", "straight_grecian");
  const noseBridge = getVal(noseNode, "bridge_preset", "straight_bridge");
  const noseTip = getVal(noseNode, "tip_preset", "rounded_soft");
  const noseDetails = getVal(noseNode, "details", "");

  // --- MOUTH ---
  const mouthShape = getVal(mouthNode, "shape_preset", "heart_shaped");
  const mouthFullness = getVal(mouthNode, "fullness_preset", "full_plump");
  const mouthBow = getVal(mouthNode, "cupids_bow", "defined_sharp");
  const mouthDetails = getVal(mouthNode, "details", "muted matte lips");

  // --- EYES ---
  const eyeShape = getVal(eyesNode, "shape_preset", "almond_shaped");
  const eyeColor = getVal(eyesNode, "color_preset", "hazel_green");
  const eyeLashes = getVal(eyesNode, "lashes_preset", "natural_sparse");
  const eyeDetails = getVal(eyesNode, "details", "barely-there eye makeup");

  // --- HAIR ---
  const hairStyle = getVal(hairNode, "style_preset", "long_loose");
  const hairTexture = getVal(hairNode, "texture_preset", "straight_silky");
  const hairColor = getVal(hairNode, "color_preset", "dark_brunette");
  const hairCond = getVal(hairNode, "condition_preset", "messy_bedhead");
  const hairDetails = getVal(hairNode, "details", "");


  // 4. Формируем итоговый JSON по твоему образцу
   return {
    subject: {
      type: "person",
      gender: gender,
      age_range: age ,
      role: role,
      likeness_reference: {
        description: desc || "resembles a famous Hollywood actress with soft features",
        constraints: [
          "do not create an exact copy of a specific person",
          "maintain only general characteristic features and mood, face must be unique",
          "face shape and general vibe can resemble the reference, but expressions, feature details, and proportions must differ"
        ]
      },
      features: {
        nose: { type: noseType, bridge: noseBridge, tip: noseTip, details: noseDetails },
        mouth: { shape: mouthShape, fullness: mouthFullness, bow: mouthBow, details: mouthDetails },
        eyes: { shape: eyeShape, color: eyeColor, lashes: eyeLashes, details: eyeDetails }
      }
    },
    
    composition: {
      type: "collage",
      views: [
        { name: "front", description: "ultra-close front-facing portrait, face strictly frontal, direct gaze into camera" },
        { name: "profile", description: "ultra-close profile portrait, clear line of nose, forehead, chin, and neck" }
      ],
      camera: {
        framing: "ultra_close_up",
        angle: "eye_level",
        style: "authentic_iphone_selfie"
      }
    },

    environment: {
      background_type: "none",
      background_description: "no environment or background, no rooms, streets, studio sets, or objects",
      allow_gradients: false
    },

    skin: {
      overall_look: skinTypeID,
      finish: "matte_dry",
      retouching: "none",
      imperfections: [
        "natural skin pigmentation",
        "small imperfections and unevenness",
        "fine visible pores",
        "visible capillaries in places",
        "slight unevenness of tone and texture",
        "post-acne traces and mild scarring",
        "scattered pores on nose and jawline",
        "tiny bumps, freckles, and roughness on neck"
      ],
      texture_keywords: [
        skinTexID,
        "dense_texture",
        "visible_pores",
        "skin_grain",
        "no_smoothing"
      ],
      lighting_interaction: {
        reflection: "no_gloss_no_oil_no_sheen",
        description: "light is absorbed rather than reflected, emphasizing density and realism rather than smoothness"
      },
      redness: {
        intensity: "mild",
        description: "mild natural redness emphasizing living skin"
      },
      peach_fuzz: {
        visible: true,
        description: "fine peach fuzz along face contours enhancing real human skin feel"
      }
    },

    makeup: {
      overall_style: "extremely_minimal_skin_focused",
      base: { coverage: "sheer", finish: "matte", behavior: "does not hide texture or imperfections" },
      lips: { style: "muted_matte", description: mouthDetails || "muted natural tone" },
      eyes: { intensity: "barely_there", description: eyeDetails || "minimal enhancement" },
      constraints: ["no contouring", "no soft-focus effects", "no smoothing or blur", "no glossy highlighters"]
    },

    lighting: {
      type: "soft_diffused",
      color_temperature: "neutral",
      direction: "even",
      goals: [
        "avoid bright highlights and shine",
        "maximize skin texture and surface irregularities",
        "subtly enhance face volume with soft shadows",
        "do not make image overly flattering or glossy"
      ]
    },

    expression_pose: {
      expression: "calm_neutral",
      gaze: "direct_into_camera_for_front_view",
      notes: [
        "calm, neutral gaze without strong emotions",
        "natural head and neck position",
        "profile maintains natural relaxation"
      ]
    },

    hair: {
      style: hairStyle,
      texture: hairTexture,
      color: hairColor,
      condition: hairCond,
      description: `hair ${hairStyle}, color ${hairColor}. ${hairDetails}`
    },

    wardrobe: {
      top: { color_tone: "light", style: "simple_minimal", description: "minimalist light top without large prints" },
      jewelry: { presence: true, material: "silver", style: "minimal", description: "minimal silver jewelry not distracting from face" }
    },

    style_keywords: [
      "ultra_realistic_skin", "dense_texture", "matte_finish", "raw_editorial_realism", "visible_pores", "skin_grain", "no_retouching"
    ],

    constraints: {
      forbidden_elements: [
        "studio or decorative background", 
        "bright colored rim lights", 
        "strong gloss on skin", 
        "visible beauty filters or retouching", 
        "mentioning real celebrity names"
      ],
      generation_notes: [
        "create a unique face with own features", 
        "avoid exact legal and visual match to any specific person"
      ]
    },
    
    generation_prompt_assembler: [
       `ultra-close collage portrait: front-facing and profile of ${gender}, ${age} years old`,
       `skin: ${skinTypeID}, ${skinTexID}, matte dry, no retouching`,
       `face features: ${noseType} nose, ${mouthShape} lips, ${eyeShape} ${eyeColor} eyes`,
       `hair: ${hairStyle}, ${hairColor}, ${hairTexture}`,
       `style: authentic iphone selfie, no background, raw realism`
    ]
  };

}
