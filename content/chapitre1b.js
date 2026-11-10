// Kapitel 2 – Bonjour !  (Begrüßen, sich vorstellen, ça va, höflich sein)
export default {
  id:'ch1b', titre:'Bonjour !', titel:'Hallo sagen', scene:'salon',
  icon:'👋', story:'{N} will Freunde finden! Coco zeigt euch, wie man auf Französisch Hallo sagt, sich vorstellt und fragt, wie es geht.',
  intro: { fr:'Bonjour, bonjour !', ziel:'Du lernst Hallo und Tschüss sagen, dich vorstellen (je m’appelle …), fragen wie es geht (ça va ?) und höflich sein (merci, s’il te plaît).' },
  steps:[
    { type:'dialogue', lines:[
      { fr:'Bonjour ! Je m’appelle Coco. Et toi, comment tu t’appelles ?', de:'Hallo! Ich heiße Coco. Und du, wie heißt du?' },
      { fr:'En France, on dit « bonjour » le matin et la journée, « bonsoir » le soir.', de:'In Frankreich sagt man „bonjour“ morgens und tagsüber, „bonsoir“ abends.' } ]},
    { type:'teach', deck:'salut', range:[0,4], fr:'{N} veut dire bonjour à tout le monde ! Apprends-lui les mots !', de:'{N} will alle begrüßen! Bring ihm die Wörter bei!' },
    { type:'command', cmd:'bonjour', fr:'Coco dit bonjour à {N}. Et {N} ? Dis-lui de dire bonjour !', de:'Coco sagt {N} Hallo. Und {N}? Sag ihm, er soll Hallo sagen!', hints:['„Sag Hallo!“ = <b>Dis bon…</b>'] },
    { type:'choice', fr:'– Ça va ? – Oui, ça ___ bien, merci !', full:'– Ça va ? – Oui, ça va bien, merci !', de:'– Wie geht’s? – Ja, mir geht’s gut, danke!', options:['va','vais','vas'], answer:'va',
      hints:['Die Frage verrät die Antwort: <b>ça va</b> …'], note:'<b>Ça va ?</b> = Wie geht’s? · <b>Ça va bien.</b> = Mir geht’s gut.', learn:[{fr:'Ça va ? – Ça va bien !', de:'Wie geht’s? – Gut!', gram:'ça va = es geht'}] },
    { type:'teach', deck:'salut', range:[4,8], fr:'Encore des mots pour être poli !', de:'Noch mehr Wörter, um höflich zu sein!' },
    { type:'fill', fr:'Je ___ Coco.', full:"Je m'appelle Coco.", de:'Ich heiße Coco.', answer:["m'appelle","m appelle","mappelle"], hints:["s'appeler: je <b>m'app…</b>"],
      note:"<b>je m'appelle</b> = ich heiße · tu t'appelles · il s'appelle", learn:[{fr:"Je m'appelle …", de:'Ich heiße …', gram:"je m'appelle · tu t'appelles · il s'appelle"}] },
    { type:'build', fr:'Construis la question !', de:'Bau die Frage: „Wie heißt du?“', tiles:['Comment','tu',"t'appelles","s'appelle"], answer:"Comment tu t'appelles",
      hints:['Mit <b>tu</b> → <b>t’appelles</b>'], learn:[{fr:"Comment tu t'appelles ?", de:'Wie heißt du?', gram:'Frage mit comment'}] },
    { type:'choice', fr:'Le soir, on dit : « ___ ! »', de:'Abends sagt man: „Guten Abend!“', options:['Bonsoir','Bonjour','Bonne nuit'], answer:'Bonsoir',
      hints:['soir = Abend'], note:'<b>bonsoir</b> = guten Abend · <b>bonne nuit</b> = gute Nacht (vor dem Schlafen)' },
    { type:'command', cmd:'patte', fr:'Pour dire bonjour, un chien donne la patte !', de:'Zum Begrüßen gibt ein Hund Pfötchen!', hints:['<b>Donne la p…</b>'] },
    { type:'dialogue', lines:[ { fr:'Super ! Maintenant, {N} connaît tout le monde. Au revoir… et à bientôt !', de:'Super! Jetzt kennt {N} alle. Tschüss … und bis bald!' } ]},
  ],
};
