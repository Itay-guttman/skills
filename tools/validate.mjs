// Validates every skill. Run: node tools/validate.mjs
// Errors fail CI. Warnings are advice. No dependencies.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const VENDOR = /\b(zapier|n8n|workato|pipedream|ifttt|engini|make\.com|power automate|tray\.io|airtable|hubspot|salesforce|stripe)\b/i;
const INJECTION = /(ignore|disregard)\s+(all\s+)?(previous|prior|above)\s+instructions/i;
const SECRET = /(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,})/;
const FETCH = /\b(curl|wget)\b[^\n]*https?:\/\//i;

const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

function parse(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: null, body: src };
  const meta = {};
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const k = lines[i].match(/^([\w-]+):\s*(.*)$/);
    if (!k) continue;
    let v = k[2].trim();
    if (v === '|') {
      const buf = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) buf.push(lines[++i].trim());
      v = buf.join(' ').trim();
    } else if (v.startsWith('[')) v = v.slice(1, -1).split(',').map((x) => x.trim()).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, '');
    meta[k[1]] = v;
  }
  return { meta, body: m[2] };
}

function scan(file, text) {
  if (INJECTION.test(text)) err(file, 'prompt-injection pattern');
  if (SECRET.test(text)) err(file, 'looks like a hardcoded secret');
  if (FETCH.test(text)) warn(file, 'fetches from an external URL; a human must review it');
}

const root = 'skills';
if (!existsSync(root)) {
  console.error('no skills/ directory');
  process.exit(1);
}

for (const d of readdirSync(root, { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const dir = join(root, d.name);
  const main = join(dir, 'SKILL.md');
  if (!existsSync(main)) {
    err(dir, 'missing SKILL.md');
    continue;
  }
  const { meta, body } = parse(readFileSync(main, 'utf8'));
  if (!meta) {
    err(main, 'missing frontmatter');
    continue;
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.name) || d.name.length > 60) err(dir, 'folder name must be kebab-case, 60 characters or fewer');
  if (meta.name !== d.name) err(main, `name "${meta.name}" must equal the folder name "${d.name}"`);
  for (const k of ['title', 'description', 'category']) if (!meta[k]) err(main, `missing "${k}"`);
  if (meta.description && !/^Use this skill when/.test(meta.description)) err(main, 'description must start with "Use this skill when"');
  if (!meta.author || !meta.authorUrl) warn(main, 'add author and authorUrl (a real person and their own profile link) before publishing');
  if (!/^## What good looks like/m.test(body)) err(main, 'missing the "## What good looks like" section');
  if (!/^## Rules/m.test(body)) warn(main, 'no "## Rules" section');
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words > 900) warn(main, `body is ${words} words; move depth into references/`);
  if (VENDOR.test(body) || VENDOR.test(meta.description || '')) err(main, 'names a vendor; keep SKILL.md tool-agnostic and move platform detail to a layer file');
  scan(main, body);

  const refs = join(dir, 'references');
  if (existsSync(refs)) {
    for (const f of readdirSync(refs).filter((x) => x.endsWith('.md'))) {
      const t = readFileSync(join(refs, f), 'utf8');
      if (VENDOR.test(t)) err(join(refs, f), 'names a vendor; references must stay tool-agnostic');
      scan(join(refs, f), t);
    }
  }

  // Layer files: any other .md next to SKILL.md. The only place a platform may be named.
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md') && x !== 'SKILL.md')) {
    const p = join(dir, f);
    const t = readFileSync(p, 'utf8');
    const { meta: lm } = parse(t);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(f)) err(p, 'layer file name must be kebab-case');
    if (!lm || !lm.title || !lm.description) err(p, 'layer file needs title and description frontmatter');
    scan(p, t);
  }
}

for (const w of warnings) console.warn('warn  ' + w);
for (const e of errors) console.error('error ' + e);
console.log(`${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
