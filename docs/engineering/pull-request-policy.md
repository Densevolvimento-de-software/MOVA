# Política de pull request

## Objetivo

Cada PR deve permitir que outra pessoa entenda o resultado, confira as evidências e avalie os riscos antes da integração. Merge, deploy e release são etapas distintas.

## Conteúdo obrigatório

Descreva no corpo da PR:

- issue vinculada e objetivo da mudança;
- escopo incluído e exclusões relevantes;
- critérios de aceitação e cenários cobertos;
- validações executadas, resultados observados e verificações não executadas;
- risco (`LOW`, `MEDIUM`, `HIGH` ou `CRITICAL`), com justificativa, superfícies afetadas, impacto possível e reversibilidade;
- estratégia de release e rollback, ou o motivo de não se aplicarem;
- instruções para revisão, indicando os comportamentos e evidências que a pessoa revisora deve conferir.

Use `Closes #<número>` quando a PR concluir uma issue. Não declare que um critério foi validado sem evidência correspondente.

## Escopo e tamanho

Cada PR deve ter uma intenção principal e alterar no máximo 300 linhas, somando adições e remoções. O limite não tem exceções automáticas para arquivos gerados, lockfiles ou migrations. Não fragmente artificialmente: se o trabalho coeso exceder o limite, registre a impossibilidade e aguarde aprovação humana antes de mudar o plano.

## Validações e revisão

Registre os comandos, o commit verificado e o resultado observado. Identifique como não executada qualquer validação que não tenha sido realizada. Um check verde comprova somente o resultado daquele check; não substitui a revisão dos critérios, do comportamento, das falhas possíveis e das limitações da automação.

Quando um check não existir, não estiver configurado ou não cobrir um cenário, declare essa lacuna e indique a evidência manual aplicável. Checks de commits anteriores não comprovam o estado de uma versão posterior.

## Integração e entrega

Não faça merge sem autorização humana explícita. Descreva se a PR exige release ou operação posterior. Merge não autoriza deploy nem altera por si só a disponibilidade de uma funcionalidade.

Mudanças persistidas ou externas precisam indicar compatibilidade, auditoria e recuperação conforme o risco. Consulte a [política de desenvolvimento](development-policy.md), a [estratégia de testes](testing-strategy.md) e o [runbook de rollback](../runbooks/rollback.md).
