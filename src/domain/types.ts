export interface Entity {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
}

export interface Relationship {
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  sourceName: string;
  capturedAt: Date;
}

export type EntityInput = Omit<Entity, "id">;

export interface ResolutionResult {
  entities: Entity[];
  assignments: string[];
}

export interface LinkRecord {
  sourceEntity: EntityInput;
  relatedEntity: EntityInput;
  relationshipType: string;
  sourceName: string;
  capturedAt: Date;
}

export interface IngestionResult {
  entities: Entity[];
  relationships: Relationship[];
}

export interface GraphEdge {
  to: string;
  relationship: Relationship;
}

export interface Graph {
  nodes: Map<string, Entity>;
  adjacency: Map<string, GraphEdge[]>;
}

export interface Connection {
  entity: Entity;
  hops: number;
  path: Entity[];
  relationships: Relationship[];
}
