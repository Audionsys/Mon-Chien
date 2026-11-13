// =============================================================
//  HUND – Modell austauschen
//  1. In Meshy: Vierbeiner riggen (Quadruped), Laufanimation dazu, als GLB exportieren
//  2. Datei als model ablegen (GLB, oder wie hier als JS-Paket für die Vorschau)
//  3. Bei einem Meshy-Hund passen die Knochennamen automatisch.
//     Bei einem anderen Skelett rechts den Namen des eigenen Knochens eintragen.
// =============================================================
const BASE = {
  model: 'filou-model.js',      // .js (Paket) oder .glb
  height: 0.62,                 // Höhe in Metern (Ohrspitze)
  walkClip: 0,                  // Index oder Name der Laufanimation
  // logischer Name : Name im Modell
  bones: {
    Hips:'Hips', chest:'chest', head:'head', mouth:'headend',
    tail:'tail', tailstart:'tailstart', tail1:'tail1', tail2:'tail2', tail3:'tail3',
    backleg:'backleg', backleg0:'backleg0', backleg1:'backleg1', backleg2:'backleg2',
    R_backleg:'R_backleg', R_backleg0:'R_backleg0', R_backleg1:'R_backleg1', R_backleg2:'R_backleg2',
    frontleg:'frontleg', frontleg0:'frontleg0', frontleg1:'frontleg1', frontleg2:'frontleg2',
    R_frontleg:'R_frontleg', R_frontleg0:'R_frontleg0', R_frontleg1:'R_frontleg1', R_frontleg2:'R_frontleg2',
  },
  // Feinjustage, falls ein anderer Hund anders sitzt/liegt (Multiplikatoren)
  tune: { sit:1, lie:1, paw:1 },
};

// =============================================================
//  AUSWAHL – mehrere Hunde. Neuen Hund: Eintrag anhängen (gleiches Meshy-Skelett → bones passen).
// =============================================================
export const DOGS = [
  { id:'filou',    name:'Der Kleine',     de:'kurzes, glänzendes Fell', pic:'dogs/filou.jpg',    model:'filou-model.js',          height:0.62 },
  { id:'shepherd', name:'Der Schäferhund', de:'größer, mit Blesse',      pic:'dogs/shepherd.jpg', model:'dogs/shepherd-model.js', height:0.70 },
  { id:'juna',     name:'Juna',            de:'schwarz, schlank, Stehohren', pic:'dogs/juna.jpg', model:'dogs/juna.glb', height:0.62,
    procWalk:true, wagAxis:'y', tailLift:50, wagBones:['tail','tailstart','tail1'], fur:{normal:0.35,sheen:0.6,sheenColor:0x6b6560}, poses:'meshy2',
    bones:{ Hips:'root', chest:'chest', head:'head',
      tail:'tail2', tailstart:'tail3', tail1:'tail4', tail2:'tail_04',
      frontleg:'frontUprL', frontleg0:'frontLwrL', frontleg1:'frontHorselinkL', frontleg2:'frontFootL',
      R_frontleg:'frontUprR', R_frontleg0:'frontLwrR', R_frontleg1:'frontHorselinkR', R_frontleg2:'frontFootR',
      backleg:'rearUprL', backleg0:'rearLwrL', backleg1:'rearHorselinkL', backleg2:'rearFootL',
      R_backleg:'rearUprR', R_backleg0:'rearLwrR', R_backleg1:'rearHorselinkR', R_backleg2:'rearFootR' } },
  // Berner folgt (Textur + Posen noch in Arbeit)
];
// Posen für das neue Meshy-Hundeskelett (Juna, Berner): Hinterbeine falten anders
const P2={
  sit:{ trans:{Hips:[0,-0.2,0.01]}, rot:{ Hips:[['x',-32]], head:[['x',8]], frontleg:[['x',24]], R_frontleg:[['x',24]],
        backleg:[['x',-35]], R_backleg:[['x',-35]], backleg0:[['x',110]], R_backleg0:[['x',110]], backleg1:[['x',-60]], R_backleg1:[['x',-60]], tail:[['x',58]] } },
  lie:{ trans:{Hips:[0,-0.30,0]}, rot:{ head:[['x',8]],
        frontleg:[['x',-80]], R_frontleg:[['x',-80]], frontleg0:[['x',-10]], R_frontleg0:[['x',-10]], frontleg1:[['x',10]], R_frontleg1:[['x',10]], frontleg2:[['x',70]], R_frontleg2:[['x',70]],
        backleg:[['x',-60]], R_backleg:[['x',-60]], backleg0:[['x',130]], R_backleg0:[['x',130]], backleg1:[['x',-70]], R_backleg1:[['x',-70]], tail:[['x',70]] } },
};
let sel='filou'; try{ sel=localStorage.getItem('chien_dog')||'filou'; }catch(e){}
const pick=DOGS.find(d=>d.id===sel)||DOGS[0];
export const DOG = { ...BASE, ...pick, poses: pick.poses==='meshy2'? P2 : pick.poses, bones:{ ...(pick.bones||BASE.bones) }, tune:{ ...BASE.tune, ...(pick.tune||{}) } };
export function chooseDog(id){ try{ localStorage.setItem('chien_dog',id); }catch(e){} }
