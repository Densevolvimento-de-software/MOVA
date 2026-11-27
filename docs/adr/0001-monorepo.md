# ADR 0001: Monorepo convencional

- Status: Aceito
- Data: 2026-11-27

## Contexto

O novo MOVA será desenvolvido por uma equipe inicialmente pequena enquanto o legado continua em produção. Web, API e infraestrutura precisam evoluir e ser entregues de forma independente. A arquitetura também deve permitir separar aplicações em repositórios próprios no futuro.

## Decisão

Usar um monorepo convencional, sem orquestrador de workspace nesta etapa. Manter aplicações em diretórios próprios, com dependências, builds, testes e deploys independentes. Web e API se comunicam por contratos OpenAPI; não compartilham imports de código-fonte. A API segue como monólito modular. Terraform mantém ciclo de vida separado.

Nenhum framework, versão, destino de deploy ou backend Terraform é escolhido por esta decisão.

## Alternativas consideradas

- Polyrepo desde o início: cria mais coordenação e configuração operacional antes de existir necessidade concreta.
- Pacote de código compartilhado entre aplicações: aumenta acoplamento e enfraquece a independência de build e deploy.
- Ferramenta de orquestração do monorepo: não há volume ou automação que justifique essa dependência agora.

## Consequências

- A estrutura favorece mudanças pequenas e revisão por aplicação.
- Pipelines futuras podem filtrar caminhos sem tornar os ciclos de build interdependentes.
- Separar um aplicativo em outro repositório exigirá mover seu diretório e configurar seu ciclo de entrega, sem redesenhar as fronteiras internas.
- Contratos OpenAPI continuam sendo o ponto explícito de integração entre web e API.
