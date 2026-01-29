// utils/exportUniversal.js

function serializeNodeInputs(node) {
  const data = {};
  if (node.inputs) {
    for (const [key, input] of Object.entries(node.inputs)) {
      if (input && typeof input === "object" && "value" in input) {
        data[key] = input.value;
      }
    }
  }
  return data;
}

function getUpstreamNodes(state, startNodeIds) {
  const visited = new Set();
  const queue = [...startNodeIds];

  while (queue.length) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const currentNode = state.nodes.find(n => n.id === currentId);
    if (!currentNode) continue;

    // Ищем все связи, идущие В ЭТУ ноду (т.е. from → to = current)
    const incomingConns = state.connections.filter(c => c.to && 
      Object.values(currentNode.inputs || {}).some(inp => inp?.id === c.to)
    );

    for (const conn of incomingConns) {
      const fromId = conn.from;
      const fromNode = state.nodes.find(n => 
        Object.values(n.outputs || {}).some(out => out?.id === fromId)
      );
      if (fromNode && !visited.has(fromNode.id)) {
        queue.push(fromNode.id);
      }
    }
  }

  return state.nodes.filter(n => visited.has(n.id));
}

export function exportUniversalFromBaklavaState(state) {
  const resultNodes = state.nodes.filter(n => n.type === "ResultNode");
  if (!resultNodes.length) return { error: "Нет ResultNode" };

  const results = [];

  for (const res of resultNodes) {
    const entry = {
      order: results.length + 1,
      result_id: res.id,
      model: res.inputs?.aiModel?.value ?? "unknown",
      scene: null
    };

    // Находим все CompositionNode (обычно 0 или 1)
    const compNodes = state.nodes.filter(n => n.type === "CompositionNode");
    if (!compNodes.length) {
      results.push(entry);
      continue;
    }

    // Берём первую (или можно цикл, если их несколько)
    const comp = compNodes[0];
    const scene = {
      description: comp.inputs?.description?.value || "",
      use_photo_reference: comp.inputs?.use_photo_reference?.value ?? false,
      camera: null,
      lighting: null,
      environment: null,
      style: null,
      characters: []
    };

    // ─── Собираем подключённые ноды ───────────────────────────────
    const fillInput = (inputName, targetField) => {
      const intf = comp.inputs?.[inputName];
      if (!intf?.id) return;

      const conns = state.connections.filter(c => c.to === intf.id);
      if (!conns.length) return;

      const nodes = conns.map(c => {
        const src = state.nodes.find(n => 
          Object.values(n.outputs||{}).some(o => o?.id === c.from)
        );
        return src ? { id: src.id, type: src.type, value: serializeInputs(src) } : null;
      }).filter(Boolean);

      if (nodes.length === 0) return;

      // Для одиночных входов берём первый, для множественных — массив
      scene[targetField] = nodes.length === 1 ? nodes[0].value : nodes.map(n => n.value);
    };

    fillInput("camera",     "camera");
    fillInput("light",      "lighting");
    fillInput("environment","environment");
    fillInput("style",      "style");

    // Персонажи (могут быть множественные)
    const charConns = state.connections.filter(c => 
      comp.inputs?.character?.id && c.to === comp.inputs.character.id
    );

    for (const conn of charConns) {
      const charNode = state.nodes.find(n => 
        Object.values(n.outputs||{}).some(o => o?.id === conn.from)
      );
      if (!charNode) continue;

      const charData = serializeInputs(charNode);

      // Добавляем под-ноды лица (skin, nose, eyes и т.д.)
      charData.face_details = {};
      for (const [key, intf] of Object.entries(charNode.inputs || {})) {
        if (!["gender","age","height","weight","description"].includes(key)) {
          const subConns = state.connections.filter(c => c.to === intf?.id);
          if (subConns.length) {
            const subNode = state.nodes.find(n => 
              Object.values(n.outputs||{}).some(o => o?.id === subConns[0].from)
            );
            if (subNode) {
              charData.face_details[key] = serializeInputs(subNode);
            }
          }
        }
      }

      scene.characters.push(charData);
    }

    entry.scene = scene;
    results.push(entry);
  }

  return { results };
}

function serializeInputs(node) {
  const o = {};
  if (!node?.inputs) return o;
  for (const [k, v] of Object.entries(node.inputs)) {
    if (v?.value !== undefined && v.value !== "" && v.value !== null) {
      o[k] = v.value;
    }
  }
  return o;
}