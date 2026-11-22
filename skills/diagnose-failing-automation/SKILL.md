---
name: diagnose-failing-automation
title: Diagnose a failing automation
description: |
  Use this skill when a live automation errors, produces nothing, runs twice, or "stopped working": "why didn't it fire", "it ran but did nothing", "we got duplicates", "the integration broke", "debug this workflow". Produces a classified cause with a named owner, the evidence behind it, and the next action, plus a handoff packet when someone else must fix it.
category: Automation operations
tags: [Operations, Engineering, Support]
---

Applies to anything already running. Produces a cause tied to one run record, not a guess.

## The play

1. **Pin the symptom to one run.** Find the exact run record that errored, came back empty or duplicated. Read the request that went out and the response that came back. Classify from the real response body, never from the fact that it failed.
2. **Compare with the last good run.** What changed: the definition, the credentials, the vendor, the data? The first difference is usually the cause.
3. **Nothing ran at all?** Check in this order: is the subscription or schedule live, did the source event really happen, did delivery fail. Do not blame delivery before the first two.
4. **It reports success but did nothing?** Look for these, in order:
   - a caught-failure path that reports success while swallowing the error
   - an empty result from a wrong field mapping, a filter that was ignored, or a dropdown saved as a label instead of an id
   - a connection pinned to its builder that returns nothing for anyone else
   - an expired or revoked sign-in, which often surfaces as a generic bad-request error
   - a schedule with no schedule set, or one in the wrong time zone
5. **Running twice?** Find the entry point that retried. Check the dedupe key, whether side effects were queued before the checks passed, and whether the retry key identified the attempt.
6. **Classify and name the owner** (table below).
7. **Respect the retry budget.** Same call and inputs: 2 attempts, then classify. Same cause: 2 configuration fixes, then escalate. Two attempts in a row with no new evidence end the attempt. The third try is where sessions disappear.
8. **Verify the fix with a fresh run.** A builder's report or a readiness check is not evidence. Automations built before a fix are not repaired by it, so re-save or rebuild them.

## Failure classes

| Class | Signal | Owner and next step |
|---|---|---|
| Action or configuration | Recorded inputs differ from what was intended | Fix the inputs, rerun |
| Environment or credentials | The target rejects a correct request | Human, after documenting it |
| Definition defect | Wrong endpoint or malformed body, shared by siblings | Builder, with an audit of the siblings |
| Structural anomaly | Missing fields, inconsistent siblings | Hand off at once, no workarounds |
| Platform | A successful call leaves no run record | Human. Never the builder |
| External data | The target returned an error body | Classify from the body |

A handoff carries the exact scope, a minimal evidence packet (the failing request and response beside a working sibling), "do not publish", the pre-existing problems not to fix, and whether shared dependencies may be touched.

## What good looks like

- **The tell:** the diagnosis names one run id and one field. "It seems flaky" is never a diagnosis.
- **The common mistake:** rerunning the automation to see what happens. A rerun can repeat a side effect, and it adds no evidence.
- **Good output:** the owner can act without asking a question, and the class says whether it is theirs.

## Rules

- NEVER rerun an automation with real side effects just to reproduce a fault.
- NEVER investigate someone else's data hands-on. Flag it to its owner.
- NEVER send a platform fault to the builder.
- MUST classify from the response body.
- MUST stop after two attempts with no new evidence.
