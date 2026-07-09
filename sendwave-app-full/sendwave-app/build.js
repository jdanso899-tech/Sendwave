// Build script for Sendwave Africa.
//
// What it does:
//   1. Wraps sendwave.jsx together with React/ReactDOM imports and a mount
//      call, then bundles all of it (React + ReactDOM + the app) into a
//      single offline-capable www/bundle.js using esbuild.
//   2. Copies the other static assets (index.html, manifest.json, sw.js,
//      icons) into www/, which is the folder Capacitor packages into the
//      native Android/iOS app (see webDir in capacitor.config.json).
//
// Run with: npm run build

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = __dirname;
const WWW = path.join(ROOT, 'www');

if (!fs.existsSync(WWW)) fs.mkdirSync(WWW, { recursive: true });

// --- 1. Bundle the React app ---
const sendwaveSrc = fs.readFileSync(path.join(ROOT, 'sendwave.jsx'), 'utf8');

const entryContents = [
  "import React from 'react';",
  "import { createRoot } from 'react-dom/client';",
  '',
  sendwaveSrc,
  '',
  "const root = createRoot(document.getElementById('root'));",
  'root.render(React.createElement(Sendwave));',
].join('\n');

const tmpEntry = path.join(ROOT, '.entry.build.jsx');
fs.writeFileSync(tmpEntry, entryContents);

try {
  esbuild.buildSync({
    entryPoints: [tmpEntry],
    bundle: true,
    minify: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    outfile: path.join(WWW, 'bundle.js'),
  });
  console.log('Bundled sendwave.jsx + React -> www/bundle.js');
} finally {
  fs.unlinkSync(tmpEntry);
}

// --- 2. Copy static assets ---
const STATIC_FILES = ['index.html', 'manifest.json', 'sw.js', 'icon-192.svg', 'icon-512.svg'];
for (const file of STATIC_FILES) {
  const src = path.join(ROOT, file);
  if (!fs.existsSync(src)) {
    console.warn(`Warning: ${file} not found, skipping.`);
    continue;
  }
  fs.copyFileSync(src, path.join(WWW, file));
  console.log(`Copied ${file} -> www/${file}`);
}

console.log('\nBuild complete. www/ is ready for `npx cap copy` / `npx cap sync`.');
