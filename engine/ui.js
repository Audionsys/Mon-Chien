// Oberfläche: Coco-Sprechblase, Chips, Wort-Antippen, Effekte, Fenster
import { LEXIQUE } from '../content/lexique.js';
import { say, sfx } from './audio.js';

export const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export { esc };

let nameFn=()=> 'Filou', femFn=()=>false;
export function setNameFn(f){ nameFn=f; }
export function setFemFn(f){ femFn=f; }
// Hündin: Texte automatisch anpassen (il → elle, er → sie …)
const FEM=[
  [/(?<!['’])\bIl\b(?! y a| est (dix|une|deux|trois|quatre|cinq|six|sept|huit|neuf|onze|midi)| fait)(?!\/)/g,'Elle'],
  [/(?<!['’-])\bil\b(?! y a| est (dix|une|deux|trois|quatre|cinq|six|sept|huit|neuf|onze|midi)| fait)(?!\/)/g,'elle'],
  [/Envoie-le\b/g,'Envoie-la'],[/Aide-le\b/g,'Aide-la'],[/\bfatigué(?![a-zà-ÿ])/g,'fatiguée'],[/\bcontent\b/g,'contente'],
  [/\bun bon chien\b/g,'une bonne chienne'],[/\bBon chien\b/g,'Bonne chienne'],[/\bbon chien\b/g,'bonne chienne'],[/\bQuel chien\b/g,'Quelle chienne'],
  [/\bton nouveau chien\b/g,'ta nouvelle chienne'],[/\bun chien\b/g,'une chienne'],
  [/\bein braver Hund\b/g,'eine brave Hündin'],[/\bBraver Hund\b/g,'Brave Hündin'],[/\bbraver Hund\b/g,'brave Hündin'],[/\bdein neuer Hund\b/g,'deine neue Hündin'],
  [/\bEr(?=[ ,!?.;:])/g,'Sie'],[/\ber(?=[ ,!?.;:])/g,'sie'],[/\bihm\b/g,'ihr'],[/\bihn\b/g,'sie'],
  [/\bSein(e[nmrs]?)?(?= )/g,(m,e)=>'Ihr'+(e||'')],[/\bsein(e[nmrs]?)?(?= )/g,(m,e)=>'ihr'+(e||'')],
];
function genderize(t){ if(!femFn()) return t; for(const [re,rep] of FEM) t=t.replace(re,rep); return t; }
export const N=s=>{ s=String(s??''); if(femFn()) s=s.replace(/\{N\} est noir\b(?!e)/g,'{N} est noire'); return genderize(s.replace(/\{N\}/g,nameFn())); };

// Französischen Text antippbar machen (Mehrwort-Einträge zuerst)
const MULTI=Object.keys(LEXIQUE).filter(k=>k.includes(' ')).sort((a,b)=>b.length-a.length);
export function wrap(fr){
  const text=N(fr); const name=nameFn().toLowerCase();
  let out='', i=0;
  while(i<text.length){
    const rest=text.slice(i).toLowerCase();
    const m=MULTI.find(k=>rest.startsWith(k) && !/[a-zàâçéèêëîïôûùüÿœ]/i.test(rest[k.length]||' ') && (i===0||!/[a-zàâçéèêëîïôûùüÿœ]/i.test(text[i-1])));
    if(m){ const orig=text.slice(i,i+m.length); out+=`<span class="w" data-w="${esc(orig)}" data-g="${esc(LEXIQUE[m])}">${esc(orig)}</span>`; i+=m.length; continue; }
    const wm=text.slice(i).match(/^[A-Za-zÀ-ÿœŒ'’-]+/);
    if(wm){ const w=wm[0]; const key=w.toLowerCase().replace(/’/g,"'");
      let g=LEXIQUE[key] ?? LEXIQUE[key.replace(/^(l|d|s|n|j|qu)'/,'')];
      if(key===name) g='Name deines Hundes';
      if(!g && /^(l|d|s|n|j|qu)'/.test(key)){ // l'animal -> l' + animal
        const [pre,base]=[key.slice(0,key.indexOf("'")+1), key.slice(key.indexOf("'")+1)];
        const gb=LEXIQUE[base]; if(gb){ out+=`<span class="w" data-w="${esc(w)}" data-g="${esc((LEXIQUE[pre]||'')+' + '+gb)}">${esc(w)}</span>`; i+=w.length; continue; } }
      out+= g? `<span class="w" data-w="${esc(w)}" data-g="${esc(g)}">${esc(w)}</span>` : esc(w);
      i+=w.length; continue; }
    out+=esc(text[i]); i++;
  }
  return out.replace(/___/g,'<span class="gap">___</span>');
}

// ---------- Coco ----------
const bubble=()=>$('bubble');
export function coco(html,{chirp=true}={}){ bubble().innerHTML=N(html); if(chirp) sfx.coco(); }
export function frLine(fr){ const t=N(fr); return `<span class="mission fr">${wrap(fr)}</span><button class="spk" data-say="${esc(t)}">🔊</button>`; }
export const deLine=de=>`<span class="de">🦜 ${N(de)}</span>`;
export const tipLine=h=>`<span class="tip">💡 ${N(h)}</span>`;
export const noteLine=h=>`<span class="note">${N(h)}</span>`;

// ---------- Chips ----------
export function chips(list){ const c=$('chips'); c.innerHTML='';
  for(const ch of list){ const b=document.createElement('button'); b.className='chip '+(ch.cls||''); b.innerHTML=N(ch.html); b.onclick=(e)=>{ sfx.tap(); ch.onClick(e,b); }; c.appendChild(b); } }
export function setInputMode(mode, placeholder){ // 'text' | 'none'
  $('inputRow').style.display= mode==='text'?'flex':'none';
  $('inp').placeholder=N(placeholder||'Parle à {N}…');
}

// ---------- Wort antippen ----------
export function initGloss(){
  const gl=$('gloss');
  document.addEventListener('click',(e)=>{
    const spk=e.target.closest('.spk'); if(spk){ say(spk.dataset.say,{word:true}); return; }
    const w=e.target.closest('.w'); if(!w) return;
    say(w.dataset.w,{word:true}); showGloss(`<b>${esc(w.dataset.w)}</b> = ${esc(w.dataset.g)}`, w.getBoundingClientRect());
    w.classList.add('on'); setTimeout(()=>w.classList.remove('on'),2200);
  });
}
export function showGloss(html, rect){ const gl=$('gloss'); gl.innerHTML=html;
  gl.style.left=Math.max(8,Math.min(innerWidth-250,rect.left))+'px'; gl.style.top=Math.min(innerHeight-60,rect.bottom+6)+'px'; gl.style.opacity=1;
  clearTimeout(gl._t); gl._t=setTimeout(()=>gl.style.opacity=0,2300); }

// ---------- Effekte am Hund ----------
export function dogSay(text,ms){ const d=$('dogSay'); d.textContent=text; d.style.opacity=1; clearTimeout(d._t); d._t=setTimeout(()=>d.style.opacity=0,ms); }
export function floatFx(x,y,emojis,n=4){ for(let i=0;i<n;i++) setTimeout(()=>{ const h=document.createElement('div'); h.className='fx'; h.textContent=emojis[i%emojis.length];
  h.style.left=x+'px'; h.style.top=y+'px'; h.style.setProperty('--dx',(Math.random()*60-30)+'px'); document.body.appendChild(h); setTimeout(()=>h.remove(),1500); },i*150); }
export function wordLabel(x,y,fr,de){ const d=document.createElement('div'); d.className='wordtag'; d.innerHTML=`<b class="fr">${esc(fr)}</b><small>${esc(de)}</small>`;
  d.style.left=x+'px'; d.style.top=y+'px'; document.body.appendChild(d); setTimeout(()=>d.classList.add('out'),1800); setTimeout(()=>d.remove(),2300); }

// ---------- Fenster ----------
let sheetHist=false;
export function openSheet(title, bodyHtml, {onOpen}={}){
  if(!$('sheet').classList.contains('open')){ try{ history.pushState({sheet:1},''); sheetHist=true; }catch(e){} }
  $('sheetTitle').innerHTML=title; $('sheetBody').innerHTML=bodyHtml; $('sheet').classList.add('open'); onOpen&&onOpen($('sheetBody'));
}
export function closeSheet(fromBack){ if(!$('sheet').classList.contains('open')) return; $('sheet').classList.remove('open');
  if(!fromBack && sheetHist){ sheetHist=false; try{ history.back(); }catch(e){} } else sheetHist=false; }
export function sheetIsOpen(){ return $('sheet').classList.contains('open'); }

// ---------- Gedankenblase des Hundes ----------
export function think(html,cls=''){ const t=$('think'); t.innerHTML=html; t.className='on '+cls; }
export function thinkHide(){ $('think').className=''; }
