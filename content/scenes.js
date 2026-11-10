// =============================================================
//  SZENEN – Räume und antippbare Gegenstände
//  type   : Bauplan aus engine/scene.js (sofa, bed, bowl, ball, plant, window, picture, rug)
//  pos    : [x, z] auf dem Boden  (x: links/rechts, z: hinten(-)/vorne(+))
//  word   : französisches Wort (mit Artikel) + de
//  spot   : wohin der Hund läuft, wenn man ihn dorthin schickt
//  block  : Hindernis (Breite, Tiefe) – der Hund läuft drumherum/davor
// =============================================================
export const SCENES = {
  salon: {
    room: { w:6, d:5, wall:'#f6d7b8', floor:'wood' },
    props: [
      { id:'canape',  type:'sofa',    pos:[1.5,-1.75], word:{fr:'le canapé', de:'das Sofa'},        block:[2.3,1.1] },
      { id:'panier',  type:'bed',     pos:[-1.85,-1.35], word:{fr:'le panier', de:'das Körbchen'},  spot:[-1.6,-0.35], enter:{pos:[-1.85,-1.35], y:0.065}, block:[1.3,1.05] },
      { id:'gamelle', type:'bowl',    pos:[-2.2,0.6],  word:{fr:'la gamelle', de:'der Napf'},       spot:[-1.78,0.6], block:[0.45,0.45] },
      { id:'balle',   type:'ball',    pos:[1.0,0.9],   word:{fr:'la balle', de:'der Ball'} },
      { id:'plante',  type:'plant',   pos:[-2.55,-2.05], word:{fr:'la plante', de:'die Pflanze'},   block:[0.6,0.6], spot:[-2.1,-1.6] },
      { id:'fenetre', type:'window',  pos:[-1.1,-2.5], word:{fr:'la fenêtre', de:'das Fenster'},    spot:[-1.1,-1.85] },
      { id:'tableau', type:'picture', pos:[1.3,-2.5],  word:{fr:'le tableau', de:'das Bild'} },
      { id:'tapis',   type:'rug',     pos:[0.2,0.3],   word:{fr:'le tapis', de:'der Teppich'},      spot:[0.2,0.3] },
      { id:'coussin', type:'cushion', pos:[0.2,-0.95], word:{fr:'le coussin', de:'das Kissen'} },
      { id:'lampe',   type:'lamp',    pos:[2.65,-0.75], word:{fr:'la lampe', de:'die Lampe'},          block:[0.45,0.45] },
      { id:'etagere', type:'shelf',   pos:[2.83,0.9], rot:-Math.PI/2, word:{fr:"l'étagère", de:'das Regal'}, block:[0.4,1.05] },
      { id:'tele',    type:'tv',      pos:[-2.78,0.9], rot:Math.PI/2, word:{fr:'la télé', de:'der Fernseher'}, block:[0.45,1.25] },
      { id:'horloge', type:'clock',   pos:[0.2,-2.5],  word:{fr:"l'horloge", de:'die Uhr'} },
      { id:'porte',   type:'door',    pos:[-2.97,-0.3], rot:Math.PI/2, word:{fr:'la porte', de:'die Tür'} },
      { id:'tablebasse', type:'coffeetable', pos:[1.75,0.05], word:{fr:'la table basse', de:'der Couchtisch'}, block:[1.0,0.6] },
      { id:'tasse',   type:'mug',     pos:[1.55,0.05], y:0.405, word:{fr:'la tasse', de:'die Tasse'} },
      { id:'livre',   type:'book',    pos:[1.95,0.1], y:0.405, rot:0.3, word:{fr:'le livre', de:'das Buch'} },
    ],
    start: { pos:[-1.6,-0.6], yaw:0.6 },
    betises: ['shred','tail','window','steal','dig','zoomies'],
  },
  jardin: {
    room: { w:7, d:5.5, floor:'grass', sky:'#bfe6ff' },
    props: [
      { id:'portail', type:'gate',    pos:[2.4,-2.6],  word:{fr:'le portail', de:'das Gartentor'},  spot:[2.4,-2.0] },
      { id:'barriere',type:'fence',   pos:[0,-2.75],   word:{fr:'la barrière', de:'der Zaun'} },
      { id:'niche',   type:'niche',   pos:[-2.3,-1.6], word:{fr:'la niche', de:'die Hundehütte'},   spot:[-2.3,-0.75], block:[1.0,0.9] },
      { id:'arbre',   type:'tree',    pos:[1.0,-1.9],  word:{fr:"l'arbre", de:'der Baum'},           spot:[1.0,-1.3], block:[0.5,0.5] },
      { id:'fleurs',  type:'flowers', pos:[-0.4,-2.3], word:{fr:'les fleurs', de:'die Blumen'},     spot:[-0.4,-1.7] },
      { id:'balle',   type:'ball',    pos:[0.6,0.8],   word:{fr:'la balle', de:'der Ball'} },
      { id:'gamelle', type:'bowl',    pos:[-1.5,-1.0], word:{fr:'la gamelle', de:'der Napf'},       spot:[-1.08,-0.95], block:[0.45,0.45] },
      { id:'coussin', type:'cushion', pos:[-2.7,0.4],  word:{fr:'le coussin', de:'das Kissen'} },
      { id:'soleil',  type:'sun',     pos:[3.5,-9], y:5.5, word:{fr:'le soleil', de:'die Sonne'} },
      { id:'nuage',   type:'cloud',   pos:[-2.5,-9], y:5.0, word:{fr:'le nuage', de:'die Wolke'} },
      { id:'nuage2',  type:'cloud',   pos:[0.8,-10], y:6.2, scale:0.8, word:{fr:'le nuage', de:'die Wolke'} },
      { id:'banc',    type:'bench',   pos:[2.6,0.4], rot:-Math.PI/2, word:{fr:'le banc', de:'die Bank'}, block:[0.5,1.35] },
      { id:'voisins', type:'house',   pos:[-1.6,-5.2], word:{fr:'la maison des voisins', de:'das Nachbarhaus'} },
      { id:'maison2', type:'house',   pos:[3.2,-5.8], rot:-0.3, scale:0.9, word:{fr:'la maison', de:'das Haus'} },
      { id:'chat',    type:'cat',     pos:[-0.9,-2.78], y:0.69, rot:0.2, word:{fr:'le chat', de:'die Katze'} },
      { id:'oiseau',  type:'bird',    pos:[1.62,-1.55], y:1.38, rot:-0.9, word:{fr:"l'oiseau", de:'der Vogel'} },
      { id:'boite',   type:'mailbox', pos:[3.1,-2.4], word:{fr:'la boîte aux lettres', de:'der Briefkasten'} },
    ],
    start: { pos:[-0.8,0.2], yaw:0.4 },
    betises: ['dig','tail','zoomies','steal','window','shred'],
  },
  cuisine: {
    room: { w:5.5, d:4.5, wall:'#d8f0e4', floor:'tiles' },
    props: [
      { id:'table',   type:'table',   pos:[0.6,-0.6],  word:{fr:'la table', de:'der Tisch'},        block:[1.4,0.9] },
      { id:'chaise',  type:'chair',   pos:[1.65,-0.6], rot:-Math.PI/2, word:{fr:'la chaise', de:'der Stuhl'}, block:[0.45,0.45] },
      { id:'chaise2', type:'chair',   pos:[-0.45,-0.6], rot:Math.PI/2, word:{fr:'la chaise', de:'der Stuhl'}, block:[0.45,0.45] },
      { id:'frigo',   type:'fridge',  pos:[-2.25,-1.85], word:{fr:'le frigo', de:'der Kühlschrank'}, spot:[-2.0,-1.1], block:[0.8,0.7] },
      { id:'placard', type:'counter', pos:[0.6,-1.95], word:{fr:'le placard', de:'der Küchenschrank'}, block:[2.2,0.6] },
      { id:'gamelle', type:'bowl',    pos:[-1.9,0.7],  word:{fr:'la gamelle', de:'der Napf'},       spot:[-1.48,0.7], block:[0.45,0.45] },
      { id:'balle',   type:'ball',    pos:[1.2,1.0],   word:{fr:'la balle', de:'der Ball'} },
      { id:'coussin', type:'cushion', pos:[-1.2,-0.5], word:{fr:'le coussin', de:'das Kissen'} },
      { id:'fenetre', type:'window',  pos:[2.0,-2.25], word:{fr:'la fenêtre', de:'das Fenster'},    spot:[2.0,-1.3], scale:0.75 },
      { id:'four',    type:'stove',   pos:[-1.1,-1.95], word:{fr:'la cuisinière', de:'der Herd'},       block:[0.7,0.6] },
      { id:'evier',   type:'sink',    pos:[2.35,-1.95], word:{fr:"l'évier", de:'die Spüle'},            block:[0.8,0.6] },
      { id:'poubelle',type:'bin',     pos:[-2.5,-0.6], word:{fr:'la poubelle', de:'der Mülleimer'},     block:[0.35,0.35] },
      { id:'horloge', type:'clock',   pos:[-0.3,-2.25], word:{fr:"l'horloge", de:'die Uhr'} },
      { id:'tasse',   type:'mug',     pos:[0.95,-0.45], y:0.78, word:{fr:'la tasse', de:'die Tasse'} },
    ],
    start: { pos:[-0.8,0.6], yaw:0.5 },
    betises: ['shred','steal','tail','zoomies','window'],
  },
};
