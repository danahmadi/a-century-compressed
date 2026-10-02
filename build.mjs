// Inlines data.json into template.html to produce one offline file, index.html, and writes llms.txt from the same data.
import {readFileSync,writeFileSync} from 'node:fs';
const here=new URL('./',import.meta.url);
const data=JSON.parse(readFileSync(new URL('data.json',here),'utf8'));
const template=readFileSync(new URL('template.html',here),'utf8');
const html=template.replace('__DATA__',()=>JSON.stringify(data).replaceAll('<','\\u003c'));
writeFileSync(new URL('index.html',here),html);
writeFileSync(new URL('llms.txt',here),llms(data));
console.log(`Built index.html: ${data.adoption.items.length} adoption rows, ${data.curves.length} curves, ${data.milestones.length} milestones, ${Buffer.byteLength(html)} bytes. Wrote llms.txt.`);

function llms(D){
  const repo='https://github.com/danahmadi/a-century-compressed',raw='https://raw.githubusercontent.com/danahmadi/a-century-compressed/main';
  const item=id=>D.adoption.items.find(i=>i.id===id);
  const home=n=>D.households.items.find(i=>i.name===n);
  const tel=item('telephone'),gpt=item('chatgpt'),cap=v=>v.charAt(0).toUpperCase()+v.slice(1);
  const adoption=D.adoption.items.slice().sort((a,b)=>a.launch<b.launch?-1:1).map(i=>`- ${i.name} (launched ${i.launch.slice(0,4)}): ${i.label} to 100 million. Measure: ${i.metric}.`).join('\n');
  const homes=D.households.items.slice().sort((a,b)=>a.from-b.from).map(i=>`- ${i.name}: ${i.years} years (${Math.round(i.from)} to ${Math.round(i.to)})`).join('\n');
  const curves=D.curves.map(c=>{const p=c.points.slice().sort((a,b)=>a.date<b.date?-1:1),a=p.find(v=>v.base)||p[0],b=p[p.length-1];return `- ${c.title} (${c.unit}). From ${a.date.slice(0,4)} to ${b.date.slice(0,4)}. ${c.takeaway} Sources: ${c.sources.map(s=>s.url).join(', ')}`;}).join('\n');
  const hz=D.ai.horizon;
  const steps=D.ai.milestones.map(m=>`- ${m.date}: ${m.title}. ${m.line} (${m.source.url})`).join('\n');
  const ms=D.milestones.slice().sort((a,b)=>a.date<b.date?-1:1).map(m=>`- ${m.date}: ${m.title}. ${m.line} (${m.source.url})`).join('\n');
  const cav=D.honest.map(h=>`- ${h.title}: ${h.body}`).join('\n');
  return `# A Century, Compressed

> An open source, sourced visualization asking whether innovation is really accelerating, using 100 years of data (1926 to ${D.cutoff.slice(0,4)}). Data checked ${D.cutoff}. Crafted by Dan Ahmadi (https://x.com/Dan_Ahmadi).

Short answer: some things are accelerating and some are not. ${cap(tel.lower)} took ${tel.label} to reach 100 million people; ${gpt.name} took ${gpt.label}. AI task-completion horizons double about every ${hz.headline} (METR). But radio went from 10% to 80% of US homes in ${home('Radio').years} years, about as fast as the cell phone (${home('Cell phone').years}), and economist Robert Gordon argues the deepest changes to daily life came between 1870 and 1970.

## Files

- [Interactive page](${raw}/index.html): single self-contained HTML file; download and open in a browser
- [All data](${raw}/data.json): every number, date, caveat and source URL used on the page
- [README](${repo}#readme): what the page shows, how to rebuild it, known limits

## Years from 10% to 80% of US households (Comin and Hobijn via Our World in Data)

${homes}

## Time to 100 million users, worldwide

${adoption}

## Measured trends

${curves}

## AI: task length models complete 50% of the time (METR)

${hz.takeaway} Source: ${hz.sources.map(s=>s.url).join(', ')}

## The road to large language models

${steps}

## Milestones, 1926 to ${D.cutoff.slice(0,4)}

${ms}

## Caveats

${cav}
`;
}
