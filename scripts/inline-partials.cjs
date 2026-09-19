#!/usr/bin/env node
// Generate committed static HTML. No hosting build step or runtime injection.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const renderPartials = require('../partials.js');
const check = process.argv.includes('--check');
function pages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || ['scripts', 'images', 'pdfs', 'worker'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? pages(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}
let stale = false;
for (const file of pages(root)) {
  const before = fs.readFileSync(file, 'utf8');
  const page = before.match(/data-page="([^"]+)"/)?.[1] || '';
  let after = before;
  for (const [name, content] of Object.entries(renderPartials(page))) {
    const html = `<!-- partial:${name}:start -->\n${content.trim()}\n<!-- partial:${name}:end -->`;
    const block = new RegExp(`<!-- partial:${name}:start -->[\\s\\S]*?<!-- partial:${name}:end -->`, 'g');
    const slot = new RegExp(`<div data-partial="${name}"></div>`, 'g');
    after = after.replace(block, () => html).replace(slot, () => html);
  }
  if (after !== before) {
    if (check) {
      console.error(`Stale shared HTML: ${path.relative(root, file)}`);
      stale = true;
    } else fs.writeFileSync(file, after);
  }
}
if (stale) process.exitCode = 1;
else console.log(check ? 'Shared HTML is up to date.' : 'Shared HTML generated.');
