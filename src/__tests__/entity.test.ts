import { describe, it, expect } from "vitest";
import { resolveEntities } from "../domain/entity";

describe("resolveEntities", () => {
  it("unifies records that share the same document even when the name diverges", () => {
    const result = resolveEntities([
      { name: "Metalúrgica Aliança S/A", document: "12.345.678/0001-90" },
      { name: "Metalurgica Alianca", document: "12345678000190" },
    ]);

    expect(result.entities).toHaveLength(1);
    expect(result.assignments[0]).toBe(result.assignments[1]);
  });

  it("keeps the first-seen attributes for the unified entity", () => {
    const result = resolveEntities([
      { name: "Metalúrgica Aliança S/A", document: "12.345.678/0001-90" },
      { name: "Metalurgica Alianca", document: "12345678000190" },
    ]);

    expect(result.entities[0]?.name).toBe("Metalúrgica Aliança S/A");
    expect(result.entities[0]?.document).toBe("12.345.678/0001-90");
  });

  it("keeps records with different documents as distinct entities even when the name is identical", () => {
    const result = resolveEntities([
      { name: "Indústria Têxtil São José", document: "11.111.111/0001-11" },
      { name: "Indústria Têxtil São José", document: "22.222.222/0001-22" },
    ]);

    expect(result.entities).toHaveLength(2);
    expect(result.assignments[0]).not.toBe(result.assignments[1]);
  });
});
