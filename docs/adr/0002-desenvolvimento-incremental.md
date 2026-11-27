# ADR 0002: Desenvolvimento incremental

- Status: Aceito
- Data: 2026-11-27

## Contexto

O MOVA tem uma equipe inicialmente pequena e um legado que continua em produção. A fundação do novo sistema precisa permitir entregas independentes, revisão eficiente e recuperação rápida, sem confundir código integrado com funcionalidade liberada.

## Decisão

Trabalhar em incrementos rastreados por issues do GitHub. Demandas com várias PRs terão issue principal, milestone e issues de incremento com dependências explícitas. Cada PR terá uma intenção e até 300 linhas adicionadas e removidas somadas, sem exceções automáticas e sem fragmentação artificial.

Um incremento só termina quando a implementação, os testes aplicáveis, os critérios de aceitação e as evidências estão completos, a revisão humana ocorreu e a PR foi integrada. O progresso mede incrementos validados, não linhas produzidas.

Merge, deploy e release são eventos separados. A disponibilização exige os controles de release pertinentes ao risco.

## Alternativas consideradas

- Implementar a fundação em um único lote: torna a revisão e a recuperação mais difíceis e atrasa a validação.
- Medir progresso por volume de código: não demonstra critérios satisfeitos nem resultado utilizável.
- Dividir PRs apenas para atingir o limite: fragmenta artificialmente o trabalho e perde a intenção principal.

## Consequências

- Issues e milestones nativos do GitHub são a fonte de acompanhamento.
- Cada PR pode ser revisada e revertida em lote pequeno.
- O limite de linhas é uma restrição de revisão; não substitui escopo coeso ou evidência.
- Mudanças críticas ainda exigem decisões explícitas de release, segurança e recuperação.
