import type { Connection, Entity, Graph, Relationship } from "./types";
import { edgesFrom } from "./graph";

interface Frontier {
  id: string;
  path: Entity[];
  relationships: Relationship[];
}

export function findConnections(graph: Graph, startId: string, maxHops: number): Connection[] {
  const start = graph.nodes.get(startId);

  if (!start || maxHops < 1) {
    return [];
  }

  const connections: Connection[] = [];
  const visited = new Set<string>([startId]);
  let frontier: Frontier[] = [{ id: startId, path: [start], relationships: [] }];

  for (let hops = 1; hops <= maxHops && frontier.length > 0; hops++) {
    const next: Frontier[] = [];

    for (const current of frontier) {
      for (const edge of edgesFrom(graph, current.id)) {
        const entity = graph.nodes.get(edge.to);

        if (!entity || visited.has(edge.to)) {
          continue;
        }

        visited.add(edge.to);
        const path = [...current.path, entity];
        const relationships = [...current.relationships, edge.relationship];

        connections.push({ entity, hops, path, relationships });
        next.push({ id: edge.to, path, relationships });
      }
    }

    frontier = next;
  }

  return connections;
}
