## Abordagem do problema

A minha ideia inicial é abordar o problema com uma solução simples e sofisticada ao mesmo tempo. Não quero que o projeto se torne maior do que precisa ser. O que será avaliado é a minha abordagem como engenheiro de software em tomar decisões técnicas, equilibrar trade-offs e entregar a solução dentro do que enxergo como ideal para este caso.

## Domínio da solução

A primeira parte do problema e talvez a mais delicada é sobre o tratamento e injestão dos dados. A resolução das entidades, identificando dentro do possível como relacionar cada um deles se tornando a mesma entidade.

Como estamos tratando de um exercício fictício vou assumir algumas premissas base:
- Se possuir identificador único entre si, ex: cpf, cnpj, etc serão consideradas a mesma entidade;
- Se a entendidade possui nomes parecidos suficientemente após uma normalização poderão consideradas a mesma entidade;
- A utlização de atributos extras caso existam como email e telefone podem auxiliar a confirmar que são a mesma entidade;
- Em caso de nomes iguais, mas com atributos únicos divergentes serão tratados como entidades diferentes. Ex: nome exatamente igual, mas CPF diferente em fontes e sem atributos como email ou telefone para ajudar a confirmar serão tratados como entidades diferentes.

A segunda parte do problema deve ser uma consulta baseada na teoria dos grafos. Uma das necessidades da solução é conseguir trazer a quantidade de saltos (hops) entre os nós para identificar a distancia deste relacionamento entre os nós e não deve ser confundida com graus (degree), obviamente são conceitos diferentes. Considerar as nomeclaturas em inglês no código.

Para as consultas no grafo, vamos utilizar o algoritmo em busca por largura - BFS, pois ele é o mais adequado para buscar relacionamentos em nós por quantidade de saltos (hops), retornando as conexões entre as entidades mais próximas primeiro.

Vamos manter a consulta via CLI por enquanto, caso sobre tempo vou incluir um server HTTP, mas isso seria um bonus. Vou focar inteiramente em construir a solução robusta e elegante primeiro.

## Stack e metodologia de desenvolvimento

Vamos seguir o que foi proposto, utilizando Typescript e Vitest como infraestrutura para os testes. Também vamos utilizar a metodologia baseado em TDD para adequar o desenvolvimento ao que usam na empresa. Já estou com o repositório publico no Github.

Vamos manter o código bem production-grade, independente do tamanho do projeto. Com isso quero dizer, manter o código limpo, sem comentários no código, o próprio código deve ser legível o suficiente seguindo boas práticas de desenvolvimento clean code.

- TypeScript
- Vitest
- NPM (simples)
