// Start: alles zusammenstecken
import * as THREE from 'three';
import { createWorld, buildWorld } from './scene.js';
import { Dog } from './dog.js';
import { Runner, solutionOf, help, stepLabel, markFurthest } from './steps.js';
import { P, save, reset, items, exportCode, importCode, parseCode, snapshots, snapshot, summary, attachCourse } from './progress.js';
import { COURSE as _C } from '../content/course.js';
attachCourse(_C.chapters);
import { parseCommand } from './lang.js';
import { COMMANDS } from '../content/commands.js';
import { COURSE } from '../content/course.js';
import { WORLD } from '../content/world.js';
import { BETISES } from '../content/betises.js';
import { DECKS } from '../content/vocab.js';
import { BANTER } from '../content/banter.js';
import { learn } from './progress.js';
import { ITEMS } from '../content/items.js';
import { equip, unequipSlot, buildItem, nombre } from './items.js';
import * as A from './audio.js';
import * as UI from './ui.js';
import * as Coco from './coco.js';
import { track, checkBadges, BADGES, progressOf, weekReport } from './badges.js';
import { DOGS, DOG, chooseDog } from '../content/dog.js';
const { $, N, esc } = UI;

UI.setNameFn(()=>P.name||'Filou'); UI.setFemFn(()=>P.gender==='f');
const world=createWorld($('c'));
let room=buildWorld(world, WORLD);
const roomDef=id=>WORLD.rooms.find(r=>r.id===id);
const dogRoom=()=>room.roomOf(dog.root.position).id;
const dog=new Dog(world, room, A.sfx);
A.preloadMusic('music.mp3');

// ---------- Effekte ----------
function headScreen(){ const p=dog.headWorld(); p.y+=0.22; p.project(world.camera); return {x:(p.x*0.5+0.5)*innerWidth, y:(-p.y*0.5+0.5)*innerHeight}; }
const fx={ hearts(n=3){ const s=headScreen(); UI.floatFx(s.x,s.y,['❤️','💛','✨','🧡'],n); } };
dog.on('say',(t,ms)=>UI.dogSay(t,ms)); dog.on('hearts',n=>fx.hearts(n));
export const VERSION='47';
try{ document.getElementById('ver').textContent='v'+VERSION; }catch(e){}
function toast(html,ms=2600){ const t=$('toast'); t.innerHTML=N(html); t.classList.add('on'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('on'),ms); }

// ---------- Spiel-Objekt für die Schritte ----------
const g={ world, room, dog, fx,
  command(id){ dog.do(COMMANDS[id].action); A.say(COMMANDS[id].fr); },
  freeCommand(raw){ const r=parseCommand(raw,P.name);
    if(r.type==='name'){ dog.name(); return; }
    if(r.type==='ok'||r.type==='close'){ dog.do(COMMANDS[r.id].action); toast(`<b class="fr">${COMMANDS[r.id].fr}</b> = ${COMMANDS[r.id].de}`); return; }
    dog.tilt(); toast(r.type==='german'? "🦜 <b class=\"fr\">{N} ne comprend pas l'allemand !</b>" : `🦜 <b class="fr">« ${esc(raw)} »</b> kennt {N} noch nicht.`); },
};
Coco.initCoco();
$('cocoAv').addEventListener('click',()=>{ const t=$('bubble').querySelector('.mission, .fr'); if(t) A.say(t.innerText.replace(/🔊/g,'')); else Coco.laugh(1500); });
function screenOf(id){ const p=room.props.get(id); if(!p||!p.object) return null; const b=new THREE.Box3().setFromObject(p.object); const c=b.getCenter(new THREE.Vector3()); c.y=(c.y+b.max.y)/2;
  c.project(world.camera); if(c.z>1||Math.abs(c.x)>1.05||Math.abs(c.y)>1.05) return null; return {x:(c.x+1)/2*innerWidth, y:(1-c.y)/2*innerHeight}; }
g.cocoPoint=(id)=>{ const s=screenOf(id); if(s) Coco.pointAt(s.x,s.y); };
g.celebrate=()=>Coco.celebrate(); g.openDogs=openDogs;
const run=new Runner(g);

// ---------- Freundschaft: Sympathie-Herzen & Kunststücke ----------
P.hearts ??= 0; P.tricks ??= {};
const TRICKS=[ {id:'mort',need:10,pic:'😵'}, {id:'roule',need:25,pic:'🔄'}, {id:'beau',need:45,pic:'🙏'}, {id:'danse',need:70,pic:'💃'}, {id:'bisou',need:100,pic:'💋'} ];
const LIKES={
  caresse:{n:1,cd:12,fr:'les caresses',de:'Streicheln',how:'Tippe auf {N} – das ist <b class="fr">une caresse</b>.'},
  lob:{n:1,cd:20,fr:'les compliments',de:'Lob',how:'Lob {N}: <b class="fr">Bon chien !</b> oder <b class="fr">Je t\'aime !</b>'},
  jeu:{n:2,cd:0,fr:'jouer à la balle',de:'Ballspielen',how:'Sag <b class="fr">Apporte la balle !</b>'},
  friandise:{n:2,cd:0,fr:'les friandises',de:'Leckerlis',how:'Gib {N} ein Leckerli aus dem 🦴-Coffre und sag <b class="fr">Tiens !</b>'},
  panier:{n:1,cd:60,fr:'son panier',de:'das Körbchen',how:'Sag <b class="fr">Va au panier !</b>'},
  aide:{n:1,cd:0} };
const lastLike={};
function todayWish(){ const day=new Date().toDateString(); if(!P.wish||P.wish.day!==day){
    const ks=['caresse','lob','jeu','panier']; if(Object.keys(P.inv||{}).some(id=>ITEMS[id]?.kind==='treat')) ks.push('friandise');
    P.wish={day,kind:ks[Math.floor(Math.random()*ks.length)],done:false}; save(); } return P.wish; }
function renderHearts(pop){ const e=$('hearts'); if(!e) return; e.textContent=P.hearts; if(pop){ const b=$('heartBtn'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } }
function love(kind){ const L=LIKES[kind]; if(!L||!P.name) return; const now=Date.now(); if(L.cd && now-(lastLike[kind]||0)<L.cd*1000) return; lastLike[kind]=now;
  let n=L.n, bonus=false; const w=todayWish(); if(w.kind===kind&&!w.done){ w.done=true; n+=5; bonus=true; }
  P.hearts+=n; save(); renderHearts(true);
  if(bonus){ A.sfx.success(); fx.hearts(8); setTimeout(()=>toast(`💖 <b class="fr">{N} adore ${LIKES[kind].fr} !</b><br>Herzenswunsch erfüllt: <b>+5 ❤️</b>`,4200),500); }
  const t=TRICKS.find(t=>!P.tricks[t.id]&&P.hearts>=t.need); if(t) setTimeout(()=>trickSurprise(t),bonus?4200:1800); }
g.love=love;
dog.on('liked',love);
dog.on('liked',k=>{ if(k==='caresse') track('pet'); if(k==='jeu') track('fetch'); badgeCheck(); });
dog.on('trickDone',()=>{ track('shown'); badgeCheck(); });
// ---------- Abzeichen ----------
const badgeQ=[]; let badgeBusy=false;
function badgeCheck(){ for(const b of checkBadges()) badgeQ.push(b); pumpBadge(); }
function pumpBadge(){ if(badgeBusy||!badgeQ.length) return; if(!started||UI.sheetIsOpen()||$('giftBox').classList.contains('open')||MIS.active||cocoSaved||Coco.isFlying()){ setTimeout(pumpBadge,2500); return; }
  badgeBusy=true; const b=badgeQ.shift(); let rw='';
  if(b.reward&&ITEMS[b.reward]){ const it=ITEMS[b.reward]; if(P.inv[b.reward]||Object.values(P.wear||{}).includes(b.reward)){ P.treats+=15; rw=`<p>🎁 Belohnung: <b>+15 🦴</b></p>`; } else { addItem(b.reward); rw=`<p>🎁 Geschenk für {N}: <b>${it.pic} <span class="fr">${esc(it.fr)}</span></b> – liegt im Coffre!</p>`; } save(); run.renderTop?.(); }
  const box=$('giftBox'); box.innerHTML=`<div class="gb opened badge"><div class="in"><span class="pic">${b.pic}</span><small>🏆 Neues Abzeichen</small><b class="fr">${esc(b.fr)}</b><small>${esc(b.de)}</small>${N(rw)}<button class="big" id="giftOk">Super !</button></div></div>`;
  box.classList.add('open'); A.sfx.applause?.(); A.sfx.success(); fx.hearts(6); Coco.celebrate(); A.say(b.fr);
  box.querySelector('#giftOk').onclick=()=>{ box.classList.remove('open'); badgeBusy=false; setTimeout(pumpBadge,800); }; }
g.badgeCheck=badgeCheck; g.track=track;
function openBadges(){ P.badges??={}; const got=BADGES.filter(b=>P.badges[b.id]).length;
  UI.openSheet(`🏆 Abzeichen (${got}/${BADGES.length})`, `<p class="sub">Sammle Abzeichen! Für viele gelernte Wörter bekommt {N} außerdem ein Geschenk. Nichts davon geht je verloren.</p>
    <div class="badges">${BADGES.map(b=>{ const on=P.badges[b.id]; const pr=progressOf(b); return `<div class="badge${on?' on':''}"><span class="pic">${on?b.pic:'🔒'}</span><b class="fr">${esc(b.fr)}</b><small>${esc(b.de)}</small>${on?`<small class="d">✓ ${new Date(on).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</small>`:`<div class="bp"><i style="width:${Math.round(pr.have/pr.need*100)}%"></i></div><small class="d">${pr.have}/${pr.need}${b.reward?' · 🎁':''}</small>`}</div>`; }).join('')}</div>`.replace(/\{N\}/g,esc(N('{N}')))); }
function openWeek(){ const W=weekReport(); const max=Math.max(1,...W.dayN);
  UI.openSheet('📅 Wochenrückblick (für Eltern)', `<p class="sub">Die letzten 7 Tage: an <b>${W.practiced}</b> Tagen geübt · <b>${W.tasks}</b> Aufgaben gelöst · <b>${W.fresh.length}</b> neue Wörter · insgesamt <b>${W.total}</b> Einträge im Carnet, davon <b>${W.strong}</b> schon sicher.</p>
    <div class="wk">${W.days.map((d,i)=>`<div><i style="height:${Math.round(W.dayN[i]/max*70)+(W.dayN[i]?6:2)}px"></i><small>${W.dayN[i]||''}</small><b>${d}</b></div>`).join('')}</div>
    <h3>🆕 Neu gelernt</h3>${W.fresh.length?W.fresh.slice(-20).reverse().map(i=>`<div class="entry"><div class="x"><div class="f">${esc(N(i.fr||''))}</div><div class="d">${esc(N(i.de||''))}</div></div></div>`).join(''):'<p class="sub">Diese Woche noch nichts Neues.</p>'}
    <h3>🔁 Wackelt noch (öfter geübt, noch nicht sicher)</h3>${W.shaky.length?W.shaky.map(i=>`<div class="entry"><div class="x"><div class="f">${esc(N(i.fr||''))}</div><div class="d">${esc(N(i.de||''))} · ${i.seen}× geübt</div></div></div>`).join(''):'<p class="sub">Nichts – super! 🎉</p>'}
    <h3>🏆 Neue Abzeichen</h3><p>${W.badges.length?W.badges.map(b=>`${b.pic} ${esc(b.fr)}`).join(' · '):'<span class="sub">Keine diese Woche.</span>'}</p>`); }
dog.on('kiss',()=>{ fx.hearts(16); A.sfx.pop(); A.sfx.applause?.(); const k=document.createElement('div'); k.className='kiss'; k.textContent='💋'; document.body.appendChild(k); setTimeout(()=>k.remove(),1600); });
{ const _do=dog.do.bind(dog); dog.do=(a,ctx)=>{ if(a&&a.do==='trick'&&!P.tricks[a.id]&&!testMode){ const t=TRICKS.find(x=>x.id===a.id); dog.tilt();
      toast(`🦜 Das kann {N} noch nicht! Bei <b>${t.need} ❤️</b> zeigt er es dir – noch ${t.need-P.hearts} Herzen. Tipp oben auf ❤️.`,4200); return; } return _do(a,ctx); }; }
function trickSurprise(t){ if(P.tricks[t.id]) return; if(MIS.active||UI.sheetIsOpen()||pendingGive||cocoSaved||$('giftBox').classList.contains('open')){ setTimeout(()=>trickSurprise(t),4000); return; }
  P.tricks[t.id]=1; save(); const c=COMMANDS[t.id]; interruptCoco();
  UI.coco(`<span class="tutostep">❤️ ${t.need} Herzen!</span>${UI.frLine("{N} a une surprise pour toi !")}${UI.deLine('{N} hat dich so lieb, dass er dir ein Kunststück zeigt. Schau mal!')}`); A.say(N("{N} a une surprise pour toi !"));
  setTimeout(()=>dog.do({do:'trick',id:t.id}),1800);
  setTimeout(()=>{ A.sfx.applause?.(); A.sfx.success(); learn('cmd:'+t.id,{kind:'cmd',fr:c.fr,de:c.de,gram:c.gram||'🎪 Kunststück'},1);
    UI.coco(`<span class="newword"><span class="pic">${t.pic}</span><b class="fr">${esc(c.fr)}</b><small>${esc(c.de)}</small></span>${UI.deLine('Neues Kunststück! Ab jetzt kannst du es {N} jederzeit sagen.')}`); A.say(c.fr);
    UI.chips([{cls:'sol fr',html:esc(c.fr),onClick:()=>{ inp.value=c.fr; submit(); }},{html:'Weiter ➜',onClick:()=>restoreCoco(0)}]); }, 1800+6500); }
function openFriends(){ const next=TRICKS.find(t=>!P.tricks[t.id]); const prev=[...TRICKS].reverse().find(t=>P.tricks[t.id]); const from=prev?prev.need:0;
  const pct=next? Math.max(0,Math.min(100,(P.hearts-from)/(next.need-from)*100)) : 100; const w=todayWish(); const W=LIKES[w.kind];
  UI.openSheet(`❤️ ${esc(N('{N}'))} t'aime !`, `<p style="font-size:30px;margin:4px 0;text-align:center"><b>${P.hearts}</b> ❤️</p>
    <div class="hbar"><i style="width:${pct}%"></i></div>
    <p class="sub" style="text-align:center">${next? `Noch <b>${Math.max(0,next.need-P.hearts)} ❤️</b> bis zum nächsten Kunststück ${next.pic}` : 'Alle Kunststücke freigeschaltet! 🏆'}</p>
    <h3>🌟 Herzenswunsch heute</h3>
    <div class="row" style="cursor:default"><b class="fr">${esc(N(`{N} adore ${W.fr} !`))} ${w.done?'✅':''}</b><small>${N(W.how)} ${w.done?'– erfüllt!':'→ <b>+5 ❤️</b>'}</small></div>
    <h3>💕 Das mag ${esc(N('{N}'))}</h3>
    ${['caresse','lob','jeu','friandise','panier'].map(k=>`<div class="row" style="cursor:default"><b class="fr">${esc(N(`{N} aime ${LIKES[k].fr}.`))}</b><small>${esc(LIKES[k].de)} · ${N(LIKES[k].how)} (+${LIKES[k].n} ❤️)</small></div>`).join('')}
    <p class="sub">${N('Und jede gelöste Aufgabe freut {N}: +1 ❤️. Herzen gehen nie verloren.')}</p>
    <h3>🎪 Kunststücke</h3>
    ${TRICKS.map(t=>{ const c=COMMANDS[t.id], on=P.tricks[t.id]; return `<button class="row" data-t="${t.id}" ${on?'':'disabled'}><b class="fr">${t.pic} ${on?esc(c.fr):'🔒 ???'}</b><small>${on?esc(c.de)+' – antippen zum Vorführen':`ab ${t.need} ❤️`}</small></button>`; }).join('')}`,
    {onOpen:b=>b.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{ const c=COMMANDS[x.dataset.t]; UI.closeSheet(); inp.value=c.fr; submit(); })}); }


// ---------- Sachen: Geschenke, Boutique, Coffre ----------
P.inv ??= {}; P.wear ??= {};
function addItem(id,n=1){ P.inv[id]=(P.inv[id]||0)+n; save(); }
function randomItem(maxRare){ const ids=Object.keys(ITEMS).filter(id=>ITEMS[id].rare<=maxRare); const w=ids.map(id=>ITEMS[id].rare===maxRare?3:1); let r=Math.random()*w.reduce((a,b)=>a+b,0);
  for(let i=0;i<ids.length;i++){ r-=w[i]; if(r<=0) return ids[i]; } return ids[0]; }
g.gift=(maxRare=1)=>{ const id=randomItem(maxRare); const it=ITEMS[id]; addItem(id); A.sfx.success();
  const box=$('giftBox'); box.innerHTML=`<div class="gb"><div class="lid">🎁</div><div class="in"><span class="pic">${it.pic}</span><b class="fr">${esc(it.fr)}</b><small>${esc(it.de)}</small>
    <p class="fr">Un cadeau pour ${esc(N('{N}'))} !</p><button class="big" id="giftOk">${it.kind==='treat'?'Im Coffre 📦':it.kind==='toy'?'Im Coffre 📦':'Im Coffre 📦'}</button></div></div>`;
  box.classList.add('open'); setTimeout(()=>{ box.querySelector('.gb').classList.add('opened'); A.say(it.fr); A.sfx.applause(); },700);
  box.querySelector('#giftOk').onclick=()=>box.classList.remove('open'); return id; };
// Jedes angetippte Wort landet im Carnet unter "Entdeckt"
function collectWord(w){ const k='d:'+w.fr; if(!P.items[k]){ learn(k,{kind:'seen',fr:w.fr,de:w.de,gram:'👀 im Zimmer entdeckt'},1); } }
let pendingGive=null;
let cocoSaved=null;
function interruptCoco(){ if(cocoSaved) return; cocoSaved={ bubble:$('bubble').innerHTML, chips:[...$('chips').childNodes], think:$('think').className, thinkHtml:$('think').innerHTML, input:$('inputRow').style.display }; $('chips').replaceChildren(); UI.setInputMode('text'); }
function restoreCoco(delay=0){ setTimeout(()=>{ const S=cocoSaved; if(!S) return; cocoSaved=null; $('bubble').innerHTML=S.bubble; $('chips').replaceChildren(...S.chips);
  if(S.think){ $('think').className=S.think; $('think').innerHTML=S.thinkHtml; } else UI.thinkHide(); $('inputRow').style.display=S.input; }, delay); }
function give(id){ const it=ITEMS[id]; UI.closeSheet();
  if(it.kind==='wear'){ const on=P.wear[it.slot]===id; if(on){ delete P.wear[it.slot]; unequipSlot(dog,it.slot); toast(`${it.pic} abgelegt`); }
    else { P.wear[it.slot]=id; setTimeout(badgeCheck,2000); equip(dog,id); dog.happy(1500); fx.hearts(3); A.say(N(`{N} porte ${it.fr} !`)); toast(`<b class="fr">${esc(N('{N}'))} porte ${esc(it.fr)} !</b> = trägt ${esc(it.de)}`); } save(); return; }
  if(it.kind==='toy'){ const tid='toy:'+id; if(room.props.has(tid)){ toast('Liegt schon im Zimmer!'); return; }
    const obj=buildItem(id); const dp=dog.root.position; const p=room.clampPoint(new THREE.Vector3(dp.x+0.7,0,dp.z+0.5)); obj.position.set(p.x,0,p.z);
    room.addProp({id:tid,type:'toy',pos:[p.x,p.z],word:{fr:it.fr,de:it.de}}, obj); P.inv[id]--; if(P.inv[id]<=0) delete P.inv[id]; save(); A.sfx.bounce();
    const cmd='Apporte '+it.fr+' !'; interruptCoco();
    UI.coco(`${UI.frLine(`Voilà ${it.fr} ! On joue ?`)}${UI.deLine(`${esc(it.de)} liegt jetzt im Zimmer. Sag {N}, er soll es bringen: <b class="fr">${esc(cmd)}</b>`)}`);
    UI.chips([{cls:'sol fr',html:esc(cmd),onClick:()=>{ inp.value=cmd; submit(); }},{html:'✖ Später',onClick:()=>restoreCoco(0)}]); A.say(`Voilà ${it.fr} ! On joue ?`); return; }
  if(pendingGive) cancelGive(true);
  pendingGive=id; dog.faceCamera(); dog.happy(3000); interruptCoco(); UI.think(`<span class="pic">${it.pic}</span><span class="q">!</span>`);
  UI.coco(`${UI.frLine(`{N} veut ${it.fr} !`)}${UI.deLine(`{N} will ${esc(it.de)}! Gib es ihm: Sag <b class="fr">Tiens !</b> (= Hier, bitte!) – oder tippe einfach auf ihn.`)}`);
  UI.chips([{cls:'sol fr',html:'Tiens ! '+it.pic,onClick:()=>{ inp.value='Tiens !'; submit(); }},{html:'✖ Später',onClick:()=>cancelGive()}]);
  A.say(N(`{N} veut ${it.fr} !`));
}
function cancelGive(silent){ pendingGive=null; UI.thinkHide(); if(cocoSaved){ const S=cocoSaved; S.think=''; } restoreCoco(0); if(!silent) toast('Okay, das Leckerli bleibt im Coffre 📦'); }
function feed(){ const id=pendingGive; pendingGive=null; const it=ITEMS[id]; UI.thinkHide(); if(cocoSaved) cocoSaved.think=''; P.inv[id]--; if(P.inv[id]<=0) delete P.inv[id]; save();
  dog.eat(); UI.floatFx(innerWidth/2,innerHeight*0.45,[it.pic],1); UI.coco(`${UI.frLine(`Miam ! {N} adore ${it.fr} !`)}${UI.deLine(`Mmh! {N} liebt ${esc(it.de)}!`)}${UI.noteLine('📖 <b class="fr">Tiens !</b> = Hier, bitte! · <b class="fr">Miam !</b> = Mmh, lecker!')}`); $('chips').replaceChildren();
  A.say(N(`Miam ! {N} adore ${it.fr} !`)); restoreCoco(3500); }
function tryToyFetch(raw){ const s=raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  for(const [pid,p] of room.props){ if(!pid.startsWith('toy:')) continue; const w=p.word.fr.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); const base=w.replace(/^(le |la |les |l')/,'');
    if(/apporte|cherche|va chercher/.test(s) && s.includes(base.split(' ')[0])){ dog.fetch(pid); toast(`<b class="fr">${esc(raw)}</b> 👍`); if(cocoSaved) restoreCoco(1500); return true; } }
  return false; }
function openShop(tab='coffre'){
  const owned=Object.entries(P.inv).filter(([,n])=>n>0);
  const tabs=`<div class="tabs"><button class="${tab==='coffre'?'on':''}" data-tab="coffre">📦 Le coffre</button><button class="${tab==='shop'?'on':''}" data-tab="shop">🛍️ La boutique</button></div>`;
  let h=tabs;
  if(tab==='coffre'){
    h+=`<p class="sub">Tippe etwas an: Leckerli füttern, Spielzeug ins Zimmer legen, Accessoires anziehen.</p>`;
    h+= owned.length||Object.keys(P.wear).length? '<div class="grid">'+[...new Set([...owned.map(o=>o[0]),...Object.values(P.wear)])].map(id=>{ const it=ITEMS[id]; const worn=P.wear[it.slot]===id;
        return `<button class="itm${worn?' worn':''}" data-give="${id}"><span class="pic">${it.pic}</span><b class="fr">${esc(it.fr)}</b><small>${esc(it.de)}${P.inv[id]>1?' · ×'+P.inv[id]:''}${worn?' · trägt er':''}</small></button>`; }).join('')+'</div>'
      : '<div class="empty">Noch leer – gewinne Geschenke in der Hundeshow oder kauf etwas in der Boutique!</div>';
  } else {
    h+=`<p class="sub">Du hast <b>${P.treats} 🦴</b>. Coco sagt dir den Preis auf Französisch – tippe die richtige Zahl, um zu bezahlen!</p><div class="grid">`+
      Object.entries(ITEMS).map(([id,it])=>`<button class="itm" data-buy="${id}"><span class="pic">${it.pic}</span><b class="fr">${esc(it.fr)}</b><small>${esc(it.de)}</small><span class="price">🦴 ?</span></button>`).join('')+'</div>';
  }
  UI.openSheet(N('Les trésors de {N}'), h, {onOpen:b=>{
    b.querySelectorAll('[data-tab]').forEach(x=>x.onclick=()=>openShop(x.dataset.tab));
    b.querySelectorAll('[data-give]').forEach(x=>x.onclick=()=>give(x.dataset.give));
    b.querySelectorAll('[data-buy]').forEach(x=>x.onclick=()=>buy(x.dataset.buy));
  }});
}
function buy(id){ track('bought'); setTimeout(badgeCheck,2500); const it=ITEMS[id]; const pr=it.price; const fr=`${it.fr[0].toUpperCase()+it.fr.slice(1)}, ça coûte ${nombre(pr)} os.`;
  const opts=new Set([pr]); while(opts.size<3){ const d=[1,2,10,-1,-2,-10,5,20][Math.floor(Math.random()*8)]; const v=pr+d; if(v>0&&v<=100) opts.add(v); }
  A.say(fr);
  UI.openSheet('🛍️ La boutique', `<div class="buyhead"><span class="pic">${it.pic}</span><div><b class="fr">${esc(it.fr)}</b><small>${esc(it.de)}</small></div></div>
    <p class="fr" style="font-size:18px">🦜 « ${esc(fr)} » <button class="spk" data-say="${esc(fr)}">🔊</button></p>
    <p class="sub">Wie viel kostet es? Tippe die Zahl, die Coco sagt. Du hast ${P.treats} 🦴.</p>
    <div class="grid3">${[...opts].sort(()=>Math.random()-0.5).map(v=>`<button class="num" data-v="${v}">${v}</button>`).join('')}</div><p class="sub" id="buyMsg"></p>
    <button class="row" id="backShop"><b>⬅ Zurück zur Boutique</b></button>`, {onOpen:b=>{
      b.querySelector('#backShop').onclick=()=>openShop('shop');
      b.querySelectorAll('.num').forEach(x=>x.onclick=()=>{ const v=+x.dataset.v; const msg=b.querySelector('#buyMsg');
        if(v!==pr){ x.classList.add('bad'); A.sfx.soft_no(); A.say(nombre(v)); msg.innerHTML=`Das war <b>${v}</b> = <i>${nombre(v)}</i>. Hör nochmal genau hin! 🔊`; return; }
        if(P.treats<pr){ msg.innerHTML=`Richtig, <b>${pr}</b> = <i>${nombre(pr)}</i>! Aber du hast nur ${P.treats} 🦴 – sammle noch ein paar!`; A.sfx.pop(); return; }
        P.treats-=pr; addItem(id); run.renderTop(); A.sfx.success(); A.say('Merci ! Et voilà !');
        msg.innerHTML=`✅ <b>${pr} = ${nombre(pr)}</b> – gekauft! <b class="fr">Merci ! Et voilà !</b> Schau in den Coffre 📦`; b.querySelectorAll('.num').forEach(n=>n.disabled=true); }); }});
}
// Beim Laden: getragene Sachen wieder anziehen
function rewear(){ for(const slot in P.wear){ const id=P.wear[slot]; if(ITEMS[id]) equip(dog,id); } }
// Szene passend zum Kapitel wechseln
// Kapitel spielt in einem Raum: der Hund läuft selbst dorthin (keine Überblendung)
const ALLONS={ jardin:'Allons au jardin !', salon:'Allons au salon !', cuisine:'Allons dans la cuisine !', cellier:'Allons au cellier !', rue:'Allons dans la rue !', classe:'Allons au collège !' };
const ALLONS_DE={ jardin:'Gehen wir in den Garten!', salon:'Gehen wir ins Wohnzimmer!', cuisine:'Gehen wir in die Küche!', cellier:'Gehen wir in die Speisekammer!', rue:'Gehen wir auf die Straße!', classe:'Gehen wir in die Schule!' };
g.onStep=()=>{ if(!started) return; const ch=run.chapter; if(run.review||!ch) return; const want=ch.scene||'salon'; if(!roomDef(want)) return;
  if(dogRoom()!==want){ const c=room.centerOf(want); dog.walkTo(c[0],c[1],()=>dog.faceCamera()); sayQuip(ALLONS[want]||'Allons-y !', ALLONS_DE[want]||'Los geht’s!'); } };
function sayQuip(fr,de){ const q=$('quip'); const cb=$('coco').getBoundingClientRect(); q.style.setProperty('--quipTop',(cb.bottom+8)+'px');
  q.innerHTML=`<span class="fr">${UI.wrap(fr)}</span><small>${esc(N(de))}</small>`; q.classList.add('on'); A.say(N(fr),{rate:1.0}); Coco.laugh(2600); clearTimeout(q._t3); q._t3=setTimeout(()=>q.classList.remove('on'),4200); }
function switchScene(id){ const c=room.centerOf(id); dog.root.position.set(c[0],0,c[1]); dog.mode='idle'; dog.target=null; dog.setPose(0,0); }

// ---------- Partikel (Federn, Erde) ----------
const particles=(()=>{ const list=[]; const geo=new THREE.PlaneGeometry(0.05,0.03);
  const mats={ feather:new THREE.MeshBasicMaterial({color:'#fffdf5',side:THREE.DoubleSide,transparent:true}), dirt:new THREE.MeshBasicMaterial({color:'#6b4423',side:THREE.DoubleSide,transparent:true}), flour:new THREE.MeshBasicMaterial({color:'#fffdf8',side:THREE.DoubleSide,transparent:true}) };
  return { spawn(kind,pos,n=kind==='feather'?5:6){ for(let i=0;i<n;i++){ const m=new THREE.Mesh(geo,mats[kind].clone()); m.position.copy(pos); world.scene.add(m);
        const v=new THREE.Vector3((Math.random()-0.5)*1.2,0.6+Math.random()*1.1,(Math.random()-0.5)*1.2); list.push({m,v,life:kind==='dirt'?1.2:3.0,kind:kind==='flour'?'feather':kind,spin:Math.random()*6}); } },
    update(dt){ for(let i=list.length-1;i>=0;i--){ const p=list[i]; p.life-=dt; const drag=p.kind==='feather'?2.2:0.3; p.v.y-=(p.kind==='feather'?1.2:6)*dt; p.v.multiplyScalar(1-drag*dt);
        p.m.position.addScaledVector(p.v,dt); if(p.m.position.y<0.01){ p.m.position.y=0.01; p.v.set(0,0,0); } p.m.rotation.x+=p.spin*dt; p.m.rotation.y+=p.spin*0.7*dt;
        p.m.material.opacity=Math.min(1,p.life); if(p.life<=0){ world.scene.remove(p.m); p.m.material.dispose(); list.splice(i,1); } } },
    clear(){ list.forEach(p=>{ world.scene.remove(p.m); }); list.length=0; } }; })();
dog.on('particles',(k,pos)=>particles.spawn(k,pos));

// ---------- Quatsch-System ----------
const MIS={ active:null, saved:null, lastInput:performance.now(), next:45000+Math.random()*20000 };
function bump(){ MIS.lastInput=performance.now(); }
function canMischief(){ return started && !!P.name && P.chapter>0 && !MIS.active && !pendingGive && !cocoSaved && !$('sheet').classList.contains('open') && run.step && run.step.type!=='name' && document.activeElement!==inp; }
function startMischief(kind){ Coco.laugh(3000);
  const list=roomDef(dogRoom())?.betises||[]; kind=kind||list[Math.floor(Math.random()*list.length)]; const B=BETISES[kind]; if(!B) return;
  if(!dog.mischief(kind)) return;
  const X = kind==='dig'? (dogRoom()==='jardin'? 'les fleurs' : 'la plante') : '';
  MIS.active={kind,B,t:performance.now(),hint:0};
  const chipsEl=$('chips'); MIS.saved={ bubble:$('bubble').innerHTML, chips:[...chipsEl.childNodes], think:$('think').className, thinkHtml:$('think').innerHTML, input:$('inputRow').style.display };
  chipsEl.replaceChildren(); UI.thinkHide(); UI.setInputMode('text');
  const fr=B.fr.replace('{X}',X);
  UI.coco(`<span class="mission fr">${UI.wrap(fr)}</span><button class="spk" data-say="${esc(N(fr))}">🔊</button>${UI.deLine(B.de)}`); A.say(N(fr));
  UI.chips([{cls:'help',html:'💡 Was sag ich?',onClick:()=>misHint()}]);
  MIS.hintT=setTimeout(misHint,9000); MIS.endT=setTimeout(()=>endMischief(false,'tired'),28000);
}
function misHint(){ const M=MIS.active; if(!M) return; M.hint++; const best=COMMANDS[M.B.stop[0]];
  UI.coco($('bubble').innerHTML.replace(/<span class="tip">.*$/s,'')+UI.tipLine(M.B.tip),{chirp:false});
  UI.chips([{cls:'sol fr',html:best.fr,onClick:()=>{ inp.value=best.fr; inp.focus(); A.say(best.fr); }},{html:'🔊',onClick:()=>A.say(best.fr)}]); }
function endMischief(stopped,how,id){
  const M=MIS.active; if(!M) return; clearTimeout(MIS.hintT); clearTimeout(MIS.endT); MIS.active=null; MIS.next=60000+Math.random()*40000; bump();
  if(how==='tired'){ dog.stopMischief(); dog.WT.shame=0; }
  let h='';
  if(how==='good'){ const c=COMMANDS[id]; const clean=M.hint===0; P.treats+= clean?2:1; save(); run.renderTop(); A.sfx.success(); setTimeout(()=>A.sfx.treat(),400);
    learn('cmd:'+id,{kind:'cmd',cmd:id,fr:c.fr,de:c.de,gram:c.gram},clean?2:1);
    h=`<span class="mission fr">Ouf ! {N} arrête.</span> <span class="de" style="display:inline">+${clean?2:1} 🦴</span>${UI.noteLine(`📖 <b class="fr">${c.fr}</b> = ${c.de}`)}`; A.say('Ouf ! Bravo !'); }
  else if(how==='other'){ const c=COMMANDS[id]; h=`<span class="mission fr">Ça marche aussi !</span>${UI.deLine(`Klappt auch! <b class="fr">${c.fr}</b> = ${c.de}. Nächstes Mal probier: <b class="fr">${COMMANDS[M.B.stop[0]].fr}</b>`)}`; }
  else h=`<span class="mission fr">Ouf… {N} est fatigué.</span>${UI.deLine(`{N} hat von allein aufgehört. Nächstes Mal: <b class="fr">${COMMANDS[M.B.stop[0]].fr}</b>`)}`;
  UI.coco(h); $('chips').replaceChildren(); setTimeout(()=>quip('betise',true),3600);
  setTimeout(()=>{ if(MIS.active) return; const S=MIS.saved; if(!S) return; $('bubble').innerHTML=S.bubble; $('chips').replaceChildren(...S.chips);
    if(S.think){ $('think').className=S.think; $('think').innerHTML=S.thinkHtml; } $('inputRow').style.display=S.input; MIS.saved=null; }, 3200);
}
function mischiefInput(raw){ const r=parseCommand(raw,P.name); const M=MIS.active;
  if((r.type==='ok'||r.type==='close') && ['arrete','lache','non'].includes(r.id)){ dog.stopMischief(); endMischief(true,'good',r.id); return; }
  if(r.type==='ok'||r.type==='close'){ dog.do(COMMANDS[r.id].action); endMischief(true,'other',r.id); return; }
  dog.tilt(); misHint(); }
setInterval(()=>{ if(!canMischief()) return; if(performance.now()-MIS.lastInput>MIS.next) startMischief(); },2000);
let started=false;
// ---------- Neckereien zwischen Coco und dem Hund ----------
const BT={ last:0, lastIdx:-1 };
function quip(when, force){
  const now=performance.now(); if(!force && now-BT.last<25000) return; if(MIS.active||pendingGive||$('sheet').classList.contains('open')) return;
  const pool=BANTER.filter(b=>b.when===when); if(!pool.length) return; let b; do{ b=pool[Math.floor(Math.random()*pool.length)]; }while(pool.length>1 && BANTER.indexOf(b)===BT.lastIdx);
  BT.last=now; BT.lastIdx=BANTER.indexOf(b);
  const q=$('quip'); const cb=$('coco').getBoundingClientRect(); q.style.setProperty('--quipTop',(cb.bottom+8)+'px'); q.innerHTML=`<span class="fr">${UI.wrap(b.fr)}</span><small>${esc(N(b.de))}</small>`; q.classList.add('on'); A.sfx.coco(); A.say(N(b.fr),{rate:1.0}); Coco.laugh(2800);
  const av=$('cocoAv'); av.classList.remove('talk'); void av.offsetWidth; av.classList.add('talk');
  clearTimeout(q._t1); clearTimeout(q._t2); clearTimeout(q._t3);
  q._t1=setTimeout(()=>dog.react(b.dog), 1600);
  if(b.back){ q._t2=setTimeout(()=>{ q.innerHTML=`<span class="fr">${UI.wrap(b.back.fr)}</span><small>${esc(N(b.back.de))}</small>`; A.say(N(b.back.fr),{rate:1.0}); av.classList.remove('talk'); void av.offsetWidth; av.classList.add('talk'); }, 3600); }
  q._t3=setTimeout(()=>q.classList.remove('on'), b.back?7600:5200);
}
g.quip=quip;
setInterval(()=>{ if(!started||MIS.active) return; const idle=performance.now()-MIS.lastInput; if(idle>14000 && Math.random()<0.35) quip('idle'); },9000);
g.busy=()=>!!MIS.active;

// ---------- Eingabe ----------
const inp=$('inp');
function submit(){ const raw=inp.value.trim(); if(!raw) return; inp.value=''; A.audioCtx(); A.sfx.tap(); bump(); if(MIS.active) return mischiefInput(raw);
  if(pendingGive && /^(tiens|tenez|voila|voici|c est pour toi|pour toi|mange)/.test(raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/'/g,' '))){ feed(); return; }
  if(tryToyFetch(raw)) return; run.input(raw); }
$('send').onclick=submit;
$('helpBtn').onclick=()=>{ A.audioCtx(); A.sfx.tap(); bump(); if(MIS.active){ misHint(); return; }
  if(pendingGive){ toast('Sag <b class="fr">Tiens !</b> oder tippe auf den Hund 🐶'); return; }
  const r=run.helpNow(); const st=run.step;
  if(r==='joker'){ toast('In der Hundeshow gibt es nur den 🃏 Joker – den findest du unten.'); return; }
  if(r==='none'){ const ty=st?.type; toast( ty==='intro'||ty==='dialogue'||ty==='tuto'? 'Lies, was Coco sagt (🔊 zum Anhören), dann tippe unten auf den gelben Knopf ➜' : run.solved? 'Geschafft! Tippe unten auf <b>Weiter ➜</b>' : 'Mehr Tipps gibt es hier nicht – schau auf Cocos Sprechblase 🦜'); } };
inp.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); submit(); } });
// Hardware-Tastatur (iPad/PC): Tippen landet immer im Eingabefeld, auch wenn es keinen Fokus hat
document.addEventListener('keydown',e=>{
  if(!started||e.metaKey||e.ctrlKey||e.altKey&&e.key.length!==1) return;
  const a=document.activeElement; if(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.isContentEditable)) return;
  if(UI.sheetIsOpen()||inp.disabled||getComputedStyle($('inputRow')).display==='none') {
    if(e.key==='Enter'||e.key==='Escape'){ if(UI.sheetIsOpen()&&e.key==='Escape') UI.closeSheet(); } return; }
  if(e.key==='Enter'){ const w=[...document.querySelectorAll('#chips button')].find(b=>/Weiter|C'est parti|OK/.test(b.textContent)); if(w){ e.preventDefault(); w.click(); } else inp.focus(); return; }
  if(e.key==='Dead'){ inp.focus(); return; }
  if(e.key.length===1||e.key==='Backspace'){ e.preventDefault(); inp.focus(); const end=inp.value.length;
    inp.value= e.key==='Backspace'? inp.value.slice(0,-1) : inp.value+e.key; inp.setSelectionRange(end+1,end+1); inp.dispatchEvent(new Event('input')); }
});
inp.addEventListener('input',()=>{ if(/\n/.test(inp.value)){ inp.value=inp.value.replace(/\n/g,''); submit(); } });
// Tastatur auf dem Handy: Eingabezeile über die Tastatur schieben (im Vollbild legt sich die Tastatur sonst darüber)
if(window.visualViewport){ const vv=visualViewport; const kb=()=>{ if(IOS && (scrollY||document.documentElement.scrollTop)) scrollTo(0,0); const h=Math.max(0, innerHeight-vv.height-vv.offsetTop); $('bottom').style.bottom= h>60? h+'px' : ''; layoutBubble(); };
  vv.addEventListener('resize',kb); vv.addEventListener('scroll',kb); }
document.querySelectorAll('#accents button').forEach(b=>b.addEventListener('pointerdown',e=>{ e.preventDefault(); const c=b.dataset.c; const s=inp.selectionStart??inp.value.length; inp.value=inp.value.slice(0,s)+c+inp.value.slice(inp.selectionEnd??s); inp.setSelectionRange(s+1,s+1); }));
UI.initGloss();
document.addEventListener('click',e=>{ if(e.target.closest('#bubble .w')) setTimeout(()=>run.event('word'),900); });

// Mikrofon (nur wo der Browser es erlaubt)
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){ const mic=$('mic'); mic.style.display='block'; let rec=null, last='', alts=[], done=false, stopT=null;
  const finish=()=>{ if(done) return; done=true; clearTimeout(stopT); const t=(alts.find(a=>parseCommand(a,P.name).type==='ok')||last||'').trim();
    if(t){ inp.value=t; submit(); } else toast('🎤 Ich habe nichts verstanden – sprich deutlich und nah ans Mikro, oder tipp es ein.',3500); };
  mic.onclick=()=>{ if(rec){ try{ rec.stop(); }catch(e){} return; }
    try{ speechSynthesis.cancel(); }catch(e){}
    try{ rec=new SR(); rec.lang='fr-FR'; rec.maxAlternatives=3; rec.interimResults=true; rec.continuous=false; last=''; alts=[]; done=false;
      rec.onresult=e=>{ let txt=''; for(let k=0;k<e.results.length;k++) txt+=e.results[k][0].transcript; last=txt; inp.value=txt;
        const r=e.results[e.results.length-1]; if(r.isFinal){ alts=[...r].map(a=>a.transcript); finish(); try{ rec.stop(); }catch(_){} } };
      rec.onerror=e=>{ if(/not-allowed|service-not-allowed/.test(e.error)){ mic.style.display='none'; toast('🎤 Das Mikrofon ist hier gesperrt – tipp es einfach ein!'); done=true; }
        else if(e.error==='no-speech'){ /* finish() meldet sich */ } else if(e.error==='network') { toast('🎤 Spracherkennung braucht Internet.',3000); done=true; } };
      rec.onend=()=>{ mic.classList.remove('rec'); rec=null; inp.placeholder=N('Parle à {N}…'); finish(); };
      rec.start(); mic.classList.add('rec'); inp.value=''; inp.placeholder='🎤 Ich höre zu …';
      stopT=setTimeout(()=>{ try{ rec&&rec.stop(); }catch(e){} },7000); }catch(err){ mic.style.display='none'; rec=null; } }; }

// ---------- Tippen in der Szene ----------
const ndc=new THREE.Vector2(); let down=null;
$('c').addEventListener('pointerdown',e=>{ down={x:e.clientX,y:e.clientY}; bump(); });
// Aus dem Vollbild gefallen (z. B. Zurück-Taste)? Beim nächsten Tippen auf die Szene wieder Vollbild – nur auf Touch-Geräten
$('c').addEventListener('pointerup',()=>{ try{ if(started && matchMedia('(pointer:coarse)').matches && !matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches && !(document.fullscreenElement||document.webkitFullscreenElement)) goFullscreen(); }catch(e){} });
document.addEventListener('pointerdown',bump);
let lastTap=null; const GROUND=new Set(['rug','street','crosswalk','floor','path','grass']);
$('c').addEventListener('pointerup',e=>{
  if(!down) return; const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y); down=null; if(moved>12) return;
  A.audioCtx(); inp.blur(); bubbleMini(); ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);
  const ray=new THREE.Raycaster(); ray.setFromCamera(ndc,world.camera);
  const c=dog.root.position.clone(); c.y+=dog.H*0.5;
  if(ray.ray.distanceToPoint(c)<dog.H*0.55){ if(MIS.active){ UI.dogSay('?',800); misHint(); return; } if(pendingGive){ feed(); return; } dog.wake(); dog.praise('caresse'); UI.dogSay('♥',900); run.event('pet'); return; }
  const hit=room.pick(ndc,world.camera); if(!hit) return;
  const now=performance.now(); const dbl=!!(lastTap && now-lastTap.t<420 && Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<60); lastTap={t:now,x:e.clientX,y:e.clientY};
  if(hit.prop){ const p=hit.prop; const w=hit.part||p.word;
    // begehbare Flächen (Teppich, Straße, Zebrastreifen …): Wort sagen UND hinlaufen; Doppeltipp = rennen, Wort nicht nochmal
    const ground= GROUND.has(p.type) || (hit.point && hit.point.y<0.06);
    if(!(dbl&&ground)){ A.sfx.pop(); UI.wordLabel(e.clientX,e.clientY-10,w.fr,w.de); A.say(w.fr,{word:true}); collectWord(w); run.event('prop'); if(!MIS.active && run.prop(p)) return; }
    if(ground && hit.point && !MIS.active) dog.walkTo(hit.point.x,hit.point.z,null,{run:dbl});
    return; }
  if(hit.floor){ dog.walkTo(hit.floor.x,hit.floor.z,null,{run:dbl}); run.event('floor'); }
});

// ---------- Menü & Carnet ----------
// ---------- Textgröße (Aa-Knopf + mit zwei Fingern zoomen) ----------
const ZOOMS=[1,1.25,1.5,1.8]; const ZL=['normal','groß','sehr groß','riesig'];
const isPhone=Math.min(innerWidth,innerHeight)<560;
let uiz=(()=>{ try{ const v=localStorage.getItem('chien_uiz'); if(v!=null) return +v; }catch(e){} return isPhone?1.3:(Math.min(innerWidth,innerHeight)>700?1.2:1); })();
let zoomI=0;
// Sprechblase: maximale Höhe = Platz zwischen Coco oben und den Knöpfen unten
function layoutBubble(){ requestAnimationFrame(()=>{ const z=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--uiz'))||1;
  // Coco-Blase immer UNTER die Knopfleiste schieben (Notch/Kamera-Loch, Zoom, umgebrochene Leiste)
  let tb=0; $('top').querySelectorAll('*').forEach(el=>{ if(el.parentElement!==$('top')) return; const r=el.getBoundingClientRect(); if(r.height&&r.bottom>tb) tb=r.bottom; });
  if(tb){ const co0=$('coco'); const want=tb+6; co0.style.top=(want/z)+'px'; const got=co0.getBoundingClientRect().top;
    // Safari/iPad rechnet "zoom" bei fixed-Elementen anders – gemessen korrigieren
    if(got>1 && Math.abs(got-want)>2){ const f=got/(want/z); co0.style.top=(want/f)+'px'; } }
  const bot=$('bottom').getBoundingClientRect(), co=$('coco').getBoundingClientRect();
  const avail=Math.max(120,(bot.top-co.top-10))/z; document.documentElement.style.setProperty('--bubbleMax',avail+'px');
  const b=$('bubble'); b.classList.toggle('more', b.scrollHeight>b.clientHeight+4 && b.scrollTop+b.clientHeight<b.scrollHeight-4); }); }
addEventListener('resize',layoutBubble); document.addEventListener('fullscreenchange',()=>{ layoutBubble(); setTimeout(layoutBubble,400); }); setInterval(layoutBubble,3000);
// ---------- Kompakte Sprechblase (Handy): klappt nach dem Lesen ein, Tipp klappt auf ----------
const small=()=>Math.min(innerWidth,innerHeight)<600;
let miniT=null;
function bubbleOpen(){ const b=$('bubble'); b.classList.remove('mini'); clearTimeout(miniT); if(small()) miniT=setTimeout(()=>bubbleMini(),9000); layoutBubble(); }
function bubbleMini(){ if(!small()) return; const b=$('bubble'); if(b.querySelector('.newword,.build,.medal')) return; b.classList.add('mini'); layoutBubble(); }
document.getElementById('bubble').addEventListener('click',e=>{ const b=$('bubble'); if(b.classList.contains('mini')){ e.stopPropagation(); bubbleOpen(); } },true);
// Akzent-Tasten nur beim Tippen
inp.addEventListener('focus',()=>{ document.body.classList.add('typing'); bubbleMini(); layoutBubble(); });
inp.addEventListener('blur',()=>setTimeout(()=>{ if(document.activeElement!==inp){ document.body.classList.remove('typing'); layoutBubble(); } },250));
new MutationObserver(()=>{ $('bubble').scrollTop=0; bubbleOpen(); }).observe(document.getElementById('bubble'),{childList:true});
new MutationObserver(layoutBubble).observe(document.getElementById('chips'),{childList:true});
document.getElementById('bubble').addEventListener('scroll',()=>{ const b=$('bubble'); b.classList.toggle('more', b.scrollTop+b.clientHeight<b.scrollHeight-4); });
function applyZoom(save=true){ uiz=Math.max(0.85,Math.min(2.2,uiz)); document.documentElement.style.setProperty('--uiz',uiz.toFixed(3)); document.documentElement.style.setProperty('--uizb',Math.min(uiz,innerWidth<480?1.1:1.2).toFixed(3)); layoutBubble(); zoomI=ZOOMS.reduce((bi,z,i)=>Math.abs(z-uiz)<Math.abs(ZOOMS[bi]-uiz)?i:bi,0); if(save) try{ localStorage.setItem('chien_uiz',uiz.toFixed(3)); }catch(e){} }
applyZoom(false);
$('zoomBtn').onclick=()=>{ zoomI=(zoomI+1)%ZOOMS.length; uiz=ZOOMS[zoomI]; applyZoom(); A.sfx.tap(); toast('Textgröße: <b>'+ZL[zoomI]+'</b> · Tipp: auch mit zwei Fingern zoomen'); };
// Pinch: zwei Finger auseinander = größer
let pinch=null;
document.addEventListener('touchstart',e=>{ if(e.touches.length===2){ const [a,b]=e.touches; pinch={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),z:uiz}; e.preventDefault(); } },{passive:false});
document.addEventListener('touchmove',e=>{ if(pinch&&e.touches.length===2){ const [a,b]=e.touches; const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY); uiz=pinch.z*Math.pow(d/pinch.d,0.8); applyZoom(false); e.preventDefault(); } },{passive:false});
document.addEventListener('touchend',e=>{ if(pinch&&e.touches.length<2){ pinch=null; applyZoom(true); } });
document.addEventListener('gesturestart',e=>e.preventDefault()); // iOS: Seiten-Zoom verhindern, wir zoomen selbst
// ---------- Vollbild ----------
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const STANDALONE=matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches||navigator.standalone===true;
function iosHint(force){ if(STANDALONE) return; let seen=false; try{ seen=localStorage.getItem('chien_ioshint')==='1'; }catch(e){} if(seen&&!force) return;
  try{ localStorage.setItem('chien_ioshint','1'); }catch(e){}
  toast('📱 <b>Vollbild auf dem iPad/iPhone:</b> oben auf Teilen ⤴ tippen → <b>„Zum Home-Bildschirm“</b>. Dann startet das Spiel wie eine App – ohne Adresszeile, auch beim Tippen.',9000); }
function goFullscreen(){ if(IOS){ setTimeout(()=>iosHint(false),4000); return; } const el=document.documentElement; try{ const r=(el.requestFullscreen||el.webkitRequestFullscreen)?.call(el,{navigationUI:'hide'}); if(r&&r.catch) r.catch(()=>{}); }catch(e){} try{ screen.orientation?.lock?.('any').catch(()=>{}); }catch(e){} }
const canFS=!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);
$('musicBtn').onclick=()=>{ A.audioCtx(); $('musicBtn').textContent=A.toggleMusic()?'🎵':'🔇'; };
$('musicBtn').textContent=A.settings.music?'🎵':'🔇';
$('treatsBtn').onclick=()=>openShop('coffre'); $('chap').style.cursor='pointer'; $('chap').onclick=()=>{ A.sfx.tap?.(); openChapters(); }; $('heartBtn').onclick=()=>{ A.sfx.tap(); openFriends(); }; renderHearts();
$('carnetBtn').onclick=()=>{ openCarnet(); run.event('carnet'); }; $('menuBtn').onclick=openMenu; $('chap').onclick=()=>openMap();
$('sheetClose').onclick=()=>UI.closeSheet(); $('sheetX').onclick=()=>UI.closeSheet();
$('sheet').addEventListener('click',e=>{ if(e.target===$('sheet')) UI.closeSheet(); }); // Tipp neben das Fenster schließt
// Zurück-Taste: erst Fenster schließen, im Spiel nachfragen statt die Seite zu verlassen
let backArmed=false, backT=null;
function guardHistory(){ try{ history.pushState({game:1},''); }catch(e){} }
addEventListener('popstate',()=>{ if(UI.sheetIsOpen()){ UI.closeSheet(true); return; }
  if($('giftBox').classList.contains('open')){ $('giftBox').classList.remove('open'); guardHistory(); return; }
  if(!started) return;
  if(backArmed){ history.back(); return; }
  backArmed=true; guardHistory(); toast('Zum Beenden nochmal <b>Zurück</b> drücken'); clearTimeout(backT); backT=setTimeout(()=>backArmed=false,2500); });

function openCarnet(){
  const its=items().sort((a,b)=>(a.kind>b.kind?1:-1));
  const box=b=>'●'.repeat(b)+'○'.repeat(5-b);
  let h=`<p class="sub">Was {N} (und du) schon kann · 🔊 zum Anhören · ● = wie sicher</p>`;
  h+= its.length? its.map(it=>`<div class="entry"><div class="x"><div class="f">${esc(N(it.fr))}</div><div class="d">${esc(N(it.de))}</div>${it.gram?`<div class="g">✏️ ${esc(N(it.gram))}</div>`:''}</div><div class="lv" title="Lernstand">${box(it.box||1)}</div><button class="spk" data-say="${esc(N(it.fr))}">🔊</button></div>`).join('')
    : '<div class="empty">Noch leer – bring {N} etwas bei! 🐶</div>';
  if(its.length) h+=`<button class="big" id="revBtn">🔁 Réviser · 5 Wörter wiederholen</button>`;
  UI.openSheet(N('Le carnet de {N}'), N(h), {onOpen:b=>{ const r=b.querySelector('#revBtn'); if(r) r.onclick=()=>{ UI.closeSheet(); run.startReview(); }; }});
}
let testMode=(()=>{ try{ return localStorage.getItem('chien_test')==='1'; }catch(e){ return false; } })();
function openChapters(){
  let h=`<button class="row" id="mapBtn2"><b>🗺️ Die Lernreise (Karte)</b><small>Alle Stationen auf einen Blick</small></button>`;
  COURSE.chapters.forEach((ch,i)=>{ const open=testMode||i<=P.unlocked; const done=P.results?.[ch.id]; h+=`<button class="row" data-ch="${i}" ${open?'':'disabled'}><b>${i+1}. ${esc(N(ch.titre))} ${i===P.chapter?'📍':done?'✅':''}</b><small>${esc(N(ch.titel))}${ch.unite?` · 📘 ${/\d/.test(ch.unite)?'Unité '+ch.unite:ch.unite}`:''}${open?'':' · 🔒'}</small></button>`; });
  UI.openSheet('🗺️ Kapitel', h, {onOpen:b=>{ b.querySelector('#mapBtn2').onclick=()=>openMap();
    b.querySelectorAll('[data-ch]').forEach(x=>x.onclick=()=>{ if(x.disabled) return; P.chapter=+x.dataset.ch; P.step=0; save(); run.review=null; run.freeplay=false; UI.closeSheet(); if(!P.name){P.chapter=0;} run.begin(); }); }});
}
function openDecks(){
  let h=N('<p class="sub">Bring {N} Wörter bei – wie mit Karteikarten. Was {N} schon sicher kann, kommt seltener dran.</p>');
  for(const id in DECKS){ const d=DECKS[id]; const n=d.words.length; const k=d.words.filter(w=>(P.items['v:'+w.fr]?.box||0)>=2).length;
    h+=`<button class="row" data-deck="${id}"><b>${d.words[0].pic} ${esc(d.titre)} ${k>=n?'✅':''}</b><small>${esc(d.titel)} · ${k}/${n} sicher</small></button>`; }
  UI.openSheet(N('📚 Vokabeln mit {N}'), h, {onOpen:b=>b.querySelectorAll('[data-deck]').forEach(x=>x.onclick=()=>{ UI.closeSheet(); run.startDeck(x.dataset.deck); })});
}
function openMenu(){
  let h=testMode?`<p class="sub" style="background:#fff1c9;border-radius:10px;padding:6px 9px">🧪 <b>Testmodus aktiv</b> – alle Kapitel offen. Vor dem Zug ausschalten!</p>`:'';
  h+=`<div class="menutiles"><button id="chapBtnM"><span>🗺️</span><b>Kapitel</b><small>Lernreise & Kapitel wählen</small></button><button id="deckBtnM"><span>📚</span><b>Vokabeln</b><small>mit {N} üben</small></button><button id="badgeBtnM"><span>🏆</span><b>Abzeichen</b><small>${BADGES.filter(b=>(P.badges||{})[b.id]).length}/${BADGES.length}</small></button></div>`;
  h=N(h);
  h+=`<h3>Einstellungen</h3>
    <label class="set">🎵 Musik <input type="checkbox" id="setMusic" ${A.settings.music?'checked':''}></label>
    <div class="set">🔠 Textgröße <small style="opacity:.6">(auch mit 2 Fingern zoomen)</small></div><div class="zoomrow">${ZL.map((l,i)=>`<button data-z="${i}" class="${i===zoomI?'on':''}">${l}</button>`).join('')}</div>
    ${canFS?'<button class="row" id="fsBtn"><b>⛶ Vollbild</b><small>Adressleiste ausblenden</small></button>':'<p class="sub">Vollbild auf iPhone/iPad: Teilen → „Zum Home-Bildschirm“, dann von dort starten.</p>'}
    <label class="set">🇩🇪 Deutsche Hilfe immer zeigen <input type="checkbox" id="setHelp" ${help.de?'checked':''}></label>
    <label class="set">🔔 Geräusche <input type="checkbox" id="setSfx" ${A.settings.sfx?'checked':''}></label>
    <label class="set">🗣️ Stimme <select id="setVoice">${A.frenchVoices().map(v=>`<option ${v.name===A.currentVoice()?'selected':''}>${esc(v.name)}</option>`).join('')||'<option>Standard</option>'}</select></label>
    <label class="set">🐢 Sprechtempo <input type="range" id="setRate" min="0.6" max="1.1" step="0.05" value="${A.settings.rate}"></label>
    <button class="row" id="testVoice"><b>🔊 Stimme testen</b><small>Bonjour ! Je m'appelle Coco.</small></button>
    <p class="sub">Tipp für schönere Stimmen (iPad/iPhone): Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Französisch → z. B. „Audrey (Premium)“ oder „Amélie (Erweitert)“ laden. Danach hier auswählen.</p>
    <button class="row" id="dogBtn"><b>🐶 Hund aussuchen</b><small>Jetzt: ${esc(DOG.name||"")}</small></button>
    <button class="row" id="genderBtn"><b>♀♂ Hund oder Hündin</b><small>${P.gender==='f'?'Jetzt: une chienne (Hündin)':'Jetzt: un chien (Rüde)'}</small></button>
    <button class="row" id="renameBtn"><b>✏️ Hund umbenennen</b><small>Jetzt heißt er: ${esc(P.name||'–')}</small></button>
    <h3>💾 Spielstand</h3>
    <p class="sub">${esc(summary())}</p>
    <button class="row" id="saveBtn"><b>📤 Spielstand sichern</b><small>Als Code kopieren oder als Datei speichern</small></button>
    <button class="row" id="loadBtn"><b>📥 Spielstand laden</b><small>Code einfügen oder Datei wählen</small></button>
    <button class="row" id="backupBtn"><b>🕘 Automatische Sicherungen</b><small>Nach jedem Kapitel wird gesichert</small></button>
    <h3>Für Eltern</h3>
    <a class="row" href="https://paypal.me/Audionsys" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;display:block"><b>💛 Audionsys unterstützen</b><small>Gefällt euch das Spiel? Kleine Spende über PayPal – paypal.me/Audionsys</small></a>
    <button class="row" id="aboutBtn"><b>ℹ️ Über das Spiel & Credits</b><small>Audionsys · Unterstützen</small></button>
    <button class="row" id="weekBtn"><b>📅 Wochenrückblick</b><small>Für Eltern: geübt, neu gelernt, wackelt noch</small></button>
    <button class="row" id="resBtn"><b>📊 Ergebnisse der Hundeshows</b><small>Mini-Tests pro Kapitel</small></button>
    <button class="row" id="solBtn"><b>🔑 Alle Lösungen anzeigen</b><small>Übersicht pro Kapitel</small></button>
    <button class="row" id="testBtn"><b>🧪 Testmodus ${testMode?'ausschalten':'einschalten'}</b><small>Alle Kapitel offen, Sprung zu jeder Aufgabe, Quatsch & Hundeshow auslösen</small></button>
    ${testMode?`<button class="row" id="tJump"><b>🧪 Zu Aufgabe springen</b><small>Aktuelles Kapitel</small></button><button class="row" id="tMis"><b>🧪 Quatsch auslösen</b><small>Hund macht sofort Unsinn</small></button><button class="row" id="tDefi"><b>🧪 Hundeshow starten</b><small>Mini-Test dieses Kapitels</small></button>`:''}
    <button class="row" id="resetBtn"><b>🗑️ Spielstand löschen</b><small>Neuer Hund, alles von vorn</small></button>`;
  UI.openSheet('☰ Menü', h, {onOpen:b=>{
    b.querySelector('#chapBtnM').onclick=openChapters; b.querySelector('#deckBtnM').onclick=openDecks; b.querySelector('#badgeBtnM').onclick=()=>openBadges();
    b.querySelector('#setMusic').onchange=e=>{ A.audioCtx(); if(e.target.checked!==A.settings.music){ $('musicBtn').textContent=A.toggleMusic()?'🎵':'🔇'; } };
    b.querySelectorAll('[data-z]').forEach(x=>x.onclick=()=>{ uiz=ZOOMS[+x.dataset.z]; applyZoom(); openMenu(); });
    const fb=b.querySelector('#fsBtn'); if(fb) fb.onclick=()=>{ UI.closeSheet(); if(IOS) iosHint(true); else goFullscreen(); };
    b.querySelector('#setHelp').onchange=e=>{ help.de=e.target.checked; };
    b.querySelector('#setSfx').onchange=e=>{ if(e.target.checked!==A.settings.sfx) A.toggleSfx(); };
    b.querySelector('#setVoice').onchange=e=>{ A.setVoice(e.target.value); A.say("Bonjour ! Je m'appelle Coco."); };
    b.querySelector('#setRate').oninput=e=>A.setRate(+e.target.value);
    b.querySelector('#testVoice').onclick=()=>A.say("Bonjour ! Je m'appelle Coco. Et voici ton chien !");
    b.querySelector('#testBtn').onclick=()=>{ testMode=!testMode; try{ localStorage.setItem('chien_test',testMode?'1':'0'); }catch(e){} openMenu(); };
    if(testMode){ b.querySelector('#tMis').onclick=()=>{ UI.closeSheet(); startMischief(); };
      b.querySelector('#tDefi').onclick=()=>{ UI.closeSheet(); const ch=run.chapter; if(!ch) return; P.step=ch.steps.length-1; save(); run.review=null; run.begin(); };
      b.querySelector('#tJump').onclick=()=>{ const ch=run.chapter; if(!ch) return;
        UI.openSheet('🧪 Springen', ch.steps.map((st,i)=>`<button class="row" data-j="${i}"><b>${i+1}. ${st.type}</b><small>${esc(N(st.fr||st.de||(st.cmd?COMMANDS[st.cmd].fr:'')||st.deck||''))}</small></button>`).join(''),
          {onOpen:bb=>bb.querySelectorAll('[data-j]').forEach(x=>x.onclick=()=>{ P.step=+x.dataset.j; save(); run.review=null; UI.closeSheet(); run.begin(); })}); }; }
    b.querySelector('#solBtn').onclick=openSolutions; b.querySelector('#renameBtn').onclick=openRename; b.querySelector('#genderBtn').onclick=()=>askGender(); b.querySelector('#dogBtn').onclick=openDogs; b.querySelector('#weekBtn').onclick=openWeek; b.querySelector('#aboutBtn').onclick=openAbout; b.querySelector('#resBtn').onclick=openResults;
    b.querySelector('#saveBtn').onclick=openSave; b.querySelector('#loadBtn').onclick=openLoad; b.querySelector('#backupBtn').onclick=openBackups;
    const rb=b.querySelector('#resetBtn'); rb.onclick=()=>{ if(rb.dataset.sure){ reset(); location.reload(); } else { rb.dataset.sure=1; rb.innerHTML='<b>⚠️ Wirklich löschen? Nochmal tippen</b>'; } };
  }});
}
const sandboxed=/claude\.ai|claudeusercontent/.test(location.hostname) || window.self!==window.top;
function openSave(){
  snapshot('Manuell gesichert'); const code=exportCode();
  UI.openSheet('📤 Spielstand sichern', `<p class="sub">${esc(summary())}</p>
    <p class="sub">Diesen Code kopieren und z. B. in eine Notiz oder Nachricht an dich selbst einfügen. Damit kannst du den Stand jederzeit – auch in einer neuen Version oder auf einem anderen Gerät – wiederherstellen.</p>
    <textarea id="codeOut" readonly rows="5" style="width:100%;font-size:11px;border-radius:10px;border:1px solid #e4d6c2;padding:8px">${code}</textarea>
    <button class="big" id="copyBtn">📋 Code kopieren</button>
    ${sandboxed?'':'<button class="big" id="dlBtn" style="background:var(--sky)">💾 Als Datei speichern</button>'}`, {onOpen:b=>{
      const ta=b.querySelector('#codeOut'); ta.onclick=()=>ta.select();
      b.querySelector('#copyBtn').onclick=async e=>{ try{ await navigator.clipboard.writeText(code); e.target.textContent='✅ Kopiert!'; }catch(err){ ta.select(); try{ document.execCommand('copy'); e.target.textContent='✅ Kopiert!'; }catch(x){ e.target.textContent='Bitte Text markieren und kopieren'; } } };
      const dl=b.querySelector('#dlBtn'); if(dl) dl.onclick=()=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([code],{type:'text/plain'}));
        a.download=`mon-chien-${(P.name||'spielstand').toLowerCase()}-${new Date().toISOString().slice(0,10)}.txt`; a.click(); };
    }});
}
function openLoad(){
  UI.openSheet('📥 Spielstand laden', `<p class="sub">Code einfügen (beginnt mit <b>CHIEN1:</b>) oder eine gespeicherte Datei wählen. Der aktuelle Stand wird vorher automatisch gesichert.</p>
    <textarea id="codeIn" rows="5" placeholder="CHIEN1:…" style="width:100%;font-size:12px;border-radius:10px;border:1px solid #e4d6c2;padding:8px"></textarea>
    <input type="file" id="fileIn" accept=".txt,text/plain" style="margin:8px 0;font-size:13px">
    <p class="sub" id="loadInfo"></p>
    <button class="big" id="doLoad">📥 Laden</button>`, {onOpen:b=>{
      const ta=b.querySelector('#codeIn'), info=b.querySelector('#loadInfo');
      const check=()=>{ try{ const d=parseCode(ta.value); info.textContent='✅ Gefunden: '+summary(d); }catch(e){ info.textContent= ta.value.trim()? '⚠️ '+e.message : ''; } };
      ta.oninput=check;
      b.querySelector('#fileIn').onchange=e=>{ const f=e.target.files[0]; if(!f) return; f.text().then(t=>{ ta.value=t; check(); }); };
      b.querySelector('#doLoad').onclick=()=>{ try{ importCode(ta.value); location.reload(); }catch(e){ info.textContent='⚠️ '+e.message; } };
    }});
}
function openBackups(){
  const list=snapshots(); const fmt=t=>new Date(t).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  UI.openSheet('🕘 Sicherungen', list.length? `<p class="sub">Tippe auf eine Sicherung, um sie wiederherzustellen (der aktuelle Stand wird vorher gesichert).</p>`+
    list.map((x,i)=>`<button class="row" data-b="${i}"><b>${esc(x.label)} · ${fmt(x.t)}</b><small>${esc(x.name||'?')} · Kapitel ${x.chapter+1} · ${x.treats} 🦴 · ${x.words} Einträge</small></button>`).join('')
    : '<div class="empty">Noch keine Sicherungen – sie entstehen automatisch nach jedem Kapitel.</div>', {onOpen:b=>{
      b.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>{ if(!x.dataset.sure){ x.dataset.sure=1; x.querySelector('b').textContent='Wirklich wiederherstellen? Nochmal tippen'; return; }
        importCode(list[+x.dataset.b].code); location.reload(); }); }});
}
// ---------- Carte du voyage (Lernreise) ----------
const PLACE={ salon:{fr:'le salon',de:'Wohnzimmer'}, cuisine:{fr:'la cuisine',de:'Küche'}, jardin:{fr:'le jardin',de:'Garten'}, cellier:{fr:'le cellier',de:'Speisekammer'}, cave:{fr:'la cave',de:'Keller'}, rue:{fr:'la rue',de:'Straße in Paris'}, classe:{fr:'la salle de classe',de:'Klassenzimmer'} };
function openMap(focus){
  markFurthest(); const F=P.furthest||{chapter:P.chapter,step:P.step}; const chs=COURSE.chapters, R=P.results||{}; const cur=Math.min(P.chapter,chs.length-1);
  const W=320, stepY=150, H=chs.length*stepY+90; const pts=chs.map((c,i)=>({x: i%2? W*0.72 : W*0.28, y: 60+i*stepY}));
  let path=`M ${pts[0].x} ${pts[0].y}`; for(let i=1;i<pts.length;i++){ const a=pts[i-1], b=pts[i]; path+=` C ${a.x} ${a.y+stepY*0.6}, ${b.x} ${b.y-stepY*0.6}, ${b.x} ${b.y}`; }
  const done=i=>i<F.chapter, open=i=>testMode||i<=Math.max(P.unlocked,F.chapter);
  let nodes=''; chs.forEach((c,i)=>{ const p=pts[i]; const r=R[c.id]; const med=r?(r.best>=90?'🥇':r.best>=70?'🥈':r.best>=50?'🥉':'🎀'):'';
    const pl=PLACE[c.scene]||{fr:'',de:''};
    nodes+=`<g class="node ${done(i)?'done':''} ${i===cur?'cur':''} ${open(i)?'':'locked'}" data-i="${i}">
      <circle cx="${p.x}" cy="${p.y}" r="34"/><text x="${p.x}" y="${p.y+12}" text-anchor="middle" class="ic">${open(i)?c.icon||'⭐':'🔒'}</text>
      ${med?`<text x="${p.x+28}" y="${p.y-20}" text-anchor="middle" class="med">${med}</text>`:''}
      ${i===cur?`<text x="${p.x-34}" y="${p.y-26}" text-anchor="middle" class="me">🐶</text>`:''}
      <text x="${i%2?p.x-48:p.x+48}" y="${p.y-4}" text-anchor="${i%2?'end':'start'}" class="t1">${i+1}. ${esc(N(c.titre))}</text>
      <text x="${i%2?p.x-48:p.x+48}" y="${p.y+14}" text-anchor="${i%2?'end':'start'}" class="t2">📍 ${esc(pl.de)}</text></g>`; });
  const svg=`<svg viewBox="0 0 ${W} ${H}" class="map"><path d="${path}" class="road"/><path d="${path}" class="road2"/>${nodes}
    <text x="${W/2}" y="${H-18}" text-anchor="middle" class="t2">… à suivre ! Weitere Orte folgen 🗺️</text></svg>`;
  UI.openSheet(N('🗺️ Le voyage de {N}'), `<p class="sub">Die Lernreise: Station für Station. Tippe eine Station an, um mehr zu erfahren.</p>${svg}<div id="mapInfo"></div>`, {onOpen:b=>{
    const show=(i,scroll=true)=>{ const c=chs[i]; const pl=PLACE[c.scene]||{fr:'',de:''}; const r=R[c.id];
      b.querySelector('#mapInfo').innerHTML=`<div class="mapcard"><b class="fr">${i+1}. ${esc(N(c.titre))}</b> <small>· ${esc(pl.fr)} (${esc(pl.de)})</small>
        <p>${esc(N(c.story||''))}</p><p class="sub">🎯 ${esc(N(c.intro?.ziel||''))}</p>${r?`<p class="sub">🏆 Hundeshow: bestes Ergebnis ${r.best}%</p>`:''}
        ${open(i)?`<button class="big" id="playCh">${F.chapter===i&&F.step>0?'▶ Weiterspielen (wo du warst)':done(i)?'🔁 Ganzes Kapitel nochmal':'▶ Los geht\'s'}</button>
          <h3 style="margin-top:12px">↪️ Hierhin springen</h3><div class="steplist">${c.steps.map((st,j)=>{ const reached= testMode || i<F.chapter || (i===F.chapter && j<=F.step);
            return `<button class="row srow ${i===P.chapter&&j===P.step?'here':''}" data-j="${j}" ${reached?'':'disabled'}><b>${j+1}. ${esc(stepLabel(st))}</b>${i===P.chapter&&j===P.step?'<small>📍 Hier bist du gerade</small>':reached?'':'<small>🔒 noch nicht erreicht</small>'}</button>`; }).join('')}</div>`
          :'<p class="sub">🔒 Wird freigeschaltet, wenn du das Kapitel davor geschafft hast.</p>'}</div>`;
      const go=(j)=>{ UI.closeSheet(); P.chapter=i; P.step=j; save(); run.review=null; run.freeplay=false; run.begin(); };
      const pb=b.querySelector('#playCh'); if(pb) pb.onclick=()=>go(F.chapter===i? F.step : 0);
      b.querySelectorAll('.srow').forEach(x=>x.onclick=()=>{ if(!x.disabled) go(+x.dataset.j); });
      if(scroll) b.querySelector('#mapInfo').scrollIntoView({behavior:'smooth',block:'nearest'}); };
    b.querySelectorAll('.node').forEach(n=>n.onclick=()=>show(+n.dataset.i));
    show(focus??cur,false); b.scrollTop=0; setTimeout(()=>{ const n=b.querySelector('.node.cur'); if(n){ const sb=b.closest('.sheetbox')||b; const r=n.getBoundingClientRect(), rb=sb.getBoundingClientRect(); sb.scrollTop+= (r.top-rb.top)-rb.height/2+40; } },60);
  }});
}
function askGender(after){
  UI.openSheet('🐶 Chien ou chienne ?', `<p class="fr" style="font-size:18px">🦜 « ${esc(P.name||'Ton chien')}, c'est un chien ou une chienne ? »</p>
    <p class="sub">Ist ${esc(P.name||'dein Hund')} ein Junge (Rüde) oder ein Mädchen (Hündin)? Im Französischen ändert sich dann einiges: <b class="fr">il → elle</b>, <b class="fr">fatigué → fatiguée</b> …</p>
    <button class="row" data-g="m"><b class="fr">♂ C'est un chien.</b><small>Ein Junge – il, le chien</small></button>
    <button class="row" data-g="f"><b class="fr">♀ C'est une chienne.</b><small>Ein Mädchen – elle, la chienne</small></button>`, {onOpen:b=>{
      b.querySelectorAll('[data-g]').forEach(x=>x.onclick=()=>{ P.gender=x.dataset.g; save(); UI.closeSheet(); A.sfx.success(); dog.happy(1500); fx.hearts(3);
        const t= P.gender==='f'? `C'est une chienne. Elle s'appelle ${P.name}.` : `C'est un chien. Il s'appelle ${P.name}.`; A.say(t);
        toast(`<b class="fr">${esc(t)}</b>`); run.refresh?.(); after&&after(); }); }});
}
function openDogs(){
  UI.openSheet('🐶 Welcher Hund?', `<p class="sub">Such dir einen Hund aus! Name, Fortschritt, Herzen und Sachen bleiben gleich – nur das Aussehen ändert sich.</p>
    <div class="dogpick">${DOGS.map(d=>`<button class="dogcard${d.id===DOG.id?' on':''}" data-d="${d.id}"><img src="${d.pic}" alt=""><b>${esc(d.name)}</b><small>${esc(d.de)}</small>${d.id===DOG.id?'<span class="tag">✓ jetzt</span>':''}</button>`).join('')}</div>`,
    {onOpen:b=>b.querySelectorAll('[data-d]').forEach(x=>x.onclick=()=>{ if(x.dataset.d===DOG.id){ UI.closeSheet(); return; } chooseDog(x.dataset.d); save(); snapshot('Vor dem Hundewechsel');
      $('sheetBody').innerHTML='<p style="text-align:center;font-size:20px;margin:30px 0">🐶 Der neue Hund kommt …</p>'; setTimeout(()=>location.reload(),400); })});
}
function openRename(){
  UI.openSheet('✏️ Neuer Name', `<p class="fr" style="font-size:18px">🦜 « Comment s'appelle ton chien maintenant ? »</p>
    <p class="sub">Wie heißt dein Hund jetzt? Antworte auf Französisch: <b class="fr">Il s'appelle …</b></p>
    <input id="newName" class="fr" value="Il s'appelle " style="width:100%;font-size:18px;padding:12px;border-radius:12px;border:1px solid #e4d6c2">
    <button class="big" id="doRename">✔ Ja, so heißt er!</button><p class="sub" id="rnMsg"></p>`, {onOpen:b=>{
      const i=b.querySelector('#newName'); setTimeout(()=>{ i.focus(); i.setSelectionRange(i.value.length,i.value.length); },100);
      b.querySelector('#doRename').onclick=()=>{ const raw=i.value.trim(); let n=raw.replace(/^(il|elle)\s*s['’ ]?\s*app?ell?e\s*/i,'').replace(/[.!?]+$/,'').trim().split(/\s+/).slice(0,2).join(' ').slice(0,16);
        if(!n||!/[a-zà-ÿ]/i.test(n)){ b.querySelector('#rnMsg').textContent='Bitte einen Namen eingeben 🙂'; return; }
        n=n[0].toUpperCase()+n.slice(1); const old=P.name; P.name=n; save(); UI.closeSheet(); $('inp').placeholder=N('Parle à {N}…'); run.renderTop();
        dog.name(); fx.hearts(4); A.sfx.success(); const t=`Il s'appelle ${n} maintenant !`; A.say(t);
        toast(`<b class="fr">${esc(t)}</b> = Er heißt jetzt ${esc(n)}!`); setTimeout(()=>quip('idle',true),2500); };
    }});
}
function openAbout(){
  UI.openSheet('ℹ️ Über das Spiel', `<p class="fr" style="font-size:20px;margin:0 0 4px">🐾 Mon chien parle français</p>
    <p class="sub">Französisch lernen mit deinem eigenen Hund – nach dem Lehrplan der 6. Klasse (Gymnasium Bayern, 2. Fremdsprache).</p>
    <h3>Credits</h3>
    <div class="entry"><div class="x"><div class="d">Idee & Konzept</div><div class="f">Frank Pree · Audionsys</div></div></div>
    <div class="entry"><div class="x"><div class="d">Musik „Petit chien de Paris“</div><div class="f">Audionsys</div><div class="g">Frank Pree, GenerativeAI</div></div></div>
    <div class="entry"><div class="x"><div class="d">3D-Hund</div><div class="f">Meshy AI</div></div></div>
    <div class="entry"><div class="x"><div class="d">Programmierung & Inhalte</div><div class="f">mit Claude (Anthropic)</div></div></div>
    <div class="entry"><div class="x"><div class="d">3D-Technik</div><div class="f">three.js</div></div></div>
    <p style="margin:14px 0 6px"><a href="https://audionsys.de" target="_blank" rel="noopener" class="linkbtn">🌐 audionsys.de</a></p>
    <h3>Unterstützen</h3>
    <p class="sub">Das Spiel ist kostenlos. Wenn es euch gefällt und beim Lernen hilft, freut sich Audionsys über eine kleine Spende – damit noch mehr Kapitel entstehen können. 💛</p>
    <p style="margin:6px 0"><a href="https://paypal.me/Audionsys" target="_blank" rel="noopener" class="linkbtn pp">💛 Spenden über PayPal</a></p>
    <p class="sub">paypal.me/Audionsys</p>`);
}
function openResults(){
  const R=P.results||{}; const fmt=t=>new Date(t).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});
  let h='<p class="sub">Am Ende jedes Kapitels gibt es eine „Hundeshow“ – in Wahrheit ein kleiner Test ohne Tipps über den Stoff des Kapitels.</p>';
  COURSE.chapters.forEach((ch,i)=>{ const r=R[ch.id];
    h+=`<div class="entry"><div class="x"><div class="f">${i+1}. ${esc(N(ch.titre))}</div><div class="d">${r?`Zuletzt ${r.last}% · Bestes ${r.best}% · ${r.tries}× · ${fmt(r.date)}`:'noch nicht gemacht'}</div>${r&&r.wrong.length?`<div class="g">Üben: ${r.wrong.map(w=>esc(N(w))).join(' · ')}</div>`:''}</div><div class="lv" style="font-size:22px">${r?(r.best>=90?'🥇':r.best>=70?'🥈':r.best>=50?'🥉':'🎀'):'–'}</div></div>`; });
  UI.openSheet('📊 Ergebnisse', h);
}
function openSolutions(){
  let h='<p class="sub">Lösungen zum Nachschauen – mit Übersetzung.</p>';
  COURSE.chapters.forEach((ch,i)=>{ h+=`<h3>${i+1}. ${esc(N(ch.titre))} – ${esc(N(ch.titel))}</h3>`;
    ch.steps.forEach((st,j)=>{ if(['dialogue','tuto','defi','teach','intro'].includes(st.type)) return; const sol=st.type==='object'? (room.props.get(st.target)?.word.fr+' antippen') : solutionOf(st);
      h+=`<div class="entry"><div class="x"><div class="d">${esc(N(st.de||'Namen geben'))}</div><div class="f">${esc(N(sol))}</div></div>${st.type!=='object'?`<button class="spk" data-say="${esc(N(sol))}">🔊</button>`:''}</div>`; }); });
  UI.openSheet('🔑 Lösungen', h);
}

// ---------- Loop ----------
const camT=new THREE.Vector3(0,0.3,0.2); let titleCam=false; let freeT=0; const freeGoal={x:0,y:0}, freeOff={x:0,y:0};
let lastW=0,lastH=0;
function resize(){ const cv=world.renderer.domElement; const w=Math.round(cv.clientWidth||innerWidth), h=Math.round(cv.clientHeight||innerHeight); if(w===lastW&&h===lastH) return; lastW=w; lastH=h; world.renderer.setSize(w,h,false); world.camera.aspect=w/h; world.camera.fov=w<h?48:38; world.camera.updateProjectionMatrix(); }
addEventListener('resize',()=>{ resize(); setTimeout(resize,350); setTimeout(resize,900); }); resize();
for(const ev of ['fullscreenchange','webkitfullscreenchange','orientationchange']) document.addEventListener(ev,()=>{ setTimeout(resize,300); setTimeout(resize,900); });
addEventListener('orientationchange',()=>setTimeout(resize,500));
inp.addEventListener('blur',()=>{ if(IOS) setTimeout(()=>{ scrollTo(0,0); resize(); layoutBubble(); },250); });
setInterval(resize,1500);
let last=performance.now();
function frame(now){
  requestAnimationFrame(frame); const dt=Math.min(0.05,(now-last)/1000); last=now;
  dog.update(dt); dog.ground?.(dt); particles.update(dt);
  const asp=innerWidth/innerHeight, portrait=asp<0.8, dist=portrait?3.4:3.8, dp=dog.root.position;
  camT.x=THREE.MathUtils.lerp(camT.x,dp.x,dt*1.8);
  camT.z=THREE.MathUtils.lerp(camT.z,THREE.MathUtils.clamp(dp.z*(portrait?0.7:0.45),-1.2,1),dt*1.8);
  const cam=world.camera; cam.position.set(camT.x, portrait?1.75:2.1, camT.z+dist); cam.lookAt(camT.x, portrait?0.05:0.3, camT.z-0.3);
  // Schattenbereich nur ab und zu nachziehen (in festen Schritten) – ständiges Mitwandern lässt die Schatten flimmern
  if(!window.__sunC || Math.hypot(dp.x-__sunC.x,dp.z-__sunC.z)>1.4){ window.__sunC={x:Math.round(dp.x*2)/2, z:Math.round(dp.z*2)/2};
    world.sun.position.set(__sunC.x-2.5,4.5,__sunC.z-1.5); world.sun.target.position.set(__sunC.x,0,__sunC.z); world.sun.target.updateMatrixWorld(); }
  if(titleCam){ const t=performance.now()/1000, por=innerWidth<innerHeight, r=por?2.3:1.9, a=Math.sin(t*0.25)*0.55; const dp2=dog.root.position; cam.position.set(dp2.x+Math.sin(a)*r, 0.75, dp2.z+Math.cos(a)*r); cam.lookAt(dp2.x, por?0.62:0.5, dp2.z); }
  // Hund in die freie Lücke zwischen Sprechblase und Knöpfen rücken
  if(!titleCam && started){ freeT-=dt; if(freeT<=0){ freeT=0.25; const W=innerWidth,H=innerHeight; const cb=$('coco').getBoundingClientRect(), bb=$('bottom').getBoundingClientRect(); const land=W>H && H<520;
      const top= land? 60 : Math.min(cb.bottom, H*0.6), bot=Math.max(top+80,bb.top), left= land? cb.right : 0;
      freeGoal.x=-(((left+W)/2)-W/2); freeGoal.y=-(((top+bot)/2)-H/2)*0.9; } }
  else { freeGoal.x=0; freeGoal.y=0; }
  freeOff.x+=(freeGoal.x-freeOff.x)*Math.min(1,dt*3); freeOff.y+=(freeGoal.y-freeOff.y)*Math.min(1,dt*3);
  if(Math.abs(freeOff.x)>0.5||Math.abs(freeOff.y)>0.5) cam.setViewOffset(innerWidth,innerHeight,freeOff.x,freeOff.y,innerWidth,innerHeight); else cam.clearViewOffset();
  if(window.__camOverride){ const o=window.__camOverride; cam.position.set(...o.pos); cam.lookAt(...o.look); }
  const ds=$('dogSay'); if(ds.style.opacity==='1'){ const s=headScreen(); ds.style.left=s.x+'px'; ds.style.top=s.y+'px'; }
  const tk=$('think'); if(tk.className){ const s=headScreen(); tk.style.left=(s.x+10)+'px'; tk.style.top=(s.y-14)+'px'; }
  world.renderer.render(world.scene,cam);
}
requestAnimationFrame(frame);

// ---------- Laden & Start ----------
$('load').classList.add('loading');
// Titelbild (gemalt) laden – falls es fehlt, bleibt der 3D-Hund als Hintergrund
let hasArt=false;
fetch('title.jpg').then(r=>r.ok?r.blob():Promise.reject()).then(b=>{ const u=URL.createObjectURL(b); const k=$('keyart'); const img=new Image(); img.onload=()=>{ k.style.backgroundImage=`url(${u})`; k.classList.add('on'); $('load').classList.add('art'); hasArt=true; }; img.src=u; }).catch(()=>{});
dog.load(p=>{ $('loadBar').style.width=(p*100)+'%'; }).then(()=>{
  $('loadBar').style.width='100%'; const st=$('start'); st.style.display='block'; document.querySelector('#load .bar').style.display='none'; $('loadMsg').style.display='none';
  $('load').classList.remove('loading'); titleCam=!hasArt; { const c=room.centerOf('salon'); dog.root.position.set(c[0]+0.8,0,c[1]+0.4); } dog.yaw=0; dog.setPose(1,0); dog.wagAmt=0.8; dog.wagSpeed=11;
  if(P.name){ st.textContent=N('Weiter mit {N} 🐾'); document.querySelector('#load .cocoSays').textContent=N('Coucou ! {N} t\'attend !'); }
  st.onclick=()=>{ guardHistory(); goFullscreen(); document.body.classList.remove('title'); titleCam=false; dog.setPose(0,0); dog.wagAmt=0.25; dog.wagSpeed=7; const s0=room.start; dog.root.position.set(s0.pos[0],0,s0.pos[1]); dog.yaw=s0.yaw; started=true; bump(); A.audioCtx(); A.startMusic(); A.sfx.pop(); $('load').style.opacity=0; setTimeout(()=>$('load').remove(),500); run.start(); if(P.name && !P.gender) setTimeout(()=>askGender(),1500);
    setTimeout(badgeCheck,15000);
    setTimeout(function wishHint(){ if(!P.name) return; const w=todayWish(); if(w.told||w.done) return; if(UI.sheetIsOpen()||cocoSaved){ setTimeout(wishHint,5000); return; } w.told=1; save(); toast(`🌟 <b class="fr">Aujourd'hui, {N} adore ${LIKES[w.kind].fr} !</b><br>Heute wünscht sich {N}: ${LIKES[w.kind].de} → +5 ❤️ <small>(tippe oben auf ❤️)</small>`,6000); }, 9000);
     };
  rewear();
  g.openMap=openMap;
  window.__dbg={openMap,dog,run,P,gift:g.gift,openShop,give,buy,get room(){return room},world,submit,inp,startMischief,switchScene,MIS};
}).catch(err=>{ document.querySelector('#load p').textContent='Der Hund konnte nicht geladen werden 😢 ('+err.message+')'; });
