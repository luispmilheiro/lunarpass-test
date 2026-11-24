# Exemplo: impedir o avanço sem assento selecionado (Storefront)

Exemplo para calibrar a skill com um cenário real de `docs/storefront.md`. Ele usa apenas o que já existe no repositório: `BookingPage`, `cleanAndInsertMission` e o tipo `Mission`.

> **Atenção:** o exemplo não foi executado. Os locators vêm do `BookingPage` atual; o estado desabilitado do botão "Continuar" e o texto da mensagem precisam ser confirmados na descoberta de tela antes de valer como teste.

## 1. O cenário

**Funcionalidade:** Mapa de Assentos

**Contexto:**
**Dado** que eu iniciei a reserva de uma missão com vagas

**Cenário:** Impedir o avanço sem seleção mínima de assentos
*Regra de origem: R4*
**Quando** eu tento avançar para a etapa de passageiros sem escolher nenhum assento
**Então** o sistema não permite o avanço
**E** eu sou instruído a selecionar pelo menos um lugar na cabine

## 2. Leitura do cenário

| Parte | Tradução para o teste |
|---|---|
| Contexto | Missão exclusiva semeada com `cleanAndInsertMission` e reserva aberta em `/booking/<id>`, no `beforeEach` |
| Quando | Nenhum assento selecionado. Se "Continuar" estiver desabilitado, não há clique a fazer: o Act fica como comentário |
| Então | "Continuar" desabilitado (`toBeDisabled`) |
| E | Mensagem do resumo para nenhum assento (`noSeatsMessage`) visível |
| `Regra de origem: R4` | Só rastreabilidade, não vira código |

## 3. Descoberta de tela

Com o Playwright MCP, em `/booking/LP-4101A` (missão já semeada):

- Botão "Continuar": confirmar que está desabilitado sem assento e que **habilita** ao clicar em "Assento A1" (contraprova).
- Parágrafo com "Nenhum assento escolhido": confirmar o texto completo e que ele **some** quando um assento é selecionado (contraprova).

## 4. O Page Object

Nada a criar. `playwright/support/pages/storefront/booking.page.ts` já expõe o que o cenário usa:

```ts
this.continueButton = page.getByRole('button', { name: 'Continuar' })
this.noSeatsMessage = page.getByRole('paragraph').filter({ hasText: 'Nenhum assento escolhido' })
```

e `app.store.bookingPage` já está registrado em `playwright/support/index.ts`.

## 5. O teste

`playwright/e2e/storefront/booking.spec.ts` (2 espaços, como `home.spec.ts`, o spec vizinho do módulo):

```ts
import { test, expect } from '../../support'

import { Mission } from '../../support/types'
import { cleanAndInsertMission } from '../../support/database'

const mission: Mission = {
  id: 'LP-4101A',
  rocket: 'Starship',
  baseId: 'aurora',
  departureDate: '2028-03-10',
  returnDate: '2028-03-17',
  price: 1000
}

test.beforeEach(async ({ app }) => {
  await cleanAndInsertMission(mission)
  await app.store.bookingPage.go(mission.id)
})

test('Impedir o avanço sem seleção mínima de assentos', async ({ app }) => {
  // Nenhum assento selecionado: o botão Continuar fica desabilitado e não há clique a fazer

  await expect(app.store.bookingPage.continueButton).toBeDisabled()
  await expect(app.store.bookingPage.noSeatsMessage).toBeVisible()
})
```

## 6. O que observar

- O título é o nome do cenário, palavra por palavra (os specs antigos usam `deve ...`; não foram renomeados).
- Uma asserção para o **Então** e uma para o **E**, nenhuma a mais.
- `LP-4101A` não aparece em nenhum outro arquivo (`grep -rhoE "LP-[A-Z0-9]+" playwright docs`). Datas futuras e retorno 7 dias depois da partida (R1).
- Massa preparada no banco com a função do projeto, sem `afterEach` (D2): a missão fica no banco e é limpa na próxima execução.
- AAA separado por linha em branco; o único comentário explica o Act que a tela impede.
- Nenhuma verificação de contagem ou posição na vitrine.
- Para o resumo: "Nenhum assento escolhido" descreve o estado, não instrui a selecionar um lugar. É divergência entre o **E** e a tela, registrada como pergunta (especificação ou produto?).
