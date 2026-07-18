import { describe, it, expect } from "vitest";
import { nameSimilarity } from "../domain/similarity";

describe("nameSimilarity", () => {
  it("returns 1 for names with the same tokens regardless of order and formatting", () => {
    expect(nameSimilarity("Comercial Atlântico Importadora", "IMPORTADORA comercial atlantico")).toBe(1);
  });

  it("returns 0 for names with no tokens in common", () => {
    expect(nameSimilarity("Padaria do Zé", "Metalúrgica Aliança")).toBe(0);
  });

  it("scores partial token overlap between 0 and 1", () => {
    expect(nameSimilarity("Transportadora Rio Verde", "Rio Verde Transportes")).toBeCloseTo(0.5);
  });

  it("returns 0 when either name has no comparable tokens", () => {
    expect(nameSimilarity("", "Metalúrgica Aliança")).toBe(0);
  });
});
