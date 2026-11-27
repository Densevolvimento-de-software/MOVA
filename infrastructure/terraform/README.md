# Terraform

A infraestrutura tem ciclo de vida e pipeline próprios. Este incremento não provisiona recursos nem altera ambientes existentes.

## Ambientes e state

Staging e production devem usar states independentes. O backend remoto ainda precisa ser escolhido; sua configuração deverá garantir criptografia, versionamento e locking.

## Segurança e operação

Use OIDC para autenticação com AWS quando o destino estiver definido. Não versionar segredos nem inventar IDs de conta, ARNs, regiões ou credenciais. Todo apply exige aprovação humana.

A versão do Terraform e as variáveis só serão fixadas quando a configuração executável for aprovada. Até lá, este diretório contém apenas documentação.
