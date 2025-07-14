// Copyright (C) Call of Nil contributors
// SPDX-License-Identifier: AGPL-3.0-only

const scripts = [];

const response = await fetch('registry.json');

for (const entry of await response.json()) {
  scripts.push({
    url: entry.script,
    frontmatter: entry.frontmatter,
  });
}

const collator = new Intl.Collator('en-US', {
  numeric: true,
  sensitivity: 'variant',
  usage: 'sort',
});

scripts.sort((a, b) => collator.compare(a.name, b.name));

const tbody = document.querySelector('tbody');

for (const script of scripts) {
  createRow(script);
}

function createRow(script) {
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  const nameAnchor = document.createElement('a');
  nameAnchor.textContent = script.frontmatter.name;
  nameAnchor.setAttribute('href', script.url);
  nameCell.append(nameAnchor);
  row.append(nameCell);

  const authorCell = document.createElement('td');
  authorCell.textContent = script.frontmatter.author;
  row.append(authorCell);

  const versionCell = document.createElement('td');
  versionCell.textContent = script.frontmatter.version;
  row.append(versionCell);

  const officialCell = document.createElement('td');
  const official = script.frontmatter.official ? 'Yes' : 'No';
  officialCell.textContent = official;
  row.append(officialCell);

  tbody.append(row);
}
