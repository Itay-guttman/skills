# Automation Skills

Open, vendor-neutral skills for AI agents that build, prove and run business automations: spec them, prove they ran, turn them on safely, review them, and diagnose them when they fail.

Every skill is a plain `SKILL.md` that any agent can read: Claude Code, Cursor, Codex and any other agent that loads skills. It works in any automation tool. An optional layer file next to a skill shows how to run it on one specific platform.

Library site: https://automationskills.ai (coming soon).

## Install

```bash
# one skill
npx skills add automation-skills/skills --skill prove-it-ran

# the whole library (interactive picker)
npx skills add automation-skills/skills
```

Add `-a claude-code`, `-a cursor`, `-a codex` and so on to target one agent, or `--list` to see what is here.

## The skills

| Skill | Use it when |
|---|---|
| [spec-the-automation](skills/spec-the-automation/SKILL.md) | Someone wants "when X happens, do Y" and you need a build-ready spec |
| [prove-it-ran](skills/prove-it-ran/SKILL.md) | A build or change needs sign-off with real evidence, not a green check |
| [safe-to-turn-on](skills/safe-to-turn-on/SKILL.md) | You are about to create or enable an automation in someone's account |
| [review-an-automation](skills/review-an-automation/SKILL.md) | You are reviewing a change to an automation |
| [diagnose-failing-automation](skills/diagnose-failing-automation/SKILL.md) | A live automation errors, stays silent or runs twice |

## Submit your skill with your AI

You do not need to know git. Paste this to Claude, Cursor or any capable agent:

> Fetch https://raw.githubusercontent.com/automation-skills/skills/main/AGENTS.md and follow its submission flow. Interview me thoroughly about my automation playbook: the trigger, the output, the numbers I really use, real examples, the mistake the average builder makes and how I know the result is good. Draft it in their format with reference pages for the depth, and submit it.

Details in [CONTRIBUTING.md](CONTRIBUTING.md).

## Layout

```
skills/
  <skill-name>/
    SKILL.md        the skill: portable and tool-agnostic
    references/     optional: deeper material the skill points to
    <platform>.md   optional layer: how to run it on one platform
profiles/           contributor profiles: <slug>.json and <slug>.jpg (see profiles/README.md)
templates/          starting points
tools/validate.mjs  the checks CI runs
```

## What makes a skill good here

Skills encode **judgment, not just steps**: what the best builder notices first, the trap the average one falls into, and what good output looks like. They use plain verbs ("open the run history", "list the side effects") and never vendor names, so they work whatever your stack is. The bar is in [CONTRIBUTING.md](CONTRIBUTING.md). Enforcement is `node tools/validate.mjs` plus human review.

## License

MIT, see [LICENSE](LICENSE). The author stays credited.
