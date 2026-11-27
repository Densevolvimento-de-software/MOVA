# Runbook de rollback

## Objetivo e limites

Escolha a recuperação conforme o que mudou e quais efeitos já ocorreram. Desativar uma feature flag, reverter código, restaurar infraestrutura, recuperar dados e executar uma transação compensatória são ações distintas.

Este runbook orienta a decisão; não autoriza operações em produção. Antes de agir, consulte a estratégia aprovada para o sistema e ambiente. Se não houver procedimento, regra de negócio, ponto de recuperação ou autorização necessários, interrompa o rollback e peça decisão ao responsável.

## Antes de escolher a recuperação

1. Registre a versão implantada, o escopo afetado, os sintomas e os efeitos conhecidos.
2. Identifique se houve mudança de código, configuração, infraestrutura, dados ou serviço externo.
3. Verifique compatibilidade entre a versão anterior e os dados ou recursos atuais.
4. Consulte as aprovações, os responsáveis e o procedimento de recuperação aplicável.
5. Preserve logs e evidências necessários à auditoria, sem expor dados sensíveis.

Não execute operações destrutivas nem altere produção, bancos, AWS ou Supabase sem estratégia e aprovação explícitas.

## Caminhos de recuperação

| Tipo | Ação possível | Limite e conferência |
|---|---|---|
| Feature flag | Desativar a flag ou reduzir seu escopo conforme a configuração aprovada. | Interrompe a ativação futura do caminho controlado; não desfaz efeitos já persistidos, transações concluídas nem chamadas externas. Confira o estado da flag e o comportamento após a mudança. |
| Código | Reverter a mudança por uma alteração revisável ou restaurar uma versão conhecida como estável, conforme o processo de release. | Confirme antes a compatibilidade com dados, contratos e recursos atuais. Se a versão anterior não for compatível, prefira uma correção para frente aprovada. |
| Infraestrutura | Comparar a configuração desejada com o estado atual e preparar uma alteração revisável para retornar a uma configuração compatível. | O plano não restaura dados nem garante a recuperação de recursos externos. Revise o impacto e obtenha aprovação humana antes de qualquer aplicação. |
| Dados | Usar procedimento aprovado de restauração ou recuperação, preservando o ponto de recuperação e o escopo afetado. | Restaurar pode sobrescrever alterações válidas. Confirme a origem, a integridade, o destino e a aprovação antes de modificar dados; se faltar qualquer definição, pare e pergunte. |
| Transação compensatória | Registrar uma nova operação de negócio autorizada que compense o efeito anterior. | Não apague nem edite diretamente o histórico. Siga as regras de negócio, autorização, auditoria e idempotência; impeça compensação duplicada. |

Uma operação externa pode não oferecer reversão. Identifique o serviço e o efeito ocorrido e encaminhe a recuperação ao responsável pelo domínio; não presuma que desligar uma flag ou reverter código cancelará a operação.

## Verificação e encerramento

Depois da recuperação:

- confira o resultado esperado nos cenários afetados e os invariantes de segurança e isolamento;
- verifique efeitos persistidos e externos, inclusive duplicidade ou compensações pendentes;
- registre versão, decisão, responsável, evidência, limitações e riscos que restaram;
- retome release ou operações somente após a autorização correspondente.

Consulte a [política de pull request](../engineering/pull-request-policy.md) para registrar evidências de revisão e a [estratégia de testes](../engineering/testing-strategy.md) para os cenários aplicáveis.
