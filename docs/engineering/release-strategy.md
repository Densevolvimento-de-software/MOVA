# Estratégia de release progressiva

Esta política se aplica ao novo MOVA. O legado em produção continua separado. Ela define controles independentes de tecnologia; não escolhe provedor, ferramenta de flags, destino de deploy ou mecanismo de configuração.

## Merge, deploy e release

- **Merge** integra uma mudança revisada à branch de destino. Não a disponibiliza por si só.
- **Deploy** publica um artefato em um ambiente. Deploy em produção mantém a funcionalidade nova indisponível por padrão.
- **Release** habilita a funcionalidade para um público definido, com validação, monitoramento, responsável e caminho de interrupção.

Uma etapa não autoriza automaticamente a seguinte. Aprovações e destinos concretos dependem das decisões operacionais do projeto.

## Classificação de risco

Registre o risco da mudança na issue e na PR, com justificativa; esta classificação não substitui análise de segurança ou revisão humana.

- **LOW**: efeito limitado, facilmente reversível, sem alterar dados importantes nem controles obrigatórios.
- **MEDIUM**: impacto restrito a um fluxo ou grupo, com recuperação conhecida e evidência de validação.
- **HIGH**: impacto amplo ou difícil de reverter, ou que afeta disponibilidade, dados de negócio ou operações entre lojas.
- **CRITICAL**: pode afetar autenticação, autorização, isolamento entre tenants, integridade financeira ou de estoque, dados pessoais ou obrigações legais.

O risco pode aumentar conforme o público, as integrações e o volume exposto. Limites numéricos e indicadores específicos serão definidos por domínio antes do piloto; permanecem pendentes enquanto não aprovados.

## Sequência de disponibilização

1. **Staging**: implantar com a flag OFF e validar os contratos, fluxos e integrações aplicáveis.
2. **Produção com flag OFF**: implantar o mesmo artefato validado; confirmar que o caminho padrão continua seguro e que a interrupção está disponível.
3. **Validação interna**: habilitar somente para pessoas internas autorizadas, usando dados sintéticos ou permitidos e sem ampliar o público de clientes.
4. **Piloto**: habilitar para uma rede, grupo, loja ou usuário explicitamente delimitado. Registrar responsável, público, evidências, indicadores e plano de interrupção.
5. **Expansão**: aumentar o público em etapas aprovadas. Antes de cada etapa, verificar os critérios definidos para o domínio, ausência de incidentes bloqueadores, consistência dos dados e capacidade de interromper.
6. **Disponibilidade geral**: habilitar para todo o público previsto após as etapas anteriores atenderem seus critérios e o responsável registrar a aprovação.
7. **Remoção**: abrir uma tarefa para retirar a flag e os caminhos temporários após a estabilidade da release.

Cada piloto deve declarar antes de começar os sinais observáveis, limites de interrupção, responsável pela decisão e janela de avaliação. Indicadores e limites concretos não são definidos globalmente nesta política.

## Segurança e operação de flags

- Toda flag começa OFF e usa uma alternativa segura quando está ausente, indisponível ou inválida.
- Flags que alteram regras críticas são avaliadas no backend em toda operação relevante. Controles de interface não concedem autorização.
- O escopo de ativação pode ser rede, grupo, loja ou usuário. O alvo e a combinação de escopos precisam ser explícitos e verificáveis; dados enviados pelo cliente não podem ampliar a autorização.
- A alteração de estado exige acesso administrativo com menor privilégio. Registre ator, instante, flag, escopo, estado anterior e novo, justificativa e responsável.
- Toda flag tem dono responsável, finalidade, estado padrão, escopos permitidos, data ou condição de remoção e um kill switch documentado e exercitado.
- Nenhuma flag pode desativar autenticação, autorização, isolamento multi-tenant, auditoria obrigatória ou outra proteção de segurança.

## Consistência entre lojas e interrupção

Operações que envolvem várias lojas devem usar uma decisão de flag consistente para toda a operação e para a coorte relacionada. Mudanças incompatíveis não podem ser habilitadas parcialmente entre lojas que participam do mesmo fluxo. Se a consistência não puder ser garantida, manter a flag OFF para esse fluxo até definir uma expansão coordenada.

Interromper a expansão e acionar o kill switch quando um limite previamente definido for excedido, houver erro de integridade ou segurança, divergência entre lojas ou regressão que afete o público. Registrar evidência, responsável e decisão; reabrir expansão somente após correção e nova validação. Alterações de dados sem reversão simples exigem plano compatível próprio antes do deploy.

Consulte o [ADR 0003](../adr/0003-progressive-delivery-and-feature-flags.md) para as alternativas, consequências e decisões ainda pendentes.
