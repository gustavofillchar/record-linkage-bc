import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeDocument, normalizeName } from "./domain/normalization";
import type { Entity, LinkRecord } from "./domain/types";

export const DATA_DIR = join(process.cwd(), "data");

type RawRecord = Omit<LinkRecord, "capturedAt"> & { capturedAt: string };

export function loadRecords(directory: string): LinkRecord[] {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .flatMap((file) => readRecords(join(directory, file)));
}

function readRecords(path: string): LinkRecord[] {
  const raw = JSON.parse(readFileSync(path, "utf-8")) as RawRecord[];
  return raw.map((record) => ({ ...record, capturedAt: new Date(record.capturedAt) }));
}

export function findEntity(entities: Entity[], reference: string): Entity | undefined {
  return (
    entities.find((entity) => entity.id === reference) ??
    findByDocument(entities, reference) ??
    findByName(entities, reference)
  );
}

function findByDocument(entities: Entity[], reference: string): Entity | undefined {
  const document = normalizeDocument(reference);

  if (document === "") {
    return undefined;
  }

  return entities.find(
    (entity) => entity.document !== undefined && normalizeDocument(entity.document) === document,
  );
}

function findByName(entities: Entity[], reference: string): Entity | undefined {
  const name = normalizeName(reference);

  if (name === "") {
    return undefined;
  }

  return entities.find((entity) => normalizeName(entity.name) === name);
}
