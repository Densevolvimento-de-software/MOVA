# MOVA

ERP multi-tenant para redes, grupos e lojas. Este repositório inicia a construção incremental do novo sistema; o legado em produção continua separado.

## Estrutura

- [Web](apps/web/README.md): aplicação frontend independente.
- [API](apps/api/README.md): backend como monólito modular.
- [Terraform](infrastructure/terraform/README.md): ciclo de vida próprio para infraestrutura.
- [Visão arquitetural](docs/architecture/overview.md): fronteiras e contratos.
- [ADR 0001](docs/adr/0001-monorepo.md): decisão pelo monorepo convencional.

## Fronteiras

Web e API terão dependências, builds, testes e deploys independentes. A comunicação ocorrerá por contratos OpenAPI; uma aplicação não importa o código-fonte da outra. A infraestrutura também terá seu próprio ciclo de vida.

## Evolução

Nenhum framework, runtime, versão ou destino de deploy foi aprovado nesta etapa. Não há serviços locais ou recursos de infraestrutura provisionados por este scaffold. Configurações executáveis serão adicionadas quando houver decisões e aplicações concretas.

Merge, deploy e release são etapas distintas. Integrar código não disponibiliza automaticamente uma funcionalidade aos usuários.
