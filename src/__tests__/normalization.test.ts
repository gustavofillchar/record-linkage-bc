import { describe, it, expect } from "vitest";
import { normalizeDocument } from "../domain/normalization";

describe("normalizeDocument", () => {
  it("normalizes the same document written with different special characters to one comparable value", () => {
    const dotted = normalizeDocument("123.456.789-00");
    const spaced = normalizeDocument("123 456 789 00");
    const raw = normalizeDocument("12345678900");

    expect(dotted).toBe(raw);
    expect(spaced).toBe(raw);
  });

  it("removes punctuation from a CNPJ", () => {
    expect(normalizeDocument("12.345.678/0001-90")).toBe("12345678000190");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeDocument("  123.456.789-00  ")).toBe("12345678900");
  });
});
