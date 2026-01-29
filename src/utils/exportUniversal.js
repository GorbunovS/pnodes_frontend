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
  const masterTypes = new Set(["CompositionNode", "CharacterFullNode", "CharacterNode"]);

  const resultNodes = state.nodes.filter(n => n.type === "ResultNode");

  if (resultNodes.length === 0) {
    return { error: "Нет ResultNode" };
  }

  const results = [];

  for (const [idx, resultNode] of resultNodes.entries()) {
    // Находим все мастер-ноды в графе
    const masterNodes = state.nodes.filter(n => masterTypes.has(n.type));

    if (masterNodes.length === 0) {
      results.push({
        order: idx + 1,
        result_id: resultNode.id,
        result: serializeNodeInputs(resultNode),
        nodes: { warning: "Нет Composition/Character нод" },
      });
      continue;
    }

    const masterIds = masterNodes.map(n => n.id);
    const connectedNodes = getUpstreamNodes(state, masterIds);

    // Группируем
    const nodeGroups = {};
    for (const node of connectedNodes) {
      if (node.type === "ResultNode") continue;
      if (!nodeGroups[node.type]) nodeGroups[node.type] = [];
      nodeGroups[node.type].push({
        id: node.id,
        ...serializeNodeInputs(node)
      });
    }

    results.push({
      order: idx + 1,
      generationData: nodeGroups
    });
  }

  return { results };
}