import { describe, it, expect } from "vitest";
import { buildGraph, edgesFrom } from "../domain/graph";
import type { Entity, Relationship } from "../domain/types";

const entities: Entity[] = [
  { id: "entity-1", name: "Metalúrgica Aliança S/A" },
  { id: "entity-2", name: "João Andrade" },
  { id: "entity-3", name: "Importadora Atlântico Ltda" },
];

const relationship: Relationship = {
  sourceEntityId: "entity-1",
  targetEntityId: "entity-2",
  relationshipType: "member_of",
  sourceName: "junta-comercial",
  capturedAt: new Date("2023-01-10T00:00:00Z"),
};

describe("buildGraph", () => {
  it("creates a node for every resolved entity", () => {
    const graph = buildGraph(entities, []);

    expect(graph.nodes.size).toBe(3);
    expect(graph.nodes.get("entity-1")?.name).toBe("Metalúrgica Aliança S/A");
  });

  it("creates bidirectional edges for each relationship", () => {
    const graph = buildGraph(entities, [relationship]);

    expect(edgesFrom(graph, "entity-1").map((edge) => edge.to)).toContain("entity-2");
    expect(edgesFrom(graph, "entity-2").map((edge) => edge.to)).toContain("entity-1");
  });

  it("keeps the traversed relationship on each edge", () => {
    const graph = buildGraph(entities, [relationship]);

    expect(edgesFrom(graph, "entity-1")[0]?.relationship).toBe(relationship);
    expect(edgesFrom(graph, "entity-2")[0]?.relationship).toBe(relationship);
  });

  it("returns no neighbors for an isolated node", () => {
    const graph = buildGraph(entities, [relationship]);

    expect(edgesFrom(graph, "entity-3")).toEqual([]);
  });
});
