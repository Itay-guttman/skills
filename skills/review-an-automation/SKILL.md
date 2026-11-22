---
name: review-an-automation
title: Review an automation
description: |
  Use this skill when reviewing a change to an automation, workflow, integration or the code behind one: "review this workflow", "review this PR", "is this safe to ship", "sanity-check my automation". Produces a severity-ranked list of findings, each reproduced against the real thing, with a verdict and a named next owner for every fix.
category: Automation QA
tags: [Engineering, Operations, QA]
---

Applies to any change before it ships. Produces findings you could defend in front of the author, not suspicions.

## The play

1. **Read the whole thing at its latest version.** Every file or step in context, never the diff hunks alone. Read the request or ticket it claims to satisfy, the earlier review comments and the check results.
2. **List candidate findings, then try to refute each one.** Reproduce it with a concrete failing input. Report only the survivors. A finding you could not refute but could not reproduce is marked "plausible".
3. **Write each finding the same way:** the location, the concrete input that goes wrong and what it produces, the specific fix, and a severity of Blocker, Major, Minor or Nit. For a missing test, state the assertion and say it must fail without the fix.
4. **Check the usual suspects first** (below).
5. **Test the tests.** Delete the branch, clause or line the test claims to cover and watch it fail. Run the full suite once before approving, because some guard tests fail only there. A failure that passes on rerun is itself a finding: rerun 5 to 10 times and bisect. Never accept a skipped test as a way to unblock a build. Before calling a failure pre-existing, run it on the main version.
6. **Verify claims about the change.** "Unchanged", "pushed" and "CI covers it" each need a diff, a status or the real check output. A green deploy can still serve stale assets, so fetch the changed file with a cache-buster.
7. **Give a verdict:** Ship it, Ship with nits, Needs work or Blocked. Fixes go to the implementer with a short handoff, runtime proof to whoever tests, and a plan that was built faithfully but is wrong goes back to whoever planned it.

## Usual suspects

- **Valid is not working.** A step can pass validation and be rejected by the vendor at run time. An object passed where text is expected is the classic case.
- **Display labels and unknown paths.** A reference to a field by label or a wrong output path saves with a warning, then reads empty on every run.
- **A filter written as a plain input** is ignored and fetches every record. A "top 1" returns one object, not a list.
- **Ids copied from seed data**, or a connection pinned to its builder, work for the author and return nothing for everyone else.
- **Text comparison of numbers or dates.** "100" is smaller than "99".
- **A retried entry point** that queues its side effect before the checks have passed.
- **A caught failure** that makes the run report success, or one that forwards the raw error.
- **A credential as a literal input**, or a customer value inside a sample payload.
- **A loop condition** that reads a variable the body never sets.
- **A test of a stored value** that never runs it through the real reader, so the fixture never reaches the real shape.

## What good looks like

- **The tell:** you can say what the bad input is. "This looks risky" is not a finding.
- **The common mistake:** praising a green result. Tests have passed with the branch deleted, against fixtures that never reached the real shape, and against a stub that ignored flags production sets.
- **Good output:** the author can reproduce every finding in minutes and nothing in the list is a style opinion dressed up as a bug.

## Rules

- MUST read full files, not hunks.
- MUST reproduce a finding, or label it plausible.
- NEVER approve, merge or push a fix yourself. Publish the review only when asked.
- NEVER say "pre-existing" without running the main version.
- NEVER treat a green check as proof that a test tests anything.
