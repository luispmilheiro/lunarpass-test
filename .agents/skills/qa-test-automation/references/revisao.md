# Revisão antes de entregar

Passe por todos os itens. Corrija o que falhar e só então entregue.

## Fidelidade ao cenário

- [ ] O título de cada teste é o nome do cenário (ou cenário + linha de Exemplos).
- [ ] Existe uma asserção para cada **Então** e cada **E**, e nenhuma além delas.
- [ ] Nenhum passo, regra ou resultado foi inventado.
- [ ] Textos observados na tela e não definidos na especificação estão listados no resumo.

## Arquitetura do Lunar Pass

- [ ] O spec está em `playwright/e2e/<modulo>/` e importa `{ test, expect }` de `../../support`.
- [ ] Page Objects novos estão em `playwright/support/pages/<modulo>/` (ou `shared/` só se usados por 2+ módulos).
- [ ] Page Objects novos estão registrados no grupo certo de `createApp` em `playwright/support/index.ts`.
- [ ] O spec acessa as telas só por `app.mission.*`, `app.store.*` ou `app.toast`.
- [ ] Page Objects novos não têm `expect`, dados de teste nem endereço completo.
- [ ] Nenhum teste ou Page Object existente foi refatorado sem pedido.
- [ ] `playwright.config.ts`, conexão do banco, credenciais e `package.json` não foram alterados.
- [ ] Nada da seção 6 da arquitetura (`.env`, `storageState`, factories, `db.destroy()`) foi implementado.
- [ ] Sem `;`, aspas simples, indentação do arquivo vizinho.

## Locators e esperas

- [ ] Locators seguem a ordem da arquitetura: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId`.
- [ ] Não há XPath, subida no DOM nem classe CSS.
- [ ] Não há `waitForTimeout`.
- [ ] Cada asserção de estado foi confirmada com a contraprova na tela.

## Dados

- [ ] Cada teste usa um ID de missão que não aparece em nenhum outro arquivo (`grep -rhoE "LP-[A-Z0-9]+" playwright docs`).
- [ ] Cada teste prepara o próprio estado com `cleanMission` ou `cleanAndInsertMission` antes de agir.
- [ ] No Storefront, nenhuma asserção depende de contagem total ou posição na vitrine.
- [ ] Funções de massa novas seguem o estilo de `database.ts` e estão no resumo.

## Execução

- [ ] O teste foi executado com `--project=<modulo>`, e o resultado no resumo é o que realmente aconteceu.
- [ ] Rodou mais de uma vez, em série (`--repeat-each=3 --workers=1`), sem variar o resultado.
- [ ] Falhas atribuídas ao produto estão reportadas com esperado e observado, sem asserção alterada.
- [ ] Nenhum `test.only`, `test.skip` ou asserção comentada ficou no código.
- [ ] Toda decisão tomada sobre um item de `duvidas-em-aberto.md` está citada no resumo.
