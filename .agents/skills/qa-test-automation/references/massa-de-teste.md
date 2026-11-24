# Massa de teste

Os testes rodam em paralelo (`fullyParallel: true`, vários workers fora de CI) sobre um banco compartilhado. Por isso cada teste usa a própria missão, verifica só os próprios dados e parte de um estado conhecido.

O mecanismo do Lunar Pass é **acesso direto ao PostgreSQL via Kysely**, em `playwright/support/database.ts` (`docs/arquitetura.md`, pilar 3 e seção 3.3).

## Funções disponíveis

| Função | O que faz |
|---|---|
| `cleanMission(mission)` | Apaga reservas, bilhetes e a missão, nessa ordem |
| `cleanAndInsertMission(mission)` | `cleanMission` + `insertMission` |
| `insertMission(mission)` | Insere `id`, `rocket`, `baseId`, `departureDate`, `returnDate`, `price` |
| `deleteMission(id)` | Apaga a missão |
| `deleteReservations(missionId)` | Apaga as reservas da missão |
| `deleteTickets(missionId)` | Apaga os bilhetes da missão |

Uso no spec, como em `register.spec.ts`:

```ts
import { Mission } from '../../support/types'
import { cleanAndInsertMission } from '../../support/database'

const mission: Mission = {
    id: 'LP-0000A',
    rocket: 'Starship',
    baseId: 'aurora',
    departureDate: '2028-01-20',
    returnDate: '2028-01-27',
    price: 1000
}

await cleanAndInsertMission(mission)
```

## Regras

1. **ID de missão exclusivo por cenário.** Formato da suíte: `LP-` seguido de 4 dígitos e um sufixo, como `LP-0128A` (ou um código descritivo, como `LP-DUP01`). Antes de escolher, rode `grep -rhoE "LP-[A-Z0-9]+" playwright docs` e não repita nenhum. Em Esquema do Cenário, um ID por linha.
2. **Estado conhecido antes de agir:** `cleanMission` quando o teste vai criar a missão pela tela; `cleanAndInsertMission` quando o cenário parte de uma missão existente. É o padrão do projeto.
3. **Limpeza depois do teste:** não é padrão no projeto hoje (D2 em `duvidas-em-aberto.md`). Não acrescente `afterEach` de limpeza sem combinar. A limpeza no início garante a reexecução.
4. **Dados válidos para as regras que não estão em teste:** datas futuras, `returnDate` 7 dias depois da partida, preço positivo, `baseId` confirmado (`aurora`, `orion`; ver D11).
5. **Storefront: nunca verifique contagem total nem posição** na vitrine (arquitetura 3.4). Localize a missão do teste pelo ID (`cardsByMissions([mission.id])`) e verifique dentro dela.
6. **Não altere dados que o teste não criou:** usuário `buzz@lunarpass.dev`, missões de outros testes, cadastros de referência.
7. **`faker`** pode gerar um valor pontual que só precisa ser inválido ou aleatório, como o ID com formato inválido em `register.spec.ts`. Não crie factories (fora de prioridade).

## Quando falta uma função de massa

Exemplo real: `database.ts` não cria reservas nem bilhetes, e `Reservation`/`Ticket` só têm `missionId` (D10). Cenários de missão esgotada, assento ocupado e concorrência precisam disso.

1. Confirme a estrutura envolvida (tabela, colunas, valores obrigatórios) com segurança: no código existente ou consultando o esquema do banco em modo somente leitura. Não invente colunas.
2. Acrescente a função no grupo certo de `database.ts` (`// ---- reservations ----`, `// ---- tickets ----`), no mesmo estilo: `export async function`, 4 espaços, `db.insertInto(...)`, camelCase.
3. Se precisar de campos novos, complete a interface em `types.ts`.
4. Confira que `cleanMission` continua apagando tudo o que a nova função cria.
5. Registre no resumo o que foi acrescentado e por quê.
6. Se não for possível descobrir a estrutura com segurança, pergunte. Não simule o estado pela tela sem combinar.

Nunca altere a conexão (`Pool`, `connectionString`, `ssl`), o `CamelCasePlugin` nem a interface `Database` além de acrescentar tabelas confirmadas.
