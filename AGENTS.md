# Instruções para agentes

Estas regras se aplicam a todo trabalho neste repositório.

## Antes de alterar

- Leia a issue, seus critérios de aceitação e os cenários de validação.
- Consulte a [visão arquitetural](docs/architecture/overview.md), os [ADRs](docs/adr/), a [política de desenvolvimento](docs/engineering/development-policy.md) e a [estratégia de testes](docs/engineering/testing-strategy.md).
- Ao trabalhar em uma aplicação, leia também seu README: [web](apps/web/README.md), [API](apps/api/README.md) ou [Terraform](infrastructure/terraform/README.md).
- Consulte as regras de negócio em `docs/business-rules` quando esse diretório existir. Se uma regra necessária não estiver documentada ou uma decisão crítica estiver pendente, peça esclarecimento.

## Limites obrigatórios

- Mantenha o repositório moto-chefe somente para leitura: não faça escritas, commits, PRs ou alterações de configuração. Não altere recursos de produção, bancos, AWS, Supabase ou dados de clientes.
- Não invente requisitos; não exponha segredos; não desative controles de segurança ou isolamento multi-tenant; não faça merge sem autorização humana explícita.
