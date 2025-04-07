 /// <reference lib="deno.ns" />

import * as esbuild from "esbuild"

const browser = Deno.args[0];
const buildDir = 'build/' + browser;

const options: esbuild.BuildOptions = {
  entryPoints: [
    { out: 'injected', in: 'src/injected/main.ts' },
    { 'out': 'background', in: 'src/background.ts' },
    { out: 'popup', in: 'src/popup/popup.ts' },
    { out: 'global', in: 'src/css/global/main.css' },
    { 'out': 'calendar', in: 'src/css/calendar/main.css' },
    { out: 'dashboard', in: 'src/css/dashboard/main.css' }
  ],
  bundle: true,
  outdir: buildDir
};

if (browser === 'chrome') {
  options.define = { 'browser': 'chrome' }
}

await esbuild.build(options);

// Copied files
await esbuild.build({
  entryPoints: [
    'src/popup/popup.html',
    'src/popup/popup.css',
  ],
  loader: {
    '.html': 'copy',
    '.css': 'copy',
  },
  outdir: buildDir
});

// Icons
await esbuild.build({
  entryPoints: [
    'icons/*',
  ],
  loader: {
    '.png': 'copy'
  },
  outdir: buildDir
});
