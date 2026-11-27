# Visão arquitetural

O novo MOVA será desenvolvido incrementalmente ao lado do legado em produção. Este repositório organiza aplicações independentes e mantém contratos explícitos entre elas.

## Aplicações

- Web e API têm dependências, builds, testes e deploys próprios.
- A web consome a API por contratos OpenAPI; nenhuma aplicação importa o código-fonte de outra.
- A API é um monólito modular. Os módulos serão definidos com base em regras de negócio validadas.
- Terraform tem ciclo de vida próprio, separado do ciclo das aplicações.

## Entrega e operação

Merge, deploy e release são eventos distintos. Recursos executáveis e destinos de deploy só entram quando estiverem definidos; este scaffold não altera o legado, dados, AWS ou Supabase.

Staging e production deverão manter states Terraform separados. Backend, versões, contas, regiões e credenciais permanecem pendentes até decisão aprovada.

## Evolução do repositório

A estrutura de cada aplicação não depende de importar código de outra. Uma futura separação em repositórios pode preservar essas fronteiras e os contratos OpenAPI. Decisões relacionadas estão em [ADR 0001](../adr/0001-monorepo.md).
