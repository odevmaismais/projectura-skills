---
name: projectura-docs
description: >-
  Cria e atualiza documentos (markdown) no Projectura via o conector MCP. Use quando o usuário
  quiser criar/editar um doc, página ou nota no Projectura (ex.: "crie um doc de RFC", "atualize a
  página de onboarding").
---

# Projectura — Documentos

Gerencia docs markdown com `projectura_docs_*`.

## Pré-requisito
Server MCP **`projectura`** conectado (ver `https://projectura-next.vercel.app/wiki/Automacao-com-IA`).

## Escopos
`workspace` (default), `project`, `team`, `personal`. Para `project`/`team`, o `scopeId` deve
referenciar um projeto/equipe existente (`projectura_projects_list` / `projectura_teams_list`).

## Fluxo
1. `projectura_context`.
2. **Criar:** `projectura_docs_create { title, body(md), emoji?, scope?, scopeId?, parentId?, tags? }`.
   Para aninhar, `parentId` = id de um doc existente.
3. **Editar:** `projectura_docs_update { id, title?, body?, status?, tags?, pinned?, parentId? }`
   (status: draft|review|approved|archived).
4. **Listar/ler:** `projectura_docs_list { scope?, scopeId? }`, `projectura_docs_get { id }` (com corpo).
5. **Excluir:** `projectura_docs_delete { id }` (filhos sobem para a raiz; destrutivo — confirme).

## Notas
- `body` é markdown. Docs aparecem na UI em ~12s.
- Confirme exclusões antes de executar.

## Exemplo
Usuário: *"Crie um doc 'RFC: Auth v2' no projeto Web com um esqueleto de RFC."*
→ `projects_list` (achar Web) → `docs_create {title:"RFC: Auth v2", scope:"project", scopeId:<webId>, body:"## Contexto\n…"}`.
