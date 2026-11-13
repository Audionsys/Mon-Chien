// Szene: Renderer, Licht, Raum und Gegenstände aus content/scenes.js
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Echte 3D-Modelle (Poly Haven, CC0) ersetzen gezeichnete Gegenstände. Die gezeichnete Form bleibt unsichtbar als Tipp-Fläche (Wörter bleiben erhalten).
const REAL={ bench:{url:'models/bench.glb',fit:'box',rotY:Math.PI}, flowers:{url:'models/flowers.glb',fit:'box'} };
const _gl=new GLTFLoader(), _cache={};
function realize(obj,cfg){
  const keep={p:obj.position.clone(),r:obj.rotation.clone(),s:obj.scale.clone()}; obj.position.set(0,0,0); obj.rotation.set(0,0,0); obj.scale.set(1,1,1); obj.updateMatrixWorld(true);
  const pb=new THREE.Box3().setFromObject(obj); obj.position.copy(keep.p); obj.rotation.copy(keep.r); obj.scale.copy(keep.s);
  (_cache[cfg.url]??=new Promise((res,rej)=>_gl.load(cfg.url,g=>res(g.scene),undefined,rej))).then(src=>{
    const m=src.clone(true); if(cfg.rotY){ const w=new THREE.Group(); w.add(m); m.rotation.y=cfg.rotY; src=null; return place(w); } return place(m);
    function place(m){ m.updateMatrixWorld(true); const mb=new THREE.Box3().setFromObject(m), ms=mb.getSize(new THREE.Vector3()), ps=pb.getSize(new THREE.Vector3());
    if(cfg.fit==='box') m.scale.set(ps.x/ms.x, ps.y/ms.y, ps.z/ms.z); else { const k=(cfg.h||ps.y)/ms.y; m.scale.setScalar(k); }
    m.updateMatrixWorld(true); const b2=new THREE.Box3().setFromObject(m), c2=b2.getCenter(new THREE.Vector3()), pc=pb.getCenter(new THREE.Vector3());
    m.position.set(pc.x-c2.x, pb.min.y-b2.min.y, pc.z-c2.z);
    m.traverse(o=>{ if(o.isMesh){ o.castShadow=true; o.receiveShadow=true; const mt=o.material; if(mt){ mt.metalness=0; mt.envMapIntensity=0.9; } o.userData.real=true; } });
    obj.traverse(o=>{ if(o.isMesh&&!o.userData.real) o.visible=false; }); obj.add(m); }
  }).catch(()=>{}); }


export function createWorld(canvas){
  const renderer=new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#f3e3cc');
  const pmrem=new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture; scene.environmentIntensity=0.35;
  const camera=new THREE.PerspectiveCamera(38,1,0.25,45);
  scene.add(new THREE.HemisphereLight('#fff4e0','#8a6a4a',0.9));
  const sun=new THREE.DirectionalLight('#ffe7c4',2.4); sun.position.set(-2.5,4.5,-1.5); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.radius=3;
  Object.assign(sun.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:0.5,far:14}); sun.shadow.bias=-0.0008; sun.shadow.normalBias=0.035; scene.add(sun);
  const rim=new THREE.DirectionalLight('#bcd8ff',1.6); rim.position.set(2.5,2.5,-4); scene.add(rim);
  const fill=new THREE.DirectionalLight('#ffffff',0.7); fill.position.set(1,2,5); scene.add(fill);
  return { renderer, scene, camera, sun };
}

function canvasTex(w,h,draw,repeat){ const c=document.createElement('canvas'); c.width=w;c.height=h; draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=4; if(repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(...repeat);} return t; }
const std=(color,rough=0.85,extra={})=>new THREE.MeshStandardMaterial({color,roughness:rough,...extra});
function shadowy(o){ o.traverse(m=>{ if(m.isMesh){ m.castShadow=true; m.receiveShadow=true; } }); return o; }
const mesh0=(g,m)=>new THREE.Mesh(g,m);
const rr=(w,h,d,color,r=0.06,rough=0.85)=>new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,Math.min(r,w/2-0.001,h/2-0.001,d/2-0.001)),std(color,rough));
const fabric=(color)=>{ const t=canvasTex(128,128,(g,w,h)=>{ g.fillStyle=color; g.fillRect(0,0,w,h); for(let i=0;i<1400;i++){ g.fillStyle=`rgba(${Math.random()<.5?'255,255,255':'0,0,0'},${Math.random()*0.06})`; g.fillRect(Math.random()*w,Math.random()*h,2,2); } },[2,2]); return new THREE.MeshStandardMaterial({map:t,roughness:0.95}); };
const wood=(c='#b9804b')=>std(c,0.6);
const knob=(x,y,z,g,fr='la poignée',de='der Griff')=>{ const k=rr(0.12,0.025,0.03,'#c9a36a',0.012,0.3); k.material=new THREE.MeshStandardMaterial({color:'#d8b878',metalness:0.7,roughness:0.3}); k.position.set(x,y,z); g.add(part(k,fr,de)); return k; };
const part=(o,fr,de)=>{ o.traverse(m=>{ m.userData.part={fr,de}; }); return o; };
function rbox(w,h,d,color){ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),std(color)); return m; }

// ---------- Baupläne für Gegenstände ----------
const BUILD = {
  sofa(){ const g=new THREE.Group(); const fab=fabric('#e46a52'), fab2=fabric('#f08a6e');
    const base=rr(2.15,0.34,0.92,'#e46a52',0.08); base.material=fab; base.position.y=0.29; g.add(part(base,'le canapé','das Sofa'));
    const back=rr(2.15,0.62,0.26,'#e46a52',0.1); back.material=fab; back.position.set(0,0.68,-0.34); back.rotation.x=-0.08; g.add(part(back,'le dossier','die Rückenlehne'));
    [-1,1].forEach(k=>{ const a=rr(0.24,0.5,0.92,'#e46a52',0.1); a.material=fab; a.position.set(k*1.0,0.5,0); g.add(part(a,"l'accoudoir",'die Armlehne')); });
    [-0.44,0.44].forEach(x=>{ const c=rr(0.86,0.18,0.7,'#f08a6e',0.08); c.material=fab2; c.position.set(x,0.54,0.07); g.add(part(c,'le coussin','das Polster')); });
    [-0.44,0.44].forEach((x,i)=>{ const c=rr(0.8,0.42,0.16,'#f08a6e',0.08); c.material=fab2; c.position.set(x,0.82,-0.2); c.rotation.x=-0.18; g.add(part(c,'le coussin','das Polster')); });
    const p=rr(0.36,0.32,0.12,'#ffc23d',0.07); p.material=fabric('#ffc23d'); p.position.set(-0.68,0.76,-0.02); p.rotation.set(-0.2,0.25,0.2); g.add(part(p,'le coussin','das Kissen'));
    [[-0.95,-0.35],[0.95,-0.35],[-0.95,0.35],[0.95,0.35]].forEach(([x,z])=>{ const l=mesh0(new THREE.CylinderGeometry(0.03,0.02,0.12,10),wood('#7a4f2a')); l.position.set(x,0.06,z); g.add(part(l,'le pied','das Bein')); });
    return shadowy(g); },
  laundry(){ const g=new THREE.Group();
    const wick=canvasTex(256,128,(c,w,h)=>{ c.fillStyle='#d9b27a'; c.fillRect(0,0,w,h);
      for(let y=0;y<h;y+=10) for(let x=0;x<w;x+=16){ const o=((y/10)%2)*8; const gr=c.createLinearGradient(x+o,y,x+o,y+10); gr.addColorStop(0,'#f0cf98'); gr.addColorStop(1,'#a8783f'); c.fillStyle=gr; c.beginPath(); c.ellipse(x+o+8,y+5,7,4.2,0,0,Math.PI*2); c.fill(); }
      c.fillStyle='rgba(90,55,20,.35)'; for(let x=0;x<w;x+=16) c.fillRect(x,0,2,h); },[3,1]);
    const wm=new THREE.MeshStandardMaterial({map:wick,roughness:0.9,side:THREE.DoubleSide});
    const body=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.31,0.4,40,1,true),wm); body.position.y=0.2; body.castShadow=true; body.receiveShadow=true; g.add(part(body,'le panier à linge','der Wäschekorb'));
    const bottom=new THREE.Mesh(new THREE.CircleGeometry(0.31,40),std('#b98a52',0.9)); bottom.rotation.x=-Math.PI/2; bottom.position.y=0.03; g.add(part(bottom,'le panier à linge','der Wäschekorb'));
    const rim=new THREE.Mesh(new THREE.TorusGeometry(0.36,0.025,10,48),std('#b98a52',0.8)); rim.rotation.x=Math.PI/2; rim.position.y=0.4; g.add(part(rim,'le bord','der Rand'));
    for(const s of [-1,1]){ const h=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.018,8,20,Math.PI),std('#a8783f',0.8)); h.position.set(s*0.355,0.33,0); h.rotation.y=Math.PI/2; g.add(part(h,'la poignée','der Griff')); }
    // ein Handtuch hängt heraus
    const tw=rr(0.22,0.02,0.32,'#7cc4e8',0.01,1); tw.position.set(0.1,0.38,0.27); tw.rotation.x=-1.1; g.add(part(tw,'la serviette','das Handtuch'));
    return g; },
  bed(){ const g=new THREE.Group();
    const prof=[[0,0.02],[0.6,0.02],[0.66,0.05],[0.7,0.14],[0.69,0.22],[0.64,0.27],[0.57,0.26],[0.53,0.2],[0.52,0.1],[0.5,0.07],[0,0.07]].map(([a,b])=>new THREE.Vector2(a,b));
    const rim=mesh0(new THREE.LatheGeometry(prof,48),fabric('#7a5bd6')); rim.scale.set(1.08,1,0.95); g.add(part(rim,'le panier','das Körbchen'));
    const pad=mesh0(new THREE.CylinderGeometry(0.5,0.5,0.05,40),fabric('#efe6ff')); pad.scale.set(1.08,1,0.95); pad.position.y=0.085; g.add(part(pad,'le coussin','das Kissen'));
    for(let i=0;i<5;i++){ const pw=mesh0(new THREE.CircleGeometry(0.035,12),new THREE.MeshBasicMaterial({color:'#d9cff5'})); pw.rotation.x=-Math.PI/2; pw.position.set(-0.2+i*0.1,0.112,(i%2?0.08:-0.04)); g.add(pw); }
    const bone=new THREE.Group(); const bm=std('#fff3dc',0.6); const sh=mesh0(new THREE.CylinderGeometry(0.018,0.018,0.16,10),bm); sh.rotation.z=Math.PI/2; bone.add(sh);
    [-1,1].forEach(k=>[-1,1].forEach(j=>{ const b=mesh0(new THREE.SphereGeometry(0.024,10,8),bm); b.position.set(k*0.08,0,j*0.016); bone.add(b); }));
    bone.position.set(0.32,0.13,0.18); bone.rotation.y=0.6; g.add(part(bone,"l'os",'der Knochen'));
    shadowy(g); pad.castShadow=false; return g; },
  bowl(){ const pts=[[0,0],[0.17,0],[0.215,0.1],[0.2,0.11],[0.155,0.035],[0,0.035]].map(([a,b])=>new THREE.Vector2(a,b));
    const g=new THREE.Group(); const b=mesh0(new THREE.LatheGeometry(pts,40),new THREE.MeshStandardMaterial({color:'#4a9eff',roughness:0.25,metalness:0.1,side:THREE.DoubleSide})); g.add(b);
    const t=canvasTex(128,32,(c,w,h)=>{ c.fillStyle='#4a9eff'; c.fillRect(0,0,w,h); c.font='22px sans-serif'; c.fillText('🐾  🐾  🐾  🐾',2,24); });
    const food=mesh0(new THREE.CylinderGeometry(0.155,0.155,0.03,24),std('#a0602e',1)); food.position.y=0.05; g.add(part(food,'les croquettes','das Trockenfutter'));
    for(let i=0;i<14;i++){ const k=mesh0(new THREE.SphereGeometry(0.018,6,5),std(i%2?'#8a4f22':'#b06a33',1)); const a=i*2.4, r=0.03+((i*37)%10)/100; k.position.set(Math.cos(a)*r,0.07,Math.sin(a)*r); g.add(part(k,'les croquettes','das Trockenfutter')); }
    return shadowy(g); },
  ball(){ const r=0.055; const t=canvasTex(128,64,(c,w,h)=>{ c.fillStyle='#d9ef3a'; c.fillRect(0,0,w,h); c.strokeStyle='#fff'; c.lineWidth=5; c.beginPath(); for(let x=0;x<=w;x++){ const y=h/2+Math.sin(x/w*Math.PI*4)*h*0.28; x?c.lineTo(x,y):c.moveTo(x,y); } c.stroke(); });
    const m=mesh0(new THREE.SphereGeometry(r,24,16),new THREE.MeshStandardMaterial({map:t,roughness:0.9})); m.position.y=r; const g=new THREE.Group(); g.add(m); g.userData.radius=r; shadowy(g);
    const hit=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false})); hit.position.y=r; g.add(hit); return g; },
  plant(){ const g=new THREE.Group(); const pot=mesh0(new THREE.LatheGeometry([[0,0],[0.17,0],[0.22,0.36],[0.25,0.38],[0.25,0.42],[0.2,0.42],[0.2,0.38],[0,0.38]].map(([a,b])=>new THREE.Vector2(a,b)),32),std('#ff7a59',0.7)); g.add(part(pot,'le pot de fleurs','der Blumentopf'));
    const soil=mesh0(new THREE.CylinderGeometry(0.2,0.2,0.02,24),std('#5a3a22',1)); soil.position.y=0.39; g.add(part(soil,'la terre','die Erde'));
    for(let i=0;i<11;i++){ const a=i/11*Math.PI*2+i*0.3, tilt=0.35+(i%3)*0.18; const leaf=mesh0(new THREE.SphereGeometry(0.11,12,8),std(i%2?'#3fb37f':'#2a9566',0.7)); leaf.scale.set(0.45,1.5,0.18);
      const holder=new THREE.Group(); holder.position.y=0.4; holder.rotation.set(Math.cos(a)*tilt,0,Math.sin(a)*tilt); leaf.position.y=0.17+(i%3)*0.05; holder.add(leaf); holder.rotation.y=a; g.add(holder); part(leaf,'la feuille','das Blatt'); }
    return shadowy(g); },
  window(){ const g=new THREE.Group(); g.position.y=1.55;
    // Ausblick nach draußen (gemalt), mit antippbaren Bereichen
    const view=canvasTex(512,384,(c,w,h)=>{ const sky=c.createLinearGradient(0,0,0,h); sky.addColorStop(0,'#7cc4ff'); sky.addColorStop(1,'#d7f0ff'); c.fillStyle=sky; c.fillRect(0,0,w,h);
      c.fillStyle='#fff'; [[90,70,30],[120,60,38],[150,72,28],[360,95,26],[390,85,34],[420,98,24]].forEach(([x,y,r])=>{ c.beginPath(); c.arc(x,y,r,0,7); c.fill(); });
      c.fillStyle='#ffd84a'; c.beginPath(); c.arc(470,52,30,0,7); c.fill();
      c.fillStyle='#8aa7c4'; c.beginPath(); c.moveTo(300,300); c.lineTo(312,170); c.lineTo(318,110); c.lineTo(324,170); c.lineTo(336,300); c.closePath(); c.fill(); c.fillRect(304,220,28,6);
      const roofs=[[0,250,90,'#c96a4a'],[80,265,80,'#e08a5a'],[150,240,100,'#b85c44'],[360,255,90,'#d9775a'],[440,245,80,'#c96a4a']];
      roofs.forEach(([x,y,wd,col])=>{ c.fillStyle='#f3e3cc'; c.fillRect(x,y,wd,h-y); c.fillStyle=col; c.beginPath(); c.moveTo(x-6,y); c.lineTo(x+wd/2,y-34); c.lineTo(x+wd+6,y); c.closePath(); c.fill();
        c.fillStyle='#6fa8d6'; for(let i=0;i<2;i++) c.fillRect(x+12+i*(wd/2),y+18,wd/4,22); });
      c.fillStyle='#2f9a69'; c.beginPath(); c.arc(250,250,48,0,7); c.arc(280,225,40,0,7); c.fill(); c.fillStyle='#7a4f2a'; c.fillRect(255,270,14,114);
      c.fillStyle='#2b2135'; c.beginPath(); c.moveTo(200,130); c.quadraticCurveTo(210,122,220,130); c.quadraticCurveTo(230,122,240,130); c.lineWidth=3; c.strokeStyle='#2b2135'; c.stroke(); });
    const glass=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.1),new THREE.MeshBasicMaterial({map:view})); glass.position.z=0.012;
    glass.userData.region=(u,v)=>{ const x=u*512, y=(1-v)*384;
      if(Math.hypot(x-470,y-52)<40) return {fr:'le soleil',de:'die Sonne'}; if(x>292&&x<344&&y>100&&y<300) return {fr:'la tour Eiffel',de:'der Eiffelturm'};
      if((Math.hypot(x-120,y-65)<55)||(Math.hypot(x-390,y-92)<50)) return {fr:'le nuage',de:'die Wolke'}; if(x>190&&x<250&&y>115&&y<140) return {fr:"l'oiseau",de:'der Vogel'};
      if(Math.hypot(x-262,y-240)<62||(x>250&&x<275&&y>268)) return {fr:"l'arbre",de:'der Baum'}; if(y>205) return {fr:'la maison',de:'das Haus'}; return {fr:'le ciel',de:'der Himmel'}; };
    g.add(glass);
    const fm=std('#ffffff',0.4);
    [[0,0.58,1.66,0.09],[0,-0.58,1.66,0.09],[-0.79,0,0.09,1.25],[0.79,0,0.09,1.25],[0,0,0.05,1.1],[0,0,1.5,0.05]].forEach(([x,y,w,h])=>{ const m=rr(w,h,0.07,'#ffffff',0.02,0.4); m.position.set(x,y,0.045); g.add(part(m,'le cadre de la fenêtre','der Fensterrahmen')); });
    const sill=rr(1.9,0.06,0.22,'#ffffff',0.02,0.4); sill.position.set(0,-0.64,0.1); g.add(part(sill,'le rebord de la fenêtre','die Fensterbank'));
    part(glass,'la vitre','die Fensterscheibe');
    // Vorhänge
    [-1,1].forEach(k=>{ const cur=new THREE.Group(); for(let i=0;i<5;i++){ const f=mesh0(new THREE.CylinderGeometry(0.05,0.06,1.45,10,1,true,0,Math.PI),new THREE.MeshStandardMaterial({color:i%2?'#ffb3a1':'#ff9a85',roughness:1,side:THREE.DoubleSide}));
        f.rotation.y=Math.PI/2*k; f.position.set(i*0.075*k,0,0); cur.add(f); } cur.position.set(k*0.98,0,0.12); part(cur,'le rideau','der Vorhang'); g.add(cur); });
    const rod=mesh0(new THREE.CylinderGeometry(0.015,0.015,2.3,8),std('#c9a36a',0.4)); rod.rotation.z=Math.PI/2; rod.position.set(0,0.78,0.13); g.add(part(rod,'la tringle','die Vorhangstange'));
    const wrap=new THREE.Group(); wrap.add(g); wrap.position.z=0.02; return wrap; },
  picture(){ const pic=canvasTex(256,320,(g,w,h)=>{ const sky=g.createLinearGradient(0,0,0,h); sky.addColorStop(0,'#ffcf9a'); sky.addColorStop(1,'#ffe9cf'); g.fillStyle=sky; g.fillRect(0,0,w,h); g.fillStyle='#ff9a6b'; g.beginPath(); g.arc(w*0.72,h*0.28,38,0,7); g.fill();
      g.fillStyle='#2b2135'; g.beginPath(); g.moveTo(w/2,40); g.lineTo(w/2+12,140); g.lineTo(w/2+40,h-30); g.lineTo(w/2+18,h-30); g.lineTo(w/2,200); g.lineTo(w/2-18,h-30); g.lineTo(w/2-40,h-30); g.lineTo(w/2-12,140); g.closePath(); g.fill();
      g.fillRect(w/2-30,150,60,8); g.fillStyle='#ffe2a8'; g.beginPath(); g.arc(w/2,h-30,16,Math.PI,0); g.fill(); g.fillStyle='#e9a46b'; g.fillRect(0,h-30,w,30); });
    const g=new THREE.Group(); const fr=rr(0.66,0.82,0.05,'#d8b878',0.02,0.35); fr.material=new THREE.MeshStandardMaterial({color:'#d8b878',metalness:0.5,roughness:0.35}); fr.position.set(0,1.7,0.03); g.add(part(fr,'le cadre','der Bilderrahmen'));
    const im=new THREE.Mesh(new THREE.PlaneGeometry(0.54,0.7),new THREE.MeshStandardMaterial({map:pic,roughness:0.8})); im.position.set(0,1.7,0.058); g.add(part(im,'le tableau','das Bild'));
    return g; },
  rug(){ const t=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#4a9eff'; g.beginPath(); g.arc(w/2,h/2,w/2-2,0,7); g.fill();
      ['#ffffff','#ffc23d','#ff7a59','#ffffff','#7fbaff'].forEach((c,i)=>{ g.strokeStyle=c; g.lineWidth=10; g.beginPath(); g.arc(w/2,h/2,w/2-28-i*44,0,7); g.stroke(); });
      g.fillStyle='#fff'; g.font='bold 70px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('🐾',w/2,h/2); });
    const m=new THREE.Mesh(new THREE.CircleGeometry(1.15,48),new THREE.MeshStandardMaterial({map:t,roughness:1})); m.rotation.x=-Math.PI/2; m.position.y=0.004; m.receiveShadow=true;
    const g=new THREE.Group(); g.add(m); g.userData.floorLike=true; return g; },
  cushion(){ const g=new THREE.Group(); const m=rr(0.42,0.16,0.36,'#ffc23d',0.07); m.material=fabric('#ffc23d'); m.position.y=0.08; g.add(m);
    const b=mesh0(new THREE.SphereGeometry(0.02,8,6),std('#ff7a59')); b.position.y=0.165; g.add(b); g.userData.radius=0.08; return shadowy(g); },
  tree(){ const g=new THREE.Group(); const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.18,1.4,10),std('#8a5a33',0.9)); tr.position.y=0.7; g.add(tr); part(tr,'le tronc','der Baumstamm');
    [[0,1.75,0,0.75],[0.4,1.5,0.2,0.5],[-0.45,1.55,-0.1,0.5],[0.1,2.15,-0.1,0.5]].forEach(([x,y,z,r],i)=>{ const l=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),std(i%2?'#3fb37f':'#2f9a69',0.9)); l.position.set(x,y,z); g.add(l); part(l,'les feuilles','die Blätter'); });
    return shadowy(g); },
  niche(){ const g=new THREE.Group(); const b=rr(0.95,0.62,0.85,'#e46a52',0.05); b.position.y=0.31; g.add(part(b,'la niche','die Hundehütte'));
    const roofM=std('#7a5bd6',0.7); [-1,1].forEach(k=>{ const r=rr(0.66,0.07,1.0,'#7a5bd6',0.03); r.material=roofM; r.position.set(k*0.23,0.74,0); r.rotation.z=-k*0.72; g.add(part(r,'le toit','das Dach')); });
    const tri=new THREE.Shape(); tri.moveTo(-0.475,0); tri.lineTo(0.475,0); tri.lineTo(0,0.42); tri.closePath();
    const gable=mesh0(new THREE.ExtrudeGeometry(tri,{depth:0.8,bevelEnabled:false}),std('#e46a52',0.85)); gable.position.set(0,0.62,-0.4); g.add(part(gable,'la niche','die Hundehütte'));
    const arch=new THREE.Shape(); arch.moveTo(-0.2,0); arch.lineTo(-0.2,0.24); arch.absarc(0,0.24,0.2,Math.PI,0,true); arch.lineTo(0.2,0); arch.closePath();
    const door=mesh0(new THREE.ShapeGeometry(arch),new THREE.MeshBasicMaterial({color:'#2b2135'})); door.position.set(0,0.0,0.428); g.add(part(door,"l'entrée",'der Eingang'));
    const plate=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.11),new THREE.MeshBasicMaterial({map:canvasTex(160,44,(c)=>{ c.fillStyle='#fff3dc'; c.fillRect(0,0,160,44); c.strokeStyle='#7a4f2a'; c.lineWidth=4; c.strokeRect(2,2,156,40); c.fillStyle='#7a4f2a'; c.font='bold 24px sans-serif'; c.textAlign='center'; c.fillText('🐾 MAISON 🐾',80,31); })}));
    plate.scale.setScalar(0.8); plate.position.set(0,0.53,0.43); g.add(part(plate,'la maison','das Haus'));
    return shadowy(g); },
  flowers(){ const g=new THREE.Group(); const bed=rbox(1.2,0.18,0.5,'#8a5a33'); bed.position.y=0.09; g.add(bed);
    const cols=['#ff7a59','#ffc23d','#ff9ad5','#ffffff','#7a5bd6']; for(let i=0;i<9;i++){ const st=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.25,4),std('#2a9566')); const x=-0.5+i*0.125, z=(i%2?0.1:-0.1); st.position.set(x,0.3,z); g.add(st);
      const f=new THREE.Mesh(new THREE.SphereGeometry(0.055,10,8),std(cols[i%cols.length],0.7)); f.position.set(x,0.44,z); g.add(f); part(f,'la fleur','die Blume'); } return shadowy(g); },
  fence(){ const g=new THREE.Group(); const m=std('#fffaf2',0.7); for(let i=0;i<13;i++){ const p=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.9,0.05),m); p.position.set(-3+i*0.5,0.45,0); g.add(p); }
    [0.25,0.65].forEach(y=>{ const r=new THREE.Mesh(new THREE.BoxGeometry(6.2,0.08,0.04),m); r.position.set(0,y,-0.03); g.add(r); }); return shadowy(g); },
  gate(){ const g=new THREE.Group(); const m=std('#7a5bd6',0.7); [-0.45,0.45].forEach(x=>{ const p=new THREE.Mesh(new THREE.BoxGeometry(0.12,1.1,0.12),m); p.position.set(x,0.55,0); g.add(p); });
    for(let i=0;i<6;i++){ const b=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.8,0.04),m); b.position.set(-0.3+i*0.12,0.45,0); g.add(b); } return shadowy(g); },
  table(){ const g=new THREE.Group(); const top=rr(1.32,0.07,0.82,'#d9a066',0.03); top.material=wood('#d9a066'); top.position.y=0.75; g.add(part(top,'la table','der Tisch'));
    const cloth=mesh0(new THREE.PlaneGeometry(0.5,0.5),new THREE.MeshStandardMaterial({map:canvasTex(64,64,(c,w,h)=>{ for(let y=0;y<8;y++) for(let x=0;x<8;x++){ c.fillStyle=(x+y)%2?'#e53e5c':'#fff'; c.fillRect(x*8,y*8,8,8); } }),roughness:1}));
    cloth.rotation.x=-Math.PI/2; cloth.position.set(-0.25,0.79,0.05); g.add(part(cloth,'la nappe','die Tischdecke'));
    [[-0.58,-0.33],[0.58,-0.33],[-0.58,0.33],[0.58,0.33]].forEach(([x,z])=>{ const l=mesh0(new THREE.CylinderGeometry(0.035,0.025,0.72,10),wood('#9a6a3c')); l.position.set(x,0.36,z); g.add(part(l,'le pied de la table','das Tischbein')); });
    const pl=mesh0(new THREE.CylinderGeometry(0.14,0.11,0.02,24),std('#ffffff',0.3)); pl.position.set(-0.3,0.8,0.1); g.add(part(pl,"l'assiette",'der Teller'));
    const ap=mesh0(new THREE.SphereGeometry(0.06,16,12),std('#e53e3e',0.35)); ap.position.set(-0.3,0.86,0.1); g.add(part(ap,'la pomme','der Apfel'));
    const st=mesh0(new THREE.CylinderGeometry(0.006,0.006,0.03,6),std('#5a3a22')); st.position.set(-0.3,0.93,0.1); g.add(part(st,'la pomme','der Apfel'));
    const bg=mesh0(new THREE.CapsuleGeometry(0.05,0.45,6,10),std('#e2a35a',0.8)); bg.rotation.z=Math.PI/2; bg.position.set(0.25,0.83,-0.05); g.add(part(bg,'la baguette','das Baguette'));
    const glassC=mesh0(new THREE.CylinderGeometry(0.035,0.03,0.11,16),new THREE.MeshStandardMaterial({color:'#cfefff',transparent:true,opacity:0.55,roughness:0.05})); glassC.position.set(0.05,0.84,0.22); g.add(part(glassC,'le verre','das Glas'));
    return shadowy(g); },
  chair(){ const g=new THREE.Group(); const c='#4a9eff'; const s=rr(0.44,0.06,0.44,c,0.025); s.position.y=0.45; g.add(part(s,'la chaise','der Stuhl'));
    const b=rr(0.44,0.4,0.05,c,0.025); b.position.set(0,0.7,-0.2); g.add(part(b,'le dossier','die Lehne'));
    [[-0.18,-0.18],[0.18,-0.18],[-0.18,0.18],[0.18,0.18]].forEach(([x,z])=>{ const l=mesh0(new THREE.CylinderGeometry(0.02,0.018,0.45,8),std(c)); l.position.set(x,0.225,z); g.add(part(l,'le pied de la chaise','das Stuhlbein')); }); return shadowy(g); },
  fridge(){ const g=new THREE.Group(); const body=rr(0.76,1.82,0.66,'#eaf6ff',0.06,0.3); body.position.y=0.91; g.add(part(body,'le frigo','der Kühlschrank'));
    const gap=rr(0.74,0.012,0.01,'#9fb3c8',0.004); gap.position.set(0,1.18,0.333); g.add(gap);
    const handM=new THREE.MeshStandardMaterial({color:'#c9d6e3',metalness:0.6,roughness:0.3});
    [[1.45,0.32],[0.75,0.5]].forEach(([y,h])=>{ const hd=rr(0.035,h,0.04,'#ccc',0.015); hd.material=handM; hd.position.set(0.3,y,0.36); g.add(part(hd,'la poignée','der Griff')); });
    const mags=[['🍎','la pomme','der Apfel'],['⭐','l’étoile','der Stern'],['🐶','le chien','der Hund'],['🇫🇷','la France','Frankreich']];
    mags.forEach(([e,fr,de],i)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(0.09,0.09),new THREE.MeshBasicMaterial({map:canvasTex(64,64,(c)=>{ c.font='48px sans-serif'; c.fillText(e,6,50); }),transparent:true}));
      m.position.set(-0.2+(i%2)*0.16,1.5-Math.floor(i/2)*0.16,0.334); g.add(part(m,'l’aimant','der Magnet')); });
    const note=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.2),new THREE.MeshBasicMaterial({map:canvasTex(80,100,(c)=>{ c.fillStyle='#fff8a8'; c.fillRect(0,0,80,100); c.fillStyle='#2b2135'; c.font='13px sans-serif'; ['Courses :','- lait','- pain','- fromage'].forEach((t,i)=>c.fillText(t,6,20+i*20)); })}));
    note.position.set(-0.12,0.85,0.334); note.rotation.z=0.06; g.add(part(note,'la liste de courses','die Einkaufsliste'));
    return shadowy(g); },
  counter(){ const g=new THREE.Group(); const b=rr(2.2,0.82,0.6,'#ffffff',0.03,0.5); b.position.y=0.41; g.add(part(b,'le placard','der Schrank'));
    const t=rr(2.26,0.05,0.64,'#ff7a59',0.015,0.35); t.position.y=0.845; g.add(part(t,'le plan de travail','die Arbeitsplatte'));
    for(let i=0;i<4;i++){ const d=rr(0.5,0.62,0.02,'#f6efe4',0.02,0.5); d.position.set(-0.82+i*0.55,0.42,0.305); g.add(part(d,'le placard','der Schrank')); knob(-0.82+i*0.55,0.66,0.325,g); }
    // Deko auf der Arbeitsplatte
    const jar=mesh0(new THREE.CylinderGeometry(0.06,0.06,0.16,16),new THREE.MeshStandardMaterial({color:'#e8f4ff',transparent:true,opacity:0.7,roughness:0.1})); jar.position.set(-0.8,0.95,-0.05); g.add(part(jar,'le bocal','das Glas (Vorratsglas)'));
    const lid=mesh0(new THREE.CylinderGeometry(0.062,0.062,0.03,16),std('#ff7a59',0.5)); lid.position.set(-0.8,1.04,-0.05); g.add(part(lid,'le bocal','das Glas (Vorratsglas)'));
    const bowlF=mesh0(new THREE.SphereGeometry(0.13,20,10,0,Math.PI*2,Math.PI/2,Math.PI/2),std('#ffffff',0.3)); bowlF.position.set(-0.35,1.0,0); g.add(part(bowlF,'le saladier','die Schüssel'));
    [['#e53e3e',-0.38,0.03],['#ffc23d',-0.3,-0.03],['#3fb37f',-0.36,-0.06]].forEach(([c,x,z])=>{ const f=mesh0(new THREE.SphereGeometry(0.045,12,10),std(c,0.4)); f.position.set(x,1.0,z); g.add(part(f,'les fruits','das Obst')); });
    const board=rr(0.36,0.025,0.24,'#d9a066',0.01); board.material=wood('#d9a066'); board.position.set(0.5,0.885,0); g.add(part(board,'la planche à découper','das Schneidebrett'));
    return shadowy(g); },
  lamp(){ const g=new THREE.Group(); const brass=new THREE.MeshStandardMaterial({color:'#d8b878',metalness:0.7,roughness:0.3});
    const b=mesh0(new THREE.LatheGeometry([[0,0],[0.18,0],[0.18,0.02],[0.06,0.06],[0,0.07]].map(([a,c])=>new THREE.Vector2(a,c)),28),brass); g.add(part(b,'le pied de la lampe','der Lampenfuß'));
    const st=mesh0(new THREE.CylinderGeometry(0.014,0.014,1.4,10),brass); st.position.y=0.74; g.add(part(st,'le pied de la lampe','der Lampenfuß'));
    const sh=mesh0(new THREE.LatheGeometry([[0.24,0],[0.15,0.32]].map(([a,c])=>new THREE.Vector2(a,c)),32),new THREE.MeshStandardMaterial({map:canvasTex(128,64,(c)=>{ c.fillStyle='#fff4dc'; c.fillRect(0,0,128,64); c.strokeStyle='#ffc23d'; c.lineWidth=3; for(let y=8;y<64;y+=14){ c.beginPath(); c.moveTo(0,y); c.lineTo(128,y); c.stroke(); } }),roughness:0.9,side:THREE.DoubleSide,emissive:'#ffcf6a',emissiveIntensity:0.45}));
    sh.position.y=1.32; g.add(part(sh,"l'abat-jour",'der Lampenschirm'));
    const bulb=mesh0(new THREE.SphereGeometry(0.05,12,8),new THREE.MeshBasicMaterial({color:'#fff3c4'})); bulb.position.y=1.4; g.add(part(bulb,"l'ampoule",'die Glühbirne'));
    const glow=new THREE.PointLight('#ffd890',0.6,2.5); glow.position.y=1.35; g.add(glow);
    shadowy(g); sh.castShadow=false; return g; },
  shelf(){ const g=new THREE.Group(); const W=std('#d9a066',0.55);
    const side=(x)=>{ const sd=rr(0.05,1.6,0.34,'#d9a066',0.015); sd.material=W; sd.position.set(x,0.8,0); g.add(part(sd,"l'étagère",'das Regal')); }; side(-0.5); side(0.5);
    const back=rr(0.98,1.58,0.02,'#c48d58',0.005); back.position.set(0,0.8,-0.16); g.add(part(back,"l'étagère",'das Regal'));
    [0.04,0.42,0.82,1.22,1.58].forEach(y=>{ const sb=rr(1.0,0.04,0.34,'#d9a066',0.012); sb.material=W; sb.position.set(0,y,0); g.add(part(sb,"l'étagère",'das Regal')); });
    const cols=['#e53e5c','#4a9eff','#3fb37f','#ffc23d','#7a5bd6','#ff7a59','#2b2135','#f6ead8'];
    [0.44,0.84].forEach((y,r)=>{ let x=-0.45; for(let i=0;i<8;i++){ const h=0.25+((i*7+r*3)%5)*0.022, wd=0.045+((i+r)%3)*0.014; const bk=rr(wd,h,0.22,cols[(i+r*3)%cols.length],0.008,0.7); bk.position.set(x+wd/2,y+h/2,0.02); if(i===6){ bk.rotation.z=0.22; bk.position.x+=0.03; } g.add(part(bk,'le livre','das Buch')); x+=wd+0.01; if(x>0.1) break; } });
    const ph=rr(0.2,0.24,0.02,'#ffffff',0.01); ph.position.set(0.28,0.56,0.02); ph.rotation.x=-0.1; g.add(part(ph,'la photo','das Foto'));
    const phi=new THREE.Mesh(new THREE.PlaneGeometry(0.15,0.19),new THREE.MeshBasicMaterial({map:canvasTex(64,80,(c)=>{ c.fillStyle='#bfe3ff'; c.fillRect(0,0,64,80); c.font='40px sans-serif'; c.fillText('🐶',10,58); })}));
    phi.position.set(0.28,0.56,0.032); phi.rotation.x=-0.1; g.add(part(phi,'la photo','das Foto'));
    const pot=mesh0(new THREE.CylinderGeometry(0.07,0.055,0.12,16),std('#ff7a59',0.6)); pot.position.set(0.25,1.3,0); g.add(part(pot,'la plante','die Pflanze'));
    for(let i=0;i<6;i++){ const l=mesh0(new THREE.SphereGeometry(0.05,8,6),std('#3fb37f',0.7)); l.scale.set(0.5,1.4,0.2); const a=i*1.05; l.position.set(0.25+Math.cos(a)*0.05,1.42,Math.sin(a)*0.05); l.rotation.set(Math.sin(a)*0.5,a,Math.cos(a)*0.5); g.add(part(l,'la plante','die Pflanze')); }
    const globe=mesh0(new THREE.SphereGeometry(0.1,24,16),new THREE.MeshStandardMaterial({map:canvasTex(128,64,(c)=>{ c.fillStyle='#4a9eff'; c.fillRect(0,0,128,64); c.fillStyle='#3fb37f'; [[20,20,18,12],[60,30,22,16],[95,18,14,10],[100,42,12,9]].forEach(([x,y,a,b])=>{ c.beginPath(); c.ellipse(x,y,a,b,0,0,7); c.fill(); }); }),roughness:0.5}));
    globe.position.set(-0.25,1.36,0); g.add(part(globe,'le globe','der Globus'));
    return shadowy(g); },
  tv(){ const g=new THREE.Group();
    // Sideboard
    const sb=rr(1.4,0.42,0.42,'#e9d8c0',0.04); sb.material=wood('#e9d8c0'); sb.position.y=0.31; g.add(part(sb,'le meuble télé','das Fernsehschränkchen'));
    [-0.35,0.35].forEach(x=>{ const d=rr(0.62,0.32,0.02,'#f6ead8',0.02); d.position.set(x,0.31,0.215); g.add(part(d,'le tiroir','die Schublade')); knob(x,0.31,0.235,g); });
    [[-0.62,-0.15],[0.62,-0.15],[-0.62,0.15],[0.62,0.15]].forEach(([x,z])=>{ const l=mesh0(new THREE.CylinderGeometry(0.02,0.012,0.1,8),wood('#7a4f2a')); l.position.set(x,0.05,z); g.add(part(l,'le pied','das Bein')); });
    // Fernseher
    const foot=rr(0.36,0.025,0.16,'#2b2135',0.012,0.3); foot.position.set(0,0.535,-0.05); g.add(part(foot,'le pied de la télé','der Fernsehfuß'));
    const neck=rr(0.06,0.14,0.03,'#2b2135',0.012,0.3); neck.position.set(0,0.6,-0.07); g.add(neck);
    const frame=rr(1.08,0.64,0.05,'#1d1a24',0.03,0.25); frame.position.set(0,0.98,-0.06); g.add(part(frame,'la télé','der Fernseher'));
    const img=canvasTex(512,300,(c,w,h)=>{ const gr=c.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#8fd3ff'); gr.addColorStop(0.65,'#d9f4ff'); gr.addColorStop(0.66,'#8fd27a'); gr.addColorStop(1,'#5fb35a'); c.fillStyle=gr; c.fillRect(0,0,w,h);
      c.fillStyle='#ffd84a'; c.beginPath(); c.arc(430,60,34,0,7); c.fill(); c.fillStyle='#fff'; [[110,70,26],[140,62,32],[170,72,24]].forEach(([x,y,r])=>{ c.beginPath(); c.arc(x,y,r,0,7); c.fill(); });
      c.font='110px sans-serif'; c.fillText('🐕',180,255); c.font='60px sans-serif'; c.fillText('🦋',360,170); });
    const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.56),new THREE.MeshBasicMaterial({map:img})); scr.position.set(0,0.98,-0.032); g.add(part(scr,"l'écran",'der Bildschirm'));
    // Deko
    const vase=mesh0(new THREE.LatheGeometry([[0,0],[0.06,0],[0.08,0.08],[0.05,0.16],[0.04,0.2],[0,0.2]].map(([a,b])=>new THREE.Vector2(a,b)),20),std('#4a9eff',0.3)); vase.position.set(0.55,0.52,0.05); g.add(part(vase,'le vase','die Vase'));
    for(let i=0;i<3;i++){ const f=mesh0(new THREE.SphereGeometry(0.035,10,8),std(['#ff7a59','#ffc23d','#ff5c8a'][i],0.6)); f.position.set(0.55+(i-1)*0.04,0.76+(i%2)*0.03,0.05); g.add(part(f,'la fleur','die Blume')); }
    const rc=rr(0.05,0.02,0.17,'#2b2135',0.01,0.4); rc.position.set(-0.45,0.53,0.1); rc.rotation.y=0.4; g.add(part(rc,'la télécommande','die Fernbedienung'));
    return shadowy(g); },
  clock(){ const g=new THREE.Group(); const t=canvasTex(256,256,(c,w,h)=>{ c.fillStyle='#fffaf1'; c.beginPath(); c.arc(128,128,124,0,7); c.fill();
      c.fillStyle='#2b2135'; c.font='bold 30px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; for(let n=1;n<=12;n++){ const a=n/12*Math.PI*2-Math.PI/2; c.fillText(n,128+Math.cos(a)*95,128+Math.sin(a)*95); }
      c.lineCap='round'; c.lineWidth=9; c.beginPath(); c.moveTo(128,128); c.lineTo(128+Math.cos(-2.1)*55,128+Math.sin(-2.1)*55); c.stroke(); c.lineWidth=6; c.beginPath(); c.moveTo(128,128); c.lineTo(128+Math.cos(-0.5)*82,128+Math.sin(-0.5)*82); c.stroke();
      c.fillStyle='#ff7a59'; c.beginPath(); c.arc(128,128,9,0,7); c.fill(); });
    const rim=mesh0(new THREE.TorusGeometry(0.2,0.025,12,40),std('#ff7a59',0.4)); rim.position.set(0,1.95,0.04); g.add(part(rim,"l'horloge",'die Uhr'));
    const face=new THREE.Mesh(new THREE.CircleGeometry(0.2,40),new THREE.MeshStandardMaterial({map:t,roughness:0.5})); face.position.set(0,1.95,0.035); g.add(part(face,"l'horloge",'die Uhr'));
    const back=mesh0(new THREE.CylinderGeometry(0.2,0.2,0.03,32),std('#ffffff')); back.rotation.x=Math.PI/2; back.position.set(0,1.95,0.018); g.add(part(back,"l'horloge",'die Uhr'));
    return g; },
  door(){ const g=new THREE.Group(); const wd=std('#ffffff',0.45);
    const casing=[[0,2.06,1.08,0.1],[-0.5,1.03,0.08,2.06],[0.5,1.03,0.08,2.06]]; casing.forEach(([x,y,w,h])=>{ const c=rr(w,h,0.06,'#ffffff',0.015,0.45); c.position.set(x,y,0.02); g.add(part(c,'le cadre de la porte','der Türrahmen')); });
    const d=rr(0.9,2.0,0.05,'#fffaf2',0.02,0.5); d.position.set(0,1.0,0.03); g.add(part(d,'la porte','die Tür'));
    [[1.45,0.6],[0.62,0.7]].forEach(([y,h])=>{ const pnl=rr(0.62,h,0.03,'#f3ece2',0.02,0.5); pnl.position.set(0,y,0.06); g.add(part(pnl,'la porte','die Tür')); });
    const brass=new THREE.MeshStandardMaterial({color:'#d8b878',metalness:0.75,roughness:0.25});
    const ros=mesh0(new THREE.CylinderGeometry(0.035,0.035,0.012,16),brass); ros.rotation.x=Math.PI/2; ros.position.set(0.34,1.0,0.065); g.add(part(ros,'la poignée','der Türgriff'));
    const lever=rr(0.14,0.025,0.025,'#d8b878',0.01); lever.material=brass; lever.position.set(0.29,1.0,0.09); g.add(part(lever,'la poignée','der Türgriff'));
    const kh=mesh0(new THREE.CylinderGeometry(0.012,0.012,0.01,10),std('#2b2135')); kh.rotation.x=Math.PI/2; kh.position.set(0.34,0.92,0.065); g.add(part(kh,'la serrure','das Schloss'));
    const stop=mesh0(new THREE.SphereGeometry(0.045,14,10,0,Math.PI*2,0,Math.PI/2),std('#7a5bd6',0.6)); stop.position.set(0.6,0,0.35); g.add(part(stop,'le butoir de porte','der Türstopper'));
    const mat=rr(0.75,0.02,0.45,'#c48d58',0.01,1); mat.position.set(0,0.01,0.35); g.add(part(mat,'le paillasson','die Fußmatte'));
    return shadowy(g); },
  coffeetable(){ const g=new THREE.Group(); const t=rr(0.92,0.06,0.52,'#d9a066',0.025); t.material=wood('#d9a066'); t.position.y=0.38; g.add(part(t,'la table basse','der Couchtisch'));
    [[-0.38,-0.2],[0.38,-0.2],[-0.38,0.2],[0.38,0.2]].forEach(([x,z])=>{ const l=mesh0(new THREE.CylinderGeometry(0.025,0.02,0.36,10),wood('#9a6a3c')); l.position.set(x,0.18,z); g.add(part(l,'le pied','das Bein')); }); return shadowy(g); },
  mug(){ const g=new THREE.Group(); const m=std('#ff5c8a',0.3); const c=mesh0(new THREE.LatheGeometry([[0,0],[0.042,0],[0.046,0.1],[0.04,0.1],[0.036,0.012],[0,0.012]].map(([a,b])=>new THREE.Vector2(a,b)),24),m); g.add(part(c,'la tasse','die Tasse'));
    const tea=mesh0(new THREE.CircleGeometry(0.038,20),std('#8a4f22',0.2)); tea.rotation.x=-Math.PI/2; tea.position.y=0.085; g.add(part(tea,'le chocolat chaud','der Kakao'));
    const h=mesh0(new THREE.TorusGeometry(0.028,0.008,8,16,Math.PI*1.3),m); h.position.set(0.05,0.05,0); h.rotation.z=-Math.PI*0.65; g.add(part(h,"l'anse",'der Henkel'));
    const sau=mesh0(new THREE.CylinderGeometry(0.07,0.06,0.01,24),std('#ffffff',0.3)); sau.position.y=-0.004; g.add(part(sau,'la soucoupe','die Untertasse')); return shadowy(g); },
  book(){ const g=new THREE.Group(); const cov=rr(0.22,0.035,0.16,'#4a9eff',0.008,0.6); cov.position.y=0.018; g.add(part(cov,'le livre','das Buch'));
    const pg=rr(0.2,0.026,0.15,'#fffaf0',0.004,0.9); pg.position.set(0.008,0.018,0); g.add(part(pg,'le livre','das Buch'));
    const t=new THREE.Mesh(new THREE.PlaneGeometry(0.16,0.11),new THREE.MeshBasicMaterial({map:canvasTex(128,90,(c)=>{ c.fillStyle='#4a9eff'; c.fillRect(0,0,128,90); c.fillStyle='#fff'; c.font='bold 22px sans-serif'; c.fillText('Le Petit',14,36); c.fillText('Chien',30,64); })}));
    t.rotation.x=-Math.PI/2; t.position.y=0.037; g.add(part(t,'le livre','das Buch')); return shadowy(g); },
  sun(){ const g=new THREE.Group(); const s=new THREE.Mesh(new THREE.SphereGeometry(0.5,24,16),new THREE.MeshBasicMaterial({color:'#ffd84a'})); g.add(s);
    for(let i=0;i<10;i++){ const r=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.35,6),new THREE.MeshBasicMaterial({color:'#ffc23d'})); const a=i/10*Math.PI*2; r.position.set(Math.cos(a)*0.72,Math.sin(a)*0.72,0); r.rotation.z=a-Math.PI/2; g.add(r); } return g; },
  cloud(){ const g=new THREE.Group(); const m=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,emissive:'#ffffff',emissiveIntensity:0.3});
    [[0,0,0.45],[0.45,-0.05,0.35],[-0.45,-0.05,0.35],[0.2,0.25,0.35]].forEach(([x,y,r])=>{ const b=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),m); b.position.set(x,y,0); g.add(b); }); return g; },
  bench(){ const g=new THREE.Group(); const w='#b9804b'; for(let i=0;i<3;i++){ const sl=rbox(1.3,0.04,0.12,w); sl.position.set(0,0.45,-0.14+i*0.14); g.add(sl); }
    for(let i=0;i<2;i++){ const sl=rbox(1.3,0.1,0.04,w); sl.position.set(0,0.62+i*0.16,-0.24); g.add(sl); }
    [-0.55,0.55].forEach(x=>{ const l=rbox(0.06,0.45,0.4,'#2b2135'); l.position.set(x,0.225,0); g.add(l); }); return shadowy(g); },
  stove(){ const g=new THREE.Group(); const b=rr(0.7,0.86,0.6,'#f3f7fb',0.03,0.3); b.position.y=0.43; g.add(part(b,'la cuisinière','der Herd'));
    const top=rr(0.7,0.025,0.6,'#2b2135',0.01,0.2); top.position.y=0.87; g.add(part(top,'la plaque de cuisson','das Kochfeld'));
    [[-0.17,-0.13],[0.17,-0.13],[-0.17,0.13],[0.17,0.13]].forEach(([x,z])=>{ const r=mesh0(new THREE.TorusGeometry(0.075,0.012,8,24),std('#555',0.4)); r.rotation.x=Math.PI/2; r.position.set(x,0.89,z); g.add(part(r,'la plaque','die Herdplatte')); });
    const win=rr(0.52,0.3,0.015,'#1d1a24',0.02,0.1); win.position.set(0,0.42,0.305); g.add(part(win,'le four','der Backofen'));
    const ovh=rr(0.44,0.03,0.035,'#ccc',0.01); ovh.material=new THREE.MeshStandardMaterial({color:'#c9d6e3',metalness:0.7,roughness:0.25}); ovh.position.set(0,0.64,0.33); g.add(part(ovh,'la poignée','der Griff'));
    for(let i=0;i<4;i++){ const k=mesh0(new THREE.CylinderGeometry(0.025,0.025,0.03,14),std('#2b2135',0.4)); k.rotation.x=Math.PI/2; k.position.set(-0.22+i*0.147,0.76,0.31); g.add(part(k,'le bouton','der Knopf')); }
    const pot=mesh0(new THREE.CylinderGeometry(0.11,0.1,0.13,22),new THREE.MeshStandardMaterial({color:'#c9d6e3',metalness:0.7,roughness:0.25})); pot.position.set(-0.17,0.96,-0.13); g.add(part(pot,'la casserole','der Kochtopf'));
    const pl=mesh0(new THREE.CylinderGeometry(0.115,0.115,0.012,22),new THREE.MeshStandardMaterial({color:'#9fb3c8',metalness:0.6,roughness:0.3})); pl.position.set(-0.17,1.03,-0.13); g.add(part(pl,'le couvercle','der Deckel'));
    const pan=mesh0(new THREE.CylinderGeometry(0.12,0.1,0.04,22),std('#2b2135',0.3)); pan.position.set(0.17,0.91,0.13); g.add(part(pan,'la poêle','die Pfanne'));
    const ph=rr(0.2,0.025,0.03,'#7a4f2a',0.01); ph.position.set(0.36,0.92,0.2); ph.rotation.y=-0.5; g.add(part(ph,'la poêle','die Pfanne'));
    return shadowy(g); },
  sink(){ const g=new THREE.Group(); const b=rr(0.8,0.82,0.6,'#ffffff',0.03,0.5); b.position.y=0.41; g.add(part(b,'le placard','der Schrank'));
    [-0.2,0.2].forEach(x=>{ const d=rr(0.36,0.62,0.02,'#f6efe4',0.02); d.position.set(x,0.42,0.305); g.add(part(d,'le placard','der Schrank')); knob(x,0.66,0.325,g); });
    const t=rr(0.84,0.05,0.64,'#ff7a59',0.015,0.35); t.position.y=0.845; g.add(part(t,'le plan de travail','die Arbeitsplatte'));
    const basin=rr(0.52,0.03,0.38,'#c9d6e3',0.02,0.15); basin.material=new THREE.MeshStandardMaterial({color:'#c9d6e3',metalness:0.6,roughness:0.2}); basin.position.y=0.865; g.add(part(basin,"l'évier",'die Spüle'));
    const steel=new THREE.MeshStandardMaterial({color:'#dfe6ee',metalness:0.85,roughness:0.15});
    const col=mesh0(new THREE.CylinderGeometry(0.02,0.025,0.22,12),steel); col.position.set(0,0.98,-0.24); g.add(part(col,'le robinet','der Wasserhahn'));
    const spout=mesh0(new THREE.TorusGeometry(0.08,0.018,8,16,Math.PI),steel); spout.position.set(0,1.09,-0.16); spout.rotation.y=Math.PI/2; g.add(part(spout,'le robinet','der Wasserhahn'));
    const sp=mesh0(new THREE.CylinderGeometry(0.03,0.03,0.13,12),std('#3fb37f',0.3)); sp.position.set(0.32,0.93,-0.2); g.add(part(sp,'le liquide vaisselle','das Spülmittel'));
    const sponge=rr(0.1,0.04,0.06,'#ffd84a',0.01,1); sponge.position.set(0.32,0.885,-0.05); g.add(part(sponge,"l'éponge",'der Schwamm'));
    return shadowy(g); },
  bin(){ const g=new THREE.Group(); const steel=new THREE.MeshStandardMaterial({color:'#dfe6ee',metalness:0.8,roughness:0.25});
    const b=mesh0(new THREE.CylinderGeometry(0.17,0.15,0.48,24),steel); b.position.y=0.24; g.add(part(b,'la poubelle','der Mülleimer'));
    const l=mesh0(new THREE.SphereGeometry(0.175,24,10,0,Math.PI*2,0,Math.PI/2),steel); l.scale.y=0.35; l.position.y=0.48; g.add(part(l,'le couvercle','der Deckel'));
    const ped=rr(0.12,0.02,0.06,'#2b2135',0.008); ped.position.set(0,0.03,0.17); g.add(part(ped,'la pédale','das Pedal'));
    return shadowy(g); },
  house(){ const g=new THREE.Group(); const w=rr(2.6,1.9,1.8,'#fff1dc',0.05); w.position.y=0.95; g.add(part(w,'la maison des voisins','das Nachbarhaus'));
    const roofM=std('#c96a4a',0.7); [-1,1].forEach(k=>{ const r=rr(1.75,0.1,2.05,'#c96a4a',0.03); r.material=roofM; r.position.set(k*0.68,2.32,0); r.rotation.z=-k*0.62; g.add(part(r,'le toit','das Dach')); });
    const ch=rr(0.25,0.6,0.25,'#b85c44',0.02); ch.position.set(0.6,2.65,-0.3); g.add(part(ch,'la cheminée','der Schornstein'));
    [[-0.7,1.25],[0.7,1.25]].forEach(([x,y])=>{ const f=rr(0.56,0.5,0.06,'#ffffff',0.02); f.position.set(x,y,0.9); g.add(part(f,'la fenêtre','das Fenster')); const gl=rr(0.46,0.4,0.03,'#8fc6ef',0.01); gl.position.set(x,y,0.93); g.add(part(gl,'la fenêtre','das Fenster')); });
    const d=rr(0.5,0.9,0.06,'#4a9eff',0.02); d.position.set(0,0.45,0.9); g.add(part(d,'la porte','die Tür'));
    return shadowy(g); },
  cat(){ const g=new THREE.Group(); const m=std('#ff9f43',0.8);
    const b=mesh0(new THREE.SphereGeometry(0.09,14,10),m); b.scale.set(1.4,0.9,0.9); b.position.y=0.09; g.add(b);
    const h=mesh0(new THREE.SphereGeometry(0.07,14,10),m); h.position.set(0.13,0.17,0); g.add(h);
    [-1,1].forEach(k=>{ const e=mesh0(new THREE.ConeGeometry(0.025,0.05,4),m); e.position.set(0.14,0.24,k*0.035); g.add(e);
      const ey=mesh0(new THREE.SphereGeometry(0.011,8,6),std('#2b2135',0.3)); ey.position.set(0.19,0.18,k*0.025); g.add(ey); });
    const t=mesh0(new THREE.TorusGeometry(0.08,0.015,6,14,Math.PI*1.2),m); t.position.set(-0.13,0.15,0); t.rotation.z=0.6; g.add(t);
    part(g,'le chat','die Katze'); return shadowy(g); },
  bird(){ const g=new THREE.Group(); const m=std('#4a9eff',0.6);
    const b=mesh0(new THREE.SphereGeometry(0.06,12,10),m); b.scale.set(1.3,1,1); g.add(b); const h=mesh0(new THREE.SphereGeometry(0.04,12,10),m); h.position.set(0.07,0.05,0); g.add(h);
    const bk=mesh0(new THREE.ConeGeometry(0.012,0.035,6),std('#ffb03a')); bk.rotation.z=-Math.PI/2; bk.position.set(0.12,0.05,0); g.add(bk);
    const be=mesh0(new THREE.SphereGeometry(0.035,10,8),std('#ff7a59')); be.scale.set(1,0.8,1); be.position.set(0.02,-0.01,0); g.add(be);
    part(g,"l'oiseau",'der Vogel'); return g; },
  mailbox(){ const g=new THREE.Group(); const p=mesh0(new THREE.CylinderGeometry(0.03,0.03,0.9,8),wood('#7a4f2a')); p.position.y=0.45; g.add(part(p,'le poteau','der Pfosten'));
    const b=rr(0.32,0.24,0.42,'#e53e5c',0.08); b.position.y=0.98; g.add(part(b,'la boîte aux lettres','der Briefkasten')); return shadowy(g); },
  pantryshelf(){ const g=new THREE.Group(); const W=wood('#c48d58');
    [-1.25,1.25].forEach(x=>{ const sd=rr(0.06,1.7,0.42,'#c48d58',0.015); sd.material=W; sd.position.set(x,0.85,0); g.add(part(sd,"l'étagère",'das Regal')); });
    [0.05,0.5,0.95,1.4].forEach(y=>{ const sb=rr(2.56,0.04,0.42,'#c48d58',0.012); sb.material=W; sb.position.set(0,y,0); g.add(part(sb,"l'étagère",'das Regal')); });
    const glassM=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:0.15,transparent:true,opacity:0.85});
    // Marmeladengläser
    ['#c0392b','#e67e22','#8e44ad','#c0392b','#f1c40f'].forEach((c,i)=>{ const j=mesh0(new THREE.CylinderGeometry(0.06,0.06,0.14,14),glassM(c)); j.position.set(-1.05+i*0.17,0.59,0.02); g.add(part(j,'la confiture','die Marmelade'));
      const l=mesh0(new THREE.CylinderGeometry(0.063,0.063,0.025,14),new THREE.MeshStandardMaterial({map:canvasTex(32,8,(cc)=>{ for(let k=0;k<4;k++){ cc.fillStyle=k%2?'#fff':'#e53e5c'; cc.fillRect(k*8,0,8,8); } })}));
      l.position.set(-1.05+i*0.17,0.675,0.02); g.add(part(l,'la confiture','die Marmelade')); });
    // Dosen
    for(let i=0;i<4;i++){ const c=mesh0(new THREE.CylinderGeometry(0.05,0.05,0.12,16),new THREE.MeshStandardMaterial({map:canvasTex(64,32,(cc)=>{ cc.fillStyle=['#e53e5c','#3fb37f','#4a9eff','#ffc23d'][i]; cc.fillRect(0,0,64,32); cc.fillStyle='#fff'; cc.fillRect(0,10,64,12); }),metalness:0.3,roughness:0.4}));
      c.position.set(0.15+i*0.13,0.58,0.02); g.add(part(c,'la boîte de conserve','die Konservendose')); }
    // Käse
    const ch=mesh0(new THREE.CylinderGeometry(0.17,0.17,0.12,24),std('#ffd36b',0.6)); ch.position.set(0.85,1.02,0); g.add(part(ch,'le fromage','der Käse'));
    const wedge=mesh0(new THREE.CylinderGeometry(0.12,0.12,0.09,3,1,false,0,Math.PI/3),std('#ffe08a',0.6)); wedge.position.set(0.5,1.0,0.05); g.add(part(wedge,'le fromage','der Käse'));
    // Mehl/Zucker Packungen
    [['#fff8e8','la farine','das Mehl'],['#e8f4ff','le sucre','der Zucker'],['#ffe9cf','le riz','der Reis']].forEach(([c,fr,de],i)=>{ const b=rr(0.16,0.24,0.1,c,0.02,0.9); b.position.set(-1.0+i*0.22,1.09,0); g.add(part(b,fr,de)); });
    // Brote
    const br=mesh0(new THREE.SphereGeometry(0.13,16,10),std('#c98a45',0.8)); br.scale.set(1.3,0.6,0.8); br.position.set(-0.2,1.5,0); g.add(part(br,'le pain','das Brot'));
    const bg=mesh0(new THREE.CapsuleGeometry(0.04,0.5,6,10),std('#e2a35a',0.8)); bg.rotation.z=Math.PI/2; bg.position.set(0.45,1.47,0.05); g.add(part(bg,'la baguette','das Baguette'));
    // Eier
    for(let i=0;i<6;i++){ const e=mesh0(new THREE.SphereGeometry(0.035,10,8),std('#fff3dc',0.5)); e.scale.y=1.25; e.position.set(-0.9+(i%3)*0.08,0.12,-0.05+Math.floor(i/3)*0.08); g.add(part(e,"l'œuf",'das Ei')); }
    const milk=rr(0.1,0.22,0.1,'#ffffff',0.02,0.5); milk.position.set(-0.45,0.18,0); g.add(part(milk,'le lait','die Milch'));
    const oil=mesh0(new THREE.CylinderGeometry(0.04,0.045,0.26,12),glassM('#e9c46a')); oil.position.set(-0.25,0.2,0); g.add(part(oil,"l'huile","das Öl"));
    return shadowy(g); },
  sack(){ const g=new THREE.Group(); const m=std('#e8d9b8',1); const b=mesh0(new THREE.SphereGeometry(0.28,18,12),m); b.scale.set(1,1.35,0.8); b.position.y=0.36; g.add(b);
    const tie=mesh0(new THREE.CylinderGeometry(0.07,0.1,0.12,12),m); tie.position.y=0.74; g.add(tie);
    const lbl=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.2),new THREE.MeshBasicMaterial({map:canvasTex(96,64,(c)=>{ c.fillStyle='#e8d9b8'; c.fillRect(0,0,96,64); c.fillStyle='#7a4f2a'; c.font='bold 20px sans-serif'; c.textAlign='center'; c.fillText('FARINE',48,40); }),transparent:true}));
    lbl.position.set(0,0.38,0.225); g.add(lbl); part(g,'le sac de farine','der Mehlsack'); g.userData.radius=0.3; return shadowy(g); },
  crate(){ const g=new THREE.Group(); const W=wood('#b9804b');
    [[0,0.04,0.6,0.04,0.42],[0,0.2,0.6,0.08,0.02,0.2],[0,0.2,0.6,0.08,0.02,-0.2]].forEach(()=>{});
    const base=rr(0.6,0.04,0.42,'#b9804b',0.01); base.material=W; base.position.y=0.03; g.add(base);
    [[0,0.18,0.2,0.6,0.3,0.03],[0,0.18,-0.2,0.6,0.3,0.03],[0.29,0.18,0,0.03,0.3,0.42],[-0.29,0.18,0,0.03,0.3,0.42]].forEach(([x,y,z,w,h,d])=>{ const sl=rr(w,h,d,'#b9804b',0.008); sl.material=W; sl.position.set(x,y,z); g.add(sl); });
    for(let i=0;i<14;i++){ const pt=mesh0(new THREE.SphereGeometry(0.06,10,8),std('#c99a5b',0.9)); pt.scale.set(1.2,0.85,1); pt.position.set(-0.2+(i%5)*0.1,0.12+Math.floor(i/5)*0.07,-0.12+((i*3)%4)*0.08); g.add(part(pt,'les pommes de terre','die Kartoffeln')); }
    part(base,'la caisse','die Kiste'); return shadowy(g); },
  stool(){ const g=new THREE.Group(); const top=mesh0(new THREE.CylinderGeometry(0.2,0.2,0.05,20),wood('#9a6a3c')); top.position.y=0.42; g.add(part(top,'le tabouret','der Hocker'));
    for(let i=0;i<3;i++){ const a=i/3*Math.PI*2; const l=mesh0(new THREE.CylinderGeometry(0.018,0.02,0.42,8),wood('#7a4f2a')); l.position.set(Math.cos(a)*0.13,0.21,Math.sin(a)*0.13); g.add(part(l,'le tabouret','der Hocker')); }
    const sau=new THREE.Group(); const sm=std('#8b3a2b',0.7);
    for(let i=0;i<2;i++){ const sg=mesh0(new THREE.CapsuleGeometry(0.035,0.24,6,10),sm); sg.rotation.z=Math.PI/2; sg.rotation.y=i*0.6; sg.position.set(0,0.48,(i-0.5)*0.08); sau.add(sg); }
    part(sau,'le saucisson','die Salami'); g.add(sau); g.userData.sausage=sau; return shadowy(g); },
  bottles(){ const g=new THREE.Group(); const W=wood('#b9804b'); const c=rr(0.42,0.2,0.3,'#b9804b',0.01); c.material=W; c.position.y=0.1; g.add(part(c,'la caisse','die Kiste'));
    for(let i=0;i<6;i++){ const b=mesh0(new THREE.CylinderGeometry(0.035,0.04,0.3,12),new THREE.MeshStandardMaterial({color:'#a8dcff',transparent:true,opacity:0.7,roughness:0.05})); b.position.set(-0.13+(i%3)*0.13,0.33,-0.07+Math.floor(i/3)*0.14); g.add(part(b,"la bouteille d'eau","die Wasserflasche"));
      const cap=mesh0(new THREE.CylinderGeometry(0.018,0.018,0.03,8),std('#4a9eff')); cap.position.set(-0.13+(i%3)*0.13,0.5,-0.07+Math.floor(i/3)*0.14); g.add(cap); } return shadowy(g); },
  bulb(){ const g=new THREE.Group(); const cord=mesh0(new THREE.CylinderGeometry(0.006,0.006,0.6,6),std('#2b2135')); cord.position.y=2.5; g.add(cord);
    const b=mesh0(new THREE.SphereGeometry(0.06,12,10),new THREE.MeshBasicMaterial({color:'#fff1b8'})); b.position.y=2.18; g.add(part(b,"l'ampoule",'die Glühbirne'));
    const l=new THREE.PointLight('#ffd890',1.0,4); l.position.y=2.1; g.add(l); return g; },
  shopfront(){ const g=new THREE.Group(); const wall=rr(3.2,2.8,0.3,'#f6e7cf',0.03); wall.position.y=1.4; g.add(part(wall,'la boulangerie','die Bäckerei'));
    const fr=rr(3.0,0.5,0.06,'#2a5bd7',0.02); fr.position.set(0,2.35,0.18); g.add(part(fr,'la boulangerie','die Bäckerei'));
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.6,0.36),new THREE.MeshBasicMaterial({map:canvasTex(512,72,(c)=>{ c.fillStyle='#2a5bd7'; c.fillRect(0,0,512,72); c.fillStyle='#fff'; c.font='bold 46px serif'; c.textAlign='center'; c.fillText('BOULANGERIE',256,52); })}));
    sign.position.set(0,2.35,0.215); g.add(part(sign,'la boulangerie','die Bäckerei'));
    const awn=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,2.9,20,1,true,0,Math.PI/2),new THREE.MeshStandardMaterial({map:canvasTex(256,32,(c)=>{ for(let i=0;i<16;i++){ c.fillStyle=i%2?'#fff':'#e5384f'; c.fillRect(i*16,0,16,32); } }),side:THREE.DoubleSide,roughness:0.9}));
    awn.rotation.z=Math.PI/2; awn.rotation.y=Math.PI; awn.position.set(0,1.95,0.18); g.add(part(awn,'le store','die Markise'));
    const win=rr(1.5,1.05,0.05,'#bfe3ff',0.02,0.1); win.material=new THREE.MeshStandardMaterial({color:'#cfefff',transparent:true,opacity:0.5,roughness:0.05}); win.position.set(-0.6,1.05,0.17); g.add(part(win,'la vitrine','das Schaufenster'));
    const shelf=rr(1.5,0.05,0.3,'#d9a066',0.01); shelf.position.set(-0.6,0.7,0.0); g.add(shelf);
    for(let i=0;i<5;i++){ const cr=mesh0(new THREE.TorusGeometry(0.06,0.035,8,12,Math.PI),std('#e2a35a',0.7)); cr.position.set(-1.15+i*0.25,0.77,0.05); cr.rotation.x=-Math.PI/2; g.add(part(cr,'le croissant','das Croissant')); }
    for(let i=0;i<3;i++){ const bg=mesh0(new THREE.CapsuleGeometry(0.04,0.6,6,10),std('#d9963f',0.8)); bg.rotation.z=1.2-i*0.15; bg.position.set(-0.9+i*0.3,1.05,0.0); g.add(part(bg,'la baguette','das Baguette')); }
    const door=rr(0.8,1.75,0.06,'#2a5bd7',0.02); door.position.set(0.95,0.875,0.17); g.add(part(door,'la porte','die Tür'));
    const dg=rr(0.55,0.8,0.02,'#cfefff',0.01,0.1); dg.position.set(0.95,1.15,0.2); g.add(part(dg,'la porte','die Tür'));
    const open=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.14),new THREE.MeshBasicMaterial({map:canvasTex(96,32,(c)=>{ c.fillStyle='#fff'; c.fillRect(0,0,96,32); c.fillStyle='#3fb37f'; c.font='bold 22px sans-serif'; c.textAlign='center'; c.fillText('OUVERT',48,24); })}));
    open.position.set(0.95,1.4,0.215); g.add(part(open,'ouvert','geöffnet'));
    return shadowy(g); },
  cafetable(){ const g=new THREE.Group(); const top=mesh0(new THREE.CylinderGeometry(0.32,0.32,0.03,24),std('#f6efe4',0.3)); top.position.y=0.72; g.add(part(top,'la table','der Tisch'));
    const leg=mesh0(new THREE.CylinderGeometry(0.03,0.03,0.72,10),std('#2b2135',0.4)); leg.position.y=0.36; g.add(leg); const ft=mesh0(new THREE.CylinderGeometry(0.2,0.2,0.02,16),std('#2b2135')); ft.position.y=0.01; g.add(ft);
    [-1,1].forEach(k=>{ const ch=new THREE.Group(); const st=mesh0(new THREE.CylinderGeometry(0.19,0.19,0.03,16),std('#e5384f',0.5)); st.position.y=0.45; ch.add(st);
      const bk=mesh0(new THREE.TorusGeometry(0.18,0.02,6,20,Math.PI),std('#2b2135',0.4)); bk.position.set(0,0.65,-0.15); ch.add(bk);
      for(let i=0;i<4;i++){ const a=i*Math.PI/2+0.78; const l=mesh0(new THREE.CylinderGeometry(0.012,0.012,0.45,6),std('#2b2135')); l.position.set(Math.cos(a)*0.13,0.225,Math.sin(a)*0.13); ch.add(l); }
      ch.position.set(k*0.55,0,0); ch.rotation.y=-k*Math.PI/2; g.add(part(ch,'la chaise','der Stuhl')); });
    const cup=mesh0(new THREE.CylinderGeometry(0.04,0.03,0.06,12),std('#ffffff',0.3)); cup.position.set(0.08,0.765,0.05); g.add(part(cup,'le café','der Kaffee'));
    const cr=mesh0(new THREE.TorusGeometry(0.05,0.028,8,12,Math.PI),std('#e2a35a',0.7)); cr.rotation.x=-Math.PI/2; cr.position.set(-0.1,0.75,-0.05); g.add(part(cr,'le croissant','das Croissant'));
    const umb=mesh0(new THREE.ConeGeometry(0.9,0.35,12,1,true),new THREE.MeshStandardMaterial({map:canvasTex(256,32,(c)=>{ for(let i=0;i<12;i++){ c.fillStyle=i%2?'#fff':'#3fb37f'; c.fillRect(i*21.3,0,21.3,32); } }),side:THREE.DoubleSide})); umb.position.y=2.1; g.add(part(umb,'le parasol','der Sonnenschirm'));
    const pole=mesh0(new THREE.CylinderGeometry(0.02,0.02,1.4,8),std('#ffffff')); pole.position.y=1.45; g.add(pole);
    return shadowy(g); },
  cafefront(){ const g=new THREE.Group(); const wall=rr(2.6,2.8,0.3,'#ffe2c4',0.03); wall.position.y=1.4; g.add(part(wall,'le café','das Café'));
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.0,0.34),new THREE.MeshBasicMaterial({map:canvasTex(512,88,(c)=>{ c.fillStyle='#3fb37f'; c.fillRect(0,0,512,88); c.fillStyle='#fff'; c.font='italic bold 52px serif'; c.textAlign='center'; c.fillText('Café de Paris',256,62); })}));
    sign.position.set(0,2.4,0.16); g.add(part(sign,'le café','das Café'));
    const win=rr(1.6,1.1,0.05,'#cfefff',0.02); win.material=new THREE.MeshStandardMaterial({color:'#cfefff',transparent:true,opacity:0.55,roughness:0.05}); win.position.set(0,1.15,0.17); g.add(part(win,'la vitre','die Scheibe'));
    const menu=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.55),new THREE.MeshBasicMaterial({map:canvasTex(80,110,(c)=>{ c.fillStyle='#2b2135'; c.fillRect(0,0,80,110); c.fillStyle='#fff'; c.font='12px sans-serif'; ['MENU','café 2 €','thé 2 €','croissant 1 €','chocolat 3 €'].forEach((t,i)=>c.fillText(t,6,18+i*20)); })}));
    menu.position.set(1.05,0.6,0.25); menu.rotation.x=-0.15; g.add(part(menu,'le menu','die Speisekarte'));
    return shadowy(g); },
  lamppost(){ const g=new THREE.Group(); const m=std('#2b3a4a',0.4); const p=mesh0(new THREE.CylinderGeometry(0.04,0.07,2.6,10),m); p.position.y=1.3; g.add(p);
    const head=mesh0(new THREE.CylinderGeometry(0.08,0.16,0.3,6),m); head.position.y=2.7; g.add(head); const gl=mesh0(new THREE.SphereGeometry(0.1,10,8),new THREE.MeshBasicMaterial({color:'#fff1b8'})); gl.position.y=2.62; g.add(gl);
    part(g,'le lampadaire','die Straßenlaterne'); return shadowy(g); },
  metro(){ const g=new THREE.Group(); const m=std('#2f6b4a',0.5); [-0.6,0.6].forEach(x=>{ const p=mesh0(new THREE.CylinderGeometry(0.04,0.05,2.3,10),m); p.position.set(x,1.15,0); g.add(p); });
    const arch=mesh0(new THREE.TorusGeometry(0.6,0.04,8,20,Math.PI),m); arch.position.y=2.3; g.add(arch);
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.26),new THREE.MeshBasicMaterial({map:canvasTex(256,64,(c)=>{ c.fillStyle='#ffd84a'; c.fillRect(0,0,256,64); c.fillStyle='#2f6b4a'; c.font='bold 44px serif'; c.textAlign='center'; c.fillText('MÉTRO',128,48); })}));
    sign.position.set(0,2.15,0.03); g.add(sign); const rail=rr(1.3,0.06,0.06,'#2f6b4a',0.02); rail.position.set(0,0.9,0); g.add(rail);
    const hole=mesh0(new THREE.PlaneGeometry(1.1,1.4),new THREE.MeshBasicMaterial({color:'#2b2135'})); hole.rotation.x=-Math.PI/2; hole.position.set(0,0.01,0.75); g.add(hole);
    part(g,'le métro','die U-Bahn'); return shadowy(g); },
  trafficlight(){ const g=new THREE.Group(); const p=mesh0(new THREE.CylinderGeometry(0.04,0.04,2.2,8),std('#3a3a44',0.4)); p.position.y=1.1; g.add(p);
    const box=rr(0.24,0.62,0.18,'#2b2135',0.04); box.position.y=2.3; g.add(box);
    [['#e53e3e',2.5,'rouge','rot'],['#ffc23d',2.3,'orange','orange'],['#3fb37f',2.1,'vert','grün']].forEach(([c,y,fr,de],i)=>{ const l=mesh0(new THREE.SphereGeometry(0.065,12,8),new THREE.MeshBasicMaterial({color:i===2?c:'#3a3a44'})); l.position.set(0,y,0.08); g.add(part(l,'le feu '+fr,'die Ampel ('+de+')')); });
    part(box,'le feu','die Ampel'); part(p,'le feu','die Ampel'); return shadowy(g); },
  crosswalk(){ const g=new THREE.Group(); for(let i=0;i<6;i++){ const s=new THREE.Mesh(new THREE.PlaneGeometry(0.35,1.6),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:0.9})); s.rotation.x=-Math.PI/2; s.position.set(-1.0+i*0.4,0.006,0); g.add(s); }
    part(g,'le passage piéton','der Zebrastreifen'); return g; },
  eiffel(){ const g=new THREE.Group(); const m=std('#8a6a4a',0.6);
    for(let i=0;i<4;i++){ const a=i*Math.PI/2+Math.PI/4; const leg=mesh0(new THREE.CylinderGeometry(0.15,0.35,4,6),m); leg.position.set(Math.cos(a)*1.0,2,Math.sin(a)*1.0); leg.rotation.set(Math.sin(a)*0.22,0,-Math.cos(a)*0.22); g.add(leg); }
    const p1=rr(2.4,0.2,2.4,'#8a6a4a',0.05); p1.position.y=3.9; g.add(p1); const mid=mesh0(new THREE.CylinderGeometry(0.25,0.75,5,6),m); mid.position.y=6.5; g.add(mid);
    const p2=rr(1.0,0.15,1.0,'#8a6a4a',0.04); p2.position.y=9.0; g.add(p2); const top=mesh0(new THREE.CylinderGeometry(0.06,0.25,4,6),m); top.position.y=11.0; g.add(top);
    const ant=mesh0(new THREE.CylinderGeometry(0.02,0.02,0.8,4),m); ant.position.y=13.3; g.add(ant);
    part(g,'la tour Eiffel','der Eiffelturm'); return g; },
  street(){ const g=new THREE.Group(); const road=new THREE.Mesh(new THREE.PlaneGeometry(8,1.8),new THREE.MeshStandardMaterial({color:'#5d5f6b',roughness:0.95})); road.rotation.x=-Math.PI/2; road.position.y=0.004; g.add(part(road,'la rue','die Straße'));
    for(let i=0;i<7;i++){ const d=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.08),new THREE.MeshBasicMaterial({color:'#fff'})); d.rotation.x=-Math.PI/2; d.position.set(-3.5+i*1.2,0.006,0); g.add(d); }
    return g; },
  blackboard(){ const g=new THREE.Group(); const fr=rr(2.6,1.3,0.06,'#9a6a3c',0.02); fr.material=wood('#9a6a3c'); fr.position.set(0,1.45,0.03); g.add(part(fr,'le tableau','die Tafel'));
    const bd=new THREE.Mesh(new THREE.PlaneGeometry(2.45,1.15),new THREE.MeshStandardMaterial({map:canvasTex(512,240,(c)=>{ c.fillStyle='#2f5d4a'; c.fillRect(0,0,512,240); c.fillStyle='#f3f7f0'; c.font='42px "Comic Sans MS", cursive'; c.fillText('Bonjour !',30,70); c.font='28px "Comic Sans MS", cursive'; c.fillText('lundi 10 novembre',30,120); c.fillText('être : je suis, tu es…',30,170); c.fillText('🐶 = le chien',300,215); }),roughness:0.95}));
    bd.position.set(0,1.45,0.065); g.add(part(bd,'le tableau','die Tafel'));
    const tray=rr(2.3,0.04,0.1,'#9a6a3c',0.01); tray.position.set(0,0.82,0.08); g.add(tray); const chalk=rr(0.08,0.02,0.02,'#ffffff',0.005); chalk.position.set(0.6,0.85,0.09); g.add(part(chalk,'la craie','die Kreide'));
    return shadowy(g); },
  desk(){ const g=new THREE.Group(); const top=rr(1.1,0.05,0.55,'#d9a066',0.015); top.material=wood('#d9a066'); top.position.y=0.68; g.add(part(top,'la table','der Tisch (Schulbank)'));
    [[-0.5,-0.22],[0.5,-0.22],[-0.5,0.22],[0.5,0.22]].forEach(([x,z])=>{ const l=mesh0(new THREE.CylinderGeometry(0.018,0.018,0.68,8),std('#3a3a44')); l.position.set(x,0.34,z); g.add(l); });
    [-0.28,0.28].forEach(x=>{ const ch=new THREE.Group(); const st=rr(0.38,0.04,0.36,'#4a9eff',0.015); st.position.y=0.42; ch.add(st); const bk=rr(0.38,0.3,0.03,'#4a9eff',0.015); bk.position.set(0,0.65,0.18); ch.add(bk);
      [[-0.15,-0.15],[0.15,-0.15],[-0.15,0.15],[0.15,0.15]].forEach(([a,b])=>{ const l=mesh0(new THREE.CylinderGeometry(0.012,0.012,0.42,6),std('#3a3a44')); l.position.set(a,0.21,b); ch.add(l); });
      ch.position.set(x,0,0.48); g.add(part(ch,'la chaise','der Stuhl')); });
    const bk=rr(0.22,0.03,0.16,'#e53e5c',0.008); bk.position.set(-0.25,0.72,0); g.add(part(bk,'le cahier','das Heft'));
    const pen=mesh0(new THREE.CylinderGeometry(0.008,0.008,0.14,6),std('#4a9eff')); pen.rotation.z=Math.PI/2; pen.position.set(0.2,0.715,0.05); g.add(part(pen,'le stylo','der Kuli'));
    const pc=rr(0.2,0.06,0.07,'#ffc23d',0.025); pc.position.set(0.35,0.735,-0.12); g.add(part(pc,'la trousse','das Mäppchen'));
    return shadowy(g); },
  teacherdesk(){ const g=new THREE.Group(); const b=rr(1.4,0.75,0.65,'#b9804b',0.03); b.material=wood('#b9804b'); b.position.y=0.375; g.add(part(b,'le bureau','das Lehrerpult'));
    const ap=mesh0(new THREE.SphereGeometry(0.06,14,10),std('#e53e3e',0.35)); ap.position.set(0.45,0.81,0); g.add(part(ap,'la pomme','der Apfel'));
    const bs=[['#2a5bd7'],['#e53e5c'],['#3fb37f']]; bs.forEach(([c],i)=>{ const b2=rr(0.26,0.04,0.2,c,0.008); b2.position.set(-0.3,0.775+i*0.04,0); b2.rotation.y=i*0.2; g.add(part(b2,'le livre','das Buch')); });
    return shadowy(g); },
  francemap(){ const g=new THREE.Group(); const m=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.0),new THREE.MeshStandardMaterial({map:canvasTex(256,256,(c)=>{ c.fillStyle='#e8f4ff'; c.fillRect(0,0,256,256); c.fillStyle='#ffd36b';
      c.beginPath(); [[120,20],[170,40],[220,70],[230,120],[205,175],[215,215],[160,235],[120,225],[70,220],[55,180],[40,120],[20,95],[60,85],[95,60]].forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.closePath(); c.fill(); c.strokeStyle='#c99a3a'; c.lineWidth=3; c.stroke();
      c.fillStyle='#e5384f'; c.beginPath(); c.arc(130,80,7,0,7); c.fill(); c.fillStyle='#2b2135'; c.font='bold 16px sans-serif'; c.fillText('Paris',140,76); c.font='13px sans-serif'; c.fillText('Lyon',170,150); c.fillText('Marseille',150,215); c.fillText('Bordeaux',55,170); c.fillText('LA FRANCE',70,250); }),roughness:0.9}));
    m.position.set(0,1.6,0.03); g.add(part(m,'la carte de France','die Frankreichkarte')); const fr=rr(1.06,1.06,0.03,'#9a6a3c',0.01); fr.position.set(0,1.6,0.012); g.add(fr); return g; },
};

export function buildRoom(world, def){
  const { scene } = world; const R=def.room; const wallMeshes=[]; const root=new THREE.Group(); root.name='room'; scene.add(root);
  const floorTex = R.floor==='grass'? canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#7cc56a'; g.fillRect(0,0,w,h); for(let i=0;i<5000;i++){ g.fillStyle=['#6bb85a','#8fd27a','#5fa84f','#9adb84'][i%4]; g.fillRect(Math.random()*w,Math.random()*h,2,5+Math.random()*5); } },[4,4])
    : R.floor==='tiles'? canvasTex(512,512,(g,w,h)=>{ for(let y=0;y<8;y++) for(let x=0;x<8;x++){ g.fillStyle=(x+y)%2?'#f6efe4':'#e9dcc8'; g.fillRect(x*64,y*64,64,64); } g.strokeStyle='rgba(0,0,0,.08)'; for(let i=0;i<=8;i++){ g.beginPath(); g.moveTo(i*64,0); g.lineTo(i*64,h); g.stroke(); g.beginPath(); g.moveTo(0,i*64); g.lineTo(w,i*64); g.stroke(); } },[3,3])
    : canvasTex(512,512,(g,w,h)=>{ const cols=['#c8935e','#bf8853','#cf9d68','#b98150','#c48d58']; const rows=8, rh=h/rows;
    for(let r=0;r<rows;r++){ let x=-(r%2)*130; while(x<w){ const len=200+Math.random()*160; g.fillStyle=cols[(Math.random()*cols.length)|0]; g.fillRect(x,r*rh,len,rh);
        g.globalAlpha=0.12; for(let k=0;k<6;k++){ g.strokeStyle='#7a4f2a'; g.beginPath(); const y=r*rh+Math.random()*rh; g.moveTo(x,y); g.bezierCurveTo(x+len*0.3,y+4,x+len*0.6,y-4,x+len,y+2); g.stroke(); } g.globalAlpha=1;
        g.fillStyle='rgba(90,55,25,.55)'; g.fillRect(x,r*rh,2,rh); x+=len; } g.fillStyle='rgba(90,55,25,.5)'; g.fillRect(0,r*rh,w,2); } },[3,3]);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(R.w,R.d),new THREE.MeshStandardMaterial({map:floorTex,roughness:0.85}));
  floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; root.add(floor);
  scene.background=new THREE.Color(R.sky||'#f3e3cc');
  if(R.floor==='grass'){ // Außen: großer Rasen + Himmel
    const big=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:'#74bd62',roughness:1})); big.rotation.x=-Math.PI/2; big.position.y=-0.01; big.receiveShadow=true; root.add(big);
    const hill=new THREE.Mesh(new THREE.SphereGeometry(8,24,12),std('#8fd27a',1)); hill.position.set(-6,-6,-14); root.add(hill);
    const hill2=hill.clone(); hill2.position.set(7,-6.5,-15); root.add(hill2);
  } else {
    const wallTex=canvasTex(256,256,(g,w,h)=>{ g.fillStyle=R.wall; g.fillRect(0,0,w,h); g.fillStyle='rgba(255,255,255,.35)'; for(let x=0;x<w;x+=32) g.fillRect(x,0,12,h); },[6,1]);
    const wm=new THREE.MeshStandardMaterial({map:wallTex,roughness:0.95});
    const back=new THREE.Mesh(new THREE.PlaneGeometry(R.w,3),wm); back.position.set(0,1.5,-R.d/2); back.receiveShadow=true; root.add(back); wallMeshes.push(back);
    const sideTex=wallTex.clone(); sideTex.repeat.set(5,1); sideTex.needsUpdate=true; const sm=new THREE.MeshStandardMaterial({map:sideTex,roughness:0.95});
    const lw=new THREE.Mesh(new THREE.PlaneGeometry(R.d,3),sm); lw.rotation.y=Math.PI/2; lw.position.set(-R.w/2,1.5,0); lw.receiveShadow=true; root.add(lw);
    const rw=lw.clone(); rw.rotation.y=-Math.PI/2; rw.position.x=R.w/2; root.add(rw); wallMeshes.push(lw,rw);
    const bm=std('#fffaf2',0.6);
    [[0,-R.d/2+0.02,R.w,0],[-R.w/2+0.02,0,R.d,1],[R.w/2-0.02,0,R.d,1]].forEach(([x,z,l,r])=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(l,0.12,0.04),bm); b.position.set(x,0.06,z); if(r) b.rotation.y=Math.PI/2; root.add(b); });
  }
  const props=new Map(); const obstacles=[]; const pickables=[];
  if(wallMeshes.length){ props.set('mur',{id:'mur',type:'wall',pos:[0,-R.d/2],word:{fr:'le mur',de:'die Wand'},object:wallMeshes[0]}); wallMeshes.forEach(m=>{ m.userData.propId='mur'; pickables.push(m); }); }
  for(const p of def.props){
    const obj=BUILD[p.type](); obj.position.set(p.pos[0],p.y||0,p.pos[1]); if(p.rot) obj.rotation.y=p.rot; if(p.scale) obj.scale.setScalar(p.scale); root.add(obj); if(REAL[p.type]) realize(obj,REAL[p.type]);
    obj.traverse(m=>{ if(m.isMesh){ m.userData.propId=p.id; pickables.push(m); } });
    const entry={...p, object:obj, home:obj.position.clone()};
    if(p.block) obstacles.push({x:p.pos[0],z:p.pos[1],w:p.block[0],d:p.block[1]});
    props.set(p.id,entry);
  }
  const bounds={minX:-R.w/2+0.45,maxX:R.w/2-0.45,minZ:-R.d/2+0.5,maxZ:R.d/2-0.35};
  const ray=new THREE.Raycaster();
  function pick(ndc,camera){
    ray.setFromCamera(ndc,camera);
    const hits=ray.intersectObjects([...pickables,floor],false);
    for(const h of hits){ if(h.object===floor) return {floor:h.point}; const pr=props.get(h.object.userData.propId); const reg=h.object.userData.region&&h.uv? h.object.userData.region(h.uv.x,h.uv.y):null; return {prop:pr, point:h.point, part:reg||h.object.userData.part||null}; }
    return null;
  }
  function clampPoint(p){
    p.x=THREE.MathUtils.clamp(p.x,bounds.minX,bounds.maxX); p.z=THREE.MathUtils.clamp(p.z,bounds.minZ,bounds.maxZ);
    for(const o of obstacles){ const hx=o.w/2+0.3, hz=o.d/2+0.3; if(Math.abs(p.x-o.x)<hx && Math.abs(p.z-o.z)<hz) p.z=o.z+hz; }
    return p;
  }
  function dispose(){ scene.remove(root); root.traverse(o=>{ if(o.geometry) o.geometry.dispose(); const m=o.material; if(m){ (Array.isArray(m)?m:[m]).forEach(x=>{ x.map&&x.map.dispose(); x.dispose(); }); } });
    for(const p of props.values()) if(p.object.parent && p.object.parent!==root) p.object.parent.remove(p.object); }
  function addProp(entry, obj){ root.add(obj); obj.traverse(m=>{ if(m.isMesh){ m.userData.propId=entry.id; pickables.push(m); } }); const e={...entry, object:obj}; props.set(entry.id,e); return e; }
  return { props, pick, clampPoint, bounds, start:def.start, dispose, def, addProp, obstacles };
}


// ======================================================================
//  WELT: zusammenhängende Räume (Haus + Garten). Der Hund läuft von Raum zu Raum.
// ======================================================================
function floorTexOf(kind){
  if(kind==='grass'&&!floorTexOf.fallback){ const t=new THREE.TextureLoader().load('models/grass.jpg'); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(5,4); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=4; return t; }
  if(kind==='grass') return canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#7cc56a'; g.fillRect(0,0,w,h); for(let i=0;i<5000;i++){ g.fillStyle=['#6bb85a','#8fd27a','#5fa84f','#9adb84'][i%4]; g.fillRect(Math.random()*w,Math.random()*h,2,5+Math.random()*5); } },[4,4]);
  if(kind==='tiles') return canvasTex(512,512,(g,w,h)=>{ for(let y=0;y<8;y++) for(let x=0;x<8;x++){ g.fillStyle=(x+y)%2?'#f6efe4':'#e9dcc8'; g.fillRect(x*64,y*64,64,64); } g.strokeStyle='rgba(0,0,0,.08)'; for(let i=0;i<=8;i++){ g.beginPath(); g.moveTo(i*64,0); g.lineTo(i*64,h); g.stroke(); g.beginPath(); g.moveTo(0,i*64); g.lineTo(w,i*64); g.stroke(); } },[3,3]);
  if(kind==='pave') return canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#9a958c'; g.fillRect(0,0,w,h); for(let y=0;y<16;y++) for(let x=0;x<16;x++){ g.fillStyle=['#aaa59b','#b3aea4','#a19c92','#bab5aa'][(x*7+y*3)%4]; g.beginPath(); g.arc(x*32+16+(y%2)*16,y*32+16,14,0,7); g.fill(); } },[4,3]);
  if(kind==='lino') return canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#d9c7a6'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(0,0,0,.06)'; for(let i=0;i<=8;i++){ g.beginPath(); g.moveTo(i*32,0); g.lineTo(i*32,h); g.stroke(); g.beginPath(); g.moveTo(0,i*32); g.lineTo(w,i*32); g.stroke(); } },[4,4]);
  if(kind==='stone') return canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#b9a993'; g.fillRect(0,0,w,h); for(let y=0;y<6;y++) for(let x=0;x<6;x++){ g.fillStyle=['#c9b9a2','#bfae96','#d3c4ad','#b5a48c'][(x*3+y)%4]; g.fillRect(x*86+3,y*86+3,80,80); } },[2,2]);
  return canvasTex(512,512,(g,w,h)=>{ const cols=['#c8935e','#bf8853','#cf9d68','#b98150','#c48d58']; const rows=8, rh=h/rows;
    for(let r=0;r<rows;r++){ let x=-(r%2)*130; while(x<w){ const len=200+Math.random()*160; g.fillStyle=cols[(Math.random()*cols.length)|0]; g.fillRect(x,r*rh,len,rh);
        g.globalAlpha=0.12; for(let k=0;k<6;k++){ g.strokeStyle='#7a4f2a'; g.beginPath(); const y=r*rh+Math.random()*rh; g.moveTo(x,y); g.bezierCurveTo(x+len*0.3,y+4,x+len*0.6,y-4,x+len,y+2); g.stroke(); } g.globalAlpha=1;
        g.fillStyle='rgba(90,55,25,.55)'; g.fillRect(x,r*rh,2,rh); x+=len; } g.fillStyle='rgba(90,55,25,.5)'; g.fillRect(0,r*rh,w,2); } },[3,3]);
}
const NOBLOCK=new Set(['gate','fence','rug','ball','toy','mug','book','bowl','sun','cloud','window','picture','clock','door','crosswalk','street','eiffel','bird','bulb','bottles','blackboard','francemap','house','trafficlight','lamppost']);
export function buildWorld(world, W){
  const { scene } = world; const root=new THREE.Group(); root.name='world'; scene.add(root);
  scene.background=new THREE.Color(W.sky||'#bfe6ff');
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,60),new THREE.MeshStandardMaterial({color:'#7cc56a',roughness:1})); ground.rotation.x=-Math.PI/2; ground.position.y=-0.02; ground.receiveShadow=true; root.add(ground);
  [[-18,-7,-22,9],[6,-7.5,-24,10],[24,-6,-20,8]].forEach(([x,y,z,r])=>{ const h=new THREE.Mesh(new THREE.SphereGeometry(r,24,12),std('#8fd27a',1)); h.position.set(x,y,z); root.add(h); });
  const props=new Map(), obstacles=[], pickables=[], floors=[], rooms=[];
  const WALL_H=2.6, T=0.12;
  const doorsOf=(id)=>W.doors.filter(d=>d.a===id||d.b===id);
  for(const R of W.rooms){
    const rx=R.x, rz=R.z||0; const r={id:R.id, x:rx, z:rz, w:R.room.w, d:R.room.d, def:R, outdoor:!!R.room.outdoor||R.room.floor==='grass'};
    r.minX=rx-r.w/2; r.maxX=rx+r.w/2; r.minZ=rz-r.d/2; r.maxZ=rz+r.d/2; rooms.push(r);
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(r.w,r.d),new THREE.MeshStandardMaterial({map:floorTexOf(R.room.floor),roughness:0.85}));
    fl.rotation.x=-Math.PI/2; fl.position.set(rx,0.001,rz); fl.receiveShadow=true; fl.userData.floor=true; root.add(fl); floors.push(fl);
    if(!r.outdoor){
      const wallTex=canvasTex(256,256,(g,w,h)=>{ g.fillStyle=R.room.wall; g.fillRect(0,0,w,h); g.fillStyle='rgba(255,255,255,.35)'; for(let x=0;x<w;x+=32) g.fillRect(x,0,12,h); },[r.w,1]);
      const wm=new THREE.MeshStandardMaterial({map:wallTex,roughness:0.95});
      const back=new THREE.Mesh(new THREE.BoxGeometry(r.w,WALL_H,T),wm); back.position.set(rx,WALL_H/2,r.minZ-T/2); back.receiveShadow=true; root.add(back);
      back.userData.propId='mur'; pickables.push(back);
      const base=new THREE.Mesh(new THREE.BoxGeometry(r.w,0.12,0.04),std('#fffaf2',0.6)); base.position.set(rx,0.06,r.minZ+0.02); root.add(base);
      const cap=rr(r.w+T,0.08,T+0.04,'#fffaf2',0.02); cap.position.set(rx,WALL_H+0.04,r.minZ-T/2); root.add(cap);
      r.wallMat=wm;
    }
    // Gegenstände (Koordinaten relativ zur Raummitte)
    for(const p of (R.props||[])){
      if(!BUILD[p.type]) continue;
      const obj=BUILD[p.type](); const gx=rx+p.pos[0], gz=rz+p.pos[1]; obj.position.set(gx,p.y||0,gz); if(p.rot) obj.rotation.y=p.rot; if(p.scale) obj.scale.setScalar(p.scale); root.add(obj); if(REAL[p.type]) realize(obj,REAL[p.type]);
      obj.traverse(m=>{ if(m.isMesh){ m.userData.propId=p.id; pickables.push(m); } });
      const e={...p, room:R.id, pos:[gx,gz], spot:p.spot?[rx+p.spot[0],rz+p.spot[1]]:null, enter:p.enter?{...p.enter,pos:[rx+p.enter.pos[0],rz+p.enter.pos[1]]}:null, object:obj, home:obj.position.clone()};
      if(p.block) obstacles.push({x:gx,z:gz,w:p.block[0],d:p.block[1]});
      else if(!p.noBlock && !p.enter && !(p.y>0.15) && !NOBLOCK.has(p.type)){ // Hindernis automatisch aus der Größe bestimmen
        obj.updateMatrixWorld(true); const bb=new THREE.Box3().setFromObject(obj); const sz=bb.getSize(new THREE.Vector3()), c=bb.getCenter(new THREE.Vector3());
        if(bb.min.y<0.15 && sz.y>0.18 && sz.x*sz.z>0.02 && sz.x*sz.z<6) obstacles.push({x:c.x,z:c.z,w:sz.x*0.9,d:sz.z*0.9,auto:p.id}); }
      props.set(p.id,e);
    }
  }
  props.set('mur',{id:'mur',type:'wall',pos:[0,-2.5],word:{fr:'le mur',de:'die Wand'},object:root});
  // Seitenwände zwischen/außen an Räumen, mit Türlücken
  const sideWall=(x,z0,z1,doors,mat,outer)=>{ const gaps=doors.map(d=>[d.z-d.w/2,d.z+d.w/2]).sort((a,b)=>a[0]-b[0]); let cur=z0; const segs=[];
    for(const [g0,g1] of gaps){ if(g0>cur) segs.push([cur,g0]); cur=Math.max(cur,g1); } if(cur<z1) segs.push([cur,z1]);
    for(const [a,b] of segs){ const m=new THREE.Mesh(new THREE.BoxGeometry(T,WALL_H,b-a),mat); m.position.set(x,WALL_H/2,(a+b)/2); m.receiveShadow=true; m.castShadow=true; root.add(m); m.userData.propId='mur'; pickables.push(m);
      const cap=rr(T+0.04,0.08,b-a,'#fffaf2',0.02); cap.position.set(x,WALL_H+0.04,(a+b)/2); root.add(cap); }
    for(const d of doors){ // Türrahmen
      const fm=std('#ffffff',0.45); const lin=rr(T+0.07,0.12,d.w+0.18,'#ffffff',0.02); lin.position.set(x,2.135,d.z); root.add(part(lin,d.outdoor?'la porte-fenêtre':'la porte',d.outdoor?'die Terrassentür':'die Tür'));
      [-1,1].forEach(k=>{ const jb=rr(T+0.06,2.12,0.08,'#ffffff',0.02); jb.position.set(x,1.065,d.z+k*(d.w/2+0.028)); root.add(part(jb,d.outdoor?'la porte-fenêtre':'la porte',d.outdoor?'die Terrassentür':'die Tür')); [lin,jb].forEach(o=>{ o.traverse(mm=>{ if(mm.isMesh){ mm.userData.propId='porte_'+d.a+d.b; pickables.push(mm); } }); }); });
      props.set('porte_'+d.a+d.b,{id:'porte_'+d.a+d.b,type:'door',pos:[x,d.z],word:{fr:d.outdoor?'la porte-fenêtre':'la porte',de:d.outdoor?'die Terrassentür':'die Tür'},object:lin});
      const sill=rr(T+0.2,0.02,d.w,'#c9b9a2',0.005); sill.position.set(x,0.01,d.z); root.add(sill); }
  };
  // jede Raumgrenze nur einmal
  const edges=new Map();
  for(const r of rooms){ for(const side of ['w','e']){ const x= side==='w'? r.minX : r.maxX; const key=x.toFixed(2); (edges.get(key)??edges.set(key,[]).get(key)).push({r,side}); } }
  for(const [key,list] of edges){ const x=+key; const indoor=list.filter(e=>!e.r.outdoor); if(!indoor.length) continue;
    const r=indoor[0].r; const z0=Math.min(...indoor.map(e=>e.r.minZ)), z1=Math.max(...indoor.map(e=>e.r.maxZ));
    const doors=W.doors.filter(d=>Math.abs(d.x-x)<0.01).map(d=>({...d, outdoor:[d.a,d.b].some(id=>rooms.find(o=>o.id===id)?.outdoor)}));
    sideWall(x,z0,z1,doors,r.wallMat,false); }
  // Hausfassade zur Gartenseite / Dach-Andeutung hinten
  // ---- Navigation ----
  const PAD=0.42;
  const walk=rooms.map(r=>({room:r.id,minX:r.minX+PAD,maxX:r.maxX-PAD,minZ:r.minZ+0.5,maxZ:r.maxZ-0.3}));
  for(const d of W.doors) walk.push({door:d,minX:d.x-0.7,maxX:d.x+0.7,minZ:d.z-d.w/2+0.18,maxZ:d.z+d.w/2-0.18});
  const inRect=(p,r)=>p.x>=r.minX&&p.x<=r.maxX&&p.z>=r.minZ&&p.z<=r.maxZ;
  function roomOf(p){ let best=null, bd=1e9; for(const r of rooms){ const dx=Math.max(r.minX-p.x,0,p.x-r.maxX), dz=Math.max(r.minZ-p.z,0,p.z-r.maxZ); const d=dx+dz; if(d<bd){ bd=d; best=r; } } return best; }
  function clampPoint(p){
    if(!walk.some(r=>inRect(p,r))){ let best=null,bd=1e9; for(const r of walk){ const q=new THREE.Vector3(THREE.MathUtils.clamp(p.x,r.minX,r.maxX),0,THREE.MathUtils.clamp(p.z,r.minZ,r.maxZ)); const d=q.distanceToSquared(p); if(d<bd){ bd=d; best=q; } } p.copy(best); }
    for(const o of obstacles){ const hx=o.w/2+0.3, hz=o.d/2+0.3; if(Math.abs(p.x-o.x)<hx && Math.abs(p.z-o.z)<hz) p.z=o.z+hz; }
    return p;
  }
  // Wegpunkte durch Türen (Breitensuche über Räume)
  function route(from,to){
    const a=roomOf(from).id, b=roomOf(to).id; if(a===b) return [to];
    const prev={[a]:null}, q=[a];
    while(q.length){ const c=q.shift(); if(c===b) break; for(const d of W.doors){ const n= d.a===c? d.b : d.b===c? d.a : null; if(n && !(n in prev)){ prev[n]={from:c,door:d}; q.push(n); } } }
    if(!(b in prev)) return [to];
    const legs=[]; let c=b; while(prev[c]){ legs.unshift(prev[c]); c=prev[c].from; }
    const pts=[]; for(const L of legs){ const d=L.door, fromR=rooms.find(r=>r.id===L.from); const dir= (d.x>fromR.x)?1:-1;
      pts.push(new THREE.Vector3(d.x-dir*0.6,0,d.z), new THREE.Vector3(d.x+dir*0.6,0,d.z)); }
    pts.push(to); return pts;
  }
  const ray=new THREE.Raycaster();
  function pick(ndc,camera){
    ray.setFromCamera(ndc,camera);
    const hits=ray.intersectObjects([...pickables,...floors],false);
    for(const h of hits){ if(h.object.userData.floor) return {floor:h.point}; const pr=props.get(h.object.userData.propId); if(!pr) continue;
      const reg=h.object.userData.region&&h.uv? h.object.userData.region(h.uv.x,h.uv.y):null; return {prop:pr, point:h.point, part:reg||h.object.userData.part||null}; }
    const g=hits.length?null:null; return g;
  }
  function addProp(entry,obj){ root.add(obj); obj.traverse(m=>{ if(m.isMesh){ m.userData.propId=entry.id; pickables.push(m); } }); const e={...entry, object:obj}; props.set(entry.id,e); return e; }
  const bounds={minX:Math.min(...rooms.map(r=>r.minX)),maxX:Math.max(...rooms.map(r=>r.maxX)),minZ:-3,maxZ:3};
  const start=(()=>{ const r=W.rooms.find(x=>x.id===W.start); return { pos:[r.x+r.start.pos[0], (r.z||0)+r.start.pos[1]], yaw:r.start.yaw }; })();
  function centerOf(id){ const r=rooms.find(x=>x.id===id); const R=W.rooms.find(x=>x.id===id); return R.start? [r.x+R.start.pos[0], r.z+R.start.pos[1]] : [r.x,r.z+0.5]; }
  return { props, pick, clampPoint, bounds, start, obstacles, addProp, roomOf, route, rooms, centerOf, dispose(){} };
}
