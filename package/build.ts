 /// <reference lib="deno.ns" />

import * as esbuild from "esbuild"

const browser = Deno.args[0];
const buildDir = 'build/' + browser;

const options: esbuild.BuildOptions = {
  entryPoints: [
    // TS
    { out: 'injected', in: 'src/injected/main.ts' },
    { 'out': 'background', in: 'src/background.ts' },
    { out: 'popup', in: 'src/popup/popup.ts' },
  ],
  bundle: true,
  outdir: buildDir
};

if (browser === 'chrome') {
  options.define = { 'browser': 'chrome' }
}

await esbuild.build(options);

// CSS
await esbuild.build({
  entryPoints: [
    { out: 'global', in: 'src/css/global/main.css' },
    { 'out': 'calendar', in: 'src/css/calendar/main.css' },
    { out: 'dashboard', in: 'src/css/dashboard/main.css' }
  ],
  bundle: true,
  outdir: buildDir + '/css'
});
