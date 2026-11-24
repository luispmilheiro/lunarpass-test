# Descoberta de tela com o Playwright MCP

O cenário diz **o que** acontece; a tela diz **como**. Antes de escrever ou completar o Page Object, percorra o caminho do cenário na aplicação e anote os elementos reais.

O Playwright MCP está configurado em `.mcp.json` (`@playwright/mcp`). Não use outra ferramenta para explorar a aplicação.

## Procedimento

1. Confirme que a aplicação responde em `http://localhost:3000` (o `baseURL` dos dois projects). Se não responder, não invente a tela: siga apenas com o que já existe nos Page Objects e entregue como "não executado". Não suba a aplicação por conta própria nem altere o `baseURL`.
2. Abra a página inicial do caminho:
   - Storefront: `/` (vitrine), `/missions` (resultados) ou `/booking/<missionId>` (reserva).
   - Mission Control: `/mission-control/login`, com `buzz@lunarpass.dev` / `pwd123`, as credenciais que os specs já usam.
3. Leia o **snapshot de acessibilidade** de cada tela: papel, nome acessível e estado de cada elemento.
4. Execute as ações do **Quando** para ver as telas seguintes e o resultado do **Então** (alertas, toasts, mudanças de estado).
5. Anote, por tela: o caminho da URL, cada elemento usado e o melhor locator.
6. Compare com o Page Object existente da tela: o que já existe é reutilizado, não redescoberto.
7. Feche a aba ao terminar.

## Cuidados

- A descoberta pode precisar de uma missão. Use a mesma massa que o teste vai criar (ver `massa-de-teste.md`), não missões semeadas por outros testes.
- Não conclua pagamentos nem cadastros com dados que não sejam da massa do teste só para explorar.
- Não invente usuários. Credenciais só as que os specs já usam.
- `docs/aderencia.md` descreve a testabilidade esperada de cada tela e o que foi pedido ao time de desenvolvimento. O que vale é o que o snapshot mostra hoje.

## Escolha do locator

Ordem definida em `docs/arquitetura.md`, seção 3.2:

| Prioridade | Locator | Quando |
|---|---|---|
| 1 | `getByRole(papel, { name })` | Botões, links, títulos, campos com nome acessível, diálogos, alertas |
| 2 | `getByLabel(rótulo)` | Campos associados a um rótulo (ex.: `getByLabel('Base lunar')`) |
| 3 | `getByPlaceholder(texto)` | Campos identificados pelo texto de ajuda (ex.: `'Informe seu email'`) |
| 4 | `getByTestId(id)` | Quando a semântica não basta (ex.: `summary-total-price`, `departure-date`) |

Padrões complementares já usados no código:

- **Escopo por item:** `page.getByRole('listitem').filter({ hasText: missionId })` e, dentro dele, `getByRole` ou `getByTestId` (`missions.page.ts`).
- **Texto sem papel próprio:** `getByRole('paragraph').filter({ hasText: '...' })` (`booking.page.ts`). Sobre `getByText`, ver D4 em `duvidas-em-aberto.md`.
- **Nome parcial ou variável:** `RegExp` no `name` (ex.: `new RegExp(\`Assento ${seat}\`)`).
- **Alternativas da mesma informação:** `.or(...)` (`missions.page.ts`).

Evite XPath, subidas no DOM (`/..`) e classes CSS (arquitetura 3.2 e `docs/aderencia.md`). Seletores por atributo (`page.locator('[...]')`), ver D5. Elemento sem papel nem identificador estável vira sugestão de testabilidade no resumo.

## Estados que a descoberta precisa revelar

- **Botões desabilitados:** o snapshot nem sempre mostra. Verifique o estado antes de planejar um clique (ex.: "Continuar" sem assento selecionado).
- **Mensagens dinâmicas:** textos de status mudam com a interação (resumo da reserva, `role="status"` do estado vazio, toast em `listitem`). Anote o texto de cada estado.
- **Contraprova:** quando a asserção verifica um estado (botão desabilitado, mensagem de vazio), confirme na tela que o estado oposto existe (o botão habilita, a mensagem muda). Assim a asserção prova algo e não passa por acaso.
