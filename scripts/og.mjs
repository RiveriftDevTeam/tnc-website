// Renders public/og.png (1200x630) from an HTML template with the pre-installed Chromium. Run: npm run og
import { chromium } from './pw.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1200px;height:630px;font-family:Geist,Inter,system-ui,sans-serif;color:#14201F;background:
 radial-gradient(900px 500px at 10% -10%, #9ED9CF 0%, transparent 60%), radial-gradient(800px 500px at 100% 30%, #F0D9B5 0%, transparent 55%), #F2EDE3;overflow:hidden}
.wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:14px;font-size:28px;font-weight:500}
h1{font-size:76px;line-height:1.02;letter-spacing:-.02em;font-weight:500;margin:0;max-width:760px}
p{font-size:28px;line-height:1.35;color:#3E4B49;margin:22px 0 0;max-width:720px}
.circle{position:absolute;right:120px;top:150px;width:360px;height:360px}
.dot{position:absolute;border-radius:50%;box-shadow:0 18px 40px -20px rgba(11,95,107,.4)}
.ring{position:absolute;left:50%;top:50%;width:150px;height:150px;border:2px solid #0B5F6B;border-radius:50%;transform:translate(-50%,-50%);opacity:.5}
</style></head><body><div class="wrap">
<div class="brand"><svg width="40" height="40" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="9" fill="#0B5F6B"/><circle cx="16" cy="16" r="4" fill="#fff"/><circle cx="16" cy="16" r="8.5" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6"/></svg> TapNConnect</div>
<div><h1>Stay close to the people you meet.</h1><p>Your AI assistant for the people in your life. It keeps what matters, tells you when a word would count, and writes the first draft. Nothing is sent without your yes.</p></div>
<div style="font-size:22px;color:#5F6A68">tapnconnect.ae · Dubai · English and Arabic</div>
</div>
<div class="circle">
 <div class="ring"></div>
 <div class="dot" style="left:50%;top:50%;width:64px;height:64px;transform:translate(-50%,-50%);background:#0B5F6B"></div>
 ${[[10,25,52,'#F0D9B5'],[82,20,44,'#9ED9CF'],[90,70,46,'#E8C9A0'],[18,80,40,'#BFE4DC'],[55,95,34,'#F3C9A8'],[2,55,30,'#D7EEF1'],[60,2,30,'#E9D6B4']].map(([x,y,s,c])=>`<div class="dot" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;transform:translate(-50%,-50%);background:radial-gradient(circle at 35% 30%,#fff,${c} 55%,rgba(0,0,0,.05))"></div>`).join('')}
</div></body></html>`;
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html); await page.screenshot({ path: path.join(here, '../public/og.png'), type: 'png' }); await browser.close();
console.log('public/og.png written');
