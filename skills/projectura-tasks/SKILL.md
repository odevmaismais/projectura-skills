---
name: projectura-tasks
description: >-
  Cria, edita, move, tria e quebra tarefas no Projectura via o conector MCP. Use quando o usuário
  quiser criar/listar/mover/fechar tarefas, adicionar subtarefas, comentar, ou quebrar um épico em
  tarefas (ex.: "crie as tarefas do épico X", "mova a tarefa Y para done", "o que está aberto?").
---

# Projectura — Tarefas

Opera tarefas do Projectura pelas tools `projectura_tasks_*` do conector MCP.

## Pré-requisito
O server MCP **`projectura`** precisa estar conectado (ver `https://projectura-next.vercel.app/wiki/Automacao-com-IA`). Se as tools
`projectura_*` não estiverem disponíveis, peça ao usuário para conectar:
`claude mcp add --transport http projectura <url>/api/mcp --header "Authorization: Bearer pj_…"`.

## Fluxo
1. **Contexto:** chame `projectura_context` (userId, workspace, escopos). Para multi-workspace,
   `projectura_list_workspaces` e passe `workspace: "<id>"` nas tools.
2. **Resolver projeto:** `projectura_projects_list` → escolha o `projectId` (default = Inbox se omitido).
3. **Criar:** `projectura_tasks_create { title, projectId?, priority?, labels?, assignees?, deadline? }`.
   Subtarefas: `projectura_tasks_add_subtask { parentId, title }`.
4. **Editar metadados:** `projectura_tasks_update` (NÃO muda status).
5. **Mover status:** `projectura_tasks_move { id, status }`. Respeita o **guard de Done**: se bloquear
   (`ci === 'failure'` ou subtarefa aberta), resolva primeiro (mova as subtarefas / corrija o CI) e
   repita. Não fure o guard.
6. **Comentar / excluir:** `projectura_tasks_add_comment`, `projectura_tasks_delete` (remove a
   subárvore — confirme com o usuário antes, é destrutivo).
7. **Listar/buscar:** `projectura_tasks_list { status?, priority?, projectId?, assignee?, label?, q?, limit?, offset? }`.

## Notas
- Escritas de tarefa aparecem na UI aberta em **~12s** (polling).
- Sempre confirme ações **destrutivas** (delete) antes de executar.
- Para fechar um épico, itere as subtarefas com `tasks_move` antes do pai.

## Exemplo
Usuário: *"Crie no projeto Web as tarefas do épico Checkout: carrinho, pagamento, recibo — label 'checkout', prioridade high."*
→ `projects_list` (achar Web) → 3× `tasks_create { projectId, title, labels:["checkout"], priority:"high" }` → confirmar ids criados.
