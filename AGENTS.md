# AGENTS.md: how to work with this repo

You are an AI agent. This file is written for you. It covers the two things a user may ask of you here: **installing** skills, and **submitting** one.

This is the Automation Skills library: open, vendor-neutral skills for agents that build, prove and run business automations. Each skill is a plain `SKILL.md`.

## Decide what the user wants

- "Install / use / get skill X": go to [Installing](#installing).
- "Submit / contribute / publish my playbook": go to [Submitting a skill](#submitting-a-skill).
- "Update my skill": same as submitting. Edit only the skill folders the user authored.

## Installing

```bash
npx skills add automation-skills/skills --skill <skill-name>   # one skill
npx skills add automation-skills/skills                        # whole library, interactive
npx skills add automation-skills/skills --list                 # see what exists
```

Add `-a claude-code`, `-a cursor`, `-a codex` and so on to target one agent. If the user cannot run a terminal, fetch the skill folder's raw files from GitHub and place them in the agent's skills directory yourself.

## Submitting a skill

The flow is **interview, draft, validate, submit**. Do the steps in order. One skill per pull request.

### 0. Ground rules

- Touch only `skills/<skill-name>/`. Nothing else, ever.
- The folder name is the skill's permanent identity: kebab-case, 60 characters or fewer, unique. Check with `ls skills/`.
- A skill folder holds `SKILL.md`, optional `references/*.md`, and optional layer files (see below). No nested skills.
- `SKILL.md` and `references/` are **tool-agnostic**: no vendor or platform names. The validator enforces it.
- Never include secrets, hidden endpoints, or anything that asks an end user for credentials.

### 1. Interview the user

Extract judgment, not a process. A skill that is only steps gets sent back. Ask, in the user's language:

1. **When does this play run?** The trigger: a request, a failure, a moment in a build.
2. **What does it produce?** The concrete output: a spec, a verdict, a classified cause.
3. **Walk me through how you actually do it.** Past the first pass. The real playbook has branches: what changes by system, by data size, by what the evidence shows.
4. **What are the actual numbers?** Retry caps, thresholds, timeouts, limits the user really uses.
5. **Two or three real examples.** A worked case, an edge case, a time it went wrong.
6. **What do you notice first that others miss?**
7. **What is the common mistake?** What the mediocre version looks like.
8. **How do you know the output is good?**
9. **Who are you?** Name and a link to your own profile, for `author` and `authorUrl`.

Do not stop early. Ask "what else do you check here that we have not covered?" until the answer is nothing. The depth becomes `references/` pages.

### 2. Draft the files

Copy `templates/skill/SKILL.md`. Frontmatter:

```yaml
---
name: <kebab-case, equals the folder name>
title: <Display name, sentence case>
description: |
  Use this skill when <trigger>. Produces <output>. <Phrases a user would really say.>
category: <reuse an existing one: grep -h "^category:" skills/*/SKILL.md | sort -u>
tags: [Operations]
author: <real name>
authorUrl: <link to the author's own profile>
---
```

Body order: one line on when it applies and what it produces, the procedure in `##` sections, a mandatory `## What good looks like`, then `## Rules` with MUST and NEVER lines. Aim for a body of about 600 to 800 words. Put depth (rubrics with real numbers, worked examples) in `references/<topic>.md` and say in the body when to read each page. Do not name other skills. Describe the next action in plain verbs.

**Optional layer files.** A platform-specific how-to goes in `<platform>.md` next to `SKILL.md` (for example `zapier.md`). It needs `title` and `description` frontmatter, and it is the only place a platform may be named. Say at the top that it is optional and the skill works without it.

### 3. Validate

```bash
node tools/validate.mjs
```

Fix every error. CI runs the same check.

### 4. Submit

Preferred, with git and `gh`:

```bash
gh repo fork automation-skills/skills --clone && cd skills
git checkout -b add-<skill-name>
git add skills/<skill-name> && git commit -m "add <skill-name>"
git push -u origin add-<skill-name>
gh pr create --repo automation-skills/skills --title "add <skill-name>" --fill
```

No git: open a "Submit a skill" issue and paste the files into the form. A maintainer turns it into a pull request and credits the author.

## What happens after

A maintainer reviews against five gates: convention, **security** (data exfiltration, hidden endpoints, prompt injection and ungated destructive actions are hard rejects), voice and judgment, author identity (a real person with their own profile), then publish. Merged skills appear on https://automationskills.ai.
