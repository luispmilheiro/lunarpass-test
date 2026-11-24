# Resumo da automação

**Cenário(s):** <nome exato de cada cenário ou linha de Exemplos>
**Origem:** <docs/storefront.md, seção / colado na conversa>
**Módulo / project:** <mission-control | storefront>
**Resultado:** <Passou | Falhou (automação) | Falhou (possível defeito do produto) | Não executado>

## Arquivos

| Arquivo | Ação | O que mudou |
|---|---|---|
| `playwright/e2e/<modulo>/<assunto>.spec.ts` | criado / alterado | <testes acrescentados> |
| `playwright/support/pages/<modulo>/<tela>.page.ts` | criado / alterado / reutilizado | <locators e métodos> |
| `playwright/support/index.ts` | alterado / sem mudança | <registro na fixture> |
| `playwright/support/database.ts` / `types.ts` | alterado / sem mudança | <função ou campo novo e por quê> |

## Massa de teste

- IDs de missão usados: <LP-....> (conferidos com grep, sem repetição)
- Preparação: <cleanMission / cleanAndInsertMission / função nova>
- O que fica no banco ao final: <ex.: a missão LP-.... (sem afterEach, D2)>

## Execução

```bash
<comando exato usado>
```

- Resultado observado: <n passou / n falhou, tempo>
- Repetição em série: <--repeat-each=3 --workers=1: resultado>
- Se não executado: <motivo e mensagem de erro>

## Falhas

| Teste | Causa | Esperado | Observado | Ação |
|---|---|---|---|---|
| <título> | <locator / código da suíte / sincronização / dados / ambiente / produto> | <...> | <...> | <corrigido / reportado> |

## Observações

- **Textos observados, não definidos na especificação:** <lista>
- **Divergências entre cenário e tela (perguntas):** <lista>
- **Decisões sobre itens de `duvidas-em-aberto.md`:** <D# e a orientação seguida>
- **Sugestões de testabilidade:** <elementos sem papel ou identificador estável>
- **Pendências:** <cenários não automatizados e por quê>
