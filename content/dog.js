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
];
let sel='filou'; try{ sel=localStorage.getItem('chien_dog')||'filou'; }catch(e){}
const pick=DOGS.find(d=>d.id===sel)||DOGS[0];
export const DOG = { ...BASE, ...pick, tune:{ ...BASE.tune, ...(pick.tune||{}) } };
export function chooseDog(id){ try{ localStorage.setItem('chien_dog',id); }catch(e){} }
