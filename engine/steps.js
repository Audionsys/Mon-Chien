// Ablauf: Kapitel → Schritte, Tippleiter, Belohnung, Wiederholung
import { COURSE } from '../content/course.js';
import { COMMANDS } from '../content/commands.js';
import { DECKS } from '../content/vocab.js';
import { parseCommand, checkAnswer, missingAccent, norm } from './lang.js';
import { P, save, learn, dueItems, snapshot } from './progress.js';
import { say, sfx } from './audio.js';
import * as UI from './ui.js';
const { N } = UI;
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const cmdKey=id=>'cmd:'+id;
export const help={ get de(){ try{ return localStorage.getItem('chien_helpde')!=='0'; }catch(e){ return true; } }, set de(v){ try{ localStorage.setItem('chien_helpde',v?'1':'0'); }catch(e){} } };
const HOW={ command:'✍️ Schreib das französische Kommando unten ins Feld und tippe ➤.', choice:'👆 Tippe unten die richtige Antwort an.', fill:'✍️ Schreib das fehlende Wort unten ins Feld.',
  build:'👆 Tippe die Wörter unten in der richtigen Reihenfolge an.', object:'👆 Tippe den Gegenstand im Zimmer an.', teachcard:'✍️ Schreib das französische Wort (mit le/la) unten ins Feld.',
  listen:'🔊 Hör gut zu und tippe an, was du gehört hast.' };

// Lösung eines Schritts (für Tippleiter + Eltern-Ansicht)
export function solutionOf(st){
  switch(st.type){
    case 'command': return COMMANDS[st.cmd].fr;
    case 'choice': return st.answer;
    case 'fill': return st.answer[0];
    case 'build': return st.answer;
    case 'object': return st._word || st.target;
    case 'name': return "Il s'appelle …";
    case 'teachcard': return st.word.fr;
    case 'listen': return st.answer;
    case 'teach': return '';
    case 'defi': return '';
    default: return '';
  }
}

function markFurthest(){ const f=P.furthest||{chapter:0,step:0}; if(P.chapter>f.chapter || (P.chapter===f.chapter && P.step>f.step)) P.furthest={chapter:P.chapter,step:P.step}; }
export { markFurthest };
// kurze Beschreibung eines Schritts (für "Hierhin springen")
export function stepLabel(st){ const map={intro:'🎯 Einführung',name:'🐶 Name geben',tuto:'🧭 Tutorial',dialogue:'💬 Geschichte',command:'🗣️ Kommando',choice:'👆 Auswählen',fill:'✍️ Lücke füllen',build:'🧩 Satz bauen',object:'🔍 Gegenstand finden',teach:'🧠 Vokabeln beibringen',listen:'👂 Hören',defi:'🏆 Hundeshow (Test)'};
  let t=map[st.type]||st.type; if(st.type==='command') t+=': '+COMMANDS[st.cmd].de; else if(st.type==='teach') t+=': '+(DECKS[st.deck]?.titel||''); else if(st.de && st.type!=='dialogue') t+=': '+st.de.replace(/<[^>]+>/g,'').slice(0,46); return N(t); }

export class Runner {
  constructor(g){ this.g=g; this.mode='course'; this.hint=0; this.review=null; this.freeplay=false; }
  get chapter(){ return COURSE.chapters[P.chapter]; }
  get step(){ const st= this.review ? this.review.steps[this.review.i] : this.chapter?.steps[P.step]; return (st&&st.fem&&P.gender==='f')? {...st,...st.fem} : st; }

  start(){
    if(!P.name){ P.chapter=0; P.step=0; }
    if(P.chapter>=COURSE.chapters.length){ this.freePlay(); return; }
    this.begin();
  }
  begin(){ UI.thinkHide(); this.wrong=0; this.solved=false; const st=this.step; if(!st) return this.chapterDone(); this.hintBase=(help.de&&st.de)?1:0; this.hint=this.hintBase;
    if(st.type==='object'){ const p=this.g.room.props.get(st.target); st._word=p?.word.fr; }
    this.g.onStep?.(st);
    this.renderTop(); (H[st.type]||H.dialogue).start.call(this,st); }
  renderTop(){
    const ch=this.chapter; const t=UI.$('chap');
    if(this.review) t.innerHTML=`Révision<small>Wiederholung</small>`;
    else if(this.freeplay||!ch) t.innerHTML=`Jeu libre<small>Freies Spiel</small>`;
    else t.innerHTML=`<span class="long">Chapitre </span>${P.chapter+1} · ${N(ch.titre)}<small>Kapitel ${P.chapter+1} · ${N(ch.titel)}</small>`;
    const pr=UI.$('progress'); pr.innerHTML='';
    const list=this.review?this.review.steps:(this.freeplay?[]:ch.steps); const cur=this.review?this.review.i:P.step;
    pr.innerHTML=`<span class="pbar"><i style="width:${list.length?Math.round(cur/list.length*100):0}%"></i></span><small>${Math.min(cur+1,list.length)}/${list.length}</small>`;
    pr.style.display=list.length?'flex':'none';
    UI.$('treats').textContent=P.treats;
  }

  // ---- Tippleiter: Übersetzung → eigene Tipps → Lösung ----
  ladder(st){ if(st.type==='teach') st=this.cardSt||st; const L=[]; if(st.de) L.push(UI.deLine(st.de)); (st.hints||[]).forEach(h=>L.push(UI.tipLine(h)));
    const sol=solutionOf(st); if(sol) L.push(`<span class="tip">✅ Lösung: <b class="fr">${UI.esc(N(sol))}</b></span>`); return L; }
  prompt(st,extra=''){ const L=this.ladder(st); let h=UI.frLine(st.fr); for(let i=0;i<Math.min(this.hint,L.length);i++) h+=L[i]; if(HOW[st.type]) h+=`<span class="how">${HOW[st.type]}</span>`; UI.coco(h+extra,{chirp:false}); this.armIdle(); }
  helpChip(st){ const L=this.ladder(st); if(this.hint>=L.length) return [];
    const lbl= this.hint===L.length-1? '💡 Lösung zeigen' : this.hint<=(this.hintBase||0)? '💡 Tipp, Coco?' : '💡 Noch ein Tipp';
    return [{cls:'help', html:lbl, onClick:()=>{ this.hint++; this.refresh(); if(this.hint===L.length) this.onSolutionShown?.(st); }}]; }
  refresh(extra=''){ const st=this.step; (H[st.type]||H.dialogue).render.call(this,st,extra); }
  armIdle(){ clearTimeout(this.idleT); if(this.solved) return; this.idleT=setTimeout(()=>{ if(this.g.busy?.()) return this.armIdle(); if(this.hint<=(this.hintBase||0) && this.step?.de){ this.hint++; this.refresh(); return; } if(false){ this.hint=1; this.refresh(); } },20000); }
  miss(extra){ if(Math.random()<0.4) setTimeout(()=>this.g.quip?.('oops'),2200); this.wrong++; this.hint=Math.min(this.ladder(this.step).length, Math.max(this.hint, 1) + (this.wrong>1?1:0)); sfx.soft_no(); this.refresh(extra); }

  // ---- geschafft ----
  complete(st,{extra='',sayText}={}){
    if(this.solved) return; this.solved=true; clearTimeout(this.idleT);
    const quality= this.hint<=(this.hintBase||0)&&this.wrong===0 ? 2 : 1; const gain= quality===2?2:1; P.treats+=gain; this.g.love?.('aide'); this.g.track?.('tasks'); setTimeout(()=>this.g.badgeCheck?.(),2600);
    sfx.success(); setTimeout(()=>sfx.treat(),450); this.g.fx.hearts(3);
    // Carnet
    if(st.type==='command') learn(cmdKey(st.cmd),{kind:'cmd',cmd:st.cmd,fr:COMMANDS[st.cmd].fr,de:COMMANDS[st.cmd].de,gram:COMMANDS[st.cmd].gram},quality);
    if(st.type==='object'){ const p=this.g.room.props.get(st.target); learn('w:'+p.word.fr,{kind:'word',prop:p.id,fr:p.word.fr,de:p.word.de,gram:''},quality); }
    (st.learn||[]).forEach(e=>learn('w:'+e.fr,{kind:'word',fr:e.fr,de:e.de,gram:e.gram||''},quality));
    if(st._reviewKey) learn(st._reviewKey,{},quality);
    save(); this.renderTop();
    const sol=solutionOf(st);
    let h=`<span class="mission fr">${['Bravo !','Super !','Génial !','Très bien !'][Math.floor(Math.random()*4)]}</span> <span class="de" style="display:inline">+${gain} 🦴</span>`;
    const full = st.type==='command'? COMMANDS[st.cmd].fr : (st.type==='choice'||st.type==='fill'||st.type==='listen')? (st.full|| (st.type==='listen'?st.answer: st.fr.replace('___',sayText||sol))) : st.type==='build'? st.answer+'.' : null;
    const fullDe = st.type==='command'? COMMANDS[st.cmd].de : st.type==='build'? ((st.de||'').match(/„(.+)“/)||[])[1]||'' : st.de;
    if(full) h+=`<span class="note">📖 <b class="fr">${UI.esc(N(full))}</b>${fullDe?' = '+UI.esc(N(fullDe)):''}</span>`;
    if(st.type==='command') h+=UI.noteLine(`✏️ ${COMMANDS[st.cmd].gram}`);
    if(st.note) h+=UI.noteLine('✏️ '+st.note);
    UI.coco(h+extra); say(N(full || sayText || sol)); if(Math.random()<0.3) setTimeout(()=>this.g.quip?.('bravo'),2600);
    UI.chips([{cls:'sol', html:'Weiter ➜', onClick:()=>this.next()}]);
  }
  next(){
    if(this.review){ this.review.i++; if(this.review.i>=this.review.steps.length){ this.review=null; UI.coco(`<span class="mission fr">Révision terminée !</span>${UI.deLine('Wiederholung geschafft! Weiter geht’s.')}`); sfx.chapter(); UI.chips([{cls:'sol',html:'Weiter ➜',onClick:()=>this.start()}]); return; } return this.begin(); }
    P.step++; markFurthest(); save(); if(P.step>=this.chapter.steps.length) return this.chapterDone(); this.begin();
  }
  chapterDone(){
    sfx.chapter(); this.g.fx.hearts(5); this.g.celebrate?.(); const ch=this.chapter;
    P.chapter++; P.step=0; P.unlocked=Math.max(P.unlocked,P.chapter); markFurthest(); save(); snapshot(`Kapitel ${P.chapter} geschafft`);
    const more=P.chapter<COURSE.chapters.length;
    UI.coco(`<span class="mission fr">Bravo ! Chapitre terminé !</span>${UI.deLine(`Kapitel „${N(ch.titel)}“ geschafft!`)}<span class="note">📖 Alles Gelernte steht im Carnet.</span>`);
    say('Bravo ! Chapitre terminé !');
    UI.chips([ {cls:'sol',html:'🗺️ Zur Karte',onClick:()=>this.g.openMap?.()}, more?{html:`Chapitre ${P.chapter+1} ➜`,onClick:()=>this.begin()}:{html:'Jeu libre ➜',onClick:()=>this.freePlay()},
               {html:'🔁 Réviser',onClick:()=>this.startReview()} ]);
    this.renderTop();
  }
  freePlay(){ this.freeplay=true; this.review=null; this.renderTop(); UI.setInputMode('text','Parle à {N}…');
    const known=Object.values(P.items).filter(i=>i.kind==='cmd').map(i=>i.cmd);
    UI.coco(`${UI.frLine('Bravo ! {N} connaît beaucoup de mots. Joue avec lui !')}${UI.deLine('{N} kennt jetzt viele Wörter. Spiel mit ihm – alles steht im 📖 Carnet.')}`);
    UI.chips([...known.map(id=>({cls:'fr',html:COMMANDS[id].fr,onClick:()=>this.g.command(id)})), {html:'🔁 Réviser',onClick:()=>this.startReview()}]); }

  // ---- Wiederholung aus dem Vokabelkasten ----
  startReview(){
    const due=dueItems(5); if(!due.length){ UI.coco(UI.tipLine('Noch nichts zum Wiederholen – erst ein paar Aufgaben lösen!')); return; }
    const all=Object.values(P.items);
    const steps=due.map(it=>{
      if(it.kind==='vocab') return { type:'teach', words:[{pic:it.pic,fr:it.fr,de:it.de,alt:it.alt,deck:it.deck}], quizOnly:true, fr:'Révision avec {N} !', de:'Wiederholen mit {N}!' };
      if(it.kind==='cmd') return { type:'command', cmd:it.cmd, fr:`Comment dit-on « ${it.de} » ?`, de:`Wie sagt man „${it.de}“ auf Französisch?`, _reviewKey:'cmd:'+it.cmd };
      if(it.prop) return { type:'object', target:it.prop, fr:`Touche ${it.fr} !`, de:`Tippe ${it.de} an!`, _reviewKey:'w:'+it.fr };
      const others=shuffle(all.filter(o=>o.fr!==it.fr)).slice(0,2).map(o=>o.fr);
      return { type:'choice', fr:`Comment dit-on « ${it.de} » ?`, de:`Wie sagt man „${it.de}“?`, options:shuffle([it.fr,...others]), answer:it.fr, _reviewKey:'w:'+it.fr };
    });
    this.review={steps,i:0}; this.freeplay=false; this.begin();
  }

  startDeck(id){ this.review={steps:[{type:'teach',deck:id,fr:'{N} veut apprendre des mots !',de:'{N} will Wörter lernen!'}],i:0}; this.freeplay=false; this.begin(); }

  // fester 💡-Knopf: nächster Tipp – oder erklären, was zu tun ist
  helpNow(){ const st=this.step; if(!st){ return; }
    if(this.review==null && !this.solved && st.type!=='defi'){ const S=st.type==='teach'?(this.cardSt||st):st; const L=this.ladder(S);
      if(['command','choice','fill','build','object','listen','teach'].includes(st.type) && this.hint<L.length){ this.hint++; this.refresh(); if(this.hint===L.length) this.onSolutionShown?.(st); return 'hint'; } }
    if(st.type==='defi' && !this.solved) return 'joker';
    return 'none'; }
  event(name){ const st=this.step; if(st?.type==='tuto' && !this.solved) H.tuto.event.call(this,st,name); }

  // ---- Eingaben ----
  input(raw){ const st=this.step; if(st && !this.solved){ const h=H[st.type]; if(h?.input && h.input.call(this,st,raw)) return; }
    this.g.freeCommand(raw); }
  prop(p){ const st=this.step; if(st && !this.solved && H[st.type]?.prop){ return H[st.type].prop.call(this,st,p); } return false; }
}

// ---------- Wort-Vorschau am Kapitelanfang (wie Karteikarten anschauen) ----------
export function chapterWords(ch){ const out=[], seen=new Set(); const add=(fr,de,pic='')=>{ if(!fr||!de) return; const k=norm(fr); if(seen.has(k)) return; seen.add(k); out.push({fr,de,pic}); };
  for(const st of ch.steps){ if(st.type==='command'&&COMMANDS[st.cmd]) add(COMMANDS[st.cmd].fr,COMMANDS[st.cmd].de);
    if(st.type==='teach'&&DECKS[st.deck]){ const w=DECKS[st.deck].words; const [a,b]=st.range||[0,w.length]; w.slice(a,b).forEach(x=>add(x.fr,x.de,x.pic)); }
    (st.learn||[]).forEach(l=>add(l.fr,l.de)); }
  return out; }
export function showWords(ch){ const W=chapterWords(ch); P.seenWords ??= {}; P.seenWords[ch.id]=1; save();
  UI.openSheet('👀 Neue Wörter', `<p class="sub">Die musst du <b>nicht</b> auswendig können! Schau sie dir einfach an und tippe drauf zum Anhören – wie bei Karteikarten. Im Spiel helfen dir Coco und 💡, und mit der Zeit kennst du sie von ganz allein.</p>
    ${W.map((w,i)=>`<button class="row" data-w="${i}"><b class="fr">${w.pic?w.pic+' ':''}${UI.esc(N(w.fr))} 🔊</b><small>${UI.esc(N(w.de))}</small></button>`).join('')}
    <p class="sub">Alle Wörter findest du später im 📖 Carnet.</p>`, {onOpen:b=>b.querySelectorAll('[data-w]').forEach(x=>x.onclick=()=>say(N(W[+x.dataset.w].fr),{word:true}))}); }

// ================= Schritt-Typen =================
const H = {
  name:{
    start(st){ UI.setInputMode('text',"Il s'appelle…"); this.refresh(); say("Voici ton nouveau chien ! Comment s'appelle ton chien ?"); },
    render(){ UI.coco(`${UI.frLine("Voici ton nouveau chien ! Comment s'appelle ton chien ?")}${UI.deLine('Hier ist dein neuer Hund! Wie heißt er? Gib ihm einen Namen – oder nimm einen Vorschlag.')}${UI.tipLine("Antworte so: <b class=\"fr\">Il s'appelle …</b> (= Er heißt …)")}`);
      const ideas=[['Réglisse','Lakritz'],['Nuit','Nacht'],['Filou','Schlingel'],['Biscuit','Keks'],['Noisette','Haselnuss']];
      UI.chips([{html:'🐶 Anderer Hund?',onClick:()=>this.g.openDogs?.()}, ...ideas.map(([n,de])=>({cls:'fr',html:`${n} <small>${de}</small>`,onClick:()=>{ UI.$('inp').value="Il s'appelle "+n; UI.$('inp').focus(); say(n); }}))]); },
    input(st,raw){
      let n=raw.trim().replace(/^(il|elle)\s*s['’ ]?\s*app?ell?e\s*/i,'').replace(/^(c['’ ]?est|son nom est|mon chien s['’ ]?appelle)\s*/i,'').replace(/[.!?]+$/,'').trim();
      n=n.split(/\s+/).slice(0,2).join(' ').slice(0,16);
      if(!n||!/[a-zà-ÿ]/i.test(n)){ UI.coco(UI.tipLine("Schreib einfach einen Namen, z. B. <b class=\"fr\">Il s'appelle Réglisse</b>.")); return true; }
      n=n.charAt(0).toUpperCase()+n.slice(1); const full=/s['’ ]?appell?e/i.test(raw);
      P.name=n; UI.setInputMode('text','Parle à {N}…'); this.g.dog.name(); this.g.fx.hearts(4);
      learn('w:il s appelle',{kind:'word',fr:`Il s'appelle ${n}.`,de:`Er heißt ${n}.`,gram:"s'appeler (heißen) → il s'appelle"},full?2:1);
      if(full) P.treats+=1;
      this.solved=true; P.treats+=1; save(); this.renderTop(); sfx.success();
      UI.coco(`${UI.frLine(`${n} ! Quel joli nom !`)}${UI.deLine(`${n}! Was für ein schöner Name!`)}<span class="note">📖 <b class="fr">Il s'appelle ${n}.</b> = Er heißt ${n}.<br><small>✏️ s'appeler (heißen) → il s'appelle${full?' · +1 🦴 extra für den ganzen Satz!':''}</small></span>${UI.tipLine(`Ruf ihn ruhig mal: <b class="fr">${n} !</b>`)}`);
      say(`${n} ! Quel joli nom !`);
      const pickG=(g)=>{ P.gender=g; save(); sfx.success(); this.g.fx.hearts(2);
        const t= g==='f'? `C'est une chienne. Elle s'appelle ${n}.` : `C'est un chien. Il s'appelle ${n}.`; say(t);
        learn('w:il s appelle',{kind:'word',fr: g==='f'?`Elle s'appelle ${n}.`:`Il s'appelle ${n}.`,de: g==='f'?`Sie heißt ${n}.`:`Er heißt ${n}.`,gram:"s'appeler: il s'appelle / elle s'appelle"},1);
        UI.coco(`<span class="mission fr">${t}</span>${UI.noteLine(g==='f'?'📖 <b class="fr">une chienne</b> = eine Hündin · <b class="fr">elle</b> = sie':'📖 <b class="fr">un chien</b> = ein Hund · <b class="fr">il</b> = er')}${UI.tipLine(`Ruf ${g==='f'?'sie':'ihn'} ruhig mal: <b class="fr">${n} !</b>`)}`);
        UI.chips([{cls:'sol',html:'Weiter ➜',onClick:()=>this.next()}]); };
      setTimeout(()=>{ if(P.gender) return; UI.coco(`${UI.frLine(`${n}, c'est un chien ou une chienne ?`)}${UI.deLine(`Ist ${n} ein Junge (Rüde) oder ein Mädchen (Hündin)?`)}`); say(`${n}, c'est un chien ou une chienne ?`); },3200);
      P.gender=null;
      UI.chips([{cls:'sol fr',html:"♂ C'est un chien.",onClick:()=>pickG('m')},{cls:'sol fr',html:"♀ C'est une chienne.",onClick:()=>pickG('f')}]); return true; },
  },

  intro:{
    start(st){ UI.setInputMode('text'); this.refresh(); say(N(st.fr)); },
    render(st){ const u=this.chapter?.unite; UI.coco(`<span class="tutostep">Chapitre ${P.chapter+1}${u?` · 📘 ${/\d/.test(u)?'Unité '+u:u}`:''}</span>${UI.frLine(st.fr)}<span class="goal">🎯 <b>Darum geht's:</b> ${N(st.ziel)}</span>${st.tipp?`<span class="how">💬 ${N(st.tipp)}</span>`:''}`,{chirp:true});
      const W=chapterWords(this.chapter);
      UI.chips([...(W.length?[{cls:'fr',html:`👀 Neue Wörter <small>${W.length}</small>`,onClick:()=>showWords(this.chapter)}]:[]),{cls:'sol',html:"C'est parti ➜",onClick:()=>{ this.solved=true; this.next(); }}]);
      if(W.length && !(P.seenWords||{})[this.chapter.id]) setTimeout(()=>{ if(this.step?.type==='intro') showWords(this.chapter); },1600); },
  },
  dialogue:{
    start(st){ this.line=0; UI.setInputMode('text'); this.refresh(); say(N(st.lines[0].fr)); },
    render(st){ const L=st.lines[this.line]; UI.coco(`${UI.frLine(L.fr)}${UI.deLine(L.de)}`,{chirp:false});
      UI.chips([{cls:'sol',html: this.line<st.lines.length-1?'Weiter ➜':'OK ➜', onClick:()=>{ if(this.line<st.lines.length-1){ this.line++; this.refresh(); say(N(st.lines[this.line].fr)); } else { this.solved=true; this.next(); } }}]); },
  },

  command:{
    start(st){ UI.setInputMode('text','Parle à {N}…'); this.refresh(); say(N(st.fr)); },
    render(st,extra=''){ this.prompt(st,extra); const ch=this.helpChip(st);
      if(this.hint>=1) ch.push({html:'🔊 Anhören',onClick:()=>say(COMMANDS[st.cmd].fr,{word:true})});
      if(this.hint>=this.ladder(st).length) ch.push({cls:'sol fr',html:COMMANDS[st.cmd].fr,onClick:()=>{ UI.$('inp').value=COMMANDS[st.cmd].fr; UI.$('inp').focus(); say(COMMANDS[st.cmd].fr); }});
      UI.chips(ch); },
    input(st,raw){
      const r=parseCommand(raw,P.name);
      if(r.type==='name'){ this.g.dog.name(); this.refresh(UI.noteLine('🦜 {N} hört auf seinen Namen! 🐶')); return true; }
      if(r.type==='ok'||r.type==='close'){
        this.g.dog.do(COMMANDS[r.id].action);
        let fix=''; if(r.type==='close') fix=UI.tipLine(`😊 <b class="fr">Presque !</b> Man schreibt: <b class="fr">${COMMANDS[r.id].fr}</b>`);
        else if(missingAccent(raw,COMMANDS[r.id].fr)) fix=UI.tipLine(`Mit Akzent schreibt man: <b class="fr">${COMMANDS[r.id].fr}</b>`);
        if(r.id===st.cmd){ this.complete(st,{extra:fix}); return true; }
        if(r.id==='bon'){ this.refresh(UI.noteLine('🦜 {N} freut sich! <b class="fr">Bon chien</b> = Braver Hund.')); return true; }
        this.miss(UI.noteLine(`🦜 Haha! <b class="fr">${COMMANDS[r.id].fr}</b> heißt „${COMMANDS[r.id].de}“ – das hat {N} gemacht. Aber lies nochmal, was er tun soll!`)); return true; }
      this.g.dog.tilt();
      if(r.type==='german'){ this.miss(UI.tipLine("<b class=\"fr\">{N} ne comprend pas l'allemand !</b> Er versteht nur Französisch 😄")); return true; }
      this.miss(UI.tipLine(`Hmm, <b class="fr">« ${UI.esc(raw)} »</b> kennt {N} (noch) nicht.`)); return true; },
  },

  choice:{
    start(st){ this.opts=shuffle(st.options.slice()); this.bad=new Set(); UI.setInputMode('none'); this.refresh(); say(N(st.fr)); },
    render(st,extra=''){ this.prompt(st,extra);
      UI.chips([...this.opts.map(o=>({cls:'fr opt'+(this.bad.has(o)?' bad':''),html:UI.esc(N(o)),onClick:()=>{
          if(norm(o)===norm(st.answer)) this.complete(st,{sayText:st.answer}); else { this.bad.add(o); this.miss(UI.tipLine(`<b class="fr">${UI.esc(o)}</b> passt hier nicht – probier's nochmal!`)); } }})),
        ...this.helpChip(st)]); },
  },

  fill:{
    start(st){ UI.setInputMode('text','Ta réponse…'); this.refresh(); say(N(st.fr)); },
    render(st,extra=''){ this.prompt(st,extra); UI.chips(this.helpChip(st)); },
    input(st,raw){ const r=checkAnswer(raw,st.answer);
      if(r.ok){ this.complete(st,{extra: r.exact?'':UI.tipLine(`😊 <b class="fr">Presque !</b> Richtig ist: <b class="fr">${r.want}</b>`), sayText:r.want}); return true; }
      this.miss(UI.tipLine(`<b class="fr">« ${UI.esc(raw)} »</b> passt nicht in die Lücke.`)); return true; },
  },

  build:{
    start(st){ this.tiles=shuffle(st.tiles.map(N)); this.built=[]; UI.setInputMode('none'); this.refresh(); },
    render(st,extra=''){ const line=this.built.length? this.built.map(UI.esc).join(' ') : '<span style="opacity:.45">Tippe die Wörter …</span>';
      this.prompt(st,`<span class="build fr">${line}</span>`+extra);
      const rest=this.tiles.map((t,i)=>({t,i})).filter(x=>!this.built.includes(x.t)||this.built.filter(b=>b===x.t).length<this.tiles.filter(y=>y===x.t).length);
      UI.chips([...this.tiles.map((t,i)=>({cls:'fr tile'+(this.usedIdx?.has(i)?' used':''),html:UI.esc(t),onClick:(e,b)=>{
          if(this.usedIdx?.has(i)) return; (this.usedIdx??=new Set()).add(i); this.built.push(t); sfx.pop();
          const want=norm(N(st.answer)), got=norm(this.built.join(' '));
          if(got===want){ this.complete(st,{sayText:N(st.answer)}); return; }
          if(!want.startsWith(got)){ this.built=[]; this.usedIdx=new Set(); this.miss(UI.tipLine('Fast – die Reihenfolge stimmt noch nicht. Nochmal!')); return; }
          this.refresh(); }})),
        {html:'↺',onClick:()=>{ this.built=[]; this.usedIdx=new Set(); this.refresh(); }}, ...this.helpChip(st)]); },
  },

  object:{
    start(st){ UI.setInputMode('text','Parle à {N}…'); this.refresh(); say(N(st.fr)); },
    render(st,extra=''){ this.prompt(st,extra); UI.chips(this.helpChip(st)); const key=P.chapter+':'+P.step+':'+this.hint;
      if(!this.solved && this.hint>=this.ladder(st).length && this._pt!==key){ this._pt=key; setTimeout(()=>this.g.cocoPoint?.(st.target),500); } },
    prop(st,p){ if(p.id===st.target){ this.complete(st,{sayText:p.word.fr}); return true; }
      this.miss(UI.tipLine(`Das ist <b class="fr">${p.word.fr}</b> (${p.word.de}). Wir suchen etwas anderes!`)); return true; },
  },
teach:{
    start(st){
      const words = st.words || DECKS[st.deck].words.slice(...(st.range||[0,99])).map(w=>({...w,deck:st.deck}));
      const known=w=>(P.items['v:'+w.fr]?.box||0)>=2;
      const q=[]; const pendingQuiz=[];
      if(st.quizOnly) words.forEach(w=>q.push({w,mode:'quiz'}));
      else words.forEach(w=>{ if(known(w)){ q.push({w,mode:'quiz'}); return; }
        q.push({w,mode:'new'}); if(pendingQuiz.length) q.push(pendingQuiz.shift()); pendingQuiz.push({w,mode:'quiz'}); });
      q.push(...pendingQuiz);
      this.tq=q; this.tDone=0; this.tTotal=q.length; UI.setInputMode('text','En français…');
      this.nextCard(st);
    },
    render(st,extra=''){ const c=this.card; const w=c.w;
      if(c.mode==='new'){
        UI.think(`<span class="pic">${w.pic}</span><span class="q">?</span>`);
        UI.coco(`<span class="mission fr">Nouveau mot !</span> <span class="de" style="display:inline">Neues Wort</span>
          <span class="newword"><span class="pic">${w.pic}</span><b class="fr">${UI.esc(w.fr)}</b><button class="spk" data-say="${UI.esc(w.fr)}">🔊</button><small>${UI.esc(w.de)}</small></span>
          ${UI.deLine(`{N} kennt das Wort nicht. Bring es ihm bei: schreib <b class="fr">${UI.esc(w.fr)}</b>!`)}${extra}`,{chirp:false});
        UI.chips([{html:'🔊 Anhören',onClick:()=>say(w.fr,{word:true})}]);
      } else {
        UI.think(`<span class="pic">${w.pic}</span><span class="q">?</span>`);
        this.prompt(this.cardSt, extra); const ch=this.helpChip(this.cardSt); if(this.hint>=2) ch.push({html:'🔊 Anhören',onClick:()=>say(w.fr,{word:true})}); UI.chips(ch);
      }
      this.tProgress();
    },
    input(st,raw){ const c=this.card, w=c.w;
      const answers=[w.fr,...(w.alt||[])]; const r=checkAnswer(raw,answers);
      const base=w.fr.replace(/^(le |la |les |l'|un |une )/,''); const noArt= !r.ok && checkAnswer(raw,[base]).ok && base!==w.fr;
      if(r.ok||noArt){
        const clean=(c.mode==='new'||this.hint<=this.hintBase)&&!noArt&&this.wrong===0;
        learn('v:'+w.fr,{kind:'vocab',pic:w.pic,fr:w.fr,de:w.de,alt:w.alt,deck:w.deck,gram:''}, c.mode==='new'?1:(clean?2:1));
        this.g.dog.happy(1200); UI.think(`<span class="pic">${w.pic}</span><span class="word">${UI.esc(w.fr)}</span>`,'learned'); say(w.fr,{word:true});
        if(c.mode==='quiz'){ sfx.success(); if(clean){ P.treats+=1; sfx.treat(); this.g.fx.hearts(2); } } else sfx.pop();
        save(); this.renderTop();
        let msg = c.mode==='new'? `<span class="mission fr">{N} apprend : ${UI.esc(w.fr)} !</span>${UI.deLine(`{N} lernt: ${UI.esc(w.fr)} = ${UI.esc(w.de)}`)}`
                               : `<span class="mission fr">${['Bravo !','Exact !','Super !','Oui !'][Math.floor(Math.random()*4)]}</span> ${clean?'<span class="de" style="display:inline">+1 🦴</span>':''}<span class="note">${w.pic} <b class="fr">${UI.esc(w.fr)}</b> = ${UI.esc(w.de)}</span>`;
        if(noArt) msg+=UI.tipLine(`Fast! Mit Artikel lernen: <b class="fr">${UI.esc(w.fr)}</b>`);
        else if(!r.exact) msg+=UI.tipLine(`😊 Richtig geschrieben: <b class="fr">${UI.esc(w.fr)}</b>`);
        if(/eau|aux|ent$|s$|t$|x$|d$/.test(w.fr)) msg+=pronTip(w.fr);
        UI.coco(msg,{chirp:false}); UI.chips([]);
        if(c.mode==='quiz' && !clean) this.tq.splice(Math.min(2,this.tq.length),0,{w,mode:'quiz',again:true});
        if(c.mode==='quiz' && clean || c.mode==='new') this.tDone++;
        clearTimeout(this.tTimer); this.tTimer=setTimeout(()=>this.nextCard(st), 2300); return true; }
      const rc=parseCommand(raw,P.name); if(rc.type==='ok'){ this.g.dog.do(COMMANDS[rc.id].action); return true; }
      this.g.dog.tilt(); this.miss(UI.tipLine(`Hmm, <b class="fr">« ${UI.esc(raw)} »</b> – {N} schaut verwirrt.`)); return true; },
  },

  listen:{
    start(st){ this.opts=shuffle(st.options.slice()); this.bad=new Set(); UI.setInputMode('none'); this.refresh(); setTimeout(()=>say(st.answer,{rate:0.8,word:true}),350); },
    render(st,extra=''){ this.prompt(st,extra);
      UI.chips([{cls:'sol',html:'🔊 Nochmal hören',onClick:()=>say(st.answer,{rate:0.75,word:true})},
        ...this.opts.map(o=>({cls:'fr opt'+(this.bad.has(o)?' bad':''),html:UI.esc(N(o)),onClick:()=>{
          if(o===st.answer) this.complete(st,{sayText:st.answer}); else { this.bad.add(o); say(o,{rate:0.8,word:true}); this.miss(UI.tipLine(`Das war <b class="fr">${UI.esc(o)}</b> – hör nochmal genau hin!`)); } }})),
        ...this.helpChip(st)]); },
  },
tuto:{
    start(st){ this.ti=0; UI.setInputMode('text','Parle à {N}…'); this.refresh(); },
    render(st,extra=''){ const t=st.tasks[this.ti];
      document.querySelectorAll('.pulse').forEach(e=>e.classList.remove('pulse')); if(t.pulse) document.querySelector(t.pulse)?.classList.add('pulse');
      UI.coco(`<span class="tutostep">Tutorial ${this.ti+1}/${st.tasks.length}</span>${UI.frLine(t.fr)}${UI.deLine(t.de)}${extra}`);
      UI.chips([{html:'Überspringen ➜',onClick:()=>this.event(t.wait)}]); say(N(t.fr)); },
    event(st,name){ const t=st.tasks[this.ti]; if(t.wait!==name) return; sfx.pop(); this.ti++;
      document.querySelectorAll('.pulse').forEach(e=>e.classList.remove('pulse'));
      if(this.ti>=st.tasks.length){ this.solved=true; P.treats+=1; save(); this.renderTop(); sfx.success(); this.g.dog.happy(1500);
        UI.coco(`<span class="mission fr">Super !</span> <span class="de" style="display:inline">+1 🦴</span>${UI.deLine('Jetzt kennst du alles! Und denk dran: Wenn du nicht weiterweißt, tipp unten links auf die gelbe 💡 – dann helfe ich dir.')}`);
        say('Super !'); setTimeout(()=>this.g.gift?.(1),1500); UI.chips([{cls:'sol',html:"C'est parti ➜",onClick:()=>this.next()}]); return; }
      setTimeout(()=>this.refresh(),500); },
  },
defi:{
    start(st){
      const ch=this.chapter; const pool=[];
      for(const s of ch.steps){
        if(s.type==='command') pool.push({q:'cmd',id:s.cmd});
        else if(s.type==='choice') pool.push({q:'choice',fr:s.fr,full:s.full,de:s.de,options:s.options,answer:s.answer});
        else if(s.type==='fill') pool.push({q:'fill',fr:s.fr,de:s.de,answer:s.answer});
        else if(s.type==='object') pool.push({q:'object',target:s.target});
        else if(s.type==='teach'){ const ws=DECKS[s.deck].words.slice(...(s.range||[0,99])); shuffle(ws).slice(0,3).forEach(w=>pool.push({q:'vocab',w:{...w,deck:s.deck}})); }
      }
      const seen=new Set(); this.dq=shuffle(pool).filter(x=>{ const k=x.q+(x.id||x.fr||x.target||x.w?.fr); if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,st.count||8);
      if(!this.dq.length){ this.solved=true; return this.next(); }
      this.di=0; this.dScore=0; this.dWrong=[]; this.joker=1; this.dLock=false;
      UI.setInputMode('none'); sfx.drum();
      UI.coco(`<span class="mission fr">🏆 Le grand concours !</span>${UI.deLine(`Die große Hundeshow! Die Jury will sehen, was {N} alles kann. ${this.dq.length} Aufgaben – ohne Tipps, aber mit <b>einem Joker 🃏</b>. Für jede richtige Antwort gibt's einen ⭐.`)}`);
      say('Le grand concours !');
      UI.chips([{cls:'sol',html:'Allez ! 🎬',onClick:()=>{ this.dRender(); }}]);
    },
    render(){ this.dRender(); },
    input(st,raw){ const d=this.dq[this.di]; if(!d||this.dLock) return true;
      if(d.q==='cmd'){ const r=parseCommand(raw,P.name); if((r.type==='ok'||r.type==='close')&&r.id===d.id){ this.g.dog.do(COMMANDS[d.id].action); return this.dResult(true), true; }
        if(r.type==='ok'||r.type==='close') this.g.dog.do(COMMANDS[r.id].action); else this.g.dog.tilt(); return this.dResult(false), true; }
      if(d.q==='fill'){ return this.dResult(checkAnswer(raw,d.answer).ok), true; }
      if(d.q==='vocab'){ const r=checkAnswer(raw,[d.w.fr,...(d.w.alt||[])]); return this.dResult(r.ok), true; }
      return false; },
    prop(st,p){ const d=this.dq[this.di]; if(d?.q!=='object'||this.dLock) return false; this.dResult(p.id===d.target); return true; },
  },
};
function pronTip(fr){
  if(/eau/.test(fr)) return UI.tipLine('🗣️ <b>eau</b> spricht man wie „o“.');
  if(/oi/.test(fr)) return UI.tipLine('🗣️ <b>oi</b> spricht man wie „wa“.');
  if(/ch/.test(fr)) return UI.tipLine('🗣️ <b>ch</b> spricht man wie „sch“.');
  if(/[stxd]$/.test(fr)) return UI.tipLine(`🗣️ Der letzte Buchstabe <b>${fr.slice(-1)}</b> bleibt meist stumm.`);
  return '';
}
Runner.prototype.nextCard=function(st){
  this.hintBase=help.de?1:0; this.hint=this.hintBase; this.wrong=0; UI.thinkHide();
  if(!this.tq.length){ UI.thinkHide(); this.solved=false; this.cardSt=null; this.complete(st,{extra:UI.noteLine('📖 Alle Wörter stehen jetzt im Carnet – mit Lernkasten ●●○○○.')}); return; }
  this.card=this.tq.shift(); const w=this.card.w;
  this.cardSt={ type:'teachcard', word:w, fr:'{N} pense à quelque chose… Comment dit-on en français ?', de:`Er denkt an: ${w.de}`,
    hints:[`Fängt an mit <b class="fr">${UI.esc(w.fr.slice(0, Math.max(w.fr.indexOf(' ')+2, w.fr.indexOf("'")+2, 2)))}…</b>`] };
  this.refresh(); if(this.card.mode==='new') say(w.fr,{word:true}); else this.g.dog.tilt?.call(this.g.dog);
};
Runner.prototype.tProgress=function(){ const pr=UI.$('progress'); if(!this.tTotal) return; pr.innerHTML=`<span class="pbar"><i style="width:${Math.round(this.tDone/this.tTotal*100)}%"></i></span><small>${this.tDone}/${this.tTotal}</small>`;
};
// Bei "Lösung zeigen" für Gegenstände: der Hund läuft hin und zeigt es
Runner.prototype.onSolutionShown=function(st){ if(st.type==='object'){ const p=this.g.room.props.get(st.target); const s=p.spot||p.pos; this.g.dog.walkTo(s[0],s[1]+0.35,()=>{ this.g.dog.facePoint(p.pos[0],p.pos[1]); this.g.dog.bark(1); }); } };
// ---------- Hundeshow (Mini-Test) ----------
Runner.prototype.dAnswer=function(d){ return d.q==='cmd'? COMMANDS[d.id].fr : d.q==='vocab'? d.w.fr : d.q==='object'? this.g.room.props.get(d.target)?.word.fr : (d.full||d.fr.replace('___',Array.isArray(d.answer)?d.answer[0]:d.answer)); };
Runner.prototype.dRender=function(jokerUsed){
  const d=this.dq[this.di]; UI.thinkHide(); this.dLock=false;
  const head=`<span class="tutostep">🏆 ${this.di+1}/${this.dq.length} · ${'⭐'.repeat(this.dScore)||'–'}</span>`;
  const joker=(extra)=> this.joker? [{cls:'help',html:'🃏 Joker',onClick:()=>{ this.joker=0; this.dJoker=true; this.dRender(true); }}] : [];
  let q='', ch=[]; const ans=this.dAnswer(d); const jk= jokerUsed? UI.tipLine(`🃏 Fängt an mit <b class="fr">${UI.esc(ans.slice(0,Math.max(3,Math.ceil(ans.length/3))))}…</b>`) : '';
  if(d.q==='cmd'){ q=`${UI.frLine('La jury demande : « '+COMMANDS[d.id].de+' »')}${UI.deLine(`Die Jury will sehen: „${COMMANDS[d.id].de}“ – sag es {N} auf Französisch!`)}`; UI.setInputMode('text','Parle à {N}…'); }
  else if(d.q==='vocab'){ UI.think(`<span class="pic">${d.w.pic}</span><span class="q">?</span>`); q=`${UI.frLine('{N} pense à quelque chose… Comment dit-on ?')}${UI.deLine('Wie heißt das auf Französisch? (mit Artikel)')}`; UI.setInputMode('text','En français…'); }
  else if(d.q==='fill'){ q=`${UI.frLine(d.fr)}${UI.deLine(d.de)}`; UI.setInputMode('text','Ta réponse…'); }
  else if(d.q==='object'){ const p=this.g.room.props.get(d.target); q=`${UI.frLine('Touche '+p.word.fr+' !')}`; UI.setInputMode('none'); }
  else if(d.q==='choice'){ q=`${UI.frLine(d.fr)}${UI.deLine(d.de)}`; UI.setInputMode('none');
    ch=shuffle(d.options.slice()).map(o=>({cls:'fr opt',html:UI.esc(N(o)),onClick:()=>this.dResult(norm(o)===norm(d.answer))})); }
  UI.coco(head+q+jk,{chirp:false}); UI.chips([...ch, ...(jokerUsed?[]:joker())]);
};
Runner.prototype.dResult=function(ok){
  const d=this.dq[this.di]; this.dLock=true; const ans=N(this.dAnswer(d));
  const key= d.q==='cmd'? 'cmd:'+d.id : d.q==='vocab'? 'v:'+d.w.fr : null;
  if(ok){ this.dScore++; sfx.success(); this.g.fx.hearts(2); this.g.dog.happy(1000); if(key && P.items[key]) learn(key,{},this.dJoker?1:2);
    UI.coco(`<span class="tutostep">🏆 ${this.di+1}/${this.dq.length} · ${'⭐'.repeat(this.dScore)}</span><span class="mission fr">${['Bravo !','Parfait !','Excellent !','Super !'][Math.floor(Math.random()*4)]}</span> <span class="de" style="display:inline">+⭐</span><span class="note">✅ <b class="fr">${UI.esc(ans)}</b></span>`,{chirp:false}); }
  else { sfx.soft_no(); this.g.dog.tilt(); this.dWrong.push({fr:ans, de:d.q==='cmd'?COMMANDS[d.id].de: d.q==='vocab'? d.w.de : d.q==='object'? '' : (d.de||'')}); if(key && P.items[key]) learn(key,{},0);
    UI.coco(`<span class="tutostep">🏆 ${this.di+1}/${this.dq.length} · ${'⭐'.repeat(this.dScore)||'–'}</span><span class="mission fr">Oups !</span>${UI.noteLine(`Richtig wäre: <b class="fr">${UI.esc(ans)}</b>`)}`,{chirp:false}); }
  say(ans); this.dJoker=false; UI.chips([]);
  setTimeout(()=>{ this.di++; if(this.di<this.dq.length) this.dRender(); else this.dFinish(); }, ok?1900:3200);
};
Runner.prototype.dFinish=function(){
  const n=this.dq.length, s=this.dScore, pct=Math.round(s/n*100); const medal= pct>=90?'🥇':pct>=70?'🥈':pct>=50?'🥉':'🎀';
  const label= pct>=90?'Médaille d’or !':pct>=70?'Médaille d’argent !':pct>=50?'Médaille de bronze !':'Bravo pour le courage !';
  const ch=this.chapter; const R=(P.results??={}); const prev=R[ch.id]; R[ch.id]={ last:pct, best:Math.max(pct,prev?.best||0), date:Date.now(), tries:(prev?.tries||0)+1, wrong:this.dWrong.map(w=>w.fr) };
  P.treats+=s; save(); this.renderTop(); sfx.applause(); setTimeout(()=>sfx.chapter(),600); this.g.fx.hearts(6); this.g.dog.jump?.(); this.g.celebrate?.(); setTimeout(()=>this.g.badgeCheck?.(),6000);
  UI.coco(`<span class="medal">${medal}</span><span class="mission fr">${label}</span> <span class="de" style="display:inline">${s}/${n} ⭐ · +${s} 🦴</span>
    ${this.dWrong.length? UI.noteLine('📖 Das üben wir nochmal:<br>'+this.dWrong.map(w=>`<b class="fr">${UI.esc(w.fr)}</b>${w.de?' = '+UI.esc(N(w.de)):''}`).join('<br>')) : UI.noteLine('Alles richtig! {N} ist der Star der Show! 🌟')}`);
  say(label); this.solved=true; setTimeout(()=>this.g.gift?.(pct>=90?3:pct>=50?2:1),2600);
  UI.chips([{cls:'sol',html:'Weiter ➜',onClick:()=>this.next()}, {html:'🔁 Nochmal antreten',onClick:()=>{ this.solved=false; H.defi.start.call(this,this.step); }}]);
};
