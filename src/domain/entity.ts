import type { Entity, EntityInput, ResolutionResult } from "./types";
import { normalizeDocument, normalizeEmail, normalizePhone } from "./normalization";
import { nameSimilarity } from "./similarity";

const STRONG_NAME_SIMILARITY = 0.7;
const WEAK_NAME_SIMILARITY = 0.4;

export function resolveEntities(inputs: EntityInput[]): ResolutionResult {
  const entities: Entity[] = [];
  const assignments: string[] = [];

  for (const input of inputs) {
    const match = findMatch(entities, input);

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

function findMatch(entities: Entity[], input: EntityInput): Entity | undefined {
  return findByDocument(entities, input) ?? findByCorroboratedName(entities, input);
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

function findByCorroboratedName(entities: Entity[], input: EntityInput): Entity | undefined {
  return entities.find((entity) => matchesByName(entity, input));
}

function matchesByName(entity: Entity, input: EntityInput): boolean {
  if (hasDocumentConflict(entity, input)) {
    return false;
  }

  const similarity = nameSimilarity(entity.name, input.name);

  if (similarity >= STRONG_NAME_SIMILARITY) {
    return true;
  }

  return similarity >= WEAK_NAME_SIMILARITY && sharesAuxiliary(entity, input);
}

function sharesAuxiliary(entity: Entity, input: EntityInput): boolean {
  return sharesEmail(entity, input) || sharesPhone(entity, input);
}

function sharesEmail(entity: Entity, input: EntityInput): boolean {
  if (input.email === undefined || entity.email === undefined) {
    return false;
  }

  const normalized = normalizeEmail(input.email);
  return normalized !== "" && normalized === normalizeEmail(entity.email);
}

function sharesPhone(entity: Entity, input: EntityInput): boolean {
  if (input.phone === undefined || entity.phone === undefined) {
    return false;
  }

  const normalized = normalizePhone(input.phone);
  return normalized !== "" && normalized === normalizePhone(entity.phone);
}

function hasDocumentConflict(entity: Entity, input: EntityInput): boolean {
  if (input.document === undefined || entity.document === undefined) {
    return false;
  }

  return normalizeDocument(input.document) !== normalizeDocument(entity.document);
}
