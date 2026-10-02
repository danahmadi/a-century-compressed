// Run after build: node check.mjs. Validates data, offline safety and house style.
import {readFileSync,readdirSync} from 'node:fs';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
const here=new URL('./',import.meta.url);
const read=f=>readFileSync(new URL(f,here),'utf8');
const data=JSON.parse(read('data.json'));
const DATE=/^\d{4}(-\d{2}(-\d{2})?)?$/;
const okDate=d=>{assert.match(String(d),DATE,`bad date ${d}`);assert.ok(String(d)<=data.cutoff,`date after cutoff: ${d}`);};
const okSrc=s=>{assert.ok(s&&s.title&&s.publisher,'source needs title and publisher');assert.match(s.url,/^https:\/\//,`source must be https: ${s.url}`);};
let n=0;
assert.ok(Number.isInteger(data.start)&&data.start<2000,'start year');
okSrc(data.households.source);
for(const h of data.households.items){assert.ok(h.from<h.to&&h.to<=2026&&h.years===Math.round(h.to-h.from),h.name);n++;}
for(const i of data.adoption.items){okDate(i.launch);assert.ok(i.days>0&&i.label&&i.metric&&i.sources.length,i.name);i.sources.forEach(okSrc);n++;}
for(const c of data.curves){assert.ok(['up','down'].includes(c.dir));assert.ok(c.points.length>=5,c.id);c.sources.forEach(okSrc);
  if(c.start)assert.ok(c.points.every(p=>Number(String(p.date).slice(0,4))>=c.start),`${c.id} point before chart start`);
  for(const p of c.points){okDate(p.date);assert.ok(typeof p.value==='number'&&p.value>0,`${c.id} ${p.date}`);n++;}}
for(const p of data.ai.horizon.points){okDate(p.date);assert.ok(p.value>0&&p.lo<=p.value&&p.value<=p.hi,p.name);n++;}
data.ai.horizon.sources.forEach(okSrc);
const eraIds=new Set(data.ai.eras.map(e=>e.id));
for(const m of data.ai.milestones){okDate(m.date);assert.ok(eraIds.has(m.era),m.title);okSrc(m.source);n++;}
const domains=new Set(data.domains.map(d=>d.id));
for(const m of data.milestones){okDate(m.date);assert.ok(domains.has(m.domain),m.title);assert.ok(m.line&&m.title);okSrc(m.source);n++;}
// House style: no em or en dashes in any project file.
for(const f of readdirSync(here).filter(f=>/\.(html|json|mjs|md|txt)$/.test(f))){const x=read(f);assert.ok(!x.includes(String.fromCharCode(0x2014)),`em dash in ${f}`);assert.ok(!x.includes(String.fromCharCode(0x2013)),`en dash in ${f}`);}
// Offline: no external loads of any kind, only outbound <a> links.
const html=read('index.html');
assert.ok(!/<(script|link|img|iframe)[^>]+(src|href)=["']?https?:/i.test(html),'external asset');
assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon|EventSource)\b/.test(html),'network API in page');
assert.ok(!html.includes('__DATA__'),'index.html not built');
const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
for(const [,attrs,body] of scripts){if(attrs.includes('application/json'))assert.deepEqual(JSON.parse(body),data);else new Script(body);}
const rebuilt=read('template.html').replace('__DATA__',()=>JSON.stringify(data).replaceAll('<','\\u003c'));
assert.equal(rebuilt,html,'index.html is stale; run node build.mjs');
console.log(`OK: ${n} dated records valid, all sources https, offline, no em dashes, script compiles, build current.`);
