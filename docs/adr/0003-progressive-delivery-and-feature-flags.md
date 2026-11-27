# ADR 0003: Entrega progressiva e feature flags

- Status: Proposto
- Data: 2026-11-27

## Contexto

O novo MOVA precisa separar integração, publicação em ambiente e disponibilidade para usuários. A expansão gradual permite validar mudanças em públicos delimitados e interromper uma release sem confundir deploy com ativação. A stack, os destinos operacionais e os serviços ainda não foram escolhidos.

## Decisão proposta

- Usar uma sequência gradual: staging; produção com flag OFF; validação interna; piloto; expansão em etapas; disponibilidade geral; remoção da flag.
- Classificar e registrar cada release como LOW, MEDIUM, HIGH ou CRITICAL, com justificativa.
- Flags começam OFF e preservam um caminho seguro se a configuração não puder ser lida. Flags críticas são avaliadas no backend.
- Permitir escopos explícitos de rede, grupo, loja ou usuário, sempre subordinados à autorização do backend.
- Exigir responsável, justificativa, auditoria, condição de remoção e kill switch para cada flag.
- Coordenar ativações relacionadas entre lojas. Uma operação multi-loja não pode observar estados incompatíveis da mesma decisão.
- Flags não alteram nem contornam controles obrigatórios de segurança ou isolamento.

Os critérios operacionais e exemplos estão na [estratégia de release](../engineering/release-strategy.md). Nenhum serviço ou SDK é implementado por esta decisão.

## Alternativas consideradas

- **Disponibilizar imediatamente após o deploy**: reduz etapas operacionais, mas não oferece piloto nem interrupção seletiva.
- **Manter branches por cliente ou loja**: permite variar o código, mas cria divergência permanente e dificulta validar uma única versão.
- **Escolher agora um serviço específico de flags**: poderia acelerar uma integração futura, mas fixaria custo, dependência e controles antes da stack e da operação serem aprovadas.
- **Entrega progressiva com princípios independentes de fornecedor**: mantém merge, deploy e release separados, define salvaguardas comuns e deixa a escolha de ferramenta para uma decisão posterior. É a alternativa proposta.

## Consequências

- Releases precisam de público, responsável, sinais observáveis, limites de interrupção e evidência antes do piloto.
- A avaliação no backend e o estado padrão OFF reduzem exposição acidental, mas não substituem testes de autorização, isolamento e consistência.
- Ativações entre lojas exigem coortes e critérios compatíveis; a expansão pode ser bloqueada até a consistência ser demonstrada.
- Flags temporárias geram trabalho de manutenção e devem ser removidas por tarefa rastreada.
- Não há limites universais definidos. O domínio responsável precisa aprovar seus indicadores antes de ativar uma release.

## Decisões pendentes

- Serviço, armazenamento, SDK e integração com a stack, após aprovação da arquitetura.
- Ambientes e responsáveis que aprovam deploy e release.
- Indicadores, limites e janelas de avaliação para cada domínio e nível de risco.
- Modelo de auditoria, retenção dos registros e processo de acesso administrativo.
- Regras de coorte e coordenação para fluxos que abrangem múltiplas lojas.

Até essas decisões serem aprovadas, não escolher provedor nem habilitar feature flags em produção.
