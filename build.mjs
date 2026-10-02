// Inlines data.json into template.html to produce one offline file, index.html.
import {readFileSync,writeFileSync} from 'node:fs';
const here=new URL('./',import.meta.url);
const data=JSON.parse(readFileSync(new URL('data.json',here),'utf8'));
const template=readFileSync(new URL('template.html',here),'utf8');
const html=template.replace('__DATA__',()=>JSON.stringify(data).replaceAll('<','\\u003c'));
writeFileSync(new URL('index.html',here),html);
console.log(`Built index.html: ${data.adoption.items.length} adoption rows, ${data.curves.length} curves, ${data.milestones.length} milestones, ${Buffer.byteLength(html)} bytes.`);
