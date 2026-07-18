import { describe, it, expect } from "vitest";
import { ingest } from "../domain/ingestion";

describe("ingest", () => {
  it("resolves entities across sources and builds one relationship per record", () => {
    const result = ingest([
      {
        sourceEntity: { name: "Metalúrgica Aliança S/A", document: "12.345.678/0001-90" },
        relatedEntity: { name: "João Andrade", document: "111.111.111-11" },
        relationshipType: "member_of",
        sourceName: "junta-comercial",
        capturedAt: new Date("2023-01-10T00:00:00Z"),
      },
      {
        sourceEntity: { name: "Metalurgica Alianca", document: "12345678000190" },
        relatedEntity: { name: "Importadora Atlântico Ltda", document: "22.222.222/0001-22" },
        relationshipType: "same_address_as",
        sourceName: "receita",
        capturedAt: new Date("2023-06-20T00:00:00Z"),
      },
    ]);

    expect(result.entities).toHaveLength(3);
    expect(result.relationships).toHaveLength(2);
    expect(result.relationships[0]?.sourceEntityId).toBe(result.relationships[1]?.sourceEntityId);
  });

  it("preserves sourceName and capturedAt as metadata on relationships", () => {
    const capturedAt = new Date("2023-03-15T00:00:00Z");
    const result = ingest([
      {
        sourceEntity: { name: "Holding Vale S/A", document: "33.333.333/0001-33" },
        relatedEntity: { name: "Indústria Química Bandeirante", document: "44.444.444/0001-44" },
        relationshipType: "controls",
        sourceName: "b3",
        capturedAt,
      },
    ]);

    expect(result.relationships[0]?.sourceName).toBe("b3");
    expect(result.relationships[0]?.capturedAt).toEqual(capturedAt);
    expect(result.relationships[0]?.relationshipType).toBe("controls");
  });

  it("points every relationship endpoint to a resolved entity id", () => {
    const result = ingest([
      {
        sourceEntity: { name: "Metalúrgica Aliança S/A", document: "12.345.678/0001-90" },
        relatedEntity: { name: "João Andrade", document: "111.111.111-11" },
        relationshipType: "member_of",
        sourceName: "junta-comercial",
        capturedAt: new Date("2023-01-10T00:00:00Z"),
      },
    ]);

    const ids = new Set(result.entities.map((entity) => entity.id));
    for (const relationship of result.relationships) {
      expect(ids.has(relationship.sourceEntityId)).toBe(true);
      expect(ids.has(relationship.targetEntityId)).toBe(true);
    }
  });
});
