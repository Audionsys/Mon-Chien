// Kapitel 2 – Bonjour !  (Begrüßen, sich vorstellen, ça va, höflich sein)
export default {
  id:'ch1b', titre:'Bonjour !', titel:'Hallo sagen', scene:'salon',
  icon:'👋', story:'{N} will Freunde finden! Coco zeigt euch die Zauberwörter: Hallo, Wie geht\'s?, Ich heiße …, Danke.',
  intro: { fr:'Bonjour, bonjour !', willkommen:'{N} will Freunde finden. Dafür braucht man ein paar Zauberwörter – ich zeige sie dir!', ziel:'Du lernst Hallo und Tschüss sagen, dich vorstellen (je m’appelle …), fragen wie es geht (ça va ?) und höflich sein (merci, s’il te plaît).' },
  steps:[
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Wer Freunde finden will, muss zuerst grüßen. Weißt du noch? «Bonjour» heißt <i>Hallo</i> – tagsüber.' },
      { who:'Coco', erz:'Unter Freunden geht es lockerer: «Salut !» heißt auch <i>Hallo!</i> – und sogar <i>Tschüss!</i>' } ]},
    { type:'command', cmd:'bonjour', recall:true, erz:'Da kommt jemand am Fenster vorbei! Sag {N}, er soll Hallo sagen.', hints:['„Sag Hallo!“ = <b class="fr">Dis bon…</b>'] },
    { type:'teach', deck:'salut', range:[0,4], fr:'Les mots magiques !', de:'Die Zauberwörter: Tippe die Karten an, hör zu, und bring sie {N} bei!' },
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Nach dem Grüßen fragt man, wie es geht: «Ça va ?» (sprich: ssa wa) = <i>Wie geht\'s?</i>' },
      { who:'Coco', erz:'Und das Tolle: Die Antwort ist fast dasselbe! «Ça va !» oder «Ça va bien !» = <i>Mir geht\'s gut!</i>' } ]},
    { type:'choice', erz:'Ich frage dich: «Ça va ?» – Was antwortest du?', options:['Ça va bien, merci !','Au revoir !','Bonsoir !'], answer:'Ça va bien, merci !',
      hints:['Die Antwort wiederholt die Frage: <b class="fr">ça va</b> …'], note:'<b>Ça va ?</b> = Wie geht’s? · <b>Ça va bien, merci !</b> = Gut, danke!', learn:[{fr:'Ça va ? – Ça va bien !', de:'Wie geht’s? – Gut!', gram:'ça va = es geht'}] },
    { type:'teach', deck:'salut', range:[4,8], fr:'Encore des mots !', de:'Noch mehr Wörter, um höflich zu sein!' },
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Wenn du jemanden kennenlernst, sagst du deinen Namen: «Je m\'appelle Coco.» = <i>Ich heiße Coco.</i>' } ]},
    { type:'choice', erz:'Stell dich vor! Was bedeutet <i>Ich heiße …</i>?', options:["Je m'appelle …","Ça va …","Au revoir …"], answer:"Je m'appelle …",
      hints:['<b class="fr">je</b> = ich'], note:"<b>je m'appelle</b> = ich heiße", learn:[{fr:"Je m'appelle …", de:'Ich heiße …', gram:"je m'appelle · tu t'appelles · il s'appelle"}] },
    { type:'build', erz:'Und so fragst du jemanden nach dem Namen: «Comment tu t\'appelles ?» = <i>Wie heißt du?</i> Bau die Frage!', tiles:['Comment','tu',"t'appelles","s'appelle"], answer:"Comment tu t'appelles",
      hints:['<b class="fr">comment</b> = wie · mit <b class="fr">tu</b> → <b class="fr">t’appelles</b>'], learn:[{fr:"Comment tu t'appelles ?", de:'Wie heißt du?', gram:'Frage mit comment'}] },
    { type:'choice', erz:'Abends sagt man nicht «Bonjour» … sondern?', options:['Bonsoir','Bonjour','Bonne nuit'], answer:'Bonsoir',
      hints:['«soir» = Abend'], note:'<b>bonsoir</b> = guten Abend · <b>bonne nuit</b> = gute Nacht (vor dem Schlafen)' },
    { type:'rappel', n:3, erz:'Kurze Wiederholung – {N} will wissen, ob du noch fit bist!' },
    { type:'command', cmd:'patte', recall:true, erz:'Zum Abschied gibt {N} Pfötchen. Weißt du noch, wie das geht?', hints:['<b class="fr">Donne la p…</b>'] },
    { type:'dialogue', lines:[ { who:'Coco', erz:'Super! Jetzt kann {N} grüßen, sich vorstellen und höflich sein. «Au revoir !» = <i>Auf Wiedersehen!</i> … und «À bientôt !» = <i>Bis bald!</i>' } ]},
  ],
};
