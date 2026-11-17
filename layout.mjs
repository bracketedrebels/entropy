// A deterministic DAG layout. Positions are a view; compiler data stays immutable.
export const inputY = (node, port) => (node.kind === 'output' ? node.height / 2 : 48 + port * 23);
export function layoutGraph(graph) {
  const nodes = graph.nodes.map((n) => ({
    ...n,
    width: n.kind === 'output' ? 150 : 230,
    height: n.kind === 'output' ? 86 : Math.max(124, 66 + n.inputs.length * 23),
    rank: 0,
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  if (byId.size !== nodes.length) throw new Error('Duplicate node ID');
  const incoming = new Map(nodes.map((n) => [n.id, []]));
  const outgoing = new Map(nodes.map((n) => [n.id, []]));
  for (const e of graph.edges) {
    if (!byId.has(e.from) || !byId.has(e.to)) throw new Error('Unknown edge endpoint');
    if (!Number.isInteger(e.port) || e.port < 0 || e.port >= byId.get(e.to).inputs.length)
      throw new Error('Invalid input port');
    incoming.get(e.to).push(e.from);
    outgoing.get(e.from).push(e.to);
  }
  const degree = new Map([...incoming].map(([id, list]) => [id, list.length]));
  const queue = nodes.filter((n) => degree.get(n.id) === 0);
  const order = [];
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    order.push(node);
    for (const target of outgoing.get(node.id)) {
      const next = byId.get(target);
      next.rank = Math.max(next.rank, node.rank + 1);
      degree.set(target, degree.get(target) - 1);
      if (degree.get(target) === 0) queue.push(next);
    }
  }
  if (order.length !== nodes.length) throw new Error('Cycle in graph');
  const layers = [];
  for (const node of order) (layers[node.rank] ??= []).push(node);
  const positions = () => new Map(layers.flatMap((layer) => layer.map((node, i) => [node.id, i])));
  for (let pass = 0; pass < 4; pass++) {
    const forward = pass % 2 === 0,
      neighbors = forward ? incoming : outgoing;
    const indexes = layers.map((_, i) => i);
    if (!forward) indexes.reverse();
    for (const i of indexes) {
      const p = positions();
      const weight = (n) => {
        const ns = neighbors.get(n.id);
        return ns.length ? ns.reduce((sum, id) => sum + p.get(id), 0) / ns.length : p.get(n.id);
      };
      layers[i].sort((a, b) => weight(a) - weight(b));
    }
  }
  const gap = 62;
  const heights = layers.map((layer) => layer.reduce((sum, n) => sum + n.height, 0) + gap * (layer.length - 1));
  const height = Math.max(1, ...heights);
  let x = 0;
  for (const [i, layer] of layers.entries()) {
    let y = (height - heights[i]) / 2;
    for (const node of layer) {
      node.x = x;
      node.y = y;
      y += node.height + gap;
    }
    x += Math.max(...layer.map((n) => n.width)) + 86;
  }
  const edges = graph.edges.map((e) => {
    const a = byId.get(e.from),
      b = byId.get(e.to);
    const x1 = a.x + a.width,
      y1 = a.y + a.height / 2,
      x2 = b.x,
      y2 = b.y + inputY(b, e.port);
    const bend = Math.max(34, (x2 - x1) * 0.48);
    return { ...e, path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}` };
  });
  return { nodes, edges, width: Math.max(1, x - 86), height };
}
export function fitTransform(width, height, layout, padding = 52) {
  const scale = Math.min(
    1.1,
    Math.max(
      0.15,
      Math.min(Math.max(1, width - padding * 2) / layout.width, Math.max(1, height - padding * 2) / layout.height),
    ),
  );
  return { scale, x: (width - layout.width * scale) / 2, y: (height - layout.height * scale) / 2 };
}
