import type { Entity, Graph, GraphEdge, Relationship } from "./types";

export function buildGraph(entities: Entity[], relationships: Relationship[]): Graph {
  const nodes = new Map(entities.map((entity) => [entity.id, entity]));
  const adjacency = new Map<string, GraphEdge[]>();

  for (const relationship of relationships) {
    connect(adjacency, relationship.sourceEntityId, relationship.targetEntityId, relationship);
    connect(adjacency, relationship.targetEntityId, relationship.sourceEntityId, relationship);
  }

  return { nodes, adjacency };
}

export function edgesFrom(graph: Graph, entityId: string): GraphEdge[] {
  return graph.adjacency.get(entityId) ?? [];
}

function connect(
  adjacency: Map<string, GraphEdge[]>,
  from: string,
  to: string,
  relationship: Relationship,
): void {
  const edges = adjacency.get(from) ?? [];
  edges.push({ to, relationship });
  adjacency.set(from, edges);
}
