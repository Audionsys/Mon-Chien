// Sprachwerkzeuge: Normalisieren, Tippfehler-Toleranz, Kommando-Erkennung
import { COMMANDS, GERMAN_WORDS } from '../content/commands.js';

export function norm(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
  .replace(/[’'`]/g,' ').replace(/[^a-z0-9\s-]/g,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim(); }
export function lev(a,b){ const m=a.length,n=b.length; if(!m) return n; if(!n) return m; let prev=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){ const cur=[i]; for(let j=1;j<=n;j++) cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1)); prev=cur; } return prev[n]; }
const tol=s=>s.length<=3?0:s.length<=5?1:2;

const FILLER=['s il te plait','s il vous plait','stp','allez','vas y','maintenant','oui','hop'];
// Ergebnis: {type:'ok'|'close'|'name'|'german'|'unknown'|'empty', id?, polite?}
export function parseCommand(raw, dogName){
  let s=norm(raw); const polite=/s il te plait|s il vous plait|stp/.test(s);
  const nn=norm(dogName||''); if(nn && s===nn) return {type:'name'};
  if(nn) s=s.replace(new RegExp('(^| )'+nn+'( |$)','g'),' ').trim();
  for(const f of FILLER) s=s.replace(new RegExp('(^| )'+f+'( |$)','g'),' ').trim();
  if(!s) return {type:'empty'};
  for(const id in COMMANDS) if(COMMANDS[id].variants.some(v=>norm(v)===s)) return {type:'ok',id,polite};
  if(GERMAN_WORDS.includes(s)) return {type:'german'};
  let best=null; for(const id in COMMANDS) for(const v of COMMANDS[id].variants){ const nv=norm(v), d=lev(s,nv); if(d<=tol(nv) && (!best||d<best.d)) best={id,d}; }
  if(best) return {type:'close',id:best.id,polite};
  return {type:'unknown'};
}
// Freitext gegen eine Liste richtiger Antworten prüfen
export function checkAnswer(raw, answers){
  const s=norm(raw); let best=null;
  for(const a of answers){ const na=norm(a); if(na===s) return {ok:true,exact:true,want:a}; const d=lev(s,na); if(d<=tol(na)&&(!best||d<best.d)) best={d,want:a}; }
  return best? {ok:true,exact:false,want:best.want} : {ok:false};
}
export function missingAccent(raw, want){ return /[éèêàçôûîëï]/i.test(want) && !/[éèêàçôûîëï]/i.test(raw); }
