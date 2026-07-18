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

  it("unifies weakly similar names when the email corroborates (case-insensitive)", () => {
    const result = resolveEntities([
      { name: "Aliança Metais", email: "Financeiro@AliancaMetais.com.br" },
      { name: "Aliança Metais Comércio", email: "financeiro@aliancametais.com.br" },
    ]);

    expect(result.entities).toHaveLength(1);
    expect(result.assignments[0]).toBe(result.assignments[1]);
  });

  it("unifies weakly similar names when the phone corroborates (ignoring formatting)", () => {
    const result = resolveEntities([
      { name: "Transportadora Rio Verde", phone: "(11) 4004-4000" },
      { name: "Rio Verde Transportes", phone: "1140044000" },
    ]);

    expect(result.entities).toHaveLength(1);
    expect(result.assignments[0]).toBe(result.assignments[1]);
  });

  it("does not unify distinct companies that merely share an email (shared accountant email)", () => {
    const result = resolveEntities([
      { name: "Padaria do Zé", email: "contato@contabilidadesilva.com.br" },
      { name: "Metalúrgica Aliança", email: "contato@contabilidadesilva.com.br" },
    ]);

    expect(result.entities).toHaveLength(2);
    expect(result.assignments[0]).not.toBe(result.assignments[1]);
  });

  it("unifies on strong name similarity alone, without auxiliary attributes", () => {
    const result = resolveEntities([
      { name: "Comercial Atlântico Importadora" },
      { name: "Importadora Comercial Atlântico" },
    ]);

    expect(result.entities).toHaveLength(1);
    expect(result.assignments[0]).toBe(result.assignments[1]);
  });

  it("does not unify weakly similar names without corroborating auxiliary attributes", () => {
    const result = resolveEntities([
      { name: "Transportadora Rio Verde" },
      { name: "Rio Verde Transportes" },
    ]);

    expect(result.entities).toHaveLength(2);
    expect(result.assignments[0]).not.toBe(result.assignments[1]);
  });

  it("does not unify auxiliary matches when documents conflict", () => {
    const result = resolveEntities([
      { name: "Grupo Andrade Participações", document: "11.111.111/0001-11", email: "ri@andrade.com" },
      { name: "Andrade Holding", document: "22.222.222/0001-22", email: "ri@andrade.com" },
    ]);

    expect(result.entities).toHaveLength(2);
    expect(result.assignments[0]).not.toBe(result.assignments[1]);
  });
});
