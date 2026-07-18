import { describe, it, expect } from "vitest";
import { buildGraph } from "../domain/graph";
import { findConnections } from "../domain/query";
import type { Entity, Relationship } from "../domain/types";

const entities: Entity[] = [
  { id: "entity-1", name: "Metalúrgica Aliança S/A" },
  { id: "entity-2", name: "João Andrade" },
  { id: "entity-3", name: "Importadora Atlântico Ltda" },
  { id: "entity-4", name: "Transportadora Rio Verde" },
];

function relationship(source: string, target: string, type: string): Relationship {
  return {
    sourceEntityId: source,
    targetEntityId: target,
    relationshipType: type,
    sourceName: "junta-comercial",
    capturedAt: new Date("2023-01-10T00:00:00Z"),
  };
}

const chain: Relationship[] = [
  relationship("entity-1", "entity-2", "member_of"),
  relationship("entity-2", "entity-3", "same_address_as"),
  relationship("entity-3", "entity-4", "controls"),
];

describe("findConnections", () => {
  it("returns entities connected within N hops with the hop distance", () => {
    const graph = buildGraph(entities, chain);

    const connections = findConnections(graph, "entity-1", 2);

    expect(connections.map((connection) => connection.entity.id)).toEqual(["entity-2", "entity-3"]);
    expect(connections.map((connection) => connection.hops)).toEqual([1, 2]);
    expect(connections.map((connection) => connection.entity.id)).not.toContain("entity-1");
  });

  it("includes the path and the traversed relationships for each connection", () => {
    const graph = buildGraph(entities, chain);

    const connections = findConnections(graph, "entity-1", 2);
    const toEntity3 = connections.find((connection) => connection.entity.id === "entity-3");

    expect(toEntity3?.path.map((entity) => entity.id)).toEqual(["entity-1", "entity-2", "entity-3"]);
    expect(toEntity3?.relationships.map((relation) => relation.relationshipType)).toEqual([
      "member_of",
      "same_address_as",
    ]);
  });

  it("limits the traversal to N hops", () => {
    const graph = buildGraph(entities, chain);

    const connections = findConnections(graph, "entity-1", 1);

    expect(connections.map((connection) => connection.entity.id)).toEqual(["entity-2"]);
  });

  it("measures the distance in hops, returning each entity once by its shortest path", () => {
    const diamond: Relationship[] = [
      relationship("entity-1", "entity-2", "member_of"),
      relationship("entity-1", "entity-3", "member_of"),
      relationship("entity-3", "entity-2", "same_address_as"),
    ];
    const graph = buildGraph(entities, diamond);

    const connections = findConnections(graph, "entity-1", 3);
    const toEntity2 = connections.filter((connection) => connection.entity.id === "entity-2");

    expect(toEntity2).toHaveLength(1);
    expect(toEntity2[0]?.hops).toBe(1);
  });

  it("follows relationships in both directions", () => {
    const graph = buildGraph(entities, chain);

    const connections = findConnections(graph, "entity-3", 1);

    expect(connections.map((connection) => connection.entity.id).sort()).toEqual([
      "entity-2",
      "entity-4",
    ]);
  });

  it("returns no connections for an unknown start entity", () => {
    const graph = buildGraph(entities, chain);

    expect(findConnections(graph, "entity-404", 3)).toEqual([]);
  });

  it("returns no connections for an isolated entity", () => {
    const withIsolated: Entity[] = [...entities, { id: "entity-5", name: "Fundação Independência" }];
    const graph = buildGraph(withIsolated, chain);

    expect(findConnections(graph, "entity-5", 3)).toEqual([]);
  });

  it("returns no connections when N is below one hop", () => {
    const graph = buildGraph(entities, chain);

    expect(findConnections(graph, "entity-1", 0)).toEqual([]);
  });
});
