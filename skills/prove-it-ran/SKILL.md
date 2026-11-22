---
name: prove-it-ran
title: Prove it ran
description: |
  Use this skill when an automation, workflow, scheduled job, webhook handler or integration step has been built or changed and someone needs to know it really works: "test this automation", "did it run", "verify the workflow", "is it working", "QA this integration", "sign off before we turn it on". Produces a verdict per step and per trigger (pass, fail, blocked, not verified), each backed by one specific run record with the evidence quoted and an owner named for every failure.
category: Automation QA
tags: [Operations, Engineering, QA]
---

Applies after a build or a change, before anyone relies on the automation. Produces a verdict per step, each tied to one run record, so a stranger can open the record and agree.

## The play

1. **List what must be proven.** Every step and every trigger. Mark which have side effects and which need data to exist first.
2. **Order by dependency.** Parents before children. Create, read, update, read, delete, then verify the deletion, using the id the create returned. Triggers go in the same plan as actions. Track each test record as available, needed, safe to change, safe to delete or spent, so a destructive step never removes what a later step needs.
3. **Take a baseline.** Before every run, note the latest run id in the run history. Accept only a new id that appears after it. No new id is a finding to diagnose. It is never a licence to read the previous run.
4. **Run it for real.** Use the automation's own supported path: trigger it, call it, cause the real event. Never hand-craft a payload to stand in for an event. Never call the target system directly to simulate a run.
5. **Open that one run record and read both sides.** The request that went out and the response that came back. Confirm it is the right step, the right connection or account, and the exact inputs you intended. Open the record once and stay in it.
6. **Judge the business payload, not the status.** A 2xx, a `success` flag, "completed", a green node and a duration only prove the call was sent and not rejected. A stale path segment gives a perfectly green run. Pass means the data a downstream step would consume is present and correct.
7. **Prove side effects with a follow-up read.** Where a step returns nothing by design (a delete, a send), read the result back. That read has its own run id. Never invent a payload to satisfy the rule.
8. **Classify every failure and name an owner** (table below), then hand off or fix.
9. **Report.** Run link first and alone, then the step, the key input, the request and status, the returned value, and the verdict with its owner. Post failed runs too. One run per item means one link per item.

## Failure classes

| Class | Signal | Next |
|---|---|---|
| Action or configuration | Recorded inputs differ from what you intended | Fix the inputs, rerun |
| Environment or credentials | The target rejects a correct request | Document it, ask a human |
| Definition defect | Wrong endpoint, malformed body, siblings share the cause | Builder, with an audit of the siblings |
| Structural anomaly | Missing fields, inconsistent siblings | Hand off at once. No workaround attempts |
| Platform | A successful call leaves no run record, or the tool misbehaves | Blocked. A human owns it. Never send it to the builder |
| External data | The target answered with an error body | Classify from the real body, not from "it failed" |

A handoff carries the exact scope, a minimal evidence packet (the failing request and response beside a working sibling), "do not publish", the pre-existing problems not to fix, and whether shared dependencies may be touched.

## Budget

- Same call, same inputs: 2 attempts, then classify.
- Same cause: 2 configuration fixes, then escalate.
- Two attempts in a row with no new evidence end the attempt.
- Retest only for a stated reason: the definition changed, a fix touched it, a dependency changed, or the earlier verdict had no run evidence. Otherwise cite the old run and move on.

For triggers and event-driven steps, read `references/trigger-testing.md` before firing anything.

## What good looks like

- **The tell:** a green run with a plausible payload that belongs to an older run. Always check that the id you cite is the id you read.
- **The common mistake:** calling an empty result a pass. A broken field mapping, a wrong path segment and an over-tight filter all return the same empty body. Seed data first. "Untestable without existing data" is a legitimate outcome and it stays open.
- **After a fix:** re-read the live configuration yourself and run it fresh. A builder's report, a readiness check or a dry run is configuration, not behaviour, and never closes an item.
- **Good output:** every verdict links to one run, the quoted values come from that run, and nothing is marked done further than the evidence reaches.

## Rules

- MUST accept only a run id that is new after the baseline.
- MUST test only on accounts and data you own, and delete only what you created.
- MUST report a trigger you could not activate as blocked, never passed.
- NEVER claim a pass without the actual runtime output in front of you.
- NEVER script clicks or call the target's API to stand in for a run.
- NEVER paste credentials or large bodies into a report.
