# Tasks — Record Linkage

Plano de execução sequenciado para implementar `spec.md` via TDD. Faça uma tarefa por vez, marcando o checkbox ao concluir.

> **Convenção:** cada tarefa segue o ciclo TDD **red → green → refactor** (escreva o teste primeiro, faça passar, depois refatore). Código in-memory, nomenclatura em inglês, sem comentários (RNF). Nada aqui adiciona requisitos além de `spec.md`.

---

- [x] **T1 — Setup** *(RNF)*
  - Configurar Vitest, estrutura de pastas e scripts npm.
  - Teste: um teste trivial rodando para validar o pipeline de testes.

- [x] **T2 — Tipos do domínio** *(Modelo de domínio)*
  - Definir as interfaces `Entity` e `Relationship` conforme a spec.
  - Sem teste dedicado (apenas tipos); serão exercitados pelas tarefas seguintes.

- [x] **T3 — Normalização de** `document` *(RF2)*
  - Teste: valores com caracteres especiais diferentes normalizam para o mesmo valor comparável.
  - Implementação: remover caracteres especiais e comparar apenas o valor normalizado (strong identifier).

- [x] **T4 — Normalização de** `name` *(RF2)*
  - Teste: variações de caixa, acentos, pontuação e espaços extras normalizam para o mesmo `name` em Uppercase.
  - Implementação: normalizar `name` removendo essas diferenças; padrão Uppercase.

- [x] **T5 — Resolução por** `document` *(RF3)*
  - Teste: dois registros com o mesmo `document` viram a mesma entidade, mesmo com `name` divergente.
  - Implementação: unificar entidades pelo `document` normalizado (primeiro na ordem de confiança).

- [x] **T6 — Conflito de** `document` *(RF3)*
  - Teste: registros com `document` diferentes (ex.: mesmo `name`, sem auxiliares suficientes) permanecem entidades distintas.
  - Implementação: tratar conflito de identificadores únicos como entidades diferentes.

- [x] **T7 — Resolução por atributos auxiliares** *(RF3)*
  - Teste: sem `document`, `email`/`phone` coincidentes servem como evidência adicional para unificar.
  - Implementação: usar auxiliares como segundo nível da ordem de confiança.

- [x] **T8 — Resolução por similaridade de** `name` *(RF3)*
  - Teste: sem `document` nem auxiliares suficientes, `name` suficientemente semelhante (após normalização) unifica as entidades.
  - Implementação: aplicar comparação de similaridade como último nível.
  - Nota: a estratégia de similaridade é decisão de implementação e pode ser ajustada pelos testes.
  - **Correção do T7 (evidência adicional):** `email`/`phone` deixaram de ser chave única (caso do email da contabilidade compartilhado). Passaram a **corroborar** a similaridade de `name` com 2 limiares — nome forte unifica sozinho; nome fraco só unifica com `email`/`phone` coincidente. T7 e T8 ficaram integrados em `matchesByName`. Similaridade via Jaccard de tokens (`similarity.ts`).

- [ ] **T9 — Ingestão** *(RF1)*
  - Teste: dado um conjunto de registros de múltiplas fontes, o pipeline produz entidades resolvidas e a lista de `Relationship`.
  - Implementação: orquestrar normalização (T3–T4) + resolução (T5–T8); preservar `capturedAt` e `sourceName` como metadata (Restrições), sem influenciar a resolução.

- [ ] **T10 — Construção do grafo** *(Restrições)*
  - Teste: relationships geram arestas (edges) **bidirecionais** em grafo **não ponderado**; entidades resolvidas são os nós.
  - Implementação: montar o grafo in-memory a partir das entidades e relationships.

- [ ] **T11 — Consulta BFS por N hops** *(RF4)*
  - Teste: dada a entidade X e N, retorna quem está conectado dentro de N hops, com os paths e os relationships percorridos; distância em **hops** (não degree).
  - Implementação: BFS a partir de X limitado a N hops, retornando os caminhos.
  - **Suposições necessárias** a decidir aqui: como referenciar X (`id`, `name` ou `document`) e receber `N` como parâmetro da consulta.

- [ ] **T12 — Demonstração (opcional)** *(Escopo — transporte não obrigatório)*
  - Expor o comportamento via função CLI, pequeno servidor HTTP **ou** testes de ponta a ponta.

