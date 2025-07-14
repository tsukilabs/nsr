// Copyright (C) Call of Nil contributors
// SPDX-License-Identifier: AGPL-3.0-only

import { join } from 'node:path';
import matter from 'gray-matter';
import { cwd } from 'node:process';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';

const NSR = 'https://nil.dev.br/nsr';

const index = [];

const registry = join(cwd(), 'registry');
const entries = await readdir(registry, { encoding: 'utf8' });
await Promise.all(entries.map(checkEntry));

await write();

async function checkEntry(entry) {
  const path = join(registry, entry);
  const stats = await stat(path);
  if (stats.isDirectory()) {
    const aboutPath = join(path, 'about.md');
    const about = await readFile(aboutPath, { encoding: 'utf8' });
    index.push({
      id: entry,
      about: `${NSR}/${entry}/about.md`,
      script: `${NSR}/${entry}/script.lua`,
      frontmatter: matter(about).data,
    });
  }
}

async function write() {
  const path = join(registry, 'registry.json');
  const data = JSON.stringify(index, null, 0);
  await writeFile(path, data, { encoding: 'utf8' });
}
