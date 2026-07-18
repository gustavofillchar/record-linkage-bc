import { describe, it, expect } from "vitest";
import { normalizeDocument, normalizeName } from "../domain/normalization";

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

describe("normalizeName", () => {
  it("normalizes case, accents and extra spaces of the same name to one uppercase value", () => {
    const messy = normalizeName("  José   da Silva  ");
    const clean = normalizeName("jose da silva");

    expect(messy).toBe("JOSE DA SILVA");
    expect(clean).toBe("JOSE DA SILVA");
  });

  it("removes accents", () => {
    expect(normalizeName("São João")).toBe("SAO JOAO");
  });

  it("treats punctuation as a word separator", () => {
    expect(normalizeName("Luso-Brasileira Importadora")).toBe("LUSO BRASILEIRA IMPORTADORA");
    expect(normalizeName("Luso, Brasileira Importadora")).toBe("LUSO BRASILEIRA IMPORTADORA");
  });

  it("collapses multiple spaces and trims", () => {
    expect(normalizeName("   Indústria   Química   Bandeirante   ")).toBe(
      "INDUSTRIA QUIMICA BANDEIRANTE",
    );
  });

  it("applies the same rules to legal entity names", () => {
    const messy = normalizeName("  Indústria   Têxtil São José  LTDA. ");
    const clean = normalizeName("industria textil sao jose ltda");

    expect(messy).toBe("INDUSTRIA TEXTIL SAO JOSE LTDA");
    expect(clean).toBe("INDUSTRIA TEXTIL SAO JOSE LTDA");
  });

  it("keeps legal entity suffixes (no suffix stripping in baseline normalization)", () => {
    expect(normalizeName("Importadora Comercial Atlântico Ltda")).toBe(
      "IMPORTADORA COMERCIAL ATLANTICO LTDA",
    );
    expect(normalizeName("Nova Era Participações S/A")).toBe("NOVA ERA PARTICIPACOES S A");
  });
});
