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
