// Prozedurale Posen für das Meshy-Vierbeiner-Skelett.
// Winkel in Grad um Hund-Achsen: x = quer (Nicken), y = hoch (Drehen), z = längs (Kippen)
// trans: Verschiebung in Hund-Höhen (1.0 = Hundehöhe)
export const POSES = {
  sit:{ trans:{Hips:[0,-0.28,-0.03]},
        rot:{ Hips:[['x',-30]], chest:[['x',4]], head:[['x',20]],
              frontleg:[['x',27]], R_frontleg:[['x',27]],
              backleg:[['x',-50]], R_backleg:[['x',-50]], backleg0:[['x',-30]], R_backleg0:[['x',-30]],
              backleg1:[['x',118]], R_backleg1:[['x',118]], backleg2:[['x',-45]], R_backleg2:[['x',-45]],
              tail:[['x',45]] } },
  lie:{ trans:{Hips:[0,-0.37,0]},
        rot:{ Hips:[['x',2]], head:[['x',10]],
              frontleg:[['x',-82]], R_frontleg:[['x',-82]], frontleg1:[['x',18]], R_frontleg1:[['x',18]], frontleg2:[['x',22]], R_frontleg2:[['x',22]],
              backleg:[['x',-55]], R_backleg:[['x',-55]], backleg0:[['x',-25]], R_backleg0:[['x',-25]],
              backleg1:[['x',120]], R_backleg1:[['x',120]], backleg2:[['x',-35]], R_backleg2:[['x',-35]],
              tail:[['x',30]] } },
  paw:{ rot:{ R_frontleg:[['x',-75]], R_frontleg1:[['x',-10]], R_frontleg2:[['x',-35]], head:[['z',-10]] } },
  tilt:{ rot:{ head:[['z',24]] } },
  sniff:{ rot:{ head:[['x',38]], chest:[['x',14]] } },
  sleepHead:{ rot:{ head:[['x',30],['z',12]], chest:[['x',6]] } },
  shame:{ rot:{ head:[['x',26],['z',-10]] } },
  jumpLegs:{ rot:{ frontleg:[['x',-35]], R_frontleg:[['x',-35]], backleg:[['x',35]], R_backleg:[['x',35]], head:[['x',-10]] } },
  beg:{ rot:{ Hips:[['x',-22]], chest:[['x',-12]], head:[['x',22]], frontleg:[['x',-72]], R_frontleg:[['x',-72]], frontleg1:[['x',-15]], R_frontleg1:[['x',-15]], frontleg2:[['x',-50]], R_frontleg2:[['x',-50]] } },
  dig:{ rot:{ head:[['x',30]], chest:[['x',10]] } },
  barkHead:{ rot:{ head:[['x',-14]], chest:[['x',-4]] } },
};
export const ORDER=['Hips','tail','tailstart','tail1','tail2','tail3','backleg','backleg0','backleg1','backleg2','R_backleg','R_backleg0','R_backleg1','R_backleg2','chest','head','frontleg','frontleg0','frontleg1','frontleg2','R_frontleg','R_frontleg0','R_frontleg1','R_frontleg2'];
