---
name: projectura-status
description: >-
  Gera um status report a partir do Projectura e o salva como documento, via o conector MCP. Use
  quando o usuário pedir um status report, resumo semanal, ou panorama de progresso (ex.: "gere o
  status da semana", "resumo do projeto X e salve como doc").
---

# Projectura — Status Report

Sintetiza progresso com `projectura_tasks_list` + `projectura_releases_list` e persiste via
`projectura_docs_create`.

## Pré-requisito
Server MCP **`projectura`** conectado (ver `https://projectura-next.vercel.app/wiki/Automacao-com-IA`).

## Fluxo
1. `projectura_context` (+ `list_workspaces` se necessário).
2. **Coletar contagens** por status: `projectura_tasks_list { status }` para open/progress/review/done
   (use `total` de cada resposta; pagine se preciso).
3. **Releases em voo:** `projectura_releases_list { status: "deploying" }` (e/ou "approved").
4. **Bloqueios:** `projectura_tasks_list { status: "blocked" }`.
5. **Compor** um resumo em markdown (feito / em andamento / bloqueado / próximos passos).
6. **Salvar:** `projectura_docs_create { title: "Status YYYY-MM-DD", body: <markdown>, scope: "workspace" }`.
7. Devolver ao usuário o `id` do doc + um resumo curto.

## Notas
- Inclua números concretos (contagens, releases) — evite generalidades.
- O doc aparece na UI em ~12s; informe o título/escopo onde encontrá-lo.

## Exemplo
Usuário: *"Gere o status report da semana e salve como doc."*
→ coletar contagens + releases → `docs_create {title:"Status 2026-06-14", body, scope:"workspace"}` → retornar id.
