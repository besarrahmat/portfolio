// Columns for an architecture diagram: each node sits one column after the furthest node that points to it,
// so every edge runs left to right. A cycle cannot loop forever: depths stop growing after one round per node.
export function layers<N extends { id: string }>(
  nodes: N[],
  edges: { from: string; to: string }[],
) {
  const depth = new Map(nodes.map((n) => [n.id, 0]));
  for (let round = 0; round < nodes.length; round++)
    for (const e of edges) {
      const next = (depth.get(e.from) ?? 0) + 1;
      if (depth.has(e.to) && next > (depth.get(e.to) ?? 0))
        depth.set(e.to, next);
    }
  const columns: N[][] = [];
  for (const n of nodes) {
    const d = depth.get(n.id) ?? 0;
    columns[d] = [...(columns[d] ?? []), n];
  }
  return columns.filter(Boolean);
}
