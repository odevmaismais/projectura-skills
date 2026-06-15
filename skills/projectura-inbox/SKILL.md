---
name: projectura-inbox
description: >-
  Tria a inbox do Projectura: resume notificações não-lidas e destaca o que está bloqueado, via o
  conector MCP. Use quando o usuário pedir para triar a inbox/notificações, ver pendências, ou
  descobrir o que está bloqueado (ex.: "triage minha inbox", "o que está bloqueado?").
---

# Projectura — Triagem da Inbox

Tria notificações com `projectura_notifications_*` e `projectura_tasks_*`.

## Pré-requisito
Server MCP **`projectura`** conectado (ver `https://projectura-next.vercel.app/wiki/Automacao-com-IA`). Um PAT só-leitura
(`--scopes read`) basta para resumir; ações (mover/comentar) exigem `write`.

## Fluxo
1. `projectura_context`.
2. **Contagem:** `projectura_notifications_unread_count`.
3. **Listar:** `projectura_notifications_list { unreadOnly: true, limit: 30 }`.
4. **Aprofundar:** para notifs com `taskId`, `projectura_tasks_get { id }` → entender o contexto.
5. **Bloqueios:** `projectura_tasks_list { status: "blocked" }` → liste motivos (`blockReason`).
6. **Resumir** para o usuário (agrupado por tipo/urgência) e **propor** próximas ações.
7. (Se autorizado) agir: `projectura_tasks_move` / `projectura_tasks_add_comment`.

## Notas
- Comece read-only: resuma antes de mudar qualquer coisa.
- Destaque itens `actionRequired` e tarefas `blocked` com `ci === 'failure'`.

## Exemplo
Usuário: *"Triage minha inbox e me diga o que está travando o time."*
→ `notifications_list {unreadOnly:true}` + `tasks_list {status:"blocked"}` → resumo priorizado + ações sugeridas.
