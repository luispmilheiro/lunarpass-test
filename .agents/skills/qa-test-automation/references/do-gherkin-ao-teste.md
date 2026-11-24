# Do Gherkin ao teste

O Gherkin declarativo descreve o comportamento de negócio, sem telas, cliques ou campos. A automação traduz cada parte para o código sem mudar o que foi especificado.

## De onde vêm os cenários

- **Storefront:** `docs/storefront.md`, seção 3, gerada pela skill `gherkin-qa-design`. Funcionalidades: Busca de Missões, Mapa de Assentos, Passageiros, Pagamento e Emissão do Ticket.
- **Mission Control:** ainda não há especificação em `docs/`. O cenário vem do usuário, colado na conversa.
- As palavras-chave aparecem em **negrito** (Markdown) ou em texto puro. Linhas como `*Regra de origem: R4*` servem para rastrear e não viram código; use a regra em `docs/storefront.md` só para entender a intenção.
- Itens marcados como "A investigar" (R9, R10) ou que dependem das perguntas P1–P4 de `docs/storefront.md` não são automatizados: registre como pendentes.

## Como cada parte vira código

| Gherkin | No teste | Como no Lunar Pass |
|---|---|---|
| **Contexto** | `test.beforeEach` do arquivo | Estado comum: massa no banco e, no Mission Control, login pela tela |
| **Dado** | Arrange | Pelo banco, com as funções de `playwright/support/database.ts`. Pela tela só quando o próprio cenário pede a navegação (ex.: "acessei o pagamento" exige percorrer assentos e passageiros) |
| **Quando** | Act | Ações do usuário, sempre por métodos do Page Object (`app.store.bookingPage.continue()`) |
| **Então** / **E** | Assert | Uma asserção para cada resultado esperado, sobre locators do Page Object |
| **Esquema do Cenário** + **Exemplos** | Um teste por linha | Lista de dados percorrida com um `test` por item |

## Título do teste

Regra da skill para testes novos (os specs antigos usam `deve ...`; não os renomeie, ver D3 em `duvidas-em-aberto.md`):

- Cenário: o nome exato. `Cenário: Impedir o avanço sem seleção mínima de assentos` vira `test('Impedir o avanço sem seleção mínima de assentos', ...)`.
- Esquema do Cenário: o nome seguido da identificação da linha, por exemplo `Validar os limites dos dados de identificação obrigatórios | nome: 2, passaporte: 15`.

## Arquivo do spec

- Pasta: `playwright/e2e/<modulo>/` (`mission-control` ou `storefront`).
- Um arquivo por funcionalidade. Se a funcionalidade já tem spec, acrescente nele.
- Nome em inglês, minúsculo, `<assunto>.spec.ts`, como `login.spec.ts`, `register.spec.ts` e `home.spec.ts`. Não há regra definida para escolher o assunto: proponha um nome alinhado ao Page Object principal (ex.: `booking.spec.ts` para a tela `BookingPage`) e informe no resumo.

## Quando o cenário não é suficiente

| Situação | O que fazer |
|---|---|
| O **Então** não diz o que verificar (ex.: "o sistema reage adequadamente") | Pergunte antes de escrever |
| O **Então** descreve uma mensagem sem o texto exato | Use o texto que a tela mostra e registre no resumo: "texto observado, não definido na especificação" |
| O **Quando** é uma ação que a tela impede (ex.: "Continuar" desabilitado) | Não force o clique. Verifique o estado que impede a ação (`toBeDisabled`) e explique em comentário no Act |
| O **Então** não tem correspondência clara na tela | Automatize o que é verificável, use o elemento mais próximo e registre a divergência no resumo como pergunta: especificação, requisito ou produto? |
| O **Dado** exige um estado que `database.ts` não cria (reservas, bilhetes, assento ocupado) | Siga `massa-de-teste.md`. Sem estrutura confirmada, pergunte. Não simule o estado de outro jeito |
| O cenário depende de decisão em aberto (R9, R10, P1–P4) | Não automatize. Registre como pendente |
| A tela se comporta diferente do **Então** | O teste fica falhando. Reporte como possível defeito do produto |
