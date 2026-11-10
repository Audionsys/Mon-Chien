// Audio: Musik (Web Audio, iPad-tauglich), Soundeffekte (synthetisch), Sprachausgabe
const store={ get(k,d){ try{ const v=localStorage.getItem('chien_'+k); return v==null?d:JSON.parse(v);}catch(e){return d;} }, set(k,v){ try{ localStorage.setItem('chien_'+k,JSON.stringify(v)); }catch(e){} } };

let ctx=null, master=null, musicGain=null, sfxGain=null, musicBuf=null, musicSrc=null, musicLoading=null;
export const settings={ music: store.get('music',true), sfx: store.get('sfx',true), voiceName: store.get('voice',null), rate: store.get('rate',0.88) };
const MUSIC_VOL=0.28;

export function audioCtx(){
  if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)();
      master=ctx.createGain(); master.connect(ctx.destination);
      musicGain=ctx.createGain(); musicGain.gain.value=MUSIC_VOL; musicGain.connect(master);
      sfxGain=ctx.createGain(); sfxGain.gain.value=0.9; sfxGain.connect(master);
    }catch(e){ return null; } }
  if(ctx.state==='suspended') ctx.resume();
  return ctx;
}
// Musik schon vorab laden (ArrayBuffer), Dekodieren beim ersten Tippen
let musicData=null;
export function preloadMusic(url){ musicLoading=fetch(url).then(r=>r.arrayBuffer()).then(b=>{ musicData=b; }).catch(()=>{}); return musicLoading; }
export async function startMusic(){
  if(!settings.music) return; const a=audioCtx(); if(!a) return;
  if(musicSrc) return;
  if(!musicBuf){ await musicLoading; if(!musicData) return; try{ musicBuf=await a.decodeAudioData(musicData.slice(0)); }catch(e){ return; } }
  if(!settings.music||musicSrc) return;
  musicSrc=a.createBufferSource(); musicSrc.buffer=musicBuf; musicSrc.loop=true; musicSrc.connect(musicGain);
  musicGain.gain.setValueAtTime(0,a.currentTime); musicGain.gain.linearRampToValueAtTime(MUSIC_VOL,a.currentTime+1.5); musicSrc.start();
}
export function stopMusic(){ if(musicSrc){ try{ musicSrc.stop(); }catch(e){} musicSrc=null; } }
export function toggleMusic(){ settings.music=!settings.music; store.set('music',settings.music); settings.music?startMusic():stopMusic(); return settings.music; }
export function toggleSfx(){ settings.sfx=!settings.sfx; store.set('sfx',settings.sfx); return settings.sfx; }
function duck(on){ if(!musicGain) return; const t=ctx.currentTime; musicGain.gain.cancelScheduledValues(t); musicGain.gain.setTargetAtTime(on?MUSIC_VOL*0.3:MUSIC_VOL,t,0.15); }

// ---------------- Sprachausgabe ----------------
let voices=[], voice=null;
const GOOD=/premium|enhanced|erweitert|natural|neural|online|google|wavenet|siri/i;
const SOFT=/amélie|amelie|audrey|aurélie|marie|julie|denise|eloise|vivienne|léa|lea|céline|celine|chantal|google français|siri/i;
function score(v){ let s=0; if(/fr[-_]FR/i.test(v.lang)) s+=30; else if(/^fr/i.test(v.lang)) s+=15;
  if(GOOD.test(v.name)) s+=25; if(SOFT.test(v.name)) s+=10; if(/compact|espeak|eloquence|grandma|grandpa|jacques|rocko|shelley|flo|sandy|reed/i.test(v.name)) s-=30; if(v.localService===false) s+=5; return s; }
function loadVoices(){ try{ voices=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang)); voices.sort((a,b)=>score(b)-score(a));
  voice = voices.find(v=>v.name===settings.voiceName) || voices[0] || null; }catch(e){} }
try{ loadVoices(); speechSynthesis.onvoiceschanged=loadVoices; }catch(e){}
export function frenchVoices(){ return voices.map(v=>({name:v.name, good:GOOD.test(v.name)})); }
export function currentVoice(){ return voice?voice.name:null; }
export function setVoice(name){ voice=voices.find(v=>v.name===name)||voice; settings.voiceName=voice?.name; store.set('voice',settings.voiceName); }
export function setRate(r){ settings.rate=r; store.set('rate',r); }
// Coco spricht alles mit Papageienstimme (höher); einzelne Wörter zum Lernen (word:true) mit klarer, normaler Stimme
export function say(text,{rate,pitch,word=false}={}){
  try{ speechSynthesis.cancel();
    const clean=text.replace(/<[^>]+>/g,'').replace(/[«»]/g,'').replace(/___/g,'…').replace(/\s+/g,' ');
    const u=new SpeechSynthesisUtterance(clean); u.lang='fr-FR'; if(voice) u.voice=voice;
    u.rate=rate??settings.rate; u.pitch=pitch??(word?1.0:1.32); u.volume=0.95;
    const coco=!word; const ev=v=>{ try{ dispatchEvent(new CustomEvent('coco-tts',{detail:v})); }catch(e){} };
    u.onstart=()=>{ duck(true); if(coco) ev(true); }; u.onend=u.onerror=()=>{ duck(false); ev(false); };
    speechSynthesis.speak(u);
  }catch(e){}
}

// ---------------- Soundeffekte (alles synthetisch, weich) ----------------
function env(g,t,a,peak,rel){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+rel); }
function tone(f,t,{type='sine',a=0.01,peak=0.2,rel=0.25,to=null,dest}={}){ const o=ctx.createOscillator(); o.type=type; o.frequency.setValueAtTime(f,t); if(to) o.frequency.exponentialRampToValueAtTime(to,t+a+rel);
  const g=ctx.createGain(); env(g,t,a,peak,rel); o.connect(g); g.connect(dest||sfxGain); o.start(t); o.stop(t+a+rel+0.05); }
function noise(t,dur,{freq=1000,q=1,peak=0.2,type='bandpass'}={}){ const n=ctx.createBufferSource(); const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*dur),ctx.sampleRate); const d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; n.buffer=b;
  const f=ctx.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q; const g=ctx.createGain(); env(g,t,0.005,peak,dur); n.connect(f); f.connect(g); g.connect(sfxGain); n.start(t); n.stop(t+dur+0.05); }
function ok(){ return settings.sfx && audioCtx(); }

// Echtes Hundebellen (CC0, freesound.org „barking dog 2“ von ivolipa), geschnitten in einzelne Beller
const BARK_FILES=['sfx/bark1.mp3','sfx/bark2.mp3','sfx/bark3.mp3','sfx/bark4.mp3'], barkData=[], barkBuf=[]; let lastBark=-1;
BARK_FILES.forEach((u,i)=>fetch(u).then(r=>r.ok?r.arrayBuffer():null).then(b=>{ if(b) barkData[i]=b; }).catch(()=>{}));
async function barkBuffers(){ const a=ctx; for(let i=0;i<BARK_FILES.length;i++) if(!barkBuf[i] && barkData[i]){ try{ barkBuf[i]=await a.decodeAudioData(barkData[i].slice(0)); }catch(e){} } return barkBuf.filter(Boolean); }
function playBark(t){ const bufs=barkBuf.filter(Boolean); if(!bufs.length) return false;
  let k=Math.floor(Math.random()*bufs.length); if(bufs.length>1&&k===lastBark) k=(k+1)%bufs.length; lastBark=k;
  const src=ctx.createBufferSource(); src.buffer=bufs[k]; src.playbackRate.value=0.94+Math.random()*0.14;
  const g=ctx.createGain(); g.gain.value=0.85; src.connect(g); g.connect(sfxGain); src.start(t); return true; }
export const sfx = {
  bark(n=2){ if(!ok()) return; barkBuffers();
    if(barkBuf.some(Boolean)){ for(let i=0;i<n;i++) playBark(ctx.currentTime+i*(0.32+Math.random()*0.08)); return; }
    for(let i=0;i<n;i++){ const t=ctx.currentTime+i*0.28;
      const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(560,t); o.frequency.exponentialRampToValueAtTime(250,t+0.15);
      const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=950; bp.Q.value=1.6; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2600;
      const g=ctx.createGain(); env(g,t,0.012,0.45,0.16); o.connect(bp); bp.connect(lp); lp.connect(g); g.connect(sfxGain); o.start(t); o.stop(t+0.22);
      noise(t,0.12,{freq:1300,q:0.8,peak:0.08}); } },
  step(){ if(!ok()) return; const t=ctx.currentTime; noise(t,0.05,{freq:2400+Math.random()*600,q:2.5,peak:0.035}); },
  pop(){ if(!ok()) return; tone(520,ctx.currentTime,{type:'sine',peak:0.12,rel:0.09,to:880}); },
  tap(){ if(!ok()) return; tone(900,ctx.currentTime,{type:'triangle',peak:0.06,rel:0.06}); },
  success(){ if(!ok()) return; const t=ctx.currentTime; [523,659,784,1047].forEach((f,i)=>{ tone(f,t+i*0.09,{type:'triangle',peak:0.13,rel:0.35}); tone(f*2,t+i*0.09,{type:'sine',peak:0.03,rel:0.3}); }); },
  soft_no(){ if(!ok()) return; const t=ctx.currentTime; tone(392,t,{type:'sine',peak:0.1,rel:0.22,to:330}); tone(330,t+0.14,{type:'sine',peak:0.08,rel:0.3,to:294}); },
  treat(){ if(!ok()) return; const t=ctx.currentTime; for(let i=0;i<4;i++) noise(t+i*0.07,0.04,{freq:3000,q:1,peak:0.08}); tone(1320,t+0.3,{type:'sine',peak:0.06,rel:0.2}); },
  whoosh(){ if(!ok()) return; const t=ctx.currentTime; const n=ctx.createBufferSource(); const b=ctx.createBuffer(1,ctx.sampleRate*1.2,ctx.sampleRate); const d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; n.buffer=b;
    const f=ctx.createBiquadFilter(); f.type='bandpass'; f.Q.value=2; f.frequency.setValueAtTime(400,t); f.frequency.exponentialRampToValueAtTime(1800,t+0.6); f.frequency.exponentialRampToValueAtTime(400,t+1.2);
    const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.09,t+0.5); g.gain.exponentialRampToValueAtTime(0.0001,t+1.2); n.connect(f); f.connect(g); g.connect(sfxGain); n.start(t); n.stop(t+1.25); },
  bounce(){ if(!ok()) return; const t=ctx.currentTime; [0,0.22,0.36].forEach((d,i)=>tone(180-i*20,t+d,{type:'sine',peak:0.18/(i+1),rel:0.12,to:90})); },
  coco(){ if(!ok()) return; const t=ctx.currentTime; tone(1500,t,{type:'sine',peak:0.05,rel:0.08,to:2300}); tone(2100,t+0.1,{type:'sine',peak:0.04,rel:0.1,to:1600}); },
  pet(){ if(!ok()) return; const t=ctx.currentTime; tone(300,t,{type:'sine',peak:0.06,rel:0.4,to:420}); noise(t,0.3,{freq:600,q:0.7,peak:0.03,type:'lowpass'}); },
  applause(){ if(!ok()) return; const t=ctx.currentTime; for(let i=0;i<40;i++) noise(t+Math.random()*1.4,0.03,{freq:1500+Math.random()*2500,q:1.5,peak:0.05+Math.random()*0.05}); },
  drum(){ if(!ok()) return; const t=ctx.currentTime; for(let i=0;i<14;i++) noise(t+i*0.06,0.05,{freq:180,q:1,peak:0.12+i*0.01,type:'lowpass'}); tone(523,t+0.9,{type:'triangle',peak:0.15,rel:0.4}); tone(784,t+0.9,{type:'triangle',peak:0.1,rel:0.5}); },
  growl(){ if(!ok()) return; const t=ctx.currentTime; const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(95,t); o.frequency.linearRampToValueAtTime(80,t+0.7);
    const lfo=ctx.createOscillator(); lfo.frequency.value=28; const lg=ctx.createGain(); lg.gain.value=0.5; const g=ctx.createGain(); g.gain.value=0; lfo.connect(lg); lg.connect(g.gain);
    const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=600; const out=ctx.createGain(); env(out,t,0.08,0.35,0.6); o.connect(f); f.connect(g); g.connect(out); out.connect(sfxGain); o.start(t); lfo.start(t); o.stop(t+0.8); lfo.stop(t+0.8); },
  chapter(){ if(!ok()) return; const t=ctx.currentTime; [523,659,784,1047,1319].forEach((f,i)=>tone(f,t+i*0.12,{type:'triangle',peak:0.12,rel:0.5})); [262,392].forEach(f=>tone(f,t+0.6,{type:'sine',peak:0.08,rel:1.2})); },
};
