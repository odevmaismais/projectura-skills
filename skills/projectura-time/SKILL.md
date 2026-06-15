---
name: projectura-time
description: >-
  Lança horas (time-tracking) em tarefas do Projectura via o conector MCP. Use quando o usuário
  quiser registrar horas/tempo trabalhado numa tarefa (ex.: "lance 2h na tarefa X", "registre 1.5h
  hoje na Y").
---

# Projectura — Time-tracking

Registra horas com `projectura_tasks_log_time`.

## Pré-requisito
Server MCP **`projectura`** conectado (ver `https://projectura-next.vercel.app/wiki/Automacao-com-IA`). Exige escopo `write`.

## Fluxo
1. `projectura_context`.
2. **Identificar a tarefa:** se o usuário deu título e não id, `projectura_tasks_list { q: "<texto>" }`
   → confirme qual tarefa.
3. **Lançar:** `projectura_tasks_log_time { id, hours, date?(YYYY-MM-DD, default hoje), description? }`.
4. Confirmar o novo `logged` total devolvido.

## Notas
- `hours` é decimal (1.5 = 1h30). `date` default = hoje.
- Para vários lançamentos, repita por tarefa; some e confirme o total ao final.
- Entradas são datadas e alimentam o gráfico de horas/dia da UI.

## Exemplo
Usuário: *"Lance 2h na tarefa de auth e 1.5h na de checkout, hoje."*
→ `tasks_list {q:"auth"}` / `{q:"checkout"}` p/ achar ids → 2× `tasks_log_time {id, hours}` → confirmar totais.
