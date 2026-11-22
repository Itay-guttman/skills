---
title: Run it on Engini
description: Optional Engini layer for the safe-to-turn-on skill.
---

Optional. The skill works without this file. Verify the commands against the current Engini CLI first. Developer docs: https://docs.engini.ai/developers

## Verb mapping

| Skill says | On Engini |
|---|---|
| Confirm the target | `engini whoami`. The key must be workspace-scoped, or writes are refused (`SCOPE_REQUIRED`) |
| Read from the live system | Catalog search, schema, dropdown options and connection listings through the `engini workflows` commands |
| Dry-run | Compile the plan. Repair rounds are capped at 5 |
| Create turned off | Create from the plan. Never turn on, run or delete |
| Revision on edit | Send the expected-revision id. A 409 means re-read and propose again |

## Engini-specific traps

- Activation is refused while any step lacks a connection.
- An edit clears omitted inputs, filters and tables, but keeps name, schedule and notes.
- An older server can silently drop a field it does not know. Feature-detect it from the schema first.
