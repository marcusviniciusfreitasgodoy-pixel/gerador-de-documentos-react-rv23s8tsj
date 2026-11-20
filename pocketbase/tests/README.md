# Teste dos hooks da integração com o Prime Circle (pedido 1133)

Roda os hooks do Docs num PocketBase LOCAL, com dados fictícios. Nada aqui toca o PocketBase de produção nem o `.env`.
Este diretório não é colado no Skip: é só para quem revisa.

```bash
# 1. binário do PocketBase (0.23.x, a mesma API dos hooks), fora do repositório
PB_BIN=/caminho/pocketbase node --test pocketbase/tests/integracao-prime-circle.test.mjs
```

O que o harness troca, e só isso (arquivo `harness.mjs`, função `prepararHook`):

- `$secrets.get(` vira `$os.getenv(` (o Skip injeta `$secrets`; o PocketBase puro lê variável de ambiente);
- `$ai.chat(` e as classes `SkipAiError`/`SkipAiConfigError` vêm de `ai_stub.js`, que chama um servidor de IA falso
  (o `$ai` também é do Skip);
- os arquivos são copiados como `*.pb.js`, que é o que o PocketBase puro carrega.

Fora isso o código dos hooks roda como está. A coleção `expert_support_requests` e afins, que as migrações supõem criadas
pelo Skip, entram por `1000000000_harness_base.js`.
