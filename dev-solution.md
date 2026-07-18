## Abordagem do problema

A minha ideia inicial é abordar o problema com uma solução simples e sofisticada ao mesmo tempo. Não quero que o projeto se torne maior do que precisa ser. O que será avaliado é a minha abordagem como engenheiro de software em tomar decisões técnicas, equilibrar trade-offs e entregar a solução dentro do que enxergo como ideal para este caso.

## Domínio da solução

A primeira parte do problema e talvez a mais delicada é sobre o tratamento e injestão dos dados. A resolução das entidades, identificando dentro do possível como relacionar cada um deles se tornando a mesma entidade.

Como estamos tratando de um exercício fictício vou assumir algumas premissas base:

- Caso registros possuam um identificador único em comum (ex: CPF, CNPJ ou outro identificador equivalente), serão considerados a mesma entidade.
- Caso não exista um identificador único, registros poderão ser considerados a mesma entidade caso possuam nomes suficientemente semelhantes após um processo de normalização.
- Uma entidade pode aparecer com nomes ou atributos descritivos diferentes entre fontes distintas. Caso exista um identificador único em comum, como CPF ou CNPJ, será considerada a mesma entidade independentemente da diferença nos demais atributos.
- A utilização de atributos auxiliares, como email e telefone, poderá ser utilizada como evidência adicional durante o processo de resolução.
- Em caso de conflito entre identificadores únicos, os registros serão tratados como entidades diferentes.
  - Exemplo: registros com o mesmo nome, mas CPFs diferentes, sem atributos auxiliares suficientes para confirmar a relação, serão considerados entidades distintas.

A segunda parte do problema deve ser uma consulta baseada na teoria dos grafos. Uma das necessidades da solução é conseguir trazer a quantidade de saltos (hops) entre os nós para identificar a distancia deste relacionamento entre os nós e não deve ser confundida com graus (degree), obviamente são conceitos diferentes. Considerar as nomeclaturas em inglês no código.

Para as consultas no grafo, vamos utilizar o algoritmo em busca por largura - BFS, pois ele é o mais adequado para buscar relacionamentos em nós por quantidade de saltos (hops), retornando as conexões entre as entidades mais próximas primeiro.

Vamos manter a consulta via CLI por enquanto, caso sobre tempo vou incluir um server HTTP, mas isso seria um bonus. Vou focar inteiramente em construir a solução robusta e elegante primeiro.

## Stack e metodologia de desenvolvimento

Vamos seguir o que foi proposto, utilizando Typescript e Vitest como infraestrutura para os testes. Também vamos utilizar a metodologia baseado em TDD para adequar o desenvolvimento ao que usam na empresa. Já estou com o repositório publico no Github.

Vamos manter o código bem production-grade, independente do tamanho do projeto. Com isso quero dizer, manter o código limpo, sem comentários no código, o próprio código deve ser legível o suficiente seguindo boas práticas de desenvolvimento clean code.

- TypeScript
- Vitest
- NPM (simples)

## Decisoes arquiteturais

Vamos optar por seguir com as seguintes especificações:

- Grafo não ponderado;
- Relacionamentos entre entidades são bidirecionais;
- `capturedAt` e `sourceName` serão preservados como metadados e não influenciarão a resolução das entidades neste momento.
- Algorítmo BFS será utilizado para as consultas;
- A consulta retornará os caminhos encontrados entre entidades, incluindo os relacionamentos percorridos.

## Modelo de domínio

A forma que vamos representar as entidades e os relacionamentos existentes entre elas.

#### Entity

Será a representação de uma entidade resolvida após o processo de ingestão dos dados.

```ts
interface Entity {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
}
```

Regras:

- `id` representa o identificador interno da entidade dentro da aplicação.
- `document` representa identificadores únicos como CPF ou CNPJ.
- `email` e `phone` são atributos auxiliares utilizados durante a resolução.
- Alguns atributos podem não existir dependendo da fonte dos dados.

### Relationship

Representa um vínculo entre duas entidades.

```ts
interface Relationship {
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  sourceName: string;
  capturedAt: Date;
}
```

Regras:

- `relationshipType` representa o tipo de vínculo entre as entidades.
- Exemplos:
  - `member_of`
  - `same_address_as`
- O relacionamento não possui peso.
- Cada relacionamento representa uma aresta no grafo.