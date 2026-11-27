# Estratégia de testes

## Princípios

Teste resultados observáveis nas fronteiras do sistema. Cada incremento define cenários positivos, negativos e casos limite pertinentes, com resultado esperado e evidência verificável. Não ignore falhas nem apresente testes de mocks como validação de comportamento.

Dados de teste são sintéticos. Não use produção, credenciais reais ou dados de clientes. Logs e evidências devem ser sanitizados.

## Níveis

- Unidade: valide regras e transformações isoladas, sem infraestrutura externa.
- Integração: verifique interações entre módulos, persistência e serviços com dependências controladas.
- Contrato: valide a compatibilidade entre a API e sua especificação OpenAPI.
- Fluxo: verifique jornadas críticas de ponta a ponta em ambiente não produtivo, quando existirem aplicações executáveis.

## Aplicações e contratos

Web e API terão suítes e ciclos independentes quando suas stacks forem aprovadas. Não invente comandos nem declare lint, typecheck, build ou testes inexistentes.

Quando houver especificação OpenAPI e endpoints, valide compatibilidade entre contrato e implementação e cubra respostas de sucesso e erro. Mudanças de contrato devem acionar as verificações correspondentes.

## Risco e isolamento

Dê cobertura reforçada a regras fiscais, operações financeiras, estoque, isolamento multi-tenant, autenticação, autorização/RBAC, transferências e integridade transacional.

Testes de isolamento devem demonstrar que um tenant não lê nem altera dados de outro, inclusive em caminhos de erro e operações em lote. Testes não podem desativar autorização ou isolamento.

Quando uma mudança usar feature flag, valide estados ON e OFF, estado padrão seguro e cada escopo de ativação aplicável. Operações multi-loja devem permanecer consistentes durante ativação parcial.

Para operações persistidas ou externas, valide atomicidade, idempotência, auditoria e comportamento de compensação conforme o risco.

## Infraestrutura e evidências

Terraform deve passar fmt -check, validate e plan com configuração aprovada. Apply, destroy e import não fazem parte da validação local desta fundação.

Registre comando, resultado observado, cenários cobertos e limitações. Uma seção preenchida ou um workflow verde não prova a qualidade semântica dos testes.
