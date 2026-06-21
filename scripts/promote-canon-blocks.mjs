import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
const env={}; for(const l of readFileSync('.env.local','utf-8').split('\n')){const m=l.match(/^([^#=]+)=(.*)$/);if(m)env[m[1].trim()]=m[2].trim().replace(/^["']|["']$/g,'');}
const { createClient } = await import('@supabase/supabase-js');
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {auth:{persistSession:false}});
const SLUG=process.argv[2], PROD=process.argv[3], LANG=process.argv[4]||'en';
const { data: src } = JSON.parse(readFileSync(`_qie-output/roses-os/canon-blocks/${SLUG}-${LANG}.json`,'utf-8'));
const idMap = new Map(src.map(b=>[b.id, randomUUID()]));
const payload = src.map(b=>{ const c=JSON.parse(JSON.stringify(b.content)); if(b.block_type==='two-column-section'){c.left=(c.left||[]).map(i=>idMap.get(i)||i);c.right=(c.right||[]).map(i=>idMap.get(i)||i);} return { id:idMap.get(b.id), manual_id:PROD, language:LANG, block_type:b.block_type, content:c, position:b.position, updated_by:'Editor', source_page:null }; });
const { data: cur } = await sb.from('manual_blocks').select('*').eq('manual_id',PROD).eq('language',LANG).order('position');
mkdirSync('_qie-output/roses-os/prod-snapshots',{recursive:true});
writeFileSync(`_qie-output/roses-os/prod-snapshots/${SLUG}-${LANG}-${cur.length}rows-${Date.now()}.json`, JSON.stringify(cur,null,2));
await sb.from('manual_blocks').delete().eq('manual_id',PROD).eq('language',LANG);
const { data: ins, error } = await sb.from('manual_blocks').insert(payload).select('id');
if(error){console.error('ERR',error.message);process.exit(1);}
const { data: back } = await sb.from('manual_blocks').select('id,block_type,content').eq('manual_id',PROD).eq('language',LANG);
const ids=new Set(back.map(b=>b.id)); let bad=0,cols=0; for(const b of back){if(b.block_type==='two-column-section'){cols++;for(const id of [...(b.content.left||[]),...(b.content.right||[])])if(!ids.has(id))bad++;}}
console.log(`${SLUG} [${LANG}]: ${back.length} rows, ${cols} two-column, ${bad} broken refs (was ${cur.length})`);
