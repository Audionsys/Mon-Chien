// Der Hund: Modell laden, Laufanimation + prozedurale Posen, Verhalten
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { POSES, ORDER } from './poses.js';
import { DOG } from '../content/dog.js';

const AX={x:new THREE.Vector3(1,0,0),y:new THREE.Vector3(0,1,0),z:new THREE.Vector3(0,0,1)};
const _q=new THREE.Quaternion(), _qp=new THREE.Quaternion(), _qd=new THREE.Quaternion(), _v=new THREE.Vector3();
const lerp=THREE.MathUtils.lerp, clamp=THREE.MathUtils.clamp;
// Weg um Hindernisse herum (Rechtecke aus scenes.js 'block')
function segHits(ax,az,bx,bz,o,m){ const x0=o.x-o.w/2-m, x1=o.x+o.w/2+m, z0=o.z-o.d/2-m, z1=o.z+o.d/2+m;
  let t0=0,t1=1; const dx=bx-ax, dz=bz-az;
  for(const [p,q] of [[-dx,ax-x0],[dx,x1-ax],[-dz,az-z0],[dz,z1-az]]){ if(p===0){ if(q<0) return false; } else { const r=q/p; if(p<0){ if(r>t1) return false; if(r>t0) t0=r; } else { if(r<t0) return false; if(r<t1) t1=r; } } }
  return t0<t1; }
function planPath(from,to,obs,clamp,depth=3){
  const M=0.32; const hit=obs.find(o=>segHits(from.x,from.z,to.x,to.z,o,M));
  if(!hit||depth<=0) return [to];
  const m=M+0.12; const cs=[[hit.x-hit.w/2-m,hit.z-hit.d/2-m],[hit.x+hit.w/2+m,hit.z-hit.d/2-m],[hit.x-hit.w/2-m,hit.z+hit.d/2+m],[hit.x+hit.w/2+m,hit.z+hit.d/2+m]]
    .map(([x,z])=>clamp(new THREE.Vector3(x,0,z)));
  let best=null,bc=1e9; for(const c of cs){ if(segHits(from.x,from.z,c.x,c.z,hit,M-0.05)) continue; const cost=Math.hypot(c.x-from.x,c.z-from.z)+Math.hypot(to.x-c.x,to.z-c.z); if(cost<bc){ bc=cost; best=c; } }
  if(!best) return [to];
  return [...planPath(from,best,obs,clamp,depth-1), ...planPath(best,to,obs,clamp,depth-1)];
}
// A*-Wegsuche auf einem feinen Raster: geht sauber um alle Hindernisse herum, danach Weg glätten
function findPath(from,to,obs,clampFn){
  const M=0.28, C=0.14;
  const freeObs=(x,z)=>{ for(const o of obs){ if(Math.abs(x-o.x)<o.w/2+M && Math.abs(z-o.z)<o.d/2+M) return false; } return true; };
  const free=(x,z)=>{ if(!freeObs(x,z)) return false; const q=clampFn(new THREE.Vector3(x,0,z)); return Math.abs(q.x-x)<0.03&&Math.abs(q.z-z)<0.03; };
  const los=(a,b,skip=0)=>{ const L=Math.hypot(b.x-a.x,b.z-a.z), n=Math.max(1,Math.ceil(L/0.07)); for(let i=1;i<n;i++){ const t=i/n; if(t*L<skip) continue; if(!freeObs(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t)) return false; } return true; };
  if(los(from,to,0.35)) return [to];
  const pad=2.5, x0=Math.min(from.x,to.x)-pad, z0=Math.min(from.z,to.z)-pad;
  const W=Math.ceil((Math.abs(to.x-from.x)+2*pad)/C)+1, H=Math.ceil((Math.abs(to.z-from.z)+2*pad)/C)+1; if(W*H>40000) return [to];
  const ok=new Uint8Array(W*H); for(let j=0;j<H;j++) for(let i=0;i<W;i++) ok[j*W+i]=free(x0+i*C,z0+j*C)?1:0;
  const cell=p=>[Math.round((p.x-x0)/C),Math.round((p.z-z0)/C)];
  const nearestFree=(ci,cj)=>{ for(let r=0;r<12;r++) for(let dj=-r;dj<=r;dj++) for(let di=-r;di<=r;di++){ if(Math.max(Math.abs(di),Math.abs(dj))!==r) continue; const i=ci+di,j=cj+dj; if(i>=0&&j>=0&&i<W&&j<H&&ok[j*W+i]) return [i,j]; } return null; };
  const s=nearestFree(...cell(from)), g=nearestFree(...cell(to)); if(!s||!g) return [to];
  const S=s[1]*W+s[0], G=g[1]*W+g[0]; const gs=new Float32Array(W*H).fill(1e9), came=new Int32Array(W*H).fill(-1), closed=new Uint8Array(W*H);
  const open=[S]; gs[S]=0; const hh=k=>Math.hypot(k%W-g[0],((k/W)|0)-g[1]); let found=false, guard=0;
  while(open.length && guard++<40000){ let bi=0; for(let k=1;k<open.length;k++) if(gs[open[k]]+hh(open[k])<gs[open[bi]]+hh(open[bi])) bi=k;
    const cur=open.splice(bi,1)[0]; if(cur===G){ found=true; break; } closed[cur]=1; const ci=cur%W, cj=(cur/W)|0;
    for(let dj=-1;dj<=1;dj++) for(let di=-1;di<=1;di++){ if(!di&&!dj) continue; const i=ci+di,j=cj+dj; if(i<0||j<0||i>=W||j>=H) continue; const k=j*W+i; if(!ok[k]||closed[k]) continue;
      if(di&&dj&&(!ok[cj*W+i]||!ok[j*W+ci])) continue; const ng=gs[cur]+(di&&dj?1.414:1); if(ng<gs[k]){ gs[k]=ng; came[k]=cur; if(!open.includes(k)) open.push(k); } } }
  if(!found) return [to];
  const raw=[]; for(let k=G;k!==-1;k=came[k]) raw.unshift(new THREE.Vector3(x0+(k%W)*C,0,z0+((k/W)|0)*C)); raw.push(to.clone());
  const out=[]; let cur=from, i=0;
  while(i<raw.length-1){ let j=raw.length-1; while(j>i+1 && !los(cur,raw[j],0.35)) j--; out.push(raw[j]); cur=raw[j]; i=j; }
  return out.length?out:[to];
}
function angDiff(a,b){ let d=b-a; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI; return d; }

export class Dog {
  constructor(world, room, sfx){
    this.world=world; this.room=room; this.sfx=sfx;
    this.H=DOG.height; this.root=new THREE.Group(); this.trick=new THREE.Group(); this.trickOff=new THREE.Group(); this.inner=new THREE.Group(); this.root.add(this.trick); this.trick.add(this.trickOff); this.trickOff.add(this.inner); world.scene.add(this.root);
    this.bones={}; this.bind={}; this.allBones=[]; this.W={}; this.WT={}; for(const k in POSES){ this.W[k]=0; this.WT[k]=0; }
    this.mode='idle'; this.target=null; this.onArrive=null; this.speed=0; this.walkW=0; this.yaw=0; this.faceYaw=null;
    this.timers=[]; this.wagAmt=0.25; this.wagSpeed=7; this.lookYaw=0; this.lookPitch=0; this.T=0; this.carry=null;
    this.strideSpeed=0.4;
    this.listeners={};
    // Im Körbchen? Erst rausspringen, dann das Kommando ausführen (sonst bleibt die Körbchen-Haltung hängen)
    for(const k of ['sit','stand','paw','spin','jump','eat','come','fetch','trick_','dir']){ const orig=this[k]; if(!orig) continue;
      this[k]=(...a)=>{ if(this.inBed){ const ib=this.inBed; this.inBed=null; this.clearTimers(); this.setPose(0,0); this.WT.sleepHead=0; this.sleeping=false;
          this.later(300,()=>this.hopTo(ib.out[0],ib.out[1],0,()=>orig.apply(this,a),ib.arc)); return; } return orig.apply(this,a); }; }
  }
  on(ev,fn){ (this.listeners[ev]??=[]).push(fn); }
  emit(ev,...a){ (this.listeners[ev]||[]).forEach(f=>f(...a)); }

  load(onProgress){
    return new Promise((res,rej)=>{
      const loader=new GLTFLoader();
      const done=(gltf)=>{ try{ this._setup(gltf); res(); }catch(e){ rej(e); } };
      if(/\.js$/.test(DOG.model)){ // GLB als JS-Paket (window.FILOU_GLB = base64)
        const sc=document.createElement('script'); sc.src=DOG.model;
        sc.onload=()=>{ try{ onProgress&&onProgress(1); const bin=Uint8Array.from(atob(window.FILOU_GLB),c=>c.charCodeAt(0)); window.FILOU_GLB=null; loader.parse(bin.buffer,'',done,rej); }catch(e){ rej(e); } };
        sc.onerror=()=>rej(new Error('Modell fehlt: '+DOG.model)); document.head.appendChild(sc);
      } else loader.load(DOG.model,done,e=>onProgress&&e.total&&onProgress(e.loaded/e.total),rej);
    });
  }
  _setup(gltf){
    const model=gltf.scene; this.inner.add(model); let skinned;
    model.traverse(o=>{ if(o.isMesh){ o.castShadow=true; o.frustumCulled=false; skinned=o; const m=o.material; if(m){ m.metalness=0; m.roughness=Math.max(0.65,m.roughness??0.8); m.envMapIntensity=1.2;
        // Meshy-Modelle sind „doppelseitig“: Vorder- und Rückseite liegen aufeinander und kämpfen um die Tiefe → Flimmern. Nur Vorderseite zeichnen.
        m.side=THREE.FrontSide; m.shadowSide=THREE.FrontSide; m.transparent=false; m.depthWrite=true; m.needsUpdate=true; } }
      if(o.isBone) this.allBones.push(o); });
    const byName={}; this.allBones.forEach(b=>byName[b.name]=b);
    for(const logical in DOG.bones){ const b=byName[DOG.bones[logical]]; if(b) this.bones[logical]=b; }
    if(!this.bones.Hips||!this.bones.chest) throw new Error('Knochen "Hips"/"chest" nicht gefunden – content/dog.js prüfen');
    for(const b of this.allBones) this.bind[b.uuid]={q:b.quaternion.clone(), p:b.position.clone()};
    this.head=this.bones.head; this.mouth=this.bones.mouth||this.bones.head;
    model.updateMatrixWorld(true);
    const hp=this.bones.Hips.getWorldPosition(new THREE.Vector3()), cp=this.bones.chest.getWorldPosition(new THREE.Vector3());
    const f=cp.sub(hp); this.inner.rotation.y=-Math.atan2(f.x,f.z); this.inner.updateMatrixWorld(true);
    skinned.computeBoundingBox();
    let box=skinned.boundingBox.clone().applyMatrix4(skinned.matrixWorld);
    this.inner.scale.setScalar(this.H/(box.max.y-box.min.y)); this.inner.updateMatrixWorld(true);
    box=skinned.boundingBox.clone().applyMatrix4(skinned.matrixWorld);
    this.inner.position.set(-(box.min.x+box.max.x)/2,-box.min.y,-(box.min.z+box.max.z)/2);
    this.mixer=new THREE.AnimationMixer(model);
    const clip=(typeof DOG.walkClip==='string'? gltf.animations.find(a=>a.name.includes(DOG.walkClip)) : gltf.animations[DOG.walkClip]) || gltf.animations[0]; this.walk=this.mixer.clipAction(clip); this.walk.play(); this.walk.weight=0;
    this._measureStride(clip, model); this._setupStand(clip); this._centerPivot();
    const s=this.room.start; this.root.position.set(s.pos[0],0,s.pos[1]); this.yaw=s.yaw; this.root.rotation.y=this.yaw;
  }
  _measureStride(clip, model){
    const foot=this.bones.frontleg2||this.bones.R_frontleg2; if(!foot) return;
    this.walk.weight=1; const N=60, dur=clip.duration, zs=[], inv=new THREE.Matrix4();
    for(let i=0;i<=N;i++){ this.mixer.setTime(dur*i/N); this.root.updateMatrixWorld(true); inv.copy(this.root.matrixWorld).invert();
      const p=foot.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv); zs.push(p); }
    const minY=Math.min(...zs.map(a=>a.y)); let dist=0,time=0;
    for(let i=1;i<zs.length;i++){ const dz=zs[i].z-zs[i-1].z; if(zs[i].y<minY+0.025 && dz<0){ dist-=dz; time+=dur/N; } }
    if(time>0.05 && dist>0.01) this.strideSpeed=dist/time;
    this.walk.weight=0; this.mixer.setTime(0);
  }

  // Stehen = ein eingefrorenes Bild aus dem Laufzyklus (sonst wirkt der Hund im Stand größer als beim Laufen)
  _setupStand(clip){ const B=this.bones, ks=['frontleg2','R_frontleg2','backleg2','R_backleg2']; if(ks.some(k=>!B[k])) return;
    const N=40, dur=clip.duration, inv=new THREE.Matrix4(), v=new THREE.Vector3(); let best=0, bs=1e9; this.walk.weight=1;
    for(let i=0;i<N;i++){ for(const b of this.allBones){ const r=this.bind[b.uuid]; b.quaternion.copy(r.q); b.position.copy(r.p); }
      this.mixer.setTime(dur*i/N); this.root.updateMatrixWorld(true); inv.copy(this.root.matrixWorld).invert();
      const z=ks.map(k=>B[k].getWorldPosition(v).applyMatrix4(inv).z); const sp=Math.abs(z[0]-z[1])+Math.abs(z[2]-z[3]); if(sp<bs){ bs=sp; best=dur*i/N; } }
    this.walk.weight=0; this.mixer.setTime(0);
    this.standAct=this.mixer.clipAction(clip.clone()); this.standAct.play(); this.standAct.time=best; this.standAct.timeScale=0; this.standAct.weight=1; this.standT=best; }

  // Bodenkontakt: Nach allen Posen die Pfoten genau auf den Boden bringen (nicht in der Luft, nicht im Boden)
  ground(dt){ if(!this._feet||this._feet.length<4) this._feet=['frontleg2','R_frontleg2','backleg2','R_backleg2'].map(k=>this.bones[k]).filter(Boolean); const ks=this._feet; if(ks.length<4||this._foot0==null) return;
    if(this.inner.userData.y0==null) this.inner.userData.y0=this.inner.position.y;
    const free=!['hop','jump','trick'].includes(this.mode) && !this.carryJump;
    this.root.updateMatrixWorld(true); const v=_v; let lo=1e9; const ry=this.root.position.y;
    let loF=1e9; ks.forEach((b,i)=>{ b.getWorldPosition(v); if(v.y<lo) lo=v.y; if(i<2&&v.y<loF) loF=v.y; });
    // Sitzen/Liegen: die Vorderpfoten bestimmen den Bodenkontakt (Hinterbeine sind eingeknickt)
    const k=Math.min(1,Math.max(this.W.sit||0,this.W.lie||0,this.W.beg||0)*1.5); lo=lo*(1-k)+loF*k;
    lo-=ry; if(this._foot0==null){ this._foot0=lo; return; }   // Pfotenhöhe im normalen Stand merken
    const want= free ? THREE.MathUtils.clamp(this._foot0-lo, -0.12, 0.12) : 0;
    this._gy=lerp(this._gy||0, (this._gy||0)+want, Math.min(1,dt*8));
    this._gy=THREE.MathUtils.clamp(this._gy,-0.2,0.2); if(!free) this._gy=lerp(this._gy,0,Math.min(1,dt*6));
    this.inner.position.y=this.inner.userData.y0+this._gy; }

  // Drehpunkt = Mitte zwischen den vier Pfoten (sonst dreht sich der Hund um die Hinterbeine)
  _centerPivot(){ const ks=['frontleg2','R_frontleg2','backleg2','R_backleg2'].map(k=>this.bones[k]).filter(Boolean); if(ks.length<4) return;
    for(const b of this.allBones){ const r=this.bind[b.uuid]; b.quaternion.copy(r.q); b.position.copy(r.p); }
    this.mixer.update(0); this.root.updateMatrixWorld(true);
    const inv=new THREE.Matrix4().copy(this.root.matrixWorld).invert(), v=new THREE.Vector3(); let x=0,z=0;
    let lo=1e9; for(const b of ks){ b.getWorldPosition(v).applyMatrix4(inv); x+=v.x; z+=v.z; lo=Math.min(lo,v.y); } x/=4; z/=4; this._foot0=lo;
    this.inner.position.x-=x; this.inner.position.z-=z; this.inner.updateMatrixWorld(true); this._hindZ=null; }

  // ---------- Hilfen ----------
  later(ms,fn){ this.timers.push(setTimeout(fn,ms)); }
  clearTimers(){ this.timers.forEach(clearTimeout); this.timers=[]; }
  isDown(){ return this.WT.sit>0.5||this.WT.lie>0.5; }
  setPose(sit=0,lie=0){ this.WT.sit=sit; this.WT.lie=lie; }
  headWorld(out=new THREE.Vector3()){ return (this.head||this.root).getWorldPosition(out); }
  faceCamera(){ const c=this.world.camera.position; this.faceYaw=Math.atan2(c.x-this.root.position.x, c.z-this.root.position.z); }
  facePoint(x,z){ this.faceYaw=Math.atan2(x-this.root.position.x, z-this.root.position.z); }
  happy(ms=1200){ this.wagAmt=1; this.wagSpeed=16; this.later(ms,()=>{ this.wagAmt=0.25; this.wagSpeed=7; }); }
  _standThen(fn){ if(this.isDown()){ this.WT.paw=0; this.setPose(0,0); this.later(450,fn); } else fn(); }

  walkTo(x,z,onArrive,opts={}){
    this.runBoost=opts.run?2.3:1;
    this.wake(); this.clearTimers(); this.WT.paw=0; this.WT.tilt=0;
    const tgt=opts.raw? new THREE.Vector3(x,0,z) : this.room.clampPoint(new THREE.Vector3(x,0,z));
    const go=()=>{ const obs=(this.room.obstacles||[]).filter(o=>!opts.ignore||o!==opts.ignore);
      const from=this.root.position.clone(); const wps=this.room.route? this.room.route(from,tgt) : [tgt];
      const path=[]; let prev=from; for(const w of wps){ path.push(...findPath(prev,w,obs,p=>this.room.clampPoint(p))); prev=w; }
      this.path=path; this.target=this.path.shift(); this.mode='walk'; this.onArrive=onArrive||null; };
    if(this.inBed){ const ib=this.inBed; this.inBed=null; this.setPose(0,0); this.later(350,()=>this.hopTo(ib.out[0],ib.out[1],0,go,ib.arc)); }
    else this._standThen(go);
  }
  hopTo(x,z,y,cb,arc){ this.mode='hop'; this.hop={from:this.root.position.clone(), to:new THREE.Vector3(x,y,z), t:0, cb, arc};
    this.faceYaw=null; this.yaw=Math.atan2(x-this.root.position.x,z-this.root.position.z); this.sfx.whoosh?.(); }

  // ---------- Aktionen (werden über commands.js angesteuert) ----------
  do(action, ctx={}){
    if(this.mis && action!=='stop'){ this.mis=null; this.shake=false; this.digging=false; this.speedBoost=1; this.spinDur=null; this.WT.dig=0; this.drop(); }
    if(typeof action==='string') return this[action]?.(ctx);
    if(action.do==='goto') return this.goto(action.target, action.then);
    if(action.do==='fetch') return this.fetch(action.target);
    if(action.do==='dir') return this.dir(action);
    if(action.do==='trick') return this.trick_(action.id);
  }
  dir(action){ const p=this.root.position; return this.walkTo(p.x+(action.x||0), p.z+(action.z||0), ()=>{ this.faceCamera(); this.happy(700); }); }
  frontSpot(){ const r=this.room.roomOf?this.room.roomOf(this.root.position):null; const cx=this.world.camera.position.x; return r? [THREE.MathUtils.clamp(cx,r.minX+0.6,r.maxX-0.6), r.maxZ-0.75] : [cx*0.3,1.15]; }
  curRoom(){ return this.room.roomOf? this.room.roomOf(this.root.position).id : null; }
  come(){ this.wake(); const f=this.frontSpot(); this.walkTo(f[0], f[1], ()=>{ this.faceCamera(); this.happy(1200); }); }
  sit(){ this.wake(); this.clearTimers(); this.mode='idle'; this.WT.paw=0; this.faceCamera(); this.setPose(1,0); }
  lie(){ this.wake(); this.clearTimers(); this.mode='idle'; this.WT.paw=0; this.faceCamera(); this.setPose(0,1); }
  stand(){ this.wake(); this.clearTimers(); this.mode='idle'; this.faceCamera(); this.WT.paw=0; this.setPose(0,0); this.later(500,()=>this.happy(800)); }
  paw(){ this.wake(); this.clearTimers(); this.mode='idle'; this.faceCamera(); this.setPose(1,0); this.later(500,()=>this.WT.paw=1); this.later(2600,()=>this.WT.paw=0); }
  bark(n=2){ this.clearTimers(); this.mode=this.mode==='walk'?'walk':'idle'; if(this.mode==='idle') this.faceCamera();
    for(let i=0;i<n;i++) this.later(50+i*280,()=>{ this.WT.barkHead=1; this.later(140,()=>this.WT.barkHead=0); });
    this.sfx.bark(n); this.emit('say', n>1?'Wouf ! Wouf !':'Wouf !', 1200); }
  spin(){ this.wake(); this.clearTimers(); this.sfx.whoosh(); this._standThen(()=>{ this.mode='spin'; this.spinT=0; this.spinStart=this.yaw; }); }
  praise(kind){ kind=typeof kind==='string'?kind:'lob'; this.sfx.pet(); this.happy(1600); this.emit('hearts',4); this.emit('liked',kind); }
  tilt(){ this.WT.tilt=1; this.emit('say','Wouf ?',1200); this.later(1300,()=>this.WT.tilt=0); }
  name(){ this.clearTimers(); this.faceCamera(); this.WT.tilt=0; this.happy(1400); this.bark(1); }
  goto(id, then){
    const p=this.room.props.get(id); if(!p) return;
    const s=p.spot||p.pos;
    if(p.enter){ // z. B. Körbchen: davor laufen, reinhüpfen, einrollen
      const blk=(this.room.obstacles||[]).find(o=>o.x===p.pos[0]&&o.z===p.pos[1]);
      if(this.inBed&&this.inBed.id===id){ this.setPose(0,1); this.happy(800); return; }
      this.walkTo(s[0],s[1],()=>{ const e=p.enter; this.hopTo(e.pos[0],e.pos[1],e.y,()=>{ this.inBed={id,out:s,arc:e.arc};
          const c=this.world.camera.position; if(e.pose!=='sit') this.faceYaw=(c.x<this.root.position.x? -1:1)*Math.PI/2*0.8; this.later(150,()=>{ if(e.pose==='sit'){ this.faceCamera(); this.setPose(1,0); this.happy(1600); this.bark?.(1); this.emit('hearts',3); this.emit('trickDone','linge'); this.emit('liked','jeu'); } else { this.setPose(0,1); this.happy(900); this.emit('liked','panier'); } }, e.arc); }); },{ignore:null});
      return; }
    this.walkTo(s[0],s[1],()=>{ if(id==='fenetre'||id==='gamelle') this.facePoint(p.pos[0],p.pos[1]); else this.faceCamera();
      if(then==='lie') this.later(300,()=>this.setPose(0,1)); else if(then==='sit') this.later(300,()=>this.setPose(1,0));
      if(id==='gamelle'){ this.later(400,()=>{ this.setPose(0,0); this.WT.sniff=1; }); this.later(2200,()=>{ this.WT.sniff=0; this.happy(1000); }); }
      this.happy(900); });
  }
  fetch(id){
    const p=this.room.props.get(id); if(!p) return; this.drop();
    const ball=p.object; const bp=ball.getWorldPosition(new THREE.Vector3());
    const from=this.root.position; const dir=new THREE.Vector3(bp.x-from.x,0,bp.z-from.z); const L=dir.length(); dir.normalize();
    const reach=this.H*0.62; this.fetchTarget=id; const stop=L>reach? bp.clone().addScaledVector(dir,-reach) : from.clone();
    this.walkTo(stop.x,stop.z,()=>{
      this.facePoint(bp.x,bp.z); this.WT.sniff=1;
      this.later(550,()=>{ this._grab(ball); this.WT.sniff=0;
        this.later(350,()=>{ const f=this.frontSpot(); this.walkTo(f[0],f[1],()=>{ this.faceCamera(); this.WT.sniff=1;
          this.later(450,()=>{ this.drop(); this.WT.sniff=0; this.setPose(1,0); this.happy(1500); this.emit('hearts',3); this.emit('liked','jeu'); }); }); }); });
    });
  }
  _grab(obj){ this.root.updateMatrixWorld(true); const m=this.mouth.getWorldPosition(new THREE.Vector3());
    const r=obj.userData.radius||0.06; obj.position.set(m.x,m.y-r-r*0.3,m.z); obj.rotation.set(0,0,0); obj.updateMatrixWorld(true); this.mouth.attach(obj); this.carry=obj; }
  drop(){ if(!this.carry) return; const o=this.carry; this.carry=null; this.world.scene.attach(o);
    const p=o.getWorldPosition(new THREE.Vector3()); o.rotation.set(0,0,0); o.scale.set(1,1,1); o.position.set(p.x,0,p.z); this.sfx.bounce(); }


  sleep(){ this.clearTimers(); this.mode='idle'; this.WT.paw=0; this.setPose(0,1); this.later(600,()=>{ this.WT.sleepHead=1; this.sleeping=true; this._zzz(); }); }
  _zzz(){ if(!this.sleeping) return; this.emit('say','Z z z …',1600); this.later(2200,()=>this._zzz()); }
  wake(){ if(this.sleeping){ this.sleeping=false; this.WT.sleepHead=0; } }
  jump(){ this.clearTimers(); this._standThen(()=>{ this.mode='jump'; this.jumpT=0; this.sfx.whoosh(); }); }

  react(kind){ if(this.mis||this.mode!=='idle') return; const c=this.world.camera.position; this.facePoint(c.x-2.2,c.z-0.5);
    if(kind==='bark') this.bark(2); else if(kind==='tilt') this.tilt(); else if(kind==='happy') this.happy(1500);
    else if(kind==='growl'){ this.sfx.growl(); this.emit('say','Grrr…',1300); this.WT.shame=0.4; this.later(1200,()=>this.WT.shame=0); }
    else if(kind==='sniff'){ this.WT.sniff=1; this.emit('say','Snif snif ?',1300); this.later(1300,()=>this.WT.sniff=0); }
    this.later(1800,()=>this.faceCamera()); }
  eat(){ this.wake(); this.clearTimers(); this.mode='idle'; this.WT.paw=0; this.setPose(0,0); this.faceCamera(); this.WT.sniff=1;
    for(let i=0;i<5;i++) this.later(300+i*380,()=>{ this.WT.barkHead=1; this.sfx.treat(); this.later(150,()=>this.WT.barkHead=0); });
    this.later(2300,()=>{ this.WT.sniff=0; this.happy(2000); this.emit('hearts',4); this.emit('liked','friandise'); this.setPose(1,0); }); }

  // ---------- Quatsch ----------
  mischief(kind){ this.wake(); this.clearTimers(); this.drop(); this.mis=kind; const R=this.room;
    const prop=id=>R.props.get(id);
    if(kind==='shred'){ const p=prop('coussin'); if(!p) return false; const pp=p.object.getWorldPosition(new THREE.Vector3());
      this.walkTo(pp.x-0.35,pp.z+0.35,()=>{ this.facePoint(pp.x,pp.z); this.WT.sniff=1; this.later(500,()=>{ this._grab(p.object); this.WT.sniff=0; this.shake=true; this.happy(99999);
        const tick=()=>{ if(this.mis!=='shred') return; this.emit('particles','feather',this.mouth.getWorldPosition(new THREE.Vector3())); this.sfx.step(); this.later(220,tick); }; tick(); }); }); }
    else if(kind==='tail'){ const loop=()=>{ if(this.mis!=='tail') return; this.mode='spin'; this.spinT=0; this.spinStart=this.yaw; this.spinDur=0.9; this.bark(1); this.later(950,loop); }; this._standThen(loop); }
    else if(kind==='dig'){ const p=this.curRoom()==='jardin'? prop('fleurs') : prop('plante'); if(!p) return false; const s=p.spot||[p.pos[0]+0.3,p.pos[1]+0.45];
      this.walkTo(s[0],s[1],()=>{ this.facePoint(p.pos[0],p.pos[1]); this.WT.dig=1; this.digging=true;
        const tick=()=>{ if(this.mis!=='dig') return; this.emit('particles','dirt',this.mouth.getWorldPosition(new THREE.Vector3())); this.sfx.step(); this.later(160,tick); }; tick(); }); }
    else if(kind==='window'){ const p=this.curRoom()==='jardin'? prop('portail') : prop('fenetre'); if(!p) return false; const s=p.spot||p.pos;
      this.walkTo(s[0],s[1],()=>{ this.facePoint(p.pos[0],p.pos[1]); const b=()=>{ if(this.mis!=='window') return; this.bark(2); this.mis='window'; this.later(1100,b); }; b(); }); }
    else if(kind==='zoomies'){ this._zoom('zoomies'); }
    else if(kind==='sausage'){ const p=prop('saucisson'); if(!p) return false; const s=p.spot||p.pos;
      this.walkTo(s[0],s[1],()=>{ this.facePoint(p.pos[0],p.pos[1]); this.WT.sniff=1; this.later(500,()=>{ this.WT.sniff=0; const sg=p.object.userData.sausage; if(sg){ this._grab(sg); } this._zoom('sausage'); }); }); }
    else if(kind==='flour'){ const p=prop('sac'); if(!p) return false; const s=p.spot||p.pos;
      this.walkTo(s[0],s[1],()=>{ this.facePoint(p.pos[0],p.pos[1]); this.WT.dig=1; this.digging=true; const sack=p.object; let t=0;
        const tick=()=>{ if(this.mis!=='flour') return; t++; sack.rotation.z=Math.sin(t*0.9)*0.15; const pp=sack.getWorldPosition(new THREE.Vector3()); pp.y+=0.6; this.emit('particles','flour',pp); this.later(170,tick); }; tick(); }); }
    else if(kind==='steal'){ const p=prop('balle'); if(!p) return false; const bp=p.object.getWorldPosition(new THREE.Vector3());
      this.walkTo(bp.x-0.38,bp.z,()=>{ this.facePoint(bp.x,bp.z); this._grab(p.object); this._zoom('steal'); }); }
    return true;
  }
  _zoom(tag){ const r=this.room.roomOf(this.root.position); const cs=[[0.1,0.85],[0.9,0.85],[0.85,0.45],[0.2,0.3],[0.55,0.95]]; const corners=cs.map(([a,b])=>[r.minX+0.5+(r.maxX-r.minX-1)*a, r.minZ+0.6+(r.maxZ-r.minZ-1)*b]); let i=Math.floor(Math.random()*5);
    const run=()=>{ if(this.mis!==tag) return; const c=corners[i++%corners.length]; this.speedBoost=1.9; this.mode='walk'; this.target=this.room.clampPoint(new THREE.Vector3(c[0],0,c[1])); this.onArrive=()=>{ if(tag!=='steal') this.bark(1); run(); }; }; run(); }
  stopMischief(){ if(!this.mis) return false; this.mis=null; this.shake=false; this.digging=false; this.speedBoost=1; this.spinDur=null;
    this.clearTimers(); this.WT.dig=0; this.WT.sniff=0; this.mode='idle'; this.target=null; this.drop(); this.wagAmt=0.1; this.wagSpeed=4;
    this.faceCamera(); this.setPose(1,0); this.WT.shame=1; this.later(2600,()=>{ this.WT.shame=0; this.wagAmt=0.25; this.wagSpeed=7; }); return true; }
  stop(){ this.stopMischief(); }

  // ---------- pro Frame ----------
  update(dt){
    if(!this.mixer) return; this.T+=dt; let wantWalk=0;
    if(this.mode==='walk' && this.target){
      const dx=this.target.x-this.root.position.x, dz=this.target.z-this.root.position.z, dist=Math.hypot(dx,dz);
      const turn=angDiff(this.yaw,Math.atan2(dx,dz)); this.yaw+=clamp(turn,-4*dt,4*dt); if(Math.abs(turn)>0.5) this._turning=true;
      const align=Math.max(0,Math.cos(turn));
      if(dist>0.06){ wantWalk=1; const last=!(this.path&&this.path.length); const boost=Math.max(this.speedBoost||1,this.runBoost||1);
        // erst am letzten Wegpunkt sanft abbremsen (beim Rennen früher), dazwischen weiterlaufen
        const brake= last ? Math.min(1, 0.28+dist/((boost>1.2)?1.1:0.45)) : 1;
        this.speed=lerp(this.speed,this.strideSpeed*boost*align*brake,Math.min(1,dt*(boost>1.2?4:6))); }
      else if(this.path&&this.path.length){ this.target=this.path.shift(); }
      else { this.mode='idle'; this.target=null; this.runBoost=1; const cb=this.onArrive; this.onArrive=null; cb&&cb(); }
      this.root.position.x+=Math.sin(this.yaw)*this.speed*dt; this.root.position.z+=Math.cos(this.yaw)*this.speed*dt;
    } else if(this.mode==='spin'){
      this.spinT+=dt; const k=Math.min(1,this.spinT/(this.spinDur||1.8)), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      this.yaw=this.spinStart+e*Math.PI*2; wantWalk=0.8; this.speed=0; if(k>=1){ this.mode='idle'; if(!this.mis){ this.faceCamera(); this.happy(900); } }
    } else if(this.mode==='hop'){
      const H=this.hop; H.t+=dt; const k=Math.min(1,H.t/0.55); const e=k*k*(3-2*k);
      this.root.position.lerpVectors(H.from,H.to,e); this.root.position.y+=Math.sin(Math.PI*k)*(H.arc||0.22); this.WT.jumpLegs=k<0.8?1:0; wantWalk=0;
      if(k>=1){ this.mode='idle'; this.root.position.copy(H.to); this.WT.jumpLegs=0; this.sfx.bounce(); const cb=H.cb; this.hop=null; cb&&cb(); }
    } else if(this.mode==='trick'){ wantWalk=0; this._trickUpdate(dt);
    } else if(this.mode==='jump'){
      this.jumpT+=dt; const k=Math.min(1,this.jumpT/0.75); this.WT.jumpLegs= k<0.85?1:0; this.root.position.y=Math.sin(Math.PI*k)*0.28;
      wantWalk=0; if(k>=1){ this.mode='idle'; this.root.position.y=0; this.sfx.bounce(); this.happy(1000); this.emit('hearts',2); }
    } else { this.speed=lerp(this.speed,0,Math.min(1,dt*8));
      if(this.faceYaw!=null){ const d=angDiff(this.yaw,this.faceYaw); this.yaw+=clamp(d,-3*dt,3*dt); if(Math.abs(d)<0.02) this.faceYaw=null;
        else if(Math.abs(d)>0.15 && !this.isDown() && !this.inBed){ wantWalk=0.75; this._turning=true; } } }
    this.root.rotation.y=this.yaw;
    this.walkW=lerp(this.walkW,wantWalk,Math.min(1,dt*7)); this.walk.weight=this.walkW;
    if(this.standAct){ this.standAct.time=this.standT; this.standAct.weight=(1-this.walkW)*(1-Math.min(1,Math.max(this.W.sit,this.W.lie,this.W.beg||0)*1.4)); }
    this.walk.timeScale=(this.mode==='spin'||this._turning)?1.1:Math.max(0.35,this.speed/this.strideSpeed); this._turning=false;
    if(this.walkW>0.5){ const d=this.walk.getClip().duration, q=Math.floor(this.walk.time/(d/4)); if(q!==this._lastQ){ this._lastQ=q; this.sfx.step(); } }
    if(this.mode!=='hop'&&this.mode!=='jump'&&this.mode!=='trick'){ this.WT.jumpLegs=0; if(this.hop){ this.hop=null; if(!this.inBed) this.root.position.y=0; } }
    if(this.mode!=='trick'&&this.TR){ this._trickEnd(); }
    for(const k in this.W) this.W[k]=lerp(this.W[k],this.WT[k],Math.min(1,dt*(k==='barkHead'?18:5)));
    if(this.mode==='idle'&&this.walkW<0.1){ this.lookYaw=lerp(this.lookYaw,Math.sin(this.T*0.37)*14+Math.sin(this.T*0.9)*4,dt*1.5); this.lookPitch=lerp(this.lookPitch,Math.sin(this.T*0.5)*4,dt*1.5); }
    else { this.lookYaw=lerp(this.lookYaw,0,dt*4); this.lookPitch=lerp(this.lookPitch,0,dt*4); }
    for(const b of this.allBones){ const r=this.bind[b.uuid]; b.quaternion.copy(r.q); b.position.copy(r.p); }
    this.mixer.update(dt);
    this._procedural();
  }
  // ---------- Kunststücke (Freundschafts-Herzen) ----------
  trick_(id){ this.wake(); this.clearTimers(); this.drop(); this.WT.paw=0; this.WT.tilt=0;
    if(id==='bisou'){ const f=this.frontSpot(); this.setPose(0,0); return this.walkTo(f[0],f[1],()=>{ this.faceCamera(); this.later(500,()=>this._trickStart('bisou')); }); }
    this.faceCamera(); this._standThen(()=>this.later(350,()=>this._trickStart(id))); }
  _trickStart(id){ const D={mort:3.6,roule:2.6,beau:3.2,danse:4.6,bisou:2.0}[id]||2; this.TR={id,t:0,D,yaw0:this.yaw}; this.mode='trick';
    if(this._hindZ==null){ const v=new THREE.Vector3(); let z=0,n=0; for(const b of ['backleg2','R_backleg2']){ const bn=this.bones[b]; if(bn){ this.root.updateMatrixWorld(true); bn.getWorldPosition(v); this.root.worldToLocal(v); z+=v.z; n++; } } this._hindZ=n? z/n : -this.H*0.35; }
    if(id==='roule'){ this.setPose(0,1); } if(id==='beau'){ this.setPose(1,0); this.later(350,()=>this.WT.beg=1); this.later(2500,()=>{ this.WT.beg=0; }); }
    if(id==='mort'){ this.later(300,()=>{ this.emit('say','Pfff…',1200); this.sfx.whoosh?.(); }); }
    if(id==='danse'){ this.WT.beg=1; this.sfx.bark(2); this.emit('say','Wouf ! Wouf !',1200); }
    if(id==='bisou'){ this.WT.beg=1; this.sfx.whoosh?.(); this.later(700,()=>this.emit('kiss')); }
    this.happy(D*1000+800); }
  _trickUpdate(dt){ const R=this.TR; if(!R){ this.mode='idle'; return; } R.t+=dt; const t=R.t, H=this.H; const ease=x=>{ x=clamp(x,0,1); return x*x*(3-2*x); };
    let piv=[0,0,0], rx=0, rz=0, oy=0;
    if(R.id==='mort'){ const s=ease(t/0.55)*(1-ease((t-2.9)/0.6)); piv=[0,H*0.35,0]; rz=1.45*s; oy=-H*0.2*s; this.WT.jumpLegs=s>0.5?0.7:0; this.WT.sleepHead=s>0.5?1:0; }
    else if(R.id==='roule'){ const k=ease((t-0.5)/1.3); piv=[0,H*0.2,0]; rz=k*Math.PI*2; oy=-H*0.04+H*0.12*Math.abs(Math.sin(rz)); if(t>2.0) this.setPose(0,0); }
    else if(R.id==='beau'){ const s=ease((t-0.3)/0.5)*(1-ease((t-2.5)/0.5)); piv=[0,0,this._hindZ]; rx=-0.35*s; }
    else if(R.id==='danse'){ const s=ease(t/0.6)*(1-ease((t-4.0)/0.6)); piv=[0,0,this._hindZ]; rx=-1.05*s; oy=H*0.05*Math.abs(Math.sin(t*7))*s;
      this.yaw=R.yaw0+ease((t-0.7)/3.0)*Math.PI*2; }
    else if(R.id==='bisou'){ const s=Math.sin(Math.PI*clamp(t/1.4,0,1)); piv=[0,0,this._hindZ]; rx=-0.9*s; oy=H*0.25*s; }
    this.trick.position.set(piv[0],piv[1]+oy,piv[2]); this.trickOff.position.set(-piv[0],-piv[1],-piv[2]); this.trick.rotation.set(rx,0,rz);
    if(t>=R.D){ const id=R.id; this._trickEnd(); this.mode='idle'; this.faceCamera(); this.emit('hearts',3); this.emit('trickDone',id); } }
  _trickEnd(){ this.TR=null; this.trick.position.set(0,0,0); this.trickOff.position.set(0,0,0); this.trick.rotation.set(0,0,0); this.WT.beg=0; this.WT.jumpLegs=0; this.WT.sleepHead=0; if(this.isDown()) this.setPose(0,0); }
  _addRot(bone,ax,deg){ if(Math.abs(deg)<0.01) return;
    bone.parent.updateWorldMatrix(true,false); bone.parent.getWorldQuaternion(_qp); this.trick.getWorldQuaternion(_qd);
    _qp.premultiply(_qd.invert()); _v.copy(AX[ax]).applyQuaternion(_qp.invert());
    _q.setFromAxisAngle(_v,THREE.MathUtils.degToRad(deg)); bone.quaternion.premultiply(_q); }
  _addTrans(bone,vec){ bone.updateWorldMatrix(true,false); const wp=bone.getWorldPosition(new THREE.Vector3());
    this.trick.getWorldQuaternion(_qd); wp.add(vec.applyQuaternion(_qd)); bone.parent.worldToLocal(wp); bone.position.copy(wp); }
  _procedural(){
    const acc={}, tr={}; const A=b=>(acc[b]??={x:0,y:0,z:0});
    for(const p in POSES){ const w=this.W[p]*(DOG.tune[p]??1); if(Math.abs(w)<0.001) continue; const P=POSES[p];
      for(const b in (P.rot||{})) for(const [ax,deg] of P.rot[b]) A(b)[ax]+=deg*w;
      for(const b in (P.trans||{})){ const v=P.trans[b]; (tr[b]??=new THREE.Vector3()).add(new THREE.Vector3(...v).multiplyScalar(w*this.H)); } }
    const wag=Math.sin(this.T*this.wagSpeed)*this.wagAmt*28;
    for(const b of ['tailstart','tail1','tail2']) A(b).y+=wag*(b==='tailstart'?0.6:1);
    A('chest').x+=Math.sin(this.T*2.2)*1.2*(1-this.walkW);
    A('head').y+=this.lookYaw; A('head').x+=this.lookPitch;
    if(this.shake) A('head').y+=Math.sin(this.T*26)*28;
    if(this.digging){ const d=Math.sin(this.T*14)*40; A('frontleg').x+=-30+d; A('R_frontleg').x+=-30-d; }
    for(const b of ORDER){ const bone=this.bones[b]; if(!bone) continue;
      if(tr[b]) this._addTrans(bone,tr[b]); const a=acc[b]; if(!a) continue;
      this._addRot(bone,'y',a.y); this._addRot(bone,'x',a.x); this._addRot(bone,'z',a.z); }
  }
}
