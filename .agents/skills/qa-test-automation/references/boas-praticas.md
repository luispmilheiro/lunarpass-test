# Boas práticas para o spec

## Estrutura

- Arquivo em `playwright/e2e/<modulo>/<assunto>.spec.ts`.
- Primeira linha: `import { test, expect } from '../../support'`. Em seguida, se precisar, `faker`, `../../support/types` e `../../support/database`, como em `register.spec.ts`.
- **Contexto** do Gherkin em `test.beforeEach`. No Mission Control, o login (`app.mission.loginPage.go()` + `login('buzz@lunarpass.dev', 'pwd123')`) também fica no `beforeEach`.
- Dados da missão como `const mission: Mission = { ... }`: dentro do teste quando só ele usa; no topo do arquivo quando o `beforeEach` usa.
- Dentro do teste, Arrange, Act e Assert separados por **linha em branco**, sem comentários (D13). Comentário só para explicar um Act que a tela impede.
- Um teste por cenário. Em Esquema do Cenário, uma lista de dados com um `test` por linha.
- Acesso às telas só pela fixture: `app.mission.*`, `app.store.*`, `app.toast`. Nada de `new XxxPage(page)` no spec. `page` direto só para asserções de página, como `toHaveTitle` em `home.spec.ts`.
- Estilo: aspas simples, sem `;`, indentação do spec vizinho do módulo (D7).

## Asserções

- Use asserções que esperam sozinhas: `toBeVisible`, `toHaveText`, `toContainText`, `toHaveURL`, `toHaveTitle`, `toBeDisabled`, `toHaveCount` (só para elementos da missão do próprio teste).
- Uma asserção para cada **Então** e cada **E** do cenário. Nenhuma a mais, nenhuma a menos.
- Valor exato: o texto ou número que a tela mostra. Datas exibidas podem usar `formatDate` de `../../support/helpers`.
- `toContainText` para o toast (`app.toast.message`), como `register.spec.ts`, porque o `listitem` pode trazer título e descrição juntos.
- Para verificar que algo **não** acontece (ex.: "não permite o avanço"), verifique o estado observável que prova isso: a mensagem exibida, a etapa que continua na tela, o botão desabilitado.

## Esperas

- Nada de `waitForTimeout`.
- O Playwright espera os elementos sozinho em ações e asserções. Se uma operação é lenta, espere pelo resultado visível.
- Evite timeout por teste. Se for inevitável, justifique no resumo.

## Isolamento

- Nenhum teste depende de outro nem da ordem de execução (`fullyParallel: true`).
- Nenhum teste depende de missões que ele não semeou. O único dado de demonstração usado é o usuário `buzz@lunarpass.dev`, sem alterá-lo.
- Storefront: nada de contagem total ou posição na vitrine.

## Nomes

- Variáveis, funções e Page Objects em inglês.
- Títulos, dados de teste e textos esperados como na tela e na especificação, em português.
