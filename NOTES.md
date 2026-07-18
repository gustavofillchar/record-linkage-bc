## Abordagem

Este é um projeto de pequena escala, voltado para avaliar meu domínio sobre o problema, a abordagem e a tecnologia. Por isso, evitei overengineering e não deleguei todo o fluxo de desenvolvimento a um coding agent, como faria em projetos maiores (ex.: spec-driven development de ponta a ponta).

Optei por uma abordagem híbrida: eu planejo, defino os padrões e valido cada linha gerada; o coding agent executa task por task. Como o projeto é pequeno, consigo revisar todo o código e interferir manualmente quando necessário — sem *vibe coding*.

## O que fiz na mão vs. o que deleguei

Fiz à moda antiga toda a estrutura base do projeto: definição de pastas e arquivos, setup inicial de testes, etc.

Ao coding agent (Opus 4.8 via opencode), deleguei:

**1. Mapeamento da spec** (pasta `/docs`), a partir dos arquivos `challenge.md` (o desafio já organizado em requisitos) e `dev-solution.md` (esboço das minhas ideias para o projeto). Não usei uma skill mais complexa para isso — a ideia era manter enxuto. Prompt usado:

> Com base nos arquivos `challenge.md` e `dev-solution.md`, crie uma especificação enxuta seguindo os princípios básicos de Spec-Driven Development.
>
> Organize a documentação em seções claras, descrevendo:
>
> - Objetivo
> - Escopo
> - Requisitos funcionais
> - Requisitos não funcionais
> - Premissas
> - Restrições
> - Fluxo da solução
> - Critérios de aceitação
>
> Utilize os termos originais em inglês quando necessário para evitar ambiguidade. Não invente requisitos. Utilize apenas as informações presentes nos arquivos e destaque explicitamente qualquer suposição necessária.

**2. Plano de ação** com as tasks sequenciais, a partir da spec. Depois de validar a spec completa, pedi para transformá-la em um plano de ação executável — mantendo o mesmo cuidado de não inventar requisitos. Prompt usado:

> Com base na `spec.md`, gere um plano de ação enxuto (`tasks.md`) com tarefas sequenciais e independentes para implementar a solução via TDD. Faça uma tarefa por vez, cada uma com um checkbox para marcar ao concluir e mapeada aos requisitos correspondentes da spec. Não adicione nada além do que já está na spec.

Com o plano em mãos, fui conduzindo a execução manualmente, uma task por vez — nunca todas de uma vez. Para cada uma, solicito ao agente, valido o resultado, interfiro manualmente quando preciso e só então comito aquela task antes de seguir para a próxima. O prompt de cada etapa é simples:

> Execute a task T1 conforme a especificação.

**3. Geração de exemplos** variados de entradas para os testes.

## Por que esse caminho

Antes, o engenheiro gastava muito tempo escrevendo código e pouco definindo especificações. Hoje, com coding agents de alta qualidade (Claude Code / Codex / OpenCode), podemos exercer o ápice da engenharia: planejar e executar com excelência.

Fazendo um paralelo com a engenharia civil: o engenheiro define parâmetros, desenha a planta, calcula resistências e garante que o planejamento seja aplicado corretamente na execução — mas quem coloca bloco por bloco são os pedreiros, não o engenheiro. Da mesma forma, a engenharia de software não está mais em apenas escrever código, mas em planejar e coordenar a execução.
