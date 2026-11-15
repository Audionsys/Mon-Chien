// Abenteuer-Modus (Prototyp 2): Point-and-Click mit Verb-Ring, Dialog-Auswahl und einem Rätsel aus mehreren Schritten.
// Coco spricht für Juna mit den Menschen. Selbst sagen/schreiben = Bonus.
import * as THREE from 'three';
import { P, save, learn } from './progress.js';
import { say, sfx } from './audio.js';
import * as UI from './ui.js';
const { N, esc } = UI;

const VOICE={ boucher:{pitch:0.8,rate:0.92}, cliente:{pitch:1.25,rate:0.95}, livreur:{pitch:1.0,rate:1.0}, coco:{pitch:1.3,rate:1.0} };
function a(fr){ return fr.startsWith('le ')? 'au '+fr.slice(3) : fr.startsWith('les ')? 'aux '+fr.slice(4) : 'à '+fr; }
const VERBS={
  renifler:{icon:'👃', fr:'renifler', de:'schnüffeln', s:o=>`{N} renifle ${o.fr}.`,            sd:o=>`{N} schnüffelt an ${o.dat}.`},
  prendre: {icon:'🐾', fr:'prendre',  de:'nehmen',     s:o=>`{N} prend ${o.fr}.`,               sd:o=>`{N} nimmt ${o.akk}.`},
  aboyer:  {icon:'🗣️', fr:'aboyer',   de:'bellen',     s:o=>`{N} aboie sur ${o.fr}.`,           sd:o=>`{N} bellt ${o.akk} an.`},
  mendier: {icon:'🥺', fr:'mendier',  de:'betteln',    s:o=>`{N} fait le beau devant ${o.fr}.`, sd:o=>`{N} macht Männchen vor ${o.dat}.`},
  parler:  {icon:'🦜', fr:'parler',   de:'reden',      s:o=>`Coco parle ${a(o.fr)}.`,           sd:o=>`Coco redet mit ${o.dat}.`},
  aller:   {icon:'🚪', fr:'aller',    de:'gehen',      s:o=>`{N} va ${a(o.fr)}.`,               sd:o=>`{N} geht zu ${o.dat}.`},
};
const OBJ={
  boucher:{fr:'le boucher', de:'Metzger', akk:'den Metzger', dat:'dem Metzger', verbs:['parler','mendier','aboyer','renifler']},
  cliente:{fr:'la cliente', de:'Kundin', akk:'die Kundin', dat:'der Kundin', verbs:['parler','aboyer','mendier','renifler']},
  livreur:{fr:'le livreur', de:'Lieferant', akk:'den Lieferanten', dat:'dem Lieferanten', verbs:['parler','aboyer','mendier','renifler']},
  comptoir:{fr:'les saucisses', de:'Würste', akk:'die Würste', dat:'den Würsten', verbs:['renifler','prendre','aboyer']},
  porte:{fr:'la porte de derrière', de:'Hintertür', akk:'die Hintertür', dat:'der Hintertür', verbs:['aller','renifler','aboyer']},
};
const POSE={ boucher:{n:'adv/boucher.webp',angry:'adv/boucher_colere.webp'}, cliente:{n:'adv/cliente.webp',scared:'adv/cliente_peur.webp'}, livreur:{n:'adv/livreur.webp'} };

export function createAdventure(api){
  const S={ active:false, livreurGone:false, bossBusy:false, done:false, talking:false };
  const prop=id=>api.room().props.get(id);
  const tl=new THREE.TextureLoader(), TX={}; const tex=f=>{ if(!TX[f]){ const t=tl.load(f); t.colorSpace=THREE.SRGBColorSpace; TX[f]=t; } return TX[f]; };
  Object.values(POSE).forEach(p=>Object.values(p).forEach(tex));
  function pose(id,k){ const o=prop(id)?.object; if(!o) return; const m=o.userData.body.material; m.map=tex(POSE[id][k]||POSE[id].n); m.needsUpdate=true; }
  const T=[]; const later=(ms,f)=>T.push(setTimeout(()=>{ if(S.active) f(); },ms));

  const bub=document.createElement('div'); bub.id='npcSay'; document.body.appendChild(bub);
  const ring=document.createElement('div'); ring.id='verbRing'; document.body.appendChild(ring);
  const goal=document.createElement('div'); goal.id='advGoal'; document.body.appendChild(goal);
  let bubWho=null, bubT=null;
  for(const ev of ['pointerdown','pointerup','click']) ring.addEventListener(ev,e=>e.stopPropagation());
  addEventListener('pointerdown',e=>{ if(ring.classList.contains('on') && !ring.contains(e.target)) ring.classList.remove('on'); },true);

  function setGoal(t){ goal.innerHTML=t?`🎯 ${N(t)}`:''; goal.classList.toggle('on',!!t&&S.active); }
  function line(fr,de,extra=''){ UI.coco(`<span class="mission fr">${UI.wrap(N(fr))}</span><button class="spk" data-say="${esc(N(fr))}">🔊</button>${de?`<span class="de">${esc(N(de))}</span>`:''}${extra}`,{chirp:false}); }
  function show(who,html,ms){ bubWho=who; bub.innerHTML=html; bub.classList.add('on'); clearTimeout(bubT); bubT=setTimeout(()=>{ bub.classList.remove('on'); bubWho=null; },ms); }
  function npcSay(id,fr,de,ms=4200){ show(id,`<span class="fr">${UI.wrap(N(fr))}</span>${de?`<small>${esc(N(de))}</small>`:''}`,ms);
    const v=VOICE[id]||{}; say(N(fr),{pitch:v.pitch,rate:v.rate,word:true}); const o=prop(id)?.object; if(o) o.userData.talk=Math.min(2.2,ms/2000); }
  function cocoSay(fr,de){ show('coco',`<span class="fr">🦜 ${UI.wrap(N(fr))}</span>${de?`<small>${esc(N(de))}</small>`:''}`,3800); say(N(fr),{...VOICE.coco,word:true}); }

  // ---------- Bewegung der Figuren, Äpfel ----------
  function moveTo(id,x,z,speed=1.4,cb){ const o=prop(id)?.object; if(o) o.userData.goal={x,z,speed,cb}; }
  const apples=[];
  function dropApples(at){ for(let i=0;i<7;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.045,10,8),new THREE.MeshStandardMaterial({color:i%3?'#d8434a':'#7bb36a',roughness:0.5})); m.castShadow=true;
      m.position.set(at.x+(Math.random()-0.5)*0.2,0.55,at.z+0.12); m.userData.v=new THREE.Vector3((Math.random()-0.2)*1.8,1.4,Math.random()*1.0+0.3); api.scene().add(m); apples.push(m); } }
  function clearApples(){ for(const m of apples){ m.parent?.remove(m); m.geometry.dispose(); } apples.length=0; }
  function update(dt,camera){ if(!S.active) return;
    for(const p of api.room().props.values()){ const o=p.object; if(!o?.userData?.npc) continue; const b=o.userData.body, base=o.userData.base, u=o.userData; u.t=(u.t||Math.random()*9)+dt;
      let walking=false; if(u.goal){ const dx=u.goal.x-o.position.x, dz=u.goal.z-o.position.z, d=Math.hypot(dx,dz); if(d<0.03){ const cb=u.goal.cb; u.goal=null; cb&&cb(); } else { const st=Math.min(d,u.goal.speed*dt); o.position.x+=dx/d*st; o.position.z+=dz/d*st; walking=true; if(Math.abs(dx)>0.02) u.face=Math.sign(dx); } }
      u.talk=Math.max(0,(u.talk||0)-dt); const br=Math.sin(u.t*2.1)*0.012+(u.talk?Math.abs(Math.sin(u.t*14))*0.02:0);
      b.scale.set(base.w*(u.face||1)*(1-br*0.4),base.h*(1+br),1);
      b.position.y= walking? Math.abs(Math.sin(u.t*9))*0.05 : (u.hop? Math.sin(u.hop*Math.PI)*0.3:0); b.rotation.z= walking? Math.sin(u.t*9)*0.04 : (u.bend||0)*(u.face||1);
      if(u.hop) u.hop=Math.max(0,u.hop-dt*2.2); }
    for(const m of apples){ const v=m.userData.v; if(!v) continue; v.y-=9.8*dt; m.position.addScaledVector(v,dt); if(m.position.y<0.045){ m.position.y=0.045; v.y=-v.y*0.35; v.x*=0.85; v.z*=0.85; if(Math.abs(v.y)<0.3) v.y=0; } m.rotation.x+=v.z*dt*8; m.rotation.z-=v.x*dt*8; if(v.lengthSq()<0.002) m.userData.v=null; }
    if(bubWho && bub.classList.contains('on')){ const v=new THREE.Vector3(); let h;
      if(bubWho==='coco'){ api.dog.head.getWorldPosition(v); h=0.35; } else { const o=prop(bubWho)?.object; if(!o) return; o.getWorldPosition(v); h=o.userData.base.h+0.1; }
      v.y+=h; v.project(camera); const x=(v.x*0.5+0.5)*innerWidth, y=(-v.y*0.5+0.5)*innerHeight; bub.style.left=Math.max(120,Math.min(innerWidth-120,x))+'px'; bub.style.top=Math.max(64+bub.offsetHeight,y)+'px'; } }

  // ---------- Verb-Ring ----------
  function tap(p,x,y){ if(!S.active) return false; const o=OBJ[p.id]; if(!o) return false; if(S.talking||S.done) return true;
    if(p.id==='livreur' && S.livreurGone) return true;
    const vs=o.verbs; ring.innerHTML=`<div class="rc"><b class="fr">${esc(o.fr)}</b><small>${esc(o.de)}</small></div>`+vs.map((v,i)=>{ const ang=-Math.PI/2+i*2*Math.PI/vs.length;
      return `<button data-v="${v}" style="left:${50+Math.cos(ang)*39}%;top:${50+Math.sin(ang)*39}%"><span>${VERBS[v].icon}</span><b>${VERBS[v].fr}</b></button>`; }).join('');
    ring.style.left=Math.max(100,Math.min(innerWidth-100,x))+'px'; ring.style.top=Math.max(160,Math.min(innerHeight-270,y))+'px'; ring.classList.add('on'); sfx.pop(); say(o.fr,{word:true});
    ring.querySelectorAll('button').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); ring.classList.remove('on'); act(b.dataset.v,p.id); }); return true; }

  function act(v,id){ const o=OBJ[id], p=prop(id), V=VERBS[v], d=api.dog; sfx.tap();
    line(V.s(o),V.sd(o)); learn('v:'+v,{kind:'word',fr:V.fr,de:V.de,gram:''},1);
    const sp=p.spot||[p.pos[0],p.pos[1]+0.6];
    const go=cb=>{ const dist=Math.hypot(d.root.position.x-sp[0],d.root.position.z-sp[1]); const face=()=>d.facePoint(p.pos[0],p.pos[1]);
      if(dist<0.35||v==='parler'&&dist<2.2){ face(); cb(); } else d.walkTo(sp[0],sp[1],()=>{ face(); cb(); }); };
    if(v==='parler') return go(()=>talk(id));
    go(()=>react(v,id)); }

  // ---------- Reaktionen (das Rätsel) ----------
  function react(v,id){ const d=api.dog;
    if(v==='renifler'){ d.WT.sniff=1; setTimeout(()=>{ d.WT.sniff=0; },1500);
      const R={ comptoir:['Mmmh… les saucisses sentent bon !','Mmmh … die Würste duften!'], cliente:['La cliente sent les pommes.','Die Kundin riecht nach Äpfeln.'], boucher:['Le boucher sent… la saucisse !','Der Metzger riecht … nach Wurst!'],
        livreur:['Le livreur a une caisse de saucisses.','Der Lieferant hat eine Kiste voller Würste.'], porte:['Ça sent bon derrière la porte !','Hinter der Tür riecht es lecker!'] }[id];
      later(900,()=>line(R[0],R[1]));
      if(id==='comptoir' && !S.bossBusy) later(1600,()=>angry('Hé ! Pas de chien ici !','He! Keine Hunde hier!'));
      return; }
    if(v==='aboyer'){ d.bark();
      if(id==='cliente'){ if(S.bossBusy) return later(600,()=>npcSay('cliente','Encore ce chien !','Schon wieder dieser Hund!'));
        later(450,()=>{ pose('cliente','scared'); const c=prop('cliente').object; c.userData.hop=1; npcSay('cliente','Aaah ! Au secours ! Mes pommes !','Aaah! Hilfe! Meine Äpfel!'); dropApples(c.position); });
        later(2600,()=>{ S.bossBusy=true; const c=prop('cliente').object; npcSay('boucher','Oh là là ! Attendez, madame, je vous aide !','Oje! Warten Sie, ich helfe Ihnen!');
          moveTo('boucher',c.position.x+0.8,c.position.z+0.45,1.6,()=>{ const u=prop('boucher').object.userData; u.bend=0.4; u.face=-1; });
          setGoal(goalText()); if(S.livreurGone) line('Le boucher ne regarde pas !','Der Metzger schaut nicht her – jetzt ist deine Chance!'); });
        later(16000,()=>{ if(S.done) return; const u=prop('boucher').object.userData; u.bend=0; pose('cliente','n'); clearApples(); npcSay('cliente','Merci, monsieur !','Danke, mein Herr!');
          const h=prop('boucher').home; moveTo('boucher',h.x,h.z,1.4,()=>{ prop('boucher').object.userData.face=1; S.bossBusy=false; setGoal(goalText()); }); });
        return; }
      if(id==='boucher') return later(500,()=>angry('Ouste ! Dehors, le chien !','Husch! Raus, du Hund!'));
      if(id==='livreur') return later(500,()=>npcSay('livreur','Ha ha ! Il est drôle, ton chien !','Haha! Lustig, dein Hund!'));
      if(id==='comptoir') return later(500,()=> S.bossBusy? line('Personne ne répond.','Keiner antwortet.') : angry('Chut ! Pas de bruit ici !','Pst! Keinen Lärm hier!'));
      if(id==='porte') return later(500,()=>line('Personne derrière la porte… ?','Niemand hinter der Tür …?'));
      return; }
    if(v==='mendier'){ d.doRaw?.({do:'trick',id:'beau'});
      const R={ boucher:['Non, non, non ! Pas de saucisse pour les chiens.','Nein, nein! Keine Wurst für Hunde.'], cliente:["Oh, il est mignon… mais je n'ai que des pommes.",'Oh, ist der süß … aber ich habe nur Äpfel.'], livreur:['Désolé, ce ne sont pas mes saucisses !','Tut mir leid, das sind nicht meine Würste!'] }[id];
      if(R) later(1500,()=>npcSay(id,R[0],R[1])); return; }
    if(v==='prendre' && id==='comptoir') return later(300,()=> S.bossBusy? line('La vitrine est fermée. Zut !','Die Vitrine ist zu. Mist!') : angry('Pas touche !','Pfoten weg!'));
    if(v==='aller' && id==='porte'){
      if(!S.livreurGone) return later(300,()=>npcSay('livreur',"Hé, le chien ! C'est privé, ici !",'He, Hund! Hier ist privat!'));
      if(!S.bossBusy) return later(300,()=>angry('Hé ! Pas par là, le chien !','He! Nicht da lang, Hund!'));
      return sneak(); }
  }
  function angry(fr,de){ pose('boucher','angry'); npcSay('boucher',fr,de); prop('boucher').object.userData.hop=0.6; later(2600,()=>pose('boucher','n'));
    const d=api.dog; d.walkTo(d.root.position.x-0.5,0.9,null,{run:true}); }

  // ---------- Gespräche ----------
  function choose(opts){ S.talking=true; UI.chips(opts.map(o=>({cls:'fr ans',html:`${esc(o.fr)} <small>${esc(o.de)}</small>`,onClick:()=>{ const own=window.__spoken; window.__spoken=false; S.talking=false; chips();
      cocoSay(o.fr); if(own){ P.treats+=1; save(); api.toast('🎤 Selbst gesagt! +1 🦴'); }
      learn('s:'+o.fr,{kind:'word',fr:o.fr,de:o.de,gram:''},own?2:1); later(1400,()=>o.then()); }})));
    line('Que dit Coco ?','Was soll Coco sagen?',`<span class="tip">💡 Antippen – oder selbst sagen/schreiben für +1 🦴</span>`); }
  function talk(id){
    if(id==='livreur'){ npcSay('livreur','Salut, le chien ! Et bonjour, le perroquet !','Hallo, Hund! Und guten Tag, Papagei!');
      later(1300,()=>choose([
        {fr:'Bonjour ! Ça va ?',de:"Hallo! Wie geht's?",then:()=>{ npcSay('livreur','Ça va bien, merci ! Mais je suis pressé…','Gut, danke! Aber ich habe es eilig …'); later(3000,leave); }},
        {fr:'Où sont les saucisses ?',de:'Wo sind die Würste?',then:()=>{ npcSay('livreur','Ha ! Dans ma caisse, derrière la porte !','Ha! In meiner Kiste, hinter der Tür!'); later(3200,leave); }},
        {fr:'Je voudrais un éléphant.',de:'Ich hätte gern einen Elefanten.',then:()=>{ npcSay('livreur','Un éléphant ? Ici ? Ha ha ha !','Einen Elefanten? Hier? Hahaha!'); later(3200,leave); }} ])); return; }
    if(id==='boucher'){ npcSay('boucher','Bonjour ! Vous désirez ?','Guten Tag! Was darf es sein?');
      later(1300,()=>choose([
        {fr:"Je voudrais une saucisse, s'il vous plaît.",de:'Ich hätte gern eine Wurst, bitte.',then:()=>{ npcSay('boucher','Volontiers ! Ça fait deux euros.','Gern! Das macht zwei Euro.'); later(3300,()=>cocoSay("Euh… je n'ai pas d'argent.",'Äh … ich habe kein Geld.')); later(6600,()=>npcSay('boucher',"Pas d'argent, pas de saucisse !",'Kein Geld, keine Wurst!')); }},
        {fr:'Une saucisse ! Vite !',de:'Eine Wurst! Schnell!',then:()=>angry('Hmm… Et la politesse ?','Hmm … und die Höflichkeit?')},
        {fr:'Vous avez un chat ?',de:'Haben Sie eine Katze?',then:()=>npcSay('boucher','Un chat ? Non ! Pourquoi ?','Eine Katze? Nein! Warum?')} ])); return; }
    if(id==='cliente'){ npcSay('cliente','Oh ! Un perroquet qui parle !','Oh! Ein sprechender Papagei!');
      later(1300,()=>choose([
        {fr:'Bonjour, madame !',de:'Guten Tag, meine Dame!',then:()=>npcSay('cliente',"Bonjour ! Mais j'ai un peu peur des chiens…",'Guten Tag! Aber ich habe ein bisschen Angst vor Hunden …',5000)},
        {fr:'Vous avez des pommes ?',de:'Haben Sie Äpfel?',then:()=>npcSay('cliente','Oui, plein de pommes ! Pour ma tarte.','Ja, ganz viele Äpfel! Für meinen Kuchen.',5000)},
        {fr:'Mon chien est très gentil.',de:'Mein Hund ist sehr lieb.',then:()=>npcSay('cliente',"Gentil ? Hmm… je n'aime pas trop les chiens…",'Lieb? Hmm … ich mag Hunde nicht so …',5000)} ])); return; }
  }
  function leave(){ npcSay('livreur','Monsieur Morel ! Je reviens dans cinq minutes !','Herr Morel! Ich bin in fünf Minuten zurück!',4500);
    later(2000,()=>npcSay('boucher',"D'accord !",'In Ordnung!',2000));
    later(2600,()=>{ const l=prop('livreur'); moveTo('livreur',l.object.position.x+1.5,l.object.position.z-0.2,1.2,()=>{ l.object.visible=false; S.livreurGone=true; setGoal(goalText());
      line('Le livreur est parti !','Der Lieferant ist weg – die Hintertür ist frei. Aber der Metzger passt auf …'); }); }); }
  function goalText(){ return S.bossBusy&&S.livreurGone? 'Schnell, ab durch die Hintertür!' : S.livreurGone? 'Lenk den Metzger ab – dann ab durch die Hintertür!' : 'Hol dir eine Wurst!'; }

  // ---------- Lösung ----------
  function sneak(){ const d=api.dog, door=prop('porte'); S.done=true; setGoal('');
    d.walkTo(door.pos[0],door.pos[1]+0.2,()=>{ d.root.visible=false; line('{N} se faufile dans la cour…','{N} schlüpft in den Hof …');
      later(1500,()=>{ d.root.visible=true; api.giveSausage(6000); sfx.success(); api.fx.hearts(5); d.happy(4000); line('{N} a la saucisse ! Miam !','{N} hat die Wurst! Lecker!'); });
      later(3000,()=>{ const u=prop('boucher').object.userData; u.bend=0; u.face=1; pose('boucher','angry'); npcSay('boucher','Hé ! Ma saucisse ! Reviens ici !','He! Meine Wurst! Komm sofort zurück!'); });
      later(4400,()=>{ const x0=api.room().rooms.find(r=>r.id==='boucherie').x; d.walkTo(x0-3.6,0.8,null,{run:true}); });
      later(6800,finish); },{run:true,raw:true}); }
  function finish(){ const first=!(P.adv??={}).saucisse; P.adv.saucisse=Date.now(); if(first) P.treats+=3; save(); api.celebrate?.();
    UI.coco(`<span class="medal">🏆</span><span class="mission fr">${UI.wrap('Bravo ! Et maintenant… la gare !')}</span><button class="spk" data-say="Bravo ! Et maintenant… la gare !">🔊</button><span class="de">Bravo! Und jetzt … zum Bahnhof! (Fortsetzung folgt)${first?' · +3 🦴':''}</span>`,{chirp:false});
    cocoSay('Bravo ! Et maintenant… la gare !');
    UI.chips([{cls:'sol',html:'🔁 Nochmal spielen',onClick:()=>start()},{html:'🏠 Nach Hause',onClick:()=>stop()}]); }

  // ---------- Start / Ende ----------
  function reset(){ T.forEach(clearTimeout); T.length=0; clearApples(); ring.classList.remove('on'); Object.assign(S,{livreurGone:false,bossBusy:false,done:false,talking:false});
    for(const id of ['boucher','cliente','livreur']){ const p=prop(id); if(!p) continue; p.object.position.copy(p.home); Object.assign(p.object.userData,{goal:null,bend:0,face:1,hop:0}); p.object.visible=true; pose(id,'n'); }
    api.dog.root.visible=true; }
  function chips(){ UI.chips([{html:'🏠 Nach Hause',onClick:()=>stop()}]); }
  function start(){ UI.thinkHide?.(); S.active=true; api.switchTo('boucherie'); reset(); document.body.classList.add('adv');
    UI.setInputMode('text','Antippen – oder selbst sagen 🎤'); setGoal('Hol dir eine Wurst!'); chips();
    line('{N} a faim. Les saucisses sentent si bon…','{N} hat Hunger. Die Würste riechen so gut … Tippe Leute und Dinge an!');
    later(1300,()=>npcSay('boucher','Bonjour ! Bienvenue à la boucherie !','Hallo! Willkommen in der Metzgerei!')); }
  function stop(){ reset(); S.active=false; document.body.classList.remove('adv'); goal.classList.remove('on'); bub.classList.remove('on'); api.switchTo('salon'); api.resume(); }
  function input(raw){ if(!S.active) return false; cocoSay(raw); return true; }
  function help(){ if(!S.active) return false;
    const t= !S.livreurGone? 'Rede mal mit dem Lieferanten an der Hintertür (🦜 parler).' : !S.bossBusy? 'Der Metzger muss abgelenkt werden. Die Kundin hat Angst vor Hunden … (🗣️ aboyer)' : 'Jetzt! Tippe die Hintertür an und wähle 🚪 aller.';
    line('Coco a une idée…','💡 '+t); return true; }

  return { get active(){ return S.active; }, start, stop, input, prop:()=>false, tap, help, update };
}
