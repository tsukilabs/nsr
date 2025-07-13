import { join } from 'node:path';
import { cwd } from 'node:process';
import { readdir, stat, writeFile } from 'node:fs/promises';

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
    const about = `${NSR}/${entry}/about.md`;
    const script = `${NSR}/${entry}/script.lua`;
    const metadata = `${NSR}/${entry}/metadata.json`;
    index.push({
      id: entry,
      about,
      script,
      metadata,
    });
  }
}

async function write() {
  const path = join(registry, 'index.json');
  const data = JSON.stringify(index, null, 0);
  await writeFile(path, data, { encoding: 'utf8' });
}
