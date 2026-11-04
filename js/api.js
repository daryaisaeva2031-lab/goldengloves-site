// Адрес бэкенда (Cloudflare Worker). Вписать после деплоя.
window.API_BASE='https://goldengloves-api.goldengloves59.workers.dev';
window.ggSend=async function(path,data){if(!API_BASE)throw new Error('no_api');const r=await fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||'server');return j};
window.ggBusy=function(f,on){f.querySelectorAll('button[type=submit],button:not([type])').forEach(b=>b.disabled=on)};
