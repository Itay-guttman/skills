---
title: Trigger testing
description: How to test event-driven and scheduled triggers without blaming the trigger for a setup fault.
---

Read this before firing any trigger. Most false failures come from firing too early.

## Check in this order

1. **Is the subscription live?** Confirm the listener, webhook or schedule is active and registered. Firing before this is the biggest source of false failures.
2. **Did the generating action really succeed?** Prove the event was created. Use a real supported operation on the source system, never a hand-crafted payload.
3. **Only then ask whether delivery failed.** Compare the trigger's run history against the baseline you took before firing.

## What a pass needs

- A new trigger run after the baseline, mapped from the trigger's own payload.
- The payload has the right structure and the right values.
- One fire per event. Two fires for one event is a failure.
- No old items re-reported and no watermark leaking, checked by firing a second event and confirming only the new one arrives.
- For polling triggers, decide up front whether items that arrive by copy or move count as new, and test that case.

## What it is when you cannot test it

- A trigger you cannot activate in your authorized environment is **blocked**. Never mark it passed.
- A trigger whose only verification path needs a person to click is **not verified**, with the reason stated.
