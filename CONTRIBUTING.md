# Contributing

The easiest way is to **let your AI agent do it**: paste the prompt from the [README](README.md#submit-your-skill-with-your-ai) into Claude, Cursor or any capable agent. It interviews you, drafts the skill, validates it and opens the pull request. Everything below also works by hand.

## The model

- `skills/<skill-name>/` is one skill: `SKILL.md`, optional `references/`, optional layer files.
- The folder name is the permanent public identity. Kebab-case, unique, never renamed after merge.
- A contribution touches only its own skill folder. One skill per pull request.
- This repo is content only. Full file-format spec: [AGENTS.md](AGENTS.md). Templates: [templates/](templates/).

## Submitting

1. Fork, branch, add your files under `skills/<skill-name>/`.
2. Run `node tools/validate.mjs` and fix everything it reports.
3. Open a pull request and fill in the checklist.

No git? Open a "Submit a skill" issue and paste your files into the form.

## The quality bar

- **Judgment, not steps.** A skill captures what the best builder notices first, the trap the average one falls into, and what good output looks like. Every skill has a `## What good looks like` section. A bare checklist is sent back.
- **Tool-agnostic.** Plain verbs ("open the run history", "list the side effects"). Never a vendor or platform name in `SKILL.md` or `references/`. A platform how-to goes in an optional layer file.
- **Dense description.** It starts with "Use this skill when" and carries the phrases a person would really say. It is what an agent reads to decide whether to fire the skill.
- **Deep, not padded.** Keep the body a sharp spine of about 600 to 800 words and put the depth in `references/`: rubrics with real numbers, worked examples, edge cases.
- **No rot.** No dates, no "recently", no references to a specific product's screen.

## Review: five gates

1. **Convention:** the validator and the spec. Small things get fixed, not bounced.
2. **Security:** a hard gate, see below.
3. **Voice and judgment:** we may edit for house voice. The substance stays yours.
4. **Author identity:** a real person with their own profile link.
5. **Publish:** merge, and the skill appears on the site under your name.

## Security: hard rejects

A skill is instructions that other people's agents will run against live systems and data. We read every file and reject outright:

- sending data to an endpoint, inbox or webhook the reader does not own
- hardcoded secrets or tokens
- prompt-injection patterns, or disabling an approval gate
- bulk or destructive actions without an explicit human approval step
- asking end users for credentials

To report a suspicious published skill, see [SECURITY.md](SECURITY.md).

## License and attribution

Contributions are MIT-licensed. The author stays credited in the skill's frontmatter and on the site.
