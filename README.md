# Record Linkage BC

Serviço em TypeScript para ingerir vínculos entre entidades de múltiplas fontes e consultar conexões em até N saltos.

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
