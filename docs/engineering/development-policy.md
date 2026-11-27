# Política de desenvolvimento

## Trabalho rastreável

Toda mudança parte de uma issue com intenção, escopo, critérios de aceitação e cenários verificáveis. Quando exigir várias PRs, use uma issue principal, um milestone e issues menores com dependências explícitas.

Cada incremento deve produzir um resultado observável, mesmo sem disponibilização ao usuário. Código escrito, isoladamente, não conclui um incremento.

## Lotes e revisão

- Cada PR tem uma intenção principal, vínculo com issue e escopo delimitado.
- O diff tem no máximo 300 linhas adicionadas e removidas somadas.
- Não crie exceções automáticas para arquivos gerados, lockfiles ou migrations.
- Não fragmente artificialmente. Se a alteração necessária exceder o limite, explique a impossibilidade e aguarde aprovação humana.
- Registre cenários, evidências, risco, release, rollback e instruções de revisão.

## Convenções

Use branches temporárias por demanda e Conventional Commits em inglês. Não mude a estratégia de branches permanentes sem aprovação. Identificadores de código e nomes de arquivos são em inglês; documentação de engenharia é em português; comentários em português explicam somente motivos não óbvios.

Consulte ADRs e regras de negócio antes de alterar comportamento. Se requisito, regra crítica, stack ou destino não estiver definido, mantenha-o pendente e peça esclarecimento. Evite dependências e abstrações sem necessidade concreta.

## Segurança e entrega

O legado em produção permanece separado deste repositório. Merge, deploy e release são etapas distintas; merge não disponibiliza funcionalidade automaticamente. Nunca altere controles de segurança ou isolamento multi-tenant para facilitar testes ou ativação.

Não versionar segredos. Mudanças com efeitos persistidos exigem plano de compatibilidade, auditoria e recuperação. Não execute migrations destrutivas nem operações externas irreversíveis sem estratégia e aprovação explícitas.

## Conclusão

Feche uma issue de incremento somente depois da implementação, testes aplicáveis, critérios de aceitação e evidências atendidos, revisão humana concluída e PR integrada. O progresso considera incrementos validados, não linhas produzidas.
