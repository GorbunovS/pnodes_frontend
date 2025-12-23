function findNodesByOutputInterfaceIds(state, interfaceIdsSet) {
  return state.nodes.filter(n =>
    Object.values(n.outputs || {}).some(out => out && interfaceIdsSet.has(out.id))
  );
}

function getConnectedNodesToInput(state, node, inputKey) {
  const input = node.inputs?.[inputKey];
  if (!input?.id) return [];

  const conns = state.connections.filter(c => c.to === input.id);
  if (!conns.length) return [];

  return findNodesByOutputInterfaceIds(state, new Set(conns.map(c => c.from)));
}

export function exportSceneTemplateFromBaklavaState(state, { lightingPresets } = {}) {
  const composition = state.nodes.find(n => n.type === "CompositionNode");
  if (!composition) {
    return {
      error: "CompositionNode не найден",
      availableNodeTypes: [...new Set(state.nodes.map(n => n.type))],
    };
  }

  const presetLabel = (group, id) => {
    const arr = lightingPresets?.[group] || [];
    return (arr.find(x => x.id === id)?.label) ?? id;
  };

  const sceneDescription = composition.inputs?.description?.value ?? "{ОПИСАНИЕ_СЦЕНЫ}";

  const characterNodes = getConnectedNodesToInput(state, composition, "character");
  const envNodes = getConnectedNodesToInput(state, composition, "environment");
  const lightNodes = getConnectedNodesToInput(state, composition, "light");

  const subject_context = characterNodes.map(n => ({
    identity_source: "provided_reference_image",
    action: n?.inputs?.action?.value ?? "{ДЕЙСТВИЕ}",
    pose: n?.inputs?.pose?.value ?? "{ПОЗА}",
    expression: n?.inputs?.emotion?.value ?? "{ЭМОЦИЯ}",
    gender: n?.inputs?.gender?.value ?? "{ПОЛ_ГЕРОЯ}",
    clothing: n?.inputs?.clothing?.value ?? "{ОДЕЖДА}",
    description: n?.inputs?.description?.value ?? "{ОПИСАНИЕ_ГЕРОЯ}",
    age: n?.inputs?.age?.value ?? "{ВОЗРАСТ}",
    height_cm: n?.inputs?.height?.value ?? "{РОСТ_СМ}",
    weight_kg: n?.inputs?.weight?.value ?? "{ВЕС_КГ}",
  }));

  const environment = envNodes.length
    ? envNodes.map(n => ({
        setting: n?.inputs?.setting?.value ?? "{ЛОКАЦИЯ}",
        atmosphere: n?.inputs?.atmosphere?.value ?? "{АТМОСФЕРА}",
      }))
    : [{ setting: "{ЛОКАЦИЯ}", atmosphere: "{АТМОСФЕРА}" }];

  const lighting = lightNodes.length
    ? lightNodes.map(n => {
        const typeId = n?.inputs?.type_preset?.value ?? "natural_daylight";
        const sourceCountId = n?.inputs?.source_count_preset?.value ?? "single_window";
        const directionId = n?.inputs?.direction_preset?.value ?? "frontal_up";

        return {
          preset_ids: { type: typeId, source_count: sourceCountId, direction: directionId },
          resolved: {
            type: presetLabel("type", typeId),
            source_count: presetLabel("source_count", sourceCountId),
            direction: presetLabel("direction", directionId),
          },
        };
      })
    : [];

  const subjectsLine = subject_context.length
    ? subject_context.map(s => `${s.gender} wearing ${s.clothing}, expression ${s.expression}`).join("; ")
    : "{ПЕРСОНАЖИ}";

  return {
    metadata: {
      image_type: "photograph",
      primary_purpose: "social media/portrait",
    },
    variable_context: {
      scene_context: { description: sceneDescription },
      environment,
      lighting,
      subject_context,
    },
    generation_prompt_assembler: [
      `close-up selfie portrait of ${subjectsLine}`,
      `scene: ${sceneDescription}`,
      "in {ЛОКАЦИЯ}",
      `lighting: ${lighting[0]?.resolved?.type ?? "{СВЕТ_ТИП}"}, ${lighting[0]?.resolved?.direction ?? "{СВЕТ_НАПРАВЛЕНИЕ}"}`,
      "28mm lens, f/2.2",
      "realistic skin texture, visible pores, candid moment",
    ],
  };
}
