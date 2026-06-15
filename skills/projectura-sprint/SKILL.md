---
name: projectura-sprint
description: >-
  Planeja um sprint no Projectura: puxa tarefas abertas/de alta prioridade e as distribui pelo time,
  via o conector MCP. Use quando o usuário pedir para planejar o sprint, distribuir/atribuir tarefas,
  ou balancear o backlog (ex.: "monte o próximo sprint", "distribua as tarefas open de high").
---

# Projectura — Sprint Planning

Monta um sprint com as tools `projectura_tasks_*` e `projectura_teams_*`.

## Pré-requisito
Server MCP **`projectura`** conectado (ver `https://projectura-next.vercel.app/wiki/Automacao-com-IA`).

## Fluxo
1. `projectura_context` (+ `list_workspaces` se necessário).
2. **Backlog candidato:** `projectura_tasks_list { status: "open", priority: "high" }` (ajuste filtros).
3. **Time:** `projectura_teams_list` / `projectura_teams_get` → membros disponíveis (`members[]` = userIds).
4. **Propor a distribuição** ao usuário (capacidade vs estimativas) ANTES de escrever — sprint é decisão dele.
5. **Aplicar:** por tarefa, `projectura_tasks_update { id, assignees: [userId], deadline? }`.
6. (Opcional) Mover para `progress`: `projectura_tasks_move { id, status: "progress" }`.

## Notas
- Apresente o plano e confirme antes de atribuir em lote.
- `assignees`/`members` são userIds (= `_id` do Mongo). Use `projectura_context`/`list_workspaces`/
  `teams_get` para descobri-los.
- Não exceda a capacidade declarada do time sem sinalizar.

## Exemplo
Usuário: *"Monte o sprint: pegue as open de alta prioridade e divida entre o time."*
→ `tasks_list {status:"open",priority:"high"}` + `teams_list` → propor divisão → confirmar → `tasks_update` por tarefa.
