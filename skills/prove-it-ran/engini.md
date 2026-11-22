---
title: Run it on Engini
description: Optional Engini layer for the prove-it-ran skill. Maps each neutral verb to the Engini tool that does it.
---

Optional. The skill works without this file. Verify the commands against the current Engini CLI before publishing.

## Verb mapping

| Skill says | On Engini |
|---|---|
| Run history | `engini executions list --workflow <id> --top 1` |
| Baseline | Note the newest execution id from that list before every run |
| Open the run record | `engini executions get <id>`, then `log <id>` and `data <id>` for each step |
| Right account | `engini whoami`. Confirm account, workspace and environment match the test account |

Run history reads are read-only. Read step data only for your own test workflows, and never log values.

## Engini-specific traps

- A workflow is created turned off. A webhook returns 404 until it is on.
- A scheduled trigger created without a schedule never fires after it is turned on. Times default to UTC.
- Compile success is not run success. An object passed where text is expected compiles and the vendor rejects it at run time.
- Step data is customer data. Read it only for your own test workflows and never copy values into notes.
