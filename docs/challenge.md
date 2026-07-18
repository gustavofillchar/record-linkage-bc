# Desafio — Record Linkage

Exercício prático alinhado ao trabalho na Basalto, incluindo o uso de agentes de IA como parte do fluxo de trabalho.

---

## Contexto

Em vez de um desafio tradicional de algoritmos ou uma sessão de live coding, este exercício simula um problema real: **integrar e consultar vínculos entre entidades** a partir de múltiplas fontes de dados.

---

## Problema

Você recebe registros de participação/vínculo entre entidades, vindos de **duas ou três fontes diferentes**, capturadas em **momentos diferentes**. Cada registro descreve:

- uma entidade;
- seus membros/participantes;
- os vínculos que cada membro tem com outras entidades.

As fontes **nem sempre concordam** entre si. Exemplos comuns de divergência:

- nomes escritos de formas diferentes;
- um identificador presente em uma fonte e ausente em outra;
- um vínculo que aparece em uma fonte e não na outra.

Seu objetivo é **unificar e resolver** essas inconsistências para responder consultas sobre a rede de conexões.

---



## O que construir

Um **serviço em TypeScript** que:

1. **Ingere** os registros de vínculo vindos das diferentes fontes.
2. **Responde consultas** do tipo: *"quem está conectado à entidade X, e como, dentro de N saltos?"*

> A camada de transporte **não é obrigatória**. Pode ser uma função exposta via CLI, um pequeno servidor HTTP ou testes que demonstrem o comportamento. O foco da avaliação é o **modelo de domínio** e a **lógica de resolução**.

---



## Formato de entrada sugerido

Sinta-se livre para ajustar conforme fizer sentido para o seu modelo. Sugestão:


| Campo              | Descrição                                                           |
| ------------------ | ------------------------------------------------------------------- |
| `sourceEntity`     | Entidade de origem do vínculo                                       |
| `relatedEntity`    | Entidade relacionada                                                |
| `relationshipType` | Tipo do vínculo (string livre, ex.: `member_of`, `same_address_as`) |
| `sourceName`       | Nome da fonte de onde o registro veio                               |
| `capturedAt`       | Data/hora em que o registro foi capturado                           |


Exemplo conceitual: uma **lista de registros**, cada um com os campos acima.

---



## Requisitos técnicos


| Item                  | Detalhe                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------- |
| **Linguagem**         | TypeScript (stack atual da Basalto)                                                           |
| **TDD**               | Praticamos TDD internamente; seguir esse processo é um diferencial, mas **não é obrigatório** |
| **Ferramentas de IA** | Pode (e é esperado) usar as ferramentas que você usa no dia a dia                             |




### Uso de IA

Se utilizar agentes ou assistentes de IA, inclua junto com o código uma **nota breve** sobre:

- quais prompts ou fluxos você usou;
- o que revisou ou reescreveu manualmente.

Isso faz parte do que estamos avaliando.