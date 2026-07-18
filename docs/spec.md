# Especificação — Record Linkage

Especificação enxuta seguindo princípios de Spec-Driven Development.

> **Rastreabilidade:** este documento é derivado exclusivamente de `challenge.md` e `dev-solution.md`. Nenhum requisito foi inventado. Toda suposição que não está explícita no desafio é sinalizada com **Suposição necessária**.

---

## Objetivo

Construir um **serviço em TypeScript** que integra vínculos (`relationships`) entre entidades vindos de **duas ou três fontes diferentes**, capturadas em momentos diferentes, **unifica e resolve** as inconsistências entre essas fontes (record linkage / entity resolution) e **responde consultas** sobre a rede de conexões do tipo: *"quem está conectado à entidade X, e como, dentro de N saltos (hops)?"*.

O foco da avaliação é o **modelo de domínio** e a **lógica de resolução**.

---



## Escopo

**Dentro do escopo:**

- Ingestão (`ingest`) de registros de vínculo vindos de múltiplas fontes.
- Normalização dos atributos antes da comparação.
- Resolução de entidades (entity resolution) por ordem de confiança.
- Consulta de conexões da entidade X dentro de N hops, retornando os caminhos (paths) e os relacionamentos percorridos.

**Fora do escopo / não obrigatório:**

- Camada de transporte não é obrigatória — pode ser uma função via CLI, um pequeno servidor HTTP ou testes que demonstrem o comportamento.
- Persistência de dados — o processamento é **in-memory**, sem persistir os dados gerados.

---



## Requisitos funcionais



### RF1 — Ingestão

O serviço deve ingerir registros de vínculo vindos de diferentes fontes.

### RF2 — Normalização

Etapa inicial aplicada antes da comparação dos registros:

- `document`: tratado como identificador forte (strong identifier); remover caracteres especiais e comparar apenas o valor normalizado.
- `name`: remover diferenças de caixa, acentos, pontuação e espaços extras; padrão em **Uppercase**.



### RF3 — Resolução de entidades

A resolução deve seguir a seguinte **ordem de confiança**:

1. Identificadores únicos como CPF/CNPJ (`document`);
2. Atributos auxiliares como `email` e `phone`;
3. Similaridade de atributos descritivos (`name`) quando não existirem informações suficientes.

Regras de resolução:

- Registros com o **mesmo** `document` são a mesma entidade, mesmo que os demais atributos (como `name`) divirjam entre as fontes.
- Sem `document`, registros podem ser a mesma entidade se os `name` forem **suficientemente semelhantes** após a normalização.
- `email` e `phone` são usados como **evidência adicional** durante a resolução.
- Em **conflito entre identificadores únicos**, os registros são tratados como entidades diferentes (ex.: mesmo `name`, `document` diferentes, sem atributos auxiliares suficientes → entidades distintas).

> A estratégia de comparação de similaridade é uma **decisão de implementação** e pode ser ajustada conforme os resultados dos testes.



### RF4 — Consulta de conexões

Dada uma entidade X e um número de saltos N, o serviço deve responder quem está conectado a X e como, dentro de N hops.

- A distância é medida em **hops** (saltos), que **não** deve ser confundida com **degree** (grau) — conceitos diferentes.
- A consulta retorna os **caminhos (paths)** encontrados entre entidades, incluindo os **relacionamentos percorridos**.



### Modelo de domínio

Contratos definidos em `dev-solution.md`. O domínio é **genérico**: uma entidade representa qualquer elemento identificado pelas fontes, não limitado a um tipo específico (pessoa física, jurídica, etc.).

```ts
interface Entity {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
}
```

- `id`: identificador interno da entidade dentro da aplicação.
- `document`: identificadores únicos como CPF ou CNPJ.
- `email` e `phone`: atributos auxiliares usados durante a resolução.
- Alguns atributos podem não existir dependendo da fonte.

```ts
interface Relationship {
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  sourceName: string;
  capturedAt: Date;
}
```

- `relationshipType`: tipo do vínculo (string livre, ex.: `member_of`, `same_address_as`).
- Cada `Relationship` representa uma aresta (edge) no grafo.

---



## Requisitos não funcionais

- **Linguagem:** TypeScript.
- **Testes:** Vitest.
- **Metodologia:** TDD (adotado nesta solução).
- **Gerenciador de pacotes:** npm (setup simples).
- **Execução:** in-memory, sem persistência.
- **Qualidade:** código production-grade, clean code, legível, **sem comentários** no código.
- **Nomenclatura:** termos em **inglês** no código.
- **Repositório:** público no GitHub.

---



## Premissas

Adotadas por se tratar de um **exercício fictício** (base para as regras de RF3):

- As regras de resolução de entidades descritas em RF3 são premissas assumidas para o cenário fictício.
- O domínio de entidade é tratado de forma genérica (qualquer elemento, sem tipo fixo).

**Suposições necessárias** (pontos que o desafio não detalha e foram assumidos):

- **Suposição necessária:** os atributos usados na resolução (`name`, `document`, `email`, `phone`) acompanham os registros de entrada. O formato sugerido em `challenge.md` cita apenas `sourceEntity`, `relatedEntity`, `relationshipType`, `sourceName` e `capturedAt`.
- **Suposição necessária:** não está claro como referenciar a entidade X na consulta (por `id`, `name` ou `document`).
- **Suposição necessária:** o `N` de saltos vem como parâmetro na consulta.

---



## Restrições

Decisões arquiteturais que restringem a solução (`dev-solution.md`):

- Grafo **não ponderado** (unweighted graph).
- Relacionamentos entre entidades são **bidirecionais**.
- Algoritmo **BFS** utilizado para as consultas.
- `capturedAt` e `sourceName` são preservados como **metadados** e **não influenciam** a resolução das entidades neste momento.
- Processamento **in-memory** (sem persistência).
- Camada de transporte não obrigatória.
- Manter a solução mínima, evitando overengineering.

---



## Fluxo da solução

1. **Ingestão** dos registros de vínculo vindos das diferentes fontes.
2. **Normalização** dos atributos (`document` como identificador forte; `name` em Uppercase, sem acentos/pontuação/caixa/espaços extras).
3. **Resolução de entidades** pela ordem de confiança (`document` → `email`/`phone` → similaridade de `name`), aplicando as regras de RF3.
4. **Construção do grafo** não ponderado e bidirecional (entidades = nós; relationships = arestas), preservando `capturedAt` e `sourceName` como metadados.
5. **Consulta** por BFS a partir da entidade X, limitada a N hops.
6. **Retorno** dos caminhos (paths) encontrados, incluindo os relacionamentos percorridos.

---



## Critérios de aceitação

- [ ] Registros com o mesmo `document` são resolvidos como **a mesma entidade**, mesmo que o `name` divirja entre fontes.
- [ ] Registros com `document` em conflito são tratados como **entidades distintas** (ex.: mesmo `name`, `document` diferentes, sem atributos auxiliares suficientes).
- [ ] Registros sem `document`, mas com `name` suficientemente semelhante após normalização, são resolvidos como a mesma entidade.
- [ ] `email` e `phone` são considerados como evidência adicional na resolução.
- [ ] `document` é comparado sem caracteres especiais; `name` é comparado sem diferenças de caixa, acentos, pontuação e espaços extras (em Uppercase).
- [ ] A consulta, dada a entidade X e N, retorna as entidades conectadas dentro de N hops, incluindo os paths e os relacionamentos percorridos.
- [ ] A distância é medida em **hops**, não em **degree**.
- [ ] `capturedAt` e `sourceName` não alteram o resultado da resolução.
- [ ] O processamento ocorre in-memory, sem persistência.