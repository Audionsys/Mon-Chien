// Abenteuer-Modus (Prototyp): 2,5D-Szenen mit 2D-Figuren, Missionen mit mehreren Lösungswegen.
// Coco plappert die Sätze des Spielers gegenüber den Menschen nach.
import * as THREE from 'three';
import { P, save, learn } from './progress.js';
import { parseCommand, checkAnswer, norm } from './lang.js';
import { COMMANDS } from '../content/commands.js';
import { say, sfx } from './audio.js';
import * as UI from './ui.js';
const { N, esc } = UI;

const VOICE={ boucher:{pitch:0.8,rate:0.92}, cliente:{pitch:1.25,rate:0.95}, livreur:{pitch:1.0,rate:1.0} };
const PATHS=[
  {id:'mendier', name:'Betteln',   hint:'Menschen werden weich, wenn ein Hund Männchen macht … Wie heißt „Mach Männchen!“? <b class="fr">Fais le beau !</b>'},
  {id:'aboyer',  name:'Bellen',    hint:'Die Kundin hat Angst vor Hunden. Was passiert wohl, wenn Juna laut bellt? <b class="fr">Aboie !</b>'},
  {id:'cour',    name:'Schleichen',hint:'Tippe den Lieferanten an der Hintertür an und hör genau zu, was er sagt.'},
  {id:'acheter', name:'Kaufen',    hint:'Tippe den Metzger an. Coco spricht für dich – du musst nur sagen, was du möchtest.'},
];

export function createAdventure(api){
  const S={ active:false, phase:'free', hint:0 };
  const done=()=> (P.adv ??= {}).saucisse ??= {};
  const bub=document.createElement('div'); bub.id='npcSay'; document.body.appendChild(bub);
  let bubNpc=null, bubT=null;
  const prop=id=>api.room().props.get(id);

  // ---------- Sprechblasen über den Figuren ----------
  function npcSay(id,fr,de,ms=6500){ bubNpc=id; bub.innerHTML=`<span class="fr">${UI.wrap(fr)}</span>${de?`<small>${esc(N(de))}</small>`:''}`; bub.classList.add('on'); clearTimeout(bubT); bubT=setTimeout(()=>{ bub.classList.remove('on'); bubNpc=null; },ms);
    const v=VOICE[id]||{}; say(N(fr),{pitch:v.pitch,rate:v.rate,word:true}); poke(id); }
  function coco(fr){ UI.coco(`<span class="note">🦜 Coco plappert nach: <b class="fr">« ${esc(N(fr))} »</b></span>`+S.card,{chirp:false}); }
  function poke(id){ const o=prop(id)?.object; if(o) o.userData.talk=0.9; }
  function update(dt,camera){
    const r=api.room(); for(const p of r.props.values()){ const o=p.object; if(!o?.userData?.npc) continue; const b=o.userData.body, base=o.userData.base; o.userData.t=(o.userData.t||Math.random()*9)+dt;
      const talk=(o.userData.talk=Math.max(0,(o.userData.talk||0)-dt)); const br=Math.sin(o.userData.t*2.1)*0.012+(talk?Math.abs(Math.sin(o.userData.t*14))*0.025:0);
      b.scale.set(base.w*(1-br*0.4),base.h*(1+br),1); if(o.userData.hop){ o.userData.hop=Math.max(0,o.userData.hop-dt*2.5); b.position.y=Math.sin(o.userData.hop*Math.PI)*0.25; } }
    if(bubNpc && bub.classList.contains('on')){ const o=prop(bubNpc)?.object; if(o){ const v=new THREE.Vector3(); o.getWorldPosition(v); v.y+=o.userData.base.h+0.12; v.project(camera);
      const x=(v.x*0.5+0.5)*innerWidth, y=(-v.y*0.5+0.5)*innerHeight; bub.style.left=Math.max(110,Math.min(innerWidth-110,x))+'px'; bub.style.top=Math.max(64+bub.offsetHeight,y)+'px'; } } }

  // ---------- Karte ----------
  function card(extra=''){ const d=done(), n=PATHS.filter(p=>d[p.id]).length;
    S.card=`<span class="tutostep" style="display:inline-block">🧪 Abenteuer · ${n}/4 🐾</span>${UI.frLine('{N} veut une saucisse !')}<span class="welcome">Hol {N} eine Wurst – es gibt <b>4 Wege</b>! Tippe Leute an und gib {N} Kommandos.</span>`
      +`<span class="how">${PATHS.map(p=>(d[p.id]?'✅ ':'⬜ ')+p.name).join(' · ')}</span>`;
    UI.coco(extra+S.card,{chirp:false}); chips(); }
  function chips(list=[]){ UI.chips([...list,{html:'🏠 Nach Hause',onClick:()=>stop()}]); }
  function prompt(html,list=[]){ UI.coco(html,{chirp:false}); chips(list); }

  // ---------- Start / Ende ----------
  function start(){ UI.thinkHide?.(); S.active=true; S.phase='free'; S.hint=0; api.switchTo('boucherie'); const l=prop('livreur')?.object; if(l) l.visible=true;
    UI.setInputMode('text','Parle à {N}…'); card(); setTimeout(()=>npcSay('boucher','Bonjour ! Bienvenue à la boucherie !','Hallo! Willkommen in der Metzgerei!'),900); }
  function stop(){ S.active=false; bub.classList.remove('on'); api.dog.drop?.(); api.switchTo('salon'); api.resume(); }

  // ---------- Erfolg ----------
  function win(id,line){ const d=done(); const first=!d[id]; d[id]=Date.now(); save(); S.phase='free'; S.hint=0;
    sfx.success(); setTimeout(()=>sfx.treat(),400); api.fx.hearts(5); api.dog.happy(3000); api.giveSausage();
    if(first){ P.treats+=3; api.love?.('jeu'); }
    const n=PATHS.filter(p=>done()[p.id]).length;
    setTimeout(()=>{ if(n===4){ UI.coco(`<span class="medal">🏆</span><span class="mission fr">Mission accomplie !</span><span class="welcome">Alle 4 Wege gefunden – {N} ist satt und glücklich!</span>`); api.celebrate?.(); say('Mission accomplie !'); chips([{cls:'sol',html:'Nochmal spielen',onClick:()=>{ P.adv.saucisse={}; save(); card(); }}]); }
      else card(`<span class="mission fr">Miam ! ${line||''}</span><span class="de">Weg „${PATHS.find(p=>p.id===id).name}“ geschafft${first?' · +3 🦴':''}. Findest du noch einen?</span>`); const l=prop('livreur')?.object; if(l) l.visible=true; },2600); }

  // ---------- Figuren antippen ----------
  function onProp(p){ if(!S.active) return false;
    if(p.id==='boucher'){ if(S.phase==='pay') return true; S.phase='order'; S.hint=0;
      npcSay('boucher','Bonjour ! Vous désirez ?','Hallo! Was darf es sein?');
      prompt(`${UI.frLine('Vous désirez ?')}<span class="welcome">Der Metzger fragt, was du möchtest. Sag es auf Französisch – Coco spricht es ihm vor!</span>`,[{html:'💡 Tipp',onClick:()=>help()}]); return true; }
    if(p.id==='cliente'){ npcSay('cliente',"Oh, un chien ! J'ai un peu peur des chiens…",'Oh, ein Hund! Ich habe ein bisschen Angst vor Hunden …'); return true; }
    if(p.id==='livreur'){ if(!p.object.visible) return true; S.phase='listen'; S.hint=0;
      npcSay('livreur','Monsieur Morel ! Je reviens dans cinq minutes !','',8000);
      setTimeout(()=>npcSay('boucher',"D'accord, à tout de suite !",''),3200);
      prompt(`<span class="welcome">Hör genau hin! Tippe die Wörter in der Sprechblase an, wenn du sie nicht kennst.</span><span class="mission">Wann kommt der Lieferant zurück?</span>`,
        [['in fünf Minuten',true],['um fünf Uhr',false],['in zwei Minuten',false]].map(([t,ok])=>({html:t,onClick:()=>answerListen(ok)}))); return true; }
    return false; }
  function answerListen(ok){ if(!ok){ sfx.soft_no(); api.toast('Hör nochmal genau hin – tippe den Lieferanten an.'); prompt(`<span class="tip">💡 <b class="fr">dans cinq minutes</b> = in fünf Minuten · <b class="fr">cinq</b> = fünf</span>`,[{html:'🔁 Nochmal hören',onClick:()=>onProp(prop('livreur'))}]); return; }
    learn('w:dans cinq minutes',{kind:'word',fr:'dans cinq minutes',de:'in fünf Minuten',gram:''},2); sfx.pop();
    const l=prop('livreur').object; l.userData.hop=1; setTimeout(()=>{ l.visible=false; },400);
    S.phase='door'; S.hint=0; prompt(`<span class="mission">Der Lieferant ist weg – die Hintertür ist frei! 🤫</span><span class="welcome">Schick {N} schnell hin! „Geh zur Tür!“ heißt: <b class="fr">Va à la porte !</b></span>`,[{html:'💡 Tipp',onClick:()=>help()}]); }

  // ---------- Eingaben ----------
  function input(raw){ if(!S.active) return false; const n=norm(raw);
    if(S.phase==='order'){
      if(!/saucisse/.test(n)){ coco(raw); setTimeout(()=>npcSay('boucher',"Pardon ? Je n'ai pas compris.",'Wie bitte? Das habe ich nicht verstanden.'),900); return true; }
      coco(raw); const polite=/voudrais|s il vous plait|s il te plait/.test(n);
      if(!polite){ setTimeout(()=>{ npcSay('boucher','Hmm… Et la politesse ?','Hmm … und die Höflichkeit?'); prompt(`<span class="tip">💡 Höflicher geht's mit <b class="fr">Je voudrais …</b> (= Ich hätte gern …) oder <b class="fr">s'il vous plaît</b> (= bitte).</span>`); },900); return true; }
      learn('w:je voudrais',{kind:'word',fr:'Je voudrais une saucisse, s\'il vous plaît.',de:'Ich hätte gern eine Wurst, bitte.',gram:'je voudrais = ich hätte gern (höflich)'},2);
      S.phase='pay'; setTimeout(()=>{ npcSay('boucher','Voilà ! Ça fait deux euros.','Bitte schön! Das macht zwei Euro.');
        prompt(`${UI.frLine('Ça fait deux euros.')}<span class="welcome">Was musst du bezahlen? Sag es oder tippe auf die richtige Münze.</span>`,['1 €','2 €','5 €'].map(t=>({html:'🪙 '+t,onClick:()=>pay(t)}))); },1000); return true; }
    if(S.phase==='pay'){ const ok=/deux|^2|2 euro/.test(n); pay(ok?'2 €':'x'); return true; }
    if(S.phase==='door'){ if(/porte|derriere|cour|dehors/.test(n)){ coco(raw); sneak(); return true; }
      UI.coco(`<span class="tip">💡 Sag <b class="fr">Va à la porte !</b> – dann läuft {N} zur Hintertür.</span>`); return true; }
    const r=parseCommand(raw,P.name);
    if(r.type==='ok'||r.type==='close'){ const id=r.id;
      if(id==='beau'){ api.dog.doRaw({do:'trick',id:'beau'}); setTimeout(()=>{ npcSay('boucher',"Oh, qu'il est mignon ! Tu as faim ?",'Oh, ist der süß! Hast du Hunger?'); S.phase='hungry';
          prompt(`${UI.frLine('Tu as faim ?')}<span class="welcome">Der Metzger fragt, ob {N} Hunger hat. Antworte für {N}!</span>`,[{cls:'fr',html:'Oui !',onClick:()=>input('oui')},{cls:'fr',html:'Non !',onClick:()=>input('non')}]); },1600); return true; }
      if(id==='aboie'){ api.dog.do(COMMANDS.aboie.action); setTimeout(()=>{ prop('cliente').object.userData.hop=1; npcSay('cliente','Aaah ! Au secours ! Un chien !','Aaah! Hilfe! Ein Hund!'); },700);
        setTimeout(()=>npcSay('boucher','Hé ! Dehors, le chien !','He! Raus mit dem Hund!'),3000); setTimeout(()=>win('aboyer','La cliente a lâché son sac… et la saucisse !'),4200); return true; }
      api.dog.do(COMMANDS[id].action); api.toast(`<b class="fr">${COMMANDS[id].fr}</b> = ${COMMANDS[id].de}`); return true; }
    if(S.phase==='hungry'){ if(/^(oui|ouais|oui oui)/.test(n)){ setTimeout(()=>npcSay('boucher','Tiens, une saucisse pour toi !','Hier, eine Wurst für dich!'),300); setTimeout(()=>win('mendier','Le boucher est gentil !'),1800); }
      else { npcSay('boucher','Ah bon ? Dommage !','Ach so? Schade!'); S.phase='free'; } return true; }
    return false; }
  function pay(t){ if(t!=='2 €'){ sfx.soft_no(); npcSay('boucher','Non, non ! Deux euros.','Nein, nein! Zwei Euro.'); return; }
    coco('Voilà deux euros.'); setTimeout(()=>npcSay('boucher','Merci ! Au revoir !','Danke! Auf Wiedersehen!'),900); setTimeout(()=>win('acheter','Une saucisse achetée !'),2300); }
  function sneak(){ const d=api.dog, sp=prop('livreur').spot; S.phase='busy'; d.walkTo(sp[0]+0.6,sp[1]-0.6,()=>{ d.do('eat'); setTimeout(()=>win('cour','Chut… personne n\'a rien vu !'),1400); },{run:true}); }

  // ---------- 💡 ----------
  function help(){ if(!S.active) return false; S.hint++;
    const H={ order:['„Ich hätte gern …“ heißt <b class="fr">Je voudrais …</b>','„eine Wurst“ heißt <b class="fr">une saucisse</b>','✅ <b class="fr">Je voudrais une saucisse, s\'il vous plaît.</b>'],
      door:['✅ <b class="fr">Va à la porte !</b>'], hungry:['„Ja“ heißt <b class="fr">oui</b>'], pay:['<b class="fr">deux</b> = zwei'] }[S.phase];
    if(H){ UI.coco(`<span class="tip">💡 ${H[Math.min(S.hint,H.length)-1]}</span>`+(S.phase==='order'?'':S.card),{chirp:false}); return true; }
    const next=PATHS.filter(p=>!done()[p.id]); const p=next[(S.hint-1)%Math.max(1,next.length)];
    if(p) UI.coco(`<span class="tip">💡 ${p.hint}</span>`+S.card,{chirp:false}); return true; }

  return { get active(){ return S.active; }, start, stop, input, prop:onProp, help, update };
}
