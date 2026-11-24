# Projeto Lunar Pass: convenções observadas

Resumo do que `docs/arquitetura.md` define e do que o código em `playwright/` faz. Tudo aqui tem origem citada. Se o repositório mudou, vale o repositório.

## Stack

Playwright (`@playwright/test`), TypeScript, Kysely + `pg` sobre PostgreSQL (Supabase), `@faker-js/faker`. Gerenciador: Yarn (`yarn.lock`). Não há `tsconfig.json` nem `.env`. Fonte: `package.json`, `docs/arquitetura.md`.

## Módulos e rotas

| Módulo | Project | Grupo na fixture | Rotas conhecidas | Fonte |
|---|---|---|---|---|
| Mission Control | `mission-control` | `app.mission` | `/mission-control/login` | `login.page.ts` |
| Storefront | `storefront` | `app.store` | `/`, `/missions`, `/booking/<missionId>` | `home.page.ts`, `booking.page.ts`, `docs/aderencia.md` |
| Compartilhado | — | `app.toast` | — | `index.ts` |

Os dois projects usam `baseURL: 'http://localhost:3000'` e Desktop Chrome. O do Storefront tem `// TODO: confirmar baseURL do storefront` (ver `duvidas-em-aberto.md`). A aplicação não está neste repositório (`src/` é ilustrativo) e não há `webServer`: ela precisa estar no ar antes de rodar.

## Estrutura

```plaintext
playwright/
├── e2e/<modulo>/<assunto>.spec.ts
└── support/
    ├── pages/<modulo>/<tela>.page.ts      # Page Objects de tela
    ├── pages/<modulo>/<componente>.ts     # componentes do módulo (ex.: navbar.ts)
    ├── pages/shared/<componente>.ts       # só se 2+ módulos usam (ex.: toast.ts)
    ├── database.ts
    ├── helpers.ts
    ├── index.ts
    └── types.ts
```

## Fixture (`playwright/support/index.ts`)

- `createApp(page)` devolve um objeto agrupado: `mission: { ... }`, `store: { ... }`, `toast`.
- Chaves em camelCase com o nome da classe: `loginPage: new LoginPage(page)`, `navbar: new Navbar(page)`.
- Imports agrupados por módulo, com linha em branco entre os grupos, partindo de `./pages/<modulo>/`.
- O arquivo usa **2 espaços** de indentação.

## Specs (`playwright/e2e/<modulo>/`)

- Primeira linha: `import { test, expect } from '../../support'`.
- Massa e tipos: `import { Mission } from '../../support/types'` e `import { cleanMission, cleanAndInsertMission } from '../../support/database'` (`register.spec.ts`).
- `test.beforeEach` para o estado comum. No Mission Control, o login pela tela com `buzz@lunarpass.dev` / `pwd123` (`register.spec.ts`).
- Dados da missão declarados dentro do teste como `const mission: Mission = { ... }`.
- AAA separado por **linhas em branco**, sem comentários `// Arrange` (todos os specs atuais).
- Uma asserção por teste nos specs atuais, com `toHaveText`, `toContainText`, `toBeVisible`, `toHaveTitle`.
- Títulos antigos no padrão `deve ...` / `não deve ...` (a skill usa o nome do cenário para os novos).
- Indentação: 2 espaços em `login.spec.ts` e `home.spec.ts`, 4 espaços em `register.spec.ts`.

## Page Objects (`playwright/support/pages/<modulo>/`)

- Classe `<Tela>Page` (ou nome do componente: `Navbar`, `Toast`), `export class`.
- `import { Page, Locator } from '@playwright/test'`.
- `readonly page: Page` e locators `readonly ...: Locator` criados no construtor.
- Navegação por caminho relativo: `go()` ou `go(missionId)` com `this.page.goto('/booking/${missionId}')`.
- Elementos que dependem de dado viram método que devolve `Locator`: `seatButton(seat)`, `bookLinkByMission(missionId)`, `cardsByMissions(missionIds)`.
- Escopo por item de lista: `getByRole('listitem').filter({ hasText })` e, dentro dele, `getByTestId` ou `getByRole` (`missions.page.ts`).
- Texto sem papel próprio: `getByRole('paragraph').filter({ hasText: '...' })` (`booking.page.ts`).
- Interfaces de entrada de formulário (`PassengerInput`, `PaymentInput`) estão no próprio `booking.page.ts`; tipos de tabela estão em `types.ts`.
- Imports de tipos e helpers: `../../types`, `../../helpers`.
- Os Page Objects usam **4 espaços** de indentação.
- `LoginPage.go()` e `RegisterPage.submit()` têm `expect` dentro: padrão antigo, não copie.

## Massa de teste (`playwright/support/database.ts`)

- `db` é um `Kysely<Database>` com `CamelCasePlugin`: no código, colunas em camelCase (`baseId`, `missionId`).
- Funções agrupadas por comentários `// ---- missions ----`, `// ---- reservations ----`, `// ---- tickets ----`, cada uma `export async function`, 4 espaços.
- Disponíveis hoje: `cleanMission(mission)`, `cleanAndInsertMission(mission)`, `insertMission(mission)`, `deleteMission(id)`, `deleteReservations(missionId)`, `deleteTickets(missionId)`.
- `cleanMission` apaga reservas, bilhetes e a missão, nessa ordem.
- A connection string está escrita no arquivo. **Nunca a copie, exiba ou mova.**

## Dados de domínio observados

| Dado | Valores vistos | Fonte |
|---|---|---|
| ID de missão | Formato validado pela tela: `Use o formato LP-0000`. Em uso: `LP-0128A`, `LP-3001A`, `LP-DUP01`, `LP-0127A` (docs) | `register.spec.ts`, `docs/` |
| `baseId` | `aurora`, `orion` | `register.spec.ts` |
| Bases (nomes) | Alpha, Orion, Aurora, Selene | `docs/storefront.md` R1 |
| Duração | Ida e volta de 7 dias (`returnDate` = partida + 7) | R1, `register.spec.ts` |
| Assentos | A1, A2, B1, B2 | R4 |
| Datas | `YYYY-MM-DD` no banco; tela exibe `20 de jan. de 2028` (`formatDate`) | `helpers.ts` |

## Comandos

```bash
npx playwright test --project=mission-control
npx playwright test --project=storefront
npx playwright test --project=storefront playwright/e2e/storefront/<arquivo>.spec.ts --reporter=list
npx playwright test --list --project=storefront
```

O reporter configurado é `html`, que, ao falhar fora de CI, abre um servidor e deixa o processo esperando. Ao rodar pela skill, passe `--reporter=list` na linha de comando (não altere a configuração). O relatório HTML continua disponível com `npx playwright show-report` quando gerado.

## Fora de prioridade (não implementar)

Seção 6 de `docs/arquitetura.md`: `.env`, `storageState`, data factories com faker, `db.destroy()` no teardown.
