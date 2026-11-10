// Spielstand + Vokabel-Kasten (Leitner, 1–5) – nur im Browser dieses Geräts
const KEY='chien_save_v2';
const fresh=()=>({ name:null, chapter:0, step:0, unlocked:0, treats:0, items:{}, results:{}, inv:{}, wear:{} });
export const P = (()=>{ try{ return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)||'{}')); }catch(e){ return fresh(); } })();
// Anker: Kapitel werden über ihre feste id gemerkt, Schritte über eine Signatur –
// so überlebt der Spielstand neue Versionen mit eingefügten Kapiteln/Schritten.
let CH=null;
const sig=st=>st? st.type+':'+(st.cmd||st.deck||st.target||st.answer||st.fr||(st.lines&&st.lines[0]?.fr)||'') : '';
function anchor(){ if(!CH) return; const ch=CH[P.chapter]; if(ch){ P.chapterId=ch.id; P.stepSig=sig(ch.steps[P.step]); }
  if(CH[P.unlocked]) P.unlockedId=CH[P.unlocked].id; if(P.furthest&&CH[P.furthest.chapter]) P.furthest.id=CH[P.furthest.chapter].id; }
export function save(){ anchor(); try{ localStorage.setItem(KEY,JSON.stringify(P)); }catch(e){} }
const LEGACY=['ch1','ch1b','ch2','ch3','ch4','ch8','ch5','ch9','ch6','ch7']; // Reihenfolge bis Version 22
export function attachCourse(chapters){ CH=chapters; const ids=chapters.map(c=>c.id); const idx=id=>ids.indexOf(id);
  if(!P.name){ save(); return; }
  const cid=P.chapterId ?? LEGACY[P.chapter], uid=P.unlockedId ?? LEGACY[P.unlocked], fid=P.furthest&&(P.furthest.id ?? LEGACY[P.furthest.chapter]);
  if(idx(cid)>=0) P.chapter=idx(cid); P.chapter=Math.max(0,Math.min(P.chapter|0,ids.length-1));
  if(idx(uid)>=0) P.unlocked=Math.max(idx(uid),P.chapter); else P.unlocked=Math.max(P.unlocked|0,P.chapter);
  if(P.furthest){ if(idx(fid)>=0) P.furthest.chapter=idx(fid); if(P.furthest.chapter<P.chapter) P.furthest={chapter:P.chapter,step:P.step}; }
  const steps=chapters[P.chapter].steps;
  if(P.stepSig && sig(steps[P.step])!==P.stepSig){ const j=steps.findIndex(st=>sig(st)===P.stepSig); if(j>=0) P.step=j; }
  P.step=Math.max(0,Math.min(P.step|0,steps.length-1));
  save();
  // Automatische Sicherung beim Start (höchstens alle 12 Stunden)
  const last=snapshots()[0]; if(!last || Date.now()-last.t>12*36e5) snapshot('Automatisch beim Start');
}
export function reset(){ snapshot('Vor dem Löschen'); for(const k in P) delete P[k]; Object.assign(P,fresh()); save(); }

// ---------- Sichern & Wiederherstellen ----------
// Code-Format: CHIEN1:<base64 von JSON>  – lässt sich kopieren, per Nachricht schicken, als Datei speichern
const b64e=str=>btoa(unescape(encodeURIComponent(str))), b64d=str=>decodeURIComponent(escape(atob(str)));
export function exportCode(){ return 'CHIEN1:'+b64e(JSON.stringify({...P, savedAt:Date.now()})); }
export function parseCode(code){
  const m=String(code||'').trim().match(/CHIEN1:([A-Za-z0-9+/=\s]+)/); if(!m) throw new Error('Kein gültiger Spielstand-Code');
  const d=JSON.parse(b64d(m[1].replace(/\s+/g,''))); if(typeof d!=='object'||!('items' in d)) throw new Error('Code unvollständig'); return d; }
export function importCode(code){ const d=parseCode(code); snapshot('Vor dem Laden'); for(const k in P) delete P[k]; Object.assign(P,fresh(),d); delete P.savedAt; save(); return P; }
const SKEY='chien_backups';
export function snapshots(){ try{ return JSON.parse(localStorage.getItem(SKEY)||'[]'); }catch(e){ return []; } }
export function snapshot(label){ try{ const list=snapshots(); list.unshift({label, t:Date.now(), name:P.name, chapter:P.chapter, treats:P.treats, words:Object.keys(P.items).length, code:exportCode()});
  localStorage.setItem(SKEY, JSON.stringify(list.slice(0,8))); }catch(e){} }
export function summary(d=P){ return `${d.name||'(noch kein Name)'} · Kapitel ${Math.min((d.chapter||0)+1,99)} · ${d.treats||0} 🦴 · ${Object.keys(d.items||{}).length} Einträge im Carnet`; }

// Eintrag lernen / Ergebnis buchen. quality: 2 = ohne Hilfe, 1 = mit Tipps, 0 = falsch
export function learn(key, entry, quality=1){
  const it=P.items[key] ??= { ...entry, box:1, seen:0, last:0, first:Date.now() };
  Object.assign(it, entry); it.seen++; it.last=Date.now();
  if(quality===2) it.box=Math.min(5,it.box+1); else if(quality===0) it.box=1;
  save(); return it;
}
export function items(){ return Object.entries(P.items).map(([k,v])=>({key:k,...v})).sort((a,b)=>a.last-b.last); }
// Wiederholung: schwache und lange nicht gesehene zuerst
export function dueItems(n=5, filter=()=>true){
  const now=Date.now(), day=864e5;
  return items().filter(filter).map(it=>({it, prio:(6-it.box)*2 + Math.min(10,(now-it.last)/day) + Math.random()}))
    .sort((a,b)=>b.prio-a.prio).slice(0,n).map(x=>x.it);
}
