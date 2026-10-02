// Writes og/card.html (1200x630) from data.json. Screenshot it to og.png; see README.
import {readFileSync,writeFileSync} from 'node:fs';
const here=new URL('../',import.meta.url);
const D=JSON.parse(readFileSync(new URL('data.json',here),'utf8'));
const esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pick=['telephone','mobile','web','facebook','iphone','chatgpt'];
const rows=pick.map(id=>D.adoption.items.find(i=>i.id===id)).filter(Boolean);
const max=Math.max(...rows.map(r=>r.days));
const bars=rows.map(r=>{const w=Math.max(.6,r.days/max*100);return `<div class="row"><span class="name">${esc(r.name)}</span><span class="track"><i style="width:${w.toFixed(2)}%"></i></span><span class="dur">${esc(r.label.replace('about ',''))}</span></div>`;}).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#0d0f12;color:#eef0f2;font-family:"SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
h1{font-size:76px;font-weight:650;letter-spacing:-.035em;line-height:1}p{font-size:28px;color:#a3abb5;margin-top:18px;letter-spacing:-.01em}
.chart{display:grid;gap:14px}.label{font-size:18px;color:#727b86;margin-bottom:4px}
.row{display:grid;grid-template-columns:250px 1fr 150px;align-items:center;gap:20px;font-size:22px}
.name{color:#eef0f2;text-align:right;white-space:nowrap}.track{height:14px;position:relative}.track i{position:absolute;left:0;top:0;bottom:0;background:#f2a63b;border-radius:7px;min-width:14px}
.dur{color:#f2a63b;font-weight:600;font-variant-numeric:tabular-nums}
.foot{display:flex;justify-content:space-between;font-size:18px;color:#727b86}
</style></head><body><div><h1>A century, compressed.</h1><p>Is innovation really accelerating? 100 years of data, 1926 to 2026.</p></div>
<div class="chart"><div class="label">Time to reach 100 million people</div>${bars}</div>
<div class="foot"><span>github.com/danahmadi/a-century-compressed</span><span>Crafted by Dan Ahmadi</span></div></body></html>`;
writeFileSync(new URL('og/card.html',here),html);
console.log(`Wrote og/card.html with ${rows.length} rows.`);
