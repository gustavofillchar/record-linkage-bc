import type { IngestionResult, LinkRecord, Relationship } from "./types";
import { resolveEntities } from "./entity";

export function ingest(records: LinkRecord[]): IngestionResult {
  const inputs = records.flatMap((record) => [record.sourceEntity, record.relatedEntity]);
  const { entities, assignments } = resolveEntities(inputs);

  const relationships: Relationship[] = records.map((record, index) => ({
    sourceEntityId: assignments[index * 2]!,
    targetEntityId: assignments[index * 2 + 1]!,
    relationshipType: record.relationshipType,
    sourceName: record.sourceName,
    capturedAt: record.capturedAt,
  }));

  return { entities, relationships };
}
