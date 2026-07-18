import type { Entity, EntityInput, ResolutionResult } from "./types";
import { normalizeDocument } from "./normalization";

export function resolveEntities(inputs: EntityInput[]): ResolutionResult {
  const entities: Entity[] = [];
  const assignments: string[] = [];

  for (const input of inputs) {
    const match = findByDocument(entities, input);

    if (match) {
      assignments.push(match.id);
      continue;
    }

    const entity: Entity = { id: `entity-${entities.length + 1}`, ...input };
    entities.push(entity);
    assignments.push(entity.id);
  }

  return { entities, assignments };
}

function findByDocument(entities: Entity[], input: EntityInput): Entity | undefined {
  if (!input.document) {
    return undefined;
  }

  const target = normalizeDocument(input.document);

  if (!target) {
    return undefined;
  }

  return entities.find(
    (entity) => entity.document !== undefined && normalizeDocument(entity.document) === target,
  );
}
