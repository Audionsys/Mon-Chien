// Sachen für den Hund: Modelle, Anziehen, Füttern, Spielzeug, Zahlen auf Französisch
import * as THREE from 'three';
import { ITEMS } from '../content/items.js';

const std=(c,r=0.7)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const mesh=(g,m)=>{ const x=new THREE.Mesh(g,m); x.castShadow=true; return x; };

// ---------- Modelle (Größen in Metern, Hund ~0.62 m hoch) ----------
const MODELS = {
  tennis(){ const g=new THREE.Group(); const b=mesh(new THREE.SphereGeometry(0.045,20,14),std('#d6f03c',0.9)); b.position.y=0.045; g.add(b);
    const l=new THREE.Mesh(new THREE.TorusGeometry(0.045,0.004,6,30),std('#ffffff',0.6)); l.position.y=0.045; l.rotation.set(0.6,0.3,0); g.add(l); g.userData.radius=0.045; return g; },
  rope(){ const g=new THREE.Group(); const m=std('#ff7a59',0.9), m2=std('#4a9eff',0.9);
    const c=mesh(new THREE.CylinderGeometry(0.018,0.018,0.26,10),m); c.rotation.z=Math.PI/2; c.position.y=0.03; g.add(c);
    [-0.14,0.14].forEach(x=>{ const k=mesh(new THREE.SphereGeometry(0.035,12,10),m2); k.position.set(x,0.035,0); g.add(k); }); g.userData.radius=0.035; return g; },
  frisbee(){ const g=new THREE.Group(); const f=mesh(new THREE.CylinderGeometry(0.11,0.12,0.02,28),std('#7a5bd6',0.5)); f.position.y=0.012; g.add(f); g.userData.radius=0.02; return g; },
  plush(){ const g=new THREE.Group(); const m=std('#c8935e',1);
    const b=mesh(new THREE.SphereGeometry(0.06,14,10),m); b.position.y=0.06; g.add(b); const h=mesh(new THREE.SphereGeometry(0.045,14,10),m); h.position.set(0,0.13,0.01); g.add(h);
    [-1,1].forEach(k=>{ const e=mesh(new THREE.SphereGeometry(0.018,8,6),m); e.position.set(k*0.035,0.17,0); g.add(e); }); g.userData.radius=0.06; return g; },
  duck(){ const g=new THREE.Group(); const y=std('#ffd23d',0.5);
    const b=mesh(new THREE.SphereGeometry(0.055,14,10),y); b.scale.set(1,0.8,1.2); b.position.y=0.045; g.add(b); const h=mesh(new THREE.SphereGeometry(0.035,12,10),y); h.position.set(0,0.1,0.04); g.add(h);
    const bk=mesh(new THREE.ConeGeometry(0.015,0.035,8),std('#ff8a2a',0.5)); bk.rotation.x=Math.PI/2; bk.position.set(0,0.1,0.085); g.add(bk); g.userData.radius=0.05; return g; },
  football(){ const g=new THREE.Group(); const b=mesh(new THREE.IcosahedronGeometry(0.07,1),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:0.6,flatShading:true})); b.position.y=0.07; g.add(b);
    g.userData.radius=0.07; return g; },
  ring(){ const g=new THREE.Group(); const r=mesh(new THREE.TorusGeometry(0.07,0.02,10,24),std('#ff5c8a',0.6)); r.rotation.x=Math.PI/2; r.position.y=0.02; g.add(r); g.userData.radius=0.02; return g; },
  // Accessoires (relativ zum Kopf: y = oben, z = vorne)
  tophat(){ const g=new THREE.Group(); const m=std('#2b2135',0.5); const br=mesh(new THREE.CylinderGeometry(0.075,0.075,0.008,24),m); g.add(br);
    const c=mesh(new THREE.CylinderGeometry(0.045,0.05,0.09,24),m); c.position.y=0.048; g.add(c); const band=mesh(new THREE.CylinderGeometry(0.051,0.051,0.016,24),std('#ff7a59')); band.position.y=0.012; g.add(band); return g; },
  cap(){ const g=new THREE.Group(); const m=std('#4a9eff',0.7); const d=mesh(new THREE.SphereGeometry(0.06,20,10,0,Math.PI*2,0,Math.PI/2),m); g.add(d);
    const v=mesh(new THREE.CylinderGeometry(0.05,0.05,0.008,20,1,false,0,Math.PI),m); v.rotation.y=Math.PI/2; v.position.set(0,0.002,0.045); g.add(v); return g; },
  crown(){ const g=new THREE.Group(); const m=new THREE.MeshStandardMaterial({color:'#ffc23d',roughness:0.25,metalness:0.6});
    const b=mesh(new THREE.CylinderGeometry(0.05,0.05,0.035,20,1,true),m); b.material.side=THREE.DoubleSide; b.position.y=0.018; g.add(b);
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const p=mesh(new THREE.ConeGeometry(0.014,0.035,6),m); p.position.set(Math.cos(a)*0.05,0.05,Math.sin(a)*0.05); g.add(p);
      const gem=mesh(new THREE.SphereGeometry(0.007,8,6),std(['#e53e5c','#4a9eff','#3fb37f'][i%3],0.2)); gem.position.set(Math.cos(a)*0.051,0.02,Math.sin(a)*0.051); g.add(gem); } return g; },
  bow(){ const g=new THREE.Group(); const m=std('#ff5c8a',0.6);
    [-1,1].forEach(k=>{ const w=mesh(new THREE.ConeGeometry(0.03,0.05,4),m); w.rotation.z=k*Math.PI/2; w.position.x=k*0.026; g.add(w); });
    const k=mesh(new THREE.SphereGeometry(0.012,8,6),m); g.add(k); return g; },
  glasses(){ const g=new THREE.Group(); const m=new THREE.MeshStandardMaterial({color:'#111',roughness:0.2,metalness:0.3});
    [-1,1].forEach(k=>{ const l=mesh(new THREE.CylinderGeometry(0.024,0.024,0.008,18),m); l.rotation.x=Math.PI/2; l.position.set(k*0.03,0,0.012); g.add(l); });
    const br=mesh(new THREE.BoxGeometry(0.02,0.005,0.005),m); br.position.z=0.012; g.add(br); return g; },
  collar(){ const g=new THREE.Group(); const c=mesh(new THREE.TorusGeometry(0.065,0.011,8,28),std('#e53e5c',0.5)); g.add(c);
    const t=mesh(new THREE.CylinderGeometry(0.014,0.014,0.004,16),new THREE.MeshStandardMaterial({color:'#ffc23d',metalness:0.7,roughness:0.3})); t.rotation.x=Math.PI/2; t.position.set(0,-0.075,0.012); g.add(t); return g; },
  bandana(){ const g=new THREE.Group(); const m=new THREE.MeshStandardMaterial({color:'#e53e5c',roughness:0.9,side:THREE.DoubleSide});
    const t=mesh(new THREE.ConeGeometry(0.075,0.11,3,1,true),m); t.rotation.x=Math.PI; t.scale.set(1,1,0.35); t.position.set(0,-0.05,0.02); g.add(t);
    const r=mesh(new THREE.TorusGeometry(0.066,0.01,6,24),m); g.add(r); return g; },
};
export function buildItem(id){ const it=ITEMS[id]; const g=MODELS[it.model](); g.userData.itemId=id; return g; }

// ---------- Anziehen ----------
// Position am Kopf wird aus Kopf- und Schnauzenknochen berechnet (funktioniert auch bei anderen Hunden)
export function equip(dog, id){
  const it=ITEMS[id]; unequipSlot(dog, it.slot);
  const obj=buildItem(id); dog.worn ??= {}; dog.worn[it.slot]={id,obj};
  placeWorn(dog, it.slot, obj); return obj;
}
export function unequipSlot(dog, slot){ const w=dog.worn?.[slot]; if(!w) return; w.obj.parent?.remove(w.obj); delete dog.worn[slot]; }
function placeWorn(dog, slot, obj){
  // Hund kurz in Grundhaltung messen
  dog.root.updateMatrixWorld(true);
  const head=dog.bones.head, mouth=dog.mouth, chest=dog.bones.chest;
  const hp=head.getWorldPosition(new THREE.Vector3()), mp=mouth.getWorldPosition(new THREE.Vector3()), cp=chest.getWorldPosition(new THREE.Vector3());
  const q=new THREE.Quaternion(); dog.root.getWorldQuaternion(q);
  const up=new THREE.Vector3(0,1,0).applyQuaternion(q), fwd=mp.clone().sub(hp).setY(0).normalize();
  let s=dog.H/0.62;
  let pos, look;
  const WO=dog.wearOff||{}; if(slot==='head'){ pos=hp.clone().addScaledVector(up,(WO.up??0.085)*s).addScaledVector(fwd,(WO.fwd??-0.01)*s); }
  else if(slot==='eyes'){ pos=hp.clone().lerp(mp,0.5).addScaledVector(up,0.04*s); s*=1.25; }
  else { pos=hp.clone().lerp(cp,0.38).addScaledVector(up,-0.01*s); }
  obj.position.copy(pos); obj.scale.setScalar(s);
  // ausrichten: lokale z-Achse nach vorne
  const m=new THREE.Matrix4().lookAt(new THREE.Vector3(), fwd.clone().multiplyScalar(-1), up); obj.quaternion.setFromRotationMatrix(m);
  if(slot==='neck'){ obj.rotateX(-1.05); }
  obj.updateMatrixWorld(true);
  (slot==='neck'? chest : head).attach(obj);
}

// ---------- Zahlen auf Französisch (0–100) ----------
const U=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
const T={2:'vingt',3:'trente',4:'quarante',5:'cinquante',6:'soixante'};
export function nombre(n){
  if(n<20) return U[n]; if(n===100) return 'cent';
  if(n<70){ const t=Math.floor(n/10), u=n%10; return T[t]+(u===0?'':u===1?' et un':'-'+U[u]); }
  if(n<80){ const r=n-60; return 'soixante'+(r===11?' et onze':'-'+U[r]); }
  const r=n-80; return 'quatre-vingt'+(r===0?'s':'-'+U[r]);
}
