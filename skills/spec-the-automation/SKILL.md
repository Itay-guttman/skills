---
name: spec-the-automation
title: Spec the automation
description: |
  Use this skill when someone wants to automate a business process before it is built: "when X happens, do Y", "automate this", "design the workflow", "build me a flow", "turn this manual process into an automation". Produces a build-ready spec that any tool or person can implement without asking a question: trigger, dedupe key, steps with inputs and side effects, approval gates, failure paths, test data and open questions.
category: Automation design
tags: [Operations, Engineering]
---

Applies before anything is built. Produces a one-page spec whose failure section is as detailed as its happy path.

## The play

1. **State the outcome and the owner.** One line each: what changes in the world when it works, and who gets told when it breaks. No owner means it fails silently.
2. **Pick the trigger.** Prefer an event over polling. If you poll, write the interval and why that delay is acceptable. For a schedule, write the time zone. A default of UTC and a daylight-saving shift are the usual surprises.
3. **Choose the dedupe key before any step.** Name what makes one event the same event as its retry. Without a key, a retry does the work twice.
4. **Write each step as a row:** input (from which earlier step, by that field's real name and never its display label), action, output, and side effect (none, reversible or irreversible).
5. **Mark the approval gates.** Any bulk, destructive, money or outbound-message step needs a human approval unless the user states otherwise.
6. **Write the failure path for every step that can fail.** Retry (with a cap and a backoff), skip, stop or notify. A caught failure must still notify someone, using a fixed message plus the run id. Never forward the raw error text: it can contain the whole failed request, headers and body included.
7. **Pin the data types.** Numeric and date comparisons are a trap in many tools: compared as text, "100" is smaller than "99". Say which type each compared field has and how it will be checked.
8. **Invent the test data.** Build sample payloads from field names. Never paste customer values into a spec, a log or a note.
9. **Keep credentials out of the steps.** They belong on a connection or in a secret store, never as a literal input.
10. **Close with open questions.** List what you could not decide and what only a human can connect or supply.

## Retries and entry points

- A webhook or scheduled entry point can be called twice for one event. Queue side effects only after every check has passed, so a retry of a half-done run cannot repeat work already queued.
- Cap every retry loop. Make the retry or idempotency key identify the attempt. A key that ignored the attempt once replayed the same declined payment for 24 hours.
- A polling loop's exit condition must read a variable the loop body sets. The condition runs before each pass, so a body that sets nothing runs until the tool's limit and fails.

## What good looks like

- **The tell:** the first thing the best designer asks is "what happens on the second delivery?" The average spec never mentions it.
- **The common mistake:** a long happy path with "handle errors" as one line at the end.
- **Good output:** someone who has never seen the request builds it in any tool without a clarifying question. Every step names its side effect. The failure section is at least as long as the main path.
- **A filter** written as a plain input is often ignored and fetches every record. A "top 1" returns one object, not a list. Say which you mean.

## Rules

- MUST name a dedupe key, or state why none is needed.
- MUST gate every bulk, destructive, money or outbound-message step behind a human approval by default.
- MUST give every failure path a notification that carries the run id and no raw error text.
- NEVER put credentials or customer values in the spec.
- NEVER refer to a field by its display label.
