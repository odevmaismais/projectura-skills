---
name: projectura-releases
description: >-
  Gerencia releases no Projectura (abrir, avançar o ciclo de vida, vincular tarefas) via o conector
  MCP. Use quando o usuário mencionar abrir/avançar uma release, deploy target, ou vincular tarefas a
  uma release (ex.: "abra a release v1.2", "marque a release como deployed").
---

# Projectura — Releases

Opera releases pelas tools `projectura_releases_*`.

## Pré-requisito
Server MCP **`projectura`** conectado (ver `https://projectura-next.vercel.app/wiki/Automacao-com-IA`).

## Ciclo de vida
`planning → review → approved → deploying → deployed → rolled_back`.

## Fluxo
1. `projectura_context` (+ `list_workspaces` se multi-workspace).
2. **Selecionar tarefas prontas:** `projectura_tasks_list { status: "review", projectId }` → coletar ids.
3. **Abrir:** `projectura_releases_create { version, name, projectId?, deployTarget?, taskIds? }`
   (projectId default = Inbox; deployTarget ex.: "staging"/"production · host").
4. **Vincular mais tarefas:** `projectura_releases_link_task { releaseId, taskId }`.
5. **Avançar:** `projectura_releases_update { id, status }` conforme o ciclo (ex.: → "approved" → "deploying").
6. **Listar/ler:** `projectura_releases_list { projectId?, status? }`, `projectura_releases_get { id }`.
7. **Excluir:** `projectura_releases_delete { id }` (destrutivo — confirme).

## Notas
- `taskIds` precisa referenciar tarefas existentes no workspace (validado pelo server).
- Mudanças aparecem na UI em ~12s.

## Exemplo
Usuário: *"Abra a release v1.2.0 no projeto Web com as tarefas em review, deploy target staging."*
→ `tasks_list {status:"review", projectId}` → `releases_create {version:"v1.2.0", name:"…", projectId, deployTarget:"staging", taskIds:[…]}`.
