# Diagnóstico de falhas

Usado ao rodar um teste recém-criado (passo 7) e no modo `corrigir`.

## Como rodar

```bash
# só o arquivo, no project do módulo
npx playwright test --project=storefront playwright/e2e/storefront/<arquivo>.spec.ts --reporter=list

# só um teste, pelo título
npx playwright test --project=storefront -g "<título do teste>" --reporter=list
```

- Sempre informe `--project`: cada módulo tem o próprio `testDir`.
- Passe `--reporter=list` para o reporter `html` não abrir um servidor e travar o processo quando o teste falha. Não altere o `playwright.config.ts`.
- `trace` só é gravado em retry (`on-first-retry`) e `retries` é 0 fora de CI: localmente não há trace. Screenshot só em falha.

## Onde olhar

1. A mensagem de erro no terminal: linha, locator, esperado e recebido.
2. O `error-context.md` em `test-results/<teste>/`: o estado da página no momento da falha.
3. O screenshot da falha, na mesma pasta.
4. O relatório HTML (`npx playwright show-report`), se tiver sido gerado.
5. Se ainda houver dúvida, reproduza o caminho com o Playwright MCP.

## Classifique a causa antes de mexer

| Causa | Sinais típicos | O que fazer |
|---|---|---|
| **Locator** | Elemento não encontrado; locator em modo estrito encontra mais de um elemento; a tela mudou o texto ou o papel | Corrija o locator no Page Object, pela ordem da arquitetura |
| **Código da suíte** | `TypeError: Cannot read properties of undefined` em `app.<grupo>.<pagina>.<propriedade>` (ex.: D1, `dashPage.addMission`) | Confira o nome no Page Object e na fixture. Em código existente, informe e pergunte antes de corrigir |
| **Sincronização** | Passa às vezes; falha ao agir antes da tela terminar de carregar | Espere pelo estado visível certo. Nunca use espera fixa |
| **Dados** | `duplicate key value violates unique constraint`; missão inexistente; sobra de execução anterior; ID repetido em outro spec; asserção de contagem na vitrine compartilhada | Corrija a preparação (`cleanMission`/`cleanAndInsertMission`) ou troque por um ID exclusivo (ver `massa-de-teste.md`) |
| **Ambiente** | Aplicação fora do ar em `localhost:3000` (`net::ERR_CONNECTION_REFUSED`); banco inacessível (`getaddrinfo ENOTFOUND` no host do Supabase, timeout de conexão); navegador ausente (`Executable doesn't exist`) | Não altere teste, `baseURL` nem conexão. Reporte com a mensagem e entregue como "não executado". Navegador ausente se resolve com `npx playwright install chromium`, com autorização do usuário |
| **Produto** | A tela mostra um resultado diferente do **Então** de forma consistente | Não altere a asserção. Reporte como possível defeito, com esperado e observado |

## Regras da correção

- Corrija só a causa identificada. Uma correção por vez, rodando de novo depois de cada uma.
- **Nunca** altere asserção, valor esperado ou título para o teste passar.
- **Nunca** use `test.skip`, `test.only`, `retries` ou comentários para esconder a falha (`forbidOnly` barra `test.only` em CI).
- Teste instável: rode o arquivo algumas vezes em série (`--repeat-each=5 --workers=1`) para confirmar a instabilidade antes e a estabilidade depois. Em paralelo, repetições do mesmo teste usam o mesmo ID de missão e colidem no banco; isso não é instabilidade do teste.
- Se a causa não ficar clara, entregue o diagnóstico com as evidências e as hipóteses, sem alterar o código.
