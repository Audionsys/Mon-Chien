// Grammatik-Raps: synthetischer Beat (WebAudio) + Sprachausgabe (Französisch für die Formen, Deutsch für den Merkspruch)
import { audioCtx, settings, stopMusic, startMusic } from './audio.js';

export const RAPS = {
  er: { title:'Der -er-Rap', bpm:94, lines:[
    [['fr','je parle, tu parles, il parle']],
    [['fr','nous parlons, vous parlez, ils parlent']],
    [['de','E! E S! E!','-e · -es · -e'],['de','O N S! E Z! E N T!','· -ons · -ez · -ent !']],
    [['de','Die Endung hörst du nicht – doch schreiben musst du sie!']],
    [['fr','je joue, tu joues, elle joue']],
    [['fr','nous jouons, vous jouez, elles jouent']],
    [['de','E! E S! E!','-e · -es · -e'],['de','O N S! E Z! E N T!','· -ons · -ez · -ent !']],
    [['de','Wuff! sagt Juna – jetzt kannst du es!']],
  ]},
  etre: { title:'Der être-Rap', bpm:94, lines:[
    [['fr','je suis, tu es, il est']],
    [['fr','nous sommes, vous êtes, ils sont']],
    [['fr','suis, es, est'],['de','das ist der Test!']],
    [['fr','sommes, êtes, sont'],['de','und weiter geht es!']],
    [['fr','je suis, tu es, elle est']],
    [['fr','nous sommes, vous êtes, elles sont']],
    [['de','être heißt sein – das prägst du dir ein!']],
  ]},
  avoir: { title:'Der avoir-Rap', bpm:94, lines:[
    [['fr',"j'ai, tu as, il a"]],
    [['fr','nous avons, vous avez, ils ont']],
    [['fr','ai, as, a'],['de','Juna ist da!']],
    [['fr','avons, avez, ont'],['de','und schon gekonnt!']],
    [['de','Achtung:'],['fr','ils ont'],['de','heißt haben,'],['fr','ils sont'],['de','heißt sind!']],
    [['de','avoir heißt haben – jetzt kannst du es sagen!']],
  ]},
};

let deVoice=null, frVoice=null;
function pickVoices(){ try{ const v=speechSynthesis.getVoices();
  frVoice=v.find(x=>x.name===settings.voiceName)||v.find(x=>/^fr[-_]FR/i.test(x.lang))||v.find(x=>/^fr/i.test(x.lang))||null;
  deVoice=v.find(x=>/^de[-_]DE/i.test(x.lang)&&/google|premium|enhanced|anna|petra|helena/i.test(x.name))||v.find(x=>/^de/i.test(x.lang))||null; }catch(e){} }

let timer=null, playing=null;
export function stopRap(){ if(!playing) return; clearInterval(timer); timer=null; try{ speechSynthesis.cancel(); }catch(e){} const p=playing; playing=null; p.onEnd?.(); if(p.musicWas) startMusic(); }
export function isRapping(){ return !!playing; }

// onLine(i) wird bei jeder Zeile aufgerufen (für Karaoke-Markierung)
export function playRap(id,{onLine,onEnd,rounds=1}={}){
  stopRap(); const R=RAPS[id]; const ctx=audioCtx(); if(!R||!ctx) return; pickVoices();
  const musicWas=settings.music; if(musicWas) stopMusic();
  const out=ctx.createGain(); out.gain.value=0.55; out.connect(ctx.destination);
  const beat=60/R.bpm, bar=4*beat, slot=2*bar; // jede Zeile bekommt 2 Takte
  const total=R.lines.length*rounds;
  const t0=ctx.currentTime+0.15+bar; // 1 Takt Intro
  const kick=t=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.setValueAtTime(130,t); o.frequency.exponentialRampToValueAtTime(42,t+0.16); g.gain.setValueAtTime(0.9,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.3); o.connect(g); g.connect(out); o.start(t); o.stop(t+0.32); };
  const nz=(t,dur,hp,peak)=>{ const n=ctx.createBufferSource(), b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*dur),ctx.sampleRate), d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    n.buffer=b; const f=ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp; const g=ctx.createGain(); g.gain.setValueAtTime(peak,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur); n.connect(f); f.connect(g); g.connect(out); n.start(t); n.stop(t+dur+0.02); };
  const bass=(t,f)=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.type='triangle'; o.frequency.value=f; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.35,t+0.02); g.gain.exponentialRampToValueAtTime(0.001,t+beat*0.9); o.connect(g); g.connect(out); o.start(t); o.stop(t+beat); };
  const BASS=[55,55,65.4,49];
  let nextBeat=0; const endBeat=4+total*8+2;
  const sched=()=>{ if(!playing) return; while(t0-bar+nextBeat*beat < ctx.currentTime+0.4 && nextBeat<endBeat){ const t=t0-bar+nextBeat*beat, b=nextBeat%4;
      if(b===0||b===2) kick(t); if(b===1||b===3) nz(t,0.18,1800,0.5); nz(t,0.04,7000,0.18); nz(t+beat/2,0.04,7000,0.12);
      if(nextBeat>=4 && nextBeat<endBeat-2) bass(t,BASS[Math.floor((nextBeat-4)/4)%4]*(b===2?1.5:1));
      if(b===2&&nextBeat%8===6) kick(t+beat/2);
      nextBeat++; }
    if(nextBeat>=endBeat && ctx.currentTime>t0-bar+endBeat*beat) stopRap(); };
  playing={onEnd,musicWas}; timer=setInterval(sched,60); sched();
  // Zeilen sprechen: jede Zeile startet auf Taktbeginn
  for(let k=0;k<total;k++){ const i=k%R.lines.length, at=(t0+k*slot-ctx.currentTime)*1000;
    setTimeout(()=>{ if(!playing) return; onLine?.(i); try{ speechSynthesis.cancel(); }catch(e){}
      for(const [lang,txt] of R.lines[i]){ const u=new SpeechSynthesisUtterance(txt); u.lang=lang==='fr'?'fr-FR':'de-DE'; const v=lang==='fr'?frVoice:deVoice; if(v) u.voice=v; u.rate=lang==='fr'?1.0:1.05; u.pitch=1.0; u.volume=1; speechSynthesis.speak(u); } }, Math.max(0,at)); }
}

// ---------------- Echter Song (Suno) mit mitlaufendem Text ----------------
export const SONG = { title:'Mein Hund versteht Französisch', src:'music/rap-chien.mp3', lyrics:`[Intro]
Yo! Mein Hund ist am Start – und er versteht nur Französisch!
Also hör gut zu… on y va!

[Strophe 1]
Je parle, tu parles, il parle,
nous parlons, vous parlez, ils parlent!
Je joue, tu joues, elle joue,
nous jouons, vous jouez, elles jouent!

[Refrain]
E! E-S! E!
O-N-S! E-Z! E-N-T!
Die Endung hörst du nicht –
doch schreiben musst du sie!

[Strophe 2 – être]
Être heißt sein – das prägst du dir ein:
Je suis, tu es, il est,
nous sommes, vous êtes, ils sont!
Suis, es, est – das ist der Test!
Sommes, êtes, sont – und weiter geht's!

[Refrain]
E! E-S! E!
O-N-S! E-Z! E-N-T!

[Strophe 3 – avoir]
Avoir heißt haben – jetzt kannst du's sagen:
J'ai, tu as, il a,
nous avons, vous avez, ils ont!
Ai, as, a – mein Hund ist da!

[Bridge]
Achtung, Falle! Hör genau:
Ils ont – sie haben!
Ils sont – sie sind!
J'ai onze ans – ich bin elf!

[Outro]
Wuff! Wuff! Mon chien dit: Bravo!
C'est parti – on y va!` };
let songEl=null, songMusicWas=false;
export function playSong({onTime,onEnd}={}){ stopRap(); stopSong(); songMusicWas=settings.music; if(songMusicWas) stopMusic();
  songEl=new Audio(SONG.src); songEl.ontimeupdate=()=>onTime?.(songEl.currentTime,songEl.duration||105); songEl.onended=()=>{ stopSong(); onEnd?.(); }; songEl.play().catch(()=>{}); }
export function stopSong(){ if(!songEl) return; try{ songEl.pause(); }catch(e){} songEl=null; if(songMusicWas){ songMusicWas=false; startMusic(); } }
export function songPlaying(){ return !!songEl; }
