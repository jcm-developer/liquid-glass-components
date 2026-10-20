/**
 * Checks that the documentation and inventories still match the repository.
 *
 * Fails (exit 1) on: an em dash in any tracked text file, a relative Markdown link or anchor
 * that does not resolve, a doc under docs/ that AGENTS.md does not link, a snippet missing
 * from an inventory (SKILL.md, docs/domains/components.md, site/index.html), a component
 * missing from the derived-token :where() list, a version mismatch, and a universal prompt
 * that differs between README.md and site/index.html.
 * Run from anywhere: `node scripts/check-docs.mjs`. No dependencies.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EM_DASH = String.fromCharCode(0x2014);
const BINARY = /\.(png|jpe?g|gif|ico|webp|svg|woff2?|ttf|otf|pdf|zip|mp4|webm)$/i;
const SNIPPETS = 'skills/liquid-glass/snippets';

const errors = [];

/**
 * Returns the repository files git knows about, tracked or new but not ignored.
 *
 * @return {string[]} Paths relative to the root, with forward slashes.
 */
function repoFiles() {
  const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return out.split('\n').filter((f) => f && existsSync(join(ROOT, f)));
}

/**
 * Reads a file relative to the root as UTF-8 with LF line endings.
 *
 * @param {string} path - The path relative to the root.
 * @return {string} The file contents.
 */
function read(path) {
  return readFileSync(join(ROOT, path), 'utf8').replace(/\r\n/g, '\n');
}

/**
 * Converts a Markdown heading to the anchor GitHub generates for it.
 *
 * @param {string} heading - The heading text without the leading hashes.
 * @return {string} The anchor slug.
 */
function slug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^\p{L}\p{N} -]/gu, '')
    .replace(/ /g, '-');
}

/**
 * Lists the anchors of a Markdown file, skipping headings inside code fences.
 *
 * @param {string} text - The Markdown source.
 * @return {Set<string>} The anchor slugs.
 */
function anchorsOf(text) {
  const anchors = new Set();
  let fenced = false;
  for (const line of text.split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    const m = !fenced && line.match(/^#{1,6} (.*)$/);
    if (m) anchors.add(slug(m[1]));
  }
  return anchors;
}

/**
 * Removes fenced code blocks so their contents are not checked as prose.
 *
 * @param {string} text - The Markdown source.
 * @return {string} The text without code fences.
 */
function stripFences(text) {
  return text.replace(/```[\s\S]*?```/g, '');
}

const files = repoFiles();

/* ── 1. Em dash ── */

for (const file of files) {
  if (BINARY.test(file)) continue;
  read(file).split('\n').forEach((line, i) => {
    if (line.includes(EM_DASH)) errors.push(`${file}:${i + 1}: em dash (U+2014)`);
  });
}

/* ── 2. Relative links and anchors ── */

const markdown = files.filter((f) => f.endsWith('.md') || f.endsWith('.mdc'));
for (const doc of markdown) {
  const text = stripFences(read(doc));
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    const [path, anchor] = target.split('#');
    const file = path ? relative(ROOT, resolve(ROOT, dirname(doc), path)).replace(/\\/g, '/') : doc;
    if (!existsSync(join(ROOT, file))) {
      errors.push(`${doc}: broken link to ${target}`);
      continue;
    }
    if (anchor && file.endsWith('.md') && !anchorsOf(read(file)).has(anchor)) {
      errors.push(`${doc}: missing anchor #${anchor} in ${file}`);
    }
  }
}

/* ── 3. Every doc is reachable from AGENTS.md ── */

const agents = read('AGENTS.md');
for (const doc of files.filter((f) => f.startsWith('docs/') && f.endsWith('.md'))) {
  if (!agents.includes(`(${doc})`)) errors.push(`AGENTS.md: no link to ${doc} in the documentation map`);
}

/* ── 4. Snippet inventories ── */

const snippets = readdirSync(join(ROOT, SNIPPETS)).filter((f) => /\.(css|js)$/.test(f));
const skill = read('skills/liquid-glass/SKILL.md');
const componentsDoc = read('docs/domains/components.md');
const site = read('site/index.html');

for (const file of snippets) {
  if (!skill.includes('`' + file + '`')) errors.push(`SKILL.md: snippet table misses ${file}`);
  if (!componentsDoc.includes('`' + file + '`')) errors.push(`docs/domains/components.md: table misses ${file}`);
  if (!site.includes(`snippets/${file}"`)) errors.push(`site/index.html: does not load ${file}`);
}
for (const [doc, text] of [['SKILL.md', skill], ['docs/domains/components.md', componentsDoc]]) {
  for (const [, file] of text.matchAll(/`((?:glass-[\w-]+|tokens)\.css|liquid-glass\.js)`/g)) {
    if (!snippets.includes(file)) errors.push(`${doc}: lists ${file}, which does not exist`);
  }
}

/* ── 5. Derived-token :where() list ── */

const tokens = read(`${SNIPPETS}/tokens.css`);
const whereBlock = (tokens.match(/:where\(([\s\S]*?)\)\s*\{/) || [, ''])[1];
const whereClasses = new Set(whereBlock.split(',').map((s) => s.trim()).filter(Boolean));
for (const file of snippets.filter((f) => f.startsWith('glass-') && f.endsWith('.css'))) {
  for (const [, cls, body] of read(`${SNIPPETS}/${file}`).matchAll(/^(\.[a-z0-9_-]+)\s*\{([^}]*)\}/gm)) {
    if (!/var\(--glass-(bg|shadow-rim)\)/.test(body)) continue;
    // A modifier inherits the derived tokens of its block, which is what must be listed.
    const block = cls.replace(/--[a-z0-9-]+$/, '');
    if (!whereClasses.has(block)) errors.push(`tokens.css: ${block} (${file}) is missing from the derived-token :where() list`);
  }
}

/* ── 6. Versions ── */

const versions = new Map();
for (const file of snippets.filter((f) => f.endsWith('.css'))) {
  const m = read(`${SNIPPETS}/${file}`).match(/Liquid Glass Components v(\d+\.\d+\.\d+)/);
  versions.set(file, m ? m[1] : 'missing');
}
const engineVersion = read(`${SNIPPETS}/liquid-glass.js`).match(/const VERSION = '([\d.]+)'/);
versions.set('liquid-glass.js', engineVersion ? engineVersion[1] : 'missing');
const skillVersion = skill.match(/version: "([\d.]+)"/);
versions.set('SKILL.md', skillVersion ? skillVersion[1] : 'missing');
const expected = versions.get('SKILL.md');
for (const [file, version] of versions) {
  if (version !== expected) errors.push(`${file}: version ${version}, SKILL.md says ${expected}`);
}

/* ── 7. Universal prompt ── */

const readmePrompt = (read('README.md').match(/### Universal prompt[\s\S]*?```\n([\s\S]*?)\n```/) || [])[1];
const sitePrompt = (site.match(/const PROMPT = `([\s\S]*?)`;/) || [])[1];
if (!readmePrompt || !sitePrompt) {
  errors.push('Universal prompt: not found in README.md or site/index.html');
} else if (readmePrompt.trim() !== sitePrompt.replace(/\\`/g, '`').trim()) {
  errors.push('Universal prompt: README.md and PROMPT in site/index.html differ');
}

/* ── Report ── */

if (errors.length) {
  console.error(`check-docs: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log('check-docs: OK');
