// Uso: node scripts/stills.mjs <Composicion> <salida.png> <seg1> <seg2> ...
// Renderiza varios fotogramas con un solo bundle y hace una hoja de contacto.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const [comp, out, ...secs] = process.argv.slice(2);
const browserExecutable = process.env.CHROME || '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: comp, browserExecutable});
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'st-'));
let i = 0;
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * composition.fps));
  await renderStill({composition, serveUrl, output: path.join(dir, `f_${String(i++).padStart(3, '0')}.png`), frame, scale: 0.25, browserExecutable});
}
const cols = composition.width > composition.height ? 6 : 9;
execSync(`ffmpeg -loglevel error -y -pattern_type glob -i '${dir}/f_*.png' -vf "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='%{n}':x=4:y=4:fontsize=18:fontcolor=white:box=1:boxcolor=black,tile=${cols}x${Math.ceil(i / cols)}" -frames:v 1 ${out}`);
console.log('ok', i);
