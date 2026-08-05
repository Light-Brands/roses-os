// Build ru/uk entries in student-manual-translations.json by translating the
// existing English keys (the same source strings the es/pt maps cover) via Gemini.
import { readFileSync, writeFileSync } from 'fs';
const env={}; for(const l of readFileSync('.env.local','utf-8').split('\n')){const m=l.match(/^([^#=]+)=(.*)$/);if(m)env[m[1].trim()]=m[2].trim().replace(/^["']|["']$/g,'');}
const KEY=env.GOOGLE_GEMINI_API_KEY||env.GEMINI_API_KEY;
const PATH='scripts/pdf-manuals/student-manual-translations.json';
const NAMES={ru:'Russian',uk:'Ukrainian',de:'German'};

async function translateChunk(strings,name){
  const sys=`Translate each string in the JSON array from English to ${name}.
Rules: preserve &-entities (&amp; &nbsp; &mdash; etc.), placeholders, punctuation and numbers exactly; proper names (Angelina Ataíde and other people's names) stay as-is in Latin; do not add or drop items.
Return ONLY a JSON array of the same length, same order.`;
  const MODEL=env.GEMINI_MODEL||process.env.GEMINI_MODEL||'gemini-flash-latest';
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body={contents:[{parts:[{text:`${sys}\n\n${JSON.stringify(strings)}`}]}],generationConfig:{responseMimeType:'application/json',temperature:0}};
  for(let a=0;a<3;a++){try{
    const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!res.ok)throw new Error('gemini '+res.status);
    const j=await res.json();
    const arr=JSON.parse(j.candidates?.[0]?.content?.parts?.[0]?.text??'[]');
    if(Array.isArray(arr)&&arr.length===strings.length)return arr.map(String);
    throw new Error('len '+(arr?.length)+'!='+strings.length);
  }catch(e){if(a===2)throw e;await new Promise(r=>setTimeout(r,1500*(a+1)));}}
}

const json=JSON.parse(readFileSync(PATH,'utf-8'));
for(const [lang,name] of Object.entries(NAMES)){
  for(const lvl of ['1','2','3']){
    const keys=Object.keys(json[lvl].es||{});
    const map={};
    const CH=30;
    for(let i=0;i<keys.length;i+=CH){
      const slice=keys.slice(i,i+CH);
      const out=await translateChunk(slice,name);
      slice.forEach((k,n)=>map[k]=out[n]);
      console.log(`${lang} L${lvl}: ${Math.min(i+CH,keys.length)}/${keys.length}`);
    }
    json[lvl][lang]=map;
  }
}
writeFileSync(PATH,JSON.stringify(json,null,2)+'\n');
console.log('DONE — wrote ru/uk maps to',PATH);
