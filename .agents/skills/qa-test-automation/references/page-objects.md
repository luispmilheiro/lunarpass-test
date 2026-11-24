# Page Objects

Um Page Object representa uma tela e expõe o que o usuário faz nela. O teste deve ler como o cenário.

## Onde ficam

| Tipo | Pasta | Nome do arquivo | Exemplo |
|---|---|---|---|
| Tela de um módulo | `playwright/support/pages/<modulo>/` | `<tela>.page.ts` | `booking.page.ts` → `BookingPage` |
| Componente de um módulo | `playwright/support/pages/<modulo>/` | `<componente>.ts` | `navbar.ts` → `Navbar` |
| Componente usado por 2+ módulos | `playwright/support/pages/shared/` | `<componente>.ts` | `toast.ts` → `Toast` |

Um componente só vai para `shared/` se for comprovadamente usado por mais de um módulo (`docs/arquitetura.md` 3.2 e seção 5).

## Modelo de Page Object novo

```ts
import { Page, Locator } from '@playwright/test'

export class ExamplePage {
    readonly page: Page
    readonly title: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { name: '<texto observado>' })
    }

    async go(missionId: string) {
        await this.page.goto(`/<rota>/${missionId}`)
    }

    itemByMission(missionId: string): Locator {
        return this.page.getByRole('listitem').filter({ hasText: missionId })
    }

    async doSomething(value: string) {
        await this.page.getByRole('textbox', { name: '<rótulo>' }).fill(value)
        await this.page.getByRole('button', { name: '<botão>' }).click()
    }
}
```

## Regras para Page Objects novos

1. **Um arquivo por tela**, classe `<Tela>Page`, construtor recebendo `page: Page` e guardando `readonly page: Page`.
2. **Locators que o teste verifica são propriedades `readonly`**, criados no construtor. Locators usados só dentro de uma ação podem ficar no método, como em `HomePage.searchMissions()`.
3. **Elementos que dependem de dado viram método** que devolve `Locator`, no padrão `<elemento>By<Entidade>(...)` ou `<elemento>(...)`: `bookLinkByMission(missionId)`, `seatButton(seat)`.
4. **Métodos são ações do usuário**, com nome em inglês: `go()`, `selectSeat(seat)`, `continue()`, `submitPayment(payment)`. Recebem dados por parâmetro.
5. **Navegação por caminho relativo** apoiada no `baseURL` (`/booking/${missionId}`). Nunca `http://localhost:3000`.
6. **Sem `expect` dentro do Page Object.** `LoginPage.go()` e `RegisterPage.submit()` fazem isso hoje: é padrão antigo, não copie.
7. **Sem dados de teste nem credenciais** no Page Object.
8. **Sem espera fixa.** Se uma ação precisa aguardar algo, aguarde um estado do próprio elemento.
9. **Estilo do projeto:** 4 espaços, aspas simples, sem `;`, imports de `../../types` e `../../helpers` quando precisar.
10. **Tipos de entrada de formulário** ficam no arquivo do Page Object, como `PassengerInput` em `booking.page.ts`. Tipos de tabela ficam em `types.ts` (D9).

## Registro na fixture

Em `playwright/support/index.ts`:

1. Importe no grupo do módulo: `import { ExamplePage } from './pages/storefront/example.page'`.
2. Acrescente no grupo do módulo em `createApp`: `examplePage: new ExamplePage(page),` dentro de `store: { ... }` ou `mission: { ... }`.
3. Componente de `shared/` fica no nível raiz, como `toast`.
4. Mantenha 2 espaços e a vírgula final, como o arquivo já faz.

No spec, o acesso fica `app.store.examplePage`, `app.mission.examplePage` ou `app.<componente>`.

Grupo novo (módulo novo) exige mudar `playwright.config.ts` (arquitetura, seção 5). Não faça sem pedido explícito.

## Page Objects que já existem

Não os refatore. Ao completar um:

- Acrescente locators e métodos sem mudar o comportamento dos que existem.
- Mantenha o estilo do arquivo.
- Se precisar mudar algo existente (renomear, remover `expect`, trocar `dispatchEvent`), pergunte antes.

## Reutilizar ou criar?

| Situação | Decisão |
|---|---|
| A tela já tem Page Object (`HomePage`, `MissionsPage`, `BookingPage`, `LoginPage`, `DashPage`, `RegisterPage`) | Reutilize e complete |
| O elemento aparece em várias telas de um módulo (ex.: barra de navegação) | Componente do módulo |
| O elemento é usado por mais de um módulo | Componente em `shared/` |
| Tela nova | Page Object novo, registrado na fixture |
