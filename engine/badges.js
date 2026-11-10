// =============================================================
//  ABZEICHEN & MEILENSTEINE (ohne Serie/Streak – nichts geht verloren)
//  + Statistik für den Wochenrückblick der Eltern
// =============================================================
import { P, save } from './progress.js';
import { DECKS } from '../content/vocab.js';
import { COURSE } from '../content/course.js';

function ensure(){ P.stats ??= { tasks:0, pet:0, fetch:0, shown:0, bought:0, days:{} }; P.stats.days ??= {}; P.badges ??= {}; }
ensure();
const today=()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export function track(k,n=1){ ensure(); const S=P.stats; S[k]=(S[k]||0)+n; if(k==='tasks'){ S.days[today()]=(S.days[today()]||0)+n; } save(); }

const words=()=>Object.keys(P.items||{}).filter(k=>!k.startsWith('d:')).length; // nur wirklich geübte Wörter (nicht nur angetippte)
const results=()=>Object.values(P.results||{});
const deckDone=id=>{ const D=DECKS[id]; return D ? D.words.every(w=>P.items['v:'+w.fr]) : false; };
const deckCount=id=>{ const D=DECKS[id]; return D ? D.words.filter(w=>P.items['v:'+w.fr]).length : 0; };

// reward: Gegenstand für Juna (wird geschenkt; hat sie ihn schon → Leckerlis)
export const BADGES=[
  { id:'w10',  pic:'🌱', fr:'Premiers mots',      de:'10 Wörter gelernt',  have:words, need:10,  reward:'noeud' },
  { id:'w25',  pic:'📗', fr:'Petit lecteur',      de:'25 Wörter gelernt',  have:words, need:25,  reward:'bandana' },
  { id:'w50',  pic:'📘', fr:'Grand lecteur',      de:'50 Wörter gelernt',  have:words, need:50,  reward:'collier' },
  { id:'w100', pic:'💯', fr:'Cent mots !',        de:'100 Wörter gelernt', have:words, need:100, reward:'casquette' },
  { id:'w200', pic:'🎓', fr:'Champion des mots',  de:'200 Wörter gelernt', have:words, need:200, reward:'chapeau' },
  { id:'w300', pic:'👑', fr:'Roi des mots',       de:'300 Wörter gelernt', have:words, need:300, reward:'couronne' },
  { id:'task50',  pic:'✅', fr:'Bon travail',     de:'50 Aufgaben gelöst',  have:()=>P.stats.tasks, need:50 },
  { id:'task200', pic:'🏋️', fr:'Super travail',   de:'200 Aufgaben gelöst', have:()=>P.stats.tasks, need:200 },
  { id:'med1',  pic:'🎖️', fr:'Première médaille', de:'Erste Hundeshow geschafft', have:()=>results().length, need:1 },
  { id:'gold1', pic:'🥇', fr:'Médaille d’or',     de:'Erste Goldmedaille',          have:()=>results().filter(r=>r.best>=90).length, need:1 },
  { id:'gold5', pic:'🏆', fr:'Cinq fois l’or',    de:'5 Goldmedaillen',             have:()=>results().filter(r=>r.best>=90).length, need:5 },
  { id:'ch3',   pic:'🗺️', fr:'En route !',        de:'3 Kapitel abgeschlossen',     have:()=>results().length, need:3 },
  { id:'chall', pic:'🧳', fr:'Le grand voyage',   de:'Alle Kapitel abgeschlossen',  have:()=>results().length, need:()=>COURSE.chapters.length },
  { id:'mois',  pic:'📅', fr:'Les douze mois',    de:'Alle Monate gelernt',         have:()=>deckCount('mois'), need:12 },
  { id:'jours', pic:'🗓️', fr:'La semaine',        de:'Alle Wochentage gelernt',     have:()=>deckCount('jours'), need:7 },
  { id:'nombres', pic:'🔢', fr:'Je sais compter', de:'Zahlen 1–12 gelernt',         have:()=>deckCount('nombres'), need:12 },
  { id:'cent',  pic:'💯', fr:'Jusqu’à cent',      de:'Alle großen Zahlen gelernt',  have:()=>deckCount('nombres2')+deckCount('nombres3'), need:15 },
  { id:'trick1', pic:'🎪', fr:'Premier tour',     de:'Erstes Kunststück',           have:()=>Object.keys(P.tricks||{}).length, need:1 },
  { id:'trick5', pic:'🌟', fr:'Star du cirque',   de:'Alle 5 Kunststücke',          have:()=>Object.keys(P.tricks||{}).length, need:5 },
  { id:'show10', pic:'🎭', fr:'Le spectacle',     de:'10 Kunststücke vorgeführt',   have:()=>P.stats.shown||0, need:10 },
  { id:'h50',   pic:'💖', fr:'Meilleurs amis',    de:'50 Herzen gesammelt',         have:()=>P.hearts||0, need:50 },
  { id:'h150',  pic:'💞', fr:'Amis pour la vie',  de:'150 Herzen gesammelt',        have:()=>P.hearts||0, need:150 },
  { id:'pet25', pic:'🤗', fr:'Câlins',            de:'25-mal gestreichelt',         have:()=>P.stats.pet||0, need:25 },
  { id:'fetch10', pic:'🎾', fr:'Champion de la balle', de:'10-mal Ball geholt',     have:()=>P.stats.fetch||0, need:10 },
  { id:'shop1', pic:'🛍️', fr:'Premier achat',     de:'Zum ersten Mal eingekauft',   have:()=>P.stats.bought||0, need:1 },
  { id:'mode',  pic:'🕶️', fr:'Chien à la mode',   de:'Etwas angezogen',             have:()=>Object.keys(P.wear||{}).length, need:1 },
];
const needOf=b=>typeof b.need==='function'?b.need():b.need;

// prüft alle Abzeichen; neue werden zurückgegeben (Reihenfolge = Liste)
export function checkBadges(){ ensure(); const fresh=[];
  for(const b of BADGES){ if(P.badges[b.id]) continue; let h=0; try{ h=b.have(); }catch(e){} if(h>=needOf(b)){ P.badges[b.id]=Date.now(); fresh.push(b); } }
  if(fresh.length) save(); return fresh; }
export function progressOf(b){ let h=0; try{ h=b.have(); }catch(e){} return { have:Math.min(h,needOf(b)), need:needOf(b) }; }

// ---------- Wochenrückblick ----------
export function weekReport(){ ensure(); const day=864e5, now=Date.now(), from=now-7*day; const S=P.stats; const days=[], dayN=[];
  for(let i=6;i>=0;i--){ const d=new Date(now-i*day); const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    days.push(d.toLocaleDateString('de-DE',{weekday:'short'})); dayN.push(S.days?.[k]||0); }
  const its=Object.values(P.items||{});
  const fresh=its.filter(i=>i.first&&i.first>=from);
  const shaky=its.filter(i=>i.box<=1&&i.seen>=2).sort((a,b)=>b.seen-a.seen).slice(0,10);
  const strong=its.filter(i=>i.box>=4).length;
  const badges=BADGES.filter(b=>P.badges[b.id]>=from);
  return { days, dayN, practiced:dayN.filter(n=>n>0).length, tasks:dayN.reduce((a,b)=>a+b,0), fresh, shaky, strong, total:its.length, badges }; }
