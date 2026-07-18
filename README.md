# Record Linkage BC

Serviço em TypeScript para ingerir vínculos entre entidades de múltiplas fontes e consultar conexões em até N saltos.

> ### 🎥 [**Assista à demonstração no Loom**](https://www.loom.com/share/9511b8911cdd418c912d3102ef88803f)
>
> Walkthrough do projeto: arquitetura, decisões e a CLI em ação.

## Stack

- Node.js 24.18.0 (LTS)
- TypeScript
- npm
- nvm

Recomendo o **nvm** em vez de instalar o Node direto no sistema: o `.nvmrc` fixa a versão do projeto, você troca entre versões sem conflito com outras ferramentas, e cada repositório pode pedir uma LTS diferente sem mexer na instalação global.

## Requisitos

```bash
nvm install    # usa a versão do .nvmrc (No meu caso a 24.18.0)
nvm use
node --version # Checar se vai aparecer algo como v24.18.0
```

## Instalação

```bash
npm install
```

## Testes

O comportamento é validado por testes unitários (Vitest).

```bash
npm test        # modo watch
npm run test:run # execução única (CI)
```

## Demonstração via CLI

A CLI executa o fluxo completo sobre os dados de exemplo em `data/` (5 fontes: `junta-comercial`, `receita-federal`, `b3`, `serasa`, `vazamento`): **ingestão → normalização → resolução de entidades → construção do grafo → consulta BFS por N hops**.

```bash
npm run cli
```

Isso resolve as entidades das múltiplas fontes e imprime as conexões a partir de uma entidade inicial (padrão: primeira entidade, `2` hops).

### Parâmetros

- `--start <ref>`: entidade de origem X. Aceita `id` (ex.: `entity-4`), `document` (ex.: `12.345.678/0001-90`) ou `name` (ex.: `"João Andrade"`).
- `--hops <N>`: número máximo de saltos (padrão `2`).
- `--show-entity-details`: por padrão a CLI mostra apenas a **contagem** de entidades resolvidas; com essa flag, imprime a lista completa (`id`, `name`, `document`) uma por uma.

```bash
# Quem está conectado a "João Andrade" em até 3 hops?
npm run cli -- --start "João Andrade" --hops 3

# Referenciando por documento (CPF), em 1 hop
npm run cli -- --start "111.111.111-11" --hops 1

# Vendo a lista completa de entidades resolvidas
npm run cli -- --start "João Andrade" --show-entity-details
```

### O que os dados de exemplo demonstram

- **Resolução por `document`:** `Metalúrgica Aliança S/A`, `Metalurgica Alianca` e `Metalúrgica Aliancca SA` (typos e formatações diferentes de nome e CNPJ) viram a mesma entidade.
- **Resolução por similaridade de `name` + evidência auxiliar:** `Transportadora Rio Verde`/`Rio Verde Transportes` (via `phone`) e `Distribuidora Nordeste Ltda`/`Nordeste Distribuidora Comercial` (via `email`) são unificadas.
- **Conflito de `document`:** duas entidades `Indústria Têxtil São José`, com CNPJs diferentes, permanecem distintas mesmo com o nome idêntico.
- **Evidência compartilhada que não unifica:** múltiplos clientes de `Escritório Contábil Silva` compartilham o mesmo email, mas não têm nome semelhante o suficiente — continuam sendo entidades diferentes.
- **Dados faltando:** entidades sem `document` (ex.: `Mercado Central`, `Transportadora Rio Verde`), sem `email` ou sem `phone`.
- **Componentes desconectados:** vários grupos de entidades (ex.: `Solaris Energia Renovável`, o comércio ao redor de `Mercado Central`, pares isolados como `Carlos Souza`/`Padaria Pão Quente Ltda`) não têm nenhuma conexão com o grupo principal de `João Andrade`.
- **Consulta BFS por N hops:** retorna as entidades conectadas dentro de N saltos, com o `path` percorrido e os `relationships` de cada aresta.

> Os dados são processados **in-memory**, sem persistência (RNF). Para editar o cenário, altere os arquivos em `data/`.
