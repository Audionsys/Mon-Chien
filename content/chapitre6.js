// Kapitel 6 – La famille  (Familie, ma/mon, son/sa, Alter mit avoir, Fragen)
export default {
  id:'ch6', titre:'La famille', titel:'Die Familie', scene:'salon',
  icon:'👨\u200d👩\u200d👧', story:'Großes Familientreffen! {N} lernt alle kennen – Mama, Papa, Geschwister, Oma und Opa.',
  intro: { fr:'La famille', ziel:'{N} lernt deine Familie kennen: Mutter, Vater, Geschwister … und sein/ihr (son/sa/ses) und wie man das Alter sagt.' },
  steps:[
    { type:'dialogue', lines:[
      { fr:'{N} veut connaître ta famille !', de:'{N} will deine Familie kennenlernen!' } ]},
    { type:'teach', deck:'famille', fr:'{N} pense à ta famille… Apprends-lui les mots !', de:'{N} denkt an deine Familie … Bring ihm die Wörter bei!' },
    { type:'choice', fr:"C'est ___ mère.", de:'Das ist meine Mutter.', options:['ma','mon','mes'], answer:'ma', hints:['<b>la</b> mère ist weiblich.'] },
    { type:'choice', fr:'Coco a un frère. ___ frère s’appelle Kiwi.', full:"Coco a un frère. Son frère s'appelle Kiwi.", de:'Coco hat einen Bruder. Der Bruder von Coco heißt Kiwi.', options:['Son','Sa','Ses'], answer:'Son',
      hints:['sein/ihr: <b>son</b> (m) · <b>sa</b> (f) · <b>ses</b> (Pl.)'], note:'<b>son</b> frère · <b>sa</b> sœur · <b>ses</b> parents = sein/ihr',
      learn:[{fr:'son / sa / ses', de:'sein/ihr', gram:'son frère · sa sœur · ses parents'}] },
    { type:'choice', fr:'Coco et ___ sœur.', de:'Coco und die Schwester von Coco.', options:['sa','son','ses'], answer:'sa', hints:['<b>la</b> sœur → ?'] },
    { type:'fill', fr:'Ma sœur ___ douze ans.', de:'Meine Schwester ist zwölf.', answer:['a'], hints:['Das Alter sagt man mit <b>avoir</b>: elle <b>…</b> douze ans'],
      note:'Alter mit avoir: elle <b>a</b> douze ans = sie ist zwölf', learn:[{fr:'Elle a douze ans.', de:'Sie ist zwölf (Jahre alt).', gram:'Alter mit avoir'}] },
    { type:'build', fr:'Construis la question !', de:'Bau die Frage: „Wie heißt deine Schwester?“', tiles:['Comment',"s'appelle",'ta','sœur','ton'], answer:"Comment s'appelle ta sœur",
      hints:['<b>la</b> sœur → <b>ta</b> sœur'], learn:[{fr:"Comment s'appelle ta sœur ?", de:'Wie heißt deine Schwester?', gram:'ton (m) · ta (f) · tes (Pl.)'}] },
    { type:'command', cmd:'patte', fr:'Dis bonjour à la famille ! Demande la patte à {N}.', de:'Sag der Familie Hallo! Bitte {N} um die Pfote.', hints:['<b>Donne la p…</b>'] },
    { type:'choice', fr:"Qui est-ce ? – C'est ___ grand-père.", de:'Wer ist das? – Das ist mein Opa.', options:['mon','ma','mes'], answer:'mon', hints:['<b>le</b> grand-père'] },
    { type:'command', cmd:'viens', fr:'Toute la famille appelle {N}. Dis-lui de venir !', de:'Die ganze Familie ruft {N}. Sag ihm, er soll kommen!', hints:['<b>Vi…</b>'] },
  ],
};
