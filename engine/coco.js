// =============================================================
//  COCO – der Papagei als 2D-Assistent über dem Spiel
//  Bilder: coco/idle|talk|point|laugh|fly.webp (gleich große Quadrate, Füße unten)
//  Coco sitzt links an der Sprechblase, spricht (Schnabel auf), lacht,
//  und flattert zu Gegenständen, um darauf zu zeigen.
// =============================================================
const KEYS=['idle','talk','point','laugh','fly'];
const SRC=k=>`coco/${k}.webp`;
KEYS.forEach(k=>{ const i=new Image(); i.src=SRC(k); });

let av, img, fly, flyImg;
let talking=false, laughUntil=0, flying=false, queue=Promise.resolve();

export function initCoco(){
  av=document.getElementById('cocoAv'); img=document.getElementById('cocoImg');
  fly=document.getElementById('cocoFly'); flyImg=fly?.querySelector('img');
  addEventListener('coco-tts',e=>{ talking=!!e.detail; render(); });
  render();
}
function render(){ if(!img) return; const k= Date.now()<laughUntil ? 'laugh' : talking ? 'talk' : 'idle';
  if(img.dataset.k!==k){ img.dataset.k=k; img.src=SRC(k); }
  av.classList.toggle('speaking', talking && k==='talk'); }

export function laugh(ms=2400){ laughUntil=Date.now()+ms; render(); setTimeout(render, ms+30); }

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function home(){ const r=av.getBoundingClientRect(); return {x:r.left+r.width/2, y:r.top+r.height/2, s:r.width}; }
function place(x,y,size,{rot=0,flip=false}={}){ fly.style.width=fly.style.height=size+'px'; fly.style.transform=`translate(${x-size/2}px,${y-size/2}px) rotate(${rot}deg) scaleX(${flip?-1:1})`; }
function tween(from,to,ms,size0,size1,lift=90){
  return new Promise(res=>{ const t0=performance.now(); const mx=(from.x+to.x)/2, my=Math.min(from.y,to.y)-lift;
    const step=now=>{ const k=Math.min(1,(now-t0)/ms), e=ease(k), a=1-e;
      const x=a*a*from.x+2*a*e*mx+e*e*to.x, y=a*a*from.y+2*a*e*my+e*e*to.y+Math.sin(now/90)*4;
      place(x,y,size0+(size1-size0)*e,{rot:(to.x>from.x?1:-1)*10*Math.sin(Math.PI*k)});
      if(k<1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step); }); }

function clampPt(x,y,s){ const top=Math.max(80, (document.getElementById('top')?.getBoundingClientRect().bottom||60)+s*0.5);
  const bot=(document.getElementById('bottom')?.getBoundingClientRect().top||innerHeight)-s*0.55;
  return { x:Math.max(s*0.55,Math.min(innerWidth-s*0.55,x)), y:Math.max(top,Math.min(bot,y)) }; }

// Zu einem Bildschirmpunkt fliegen, mit dem Flügel darauf zeigen, zurückfliegen
export function pointAt(tx,ty,{hold=2600}={}){
  queue=queue.then(async()=>{ if(!fly||!av||flying) return; flying=true;
    const h=home(); const S=Math.max(96, Math.min(140, innerWidth*0.26));
    const left= tx>innerWidth/2;               // Ziel rechts → Coco sitzt links davon und zeigt nach rechts
    const dst=clampPt(tx+(left?-S*0.62:S*0.62), ty-S*0.15, S);
    av.classList.add('away'); flyImg.src=SRC('fly'); fly.classList.add('on','flap');
    place(h.x,h.y,h.s); await tween(h,dst,Math.min(1300,500+Math.hypot(dst.x-h.x,dst.y-h.y)*1.1),h.s,S);
    fly.classList.remove('flap'); flyImg.src=SRC('point'); place(dst.x,dst.y,S,{flip:!left}); fly.classList.add('perch');
    await sleep(hold);
    fly.classList.remove('perch'); flyImg.src=SRC('fly'); fly.classList.add('flap');
    const h2=home(); await tween(dst,h2,900,S,h2.s);
    fly.classList.remove('on','flap'); av.classList.remove('away'); flying=false; render(); });
  return queue;
}
// Freudenrunde über den Bildschirm (Medaille, Kapitel geschafft)
export function celebrate(){
  queue=queue.then(async()=>{ if(!fly||!av||flying) return; flying=true; const h=home(); const S=Math.max(96,Math.min(140,innerWidth*0.26));
    av.classList.add('away'); flyImg.src=SRC('fly'); fly.classList.add('on','flap'); place(h.x,h.y,h.s);
    const cx=innerWidth/2, cy=innerHeight*0.42, R=Math.min(innerWidth,innerHeight)*0.28;
    await tween(h,{x:cx+R,y:cy},700,h.s,S);
    await new Promise(res=>{ const t0=performance.now(); const step=now=>{ const k=Math.min(1,(now-t0)/1800), a=k*Math.PI*2;
      place(cx+Math.cos(a)*R, cy-Math.sin(a)*R*0.6, S, {rot:-Math.sin(a)*12}); if(k<1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
    fly.classList.remove('flap'); flyImg.src=SRC('laugh'); await sleep(900); flyImg.src=SRC('fly'); fly.classList.add('flap');
    const h2=home(); await tween({x:cx+R,y:cy},h2,800,S,h2.s);
    fly.classList.remove('on','flap'); av.classList.remove('away'); flying=false; render(); });
  return queue;
}
export function isFlying(){ return flying; }
