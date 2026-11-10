// Kapitel – Au collège  (Klassenzimmer, être, est-ce que, quelle heure, Schulsachen)
export default {
  id:'ch9', titre:'Au collège', titel:'Im Klassenzimmer', scene:'classe',
  icon:'🏫', story:'{N} schleicht sich mit in die Schule! Im Klassenzimmer gibt es eine Tafel, Schulbänke, eine Frankreichkarte … und der Unterricht ist ganz schön lang.',
  intro: { fr:'Chut ! On est en classe.', ziel:'Du lernst Wörter aus dem Klassenzimmer, die Formen von être (je suis, nous sommes …), Fragen mit „est-ce que“ und die Uhrzeit.' },
  steps:[
    { type:'dialogue', lines:[
      { fr:'Oh là là ! {N} est dans la salle de classe !', de:'Oje! {N} ist im Klassenzimmer!' },
      { fr:'Chut… le prof arrive !', de:'Pssst … der Lehrer kommt!' } ]},
    { type:'object', target:'tableaunoir', fr:'Touche le tableau !', de:'Tippe die Tafel an!', hints:['Die Tafel ist grün und hängt vorne an der Wand.'] },
    { type:'teach', deck:'ecole', range:[0,4], fr:'{N} regarde les affaires d’école… Apprends-lui les mots !', de:'{N} schaut sich die Schulsachen an … Bring ihm die Wörter bei!' },
    { type:'choice', fr:'Nous ___ en classe.', de:'Wir sind in der Klasse.', options:['sommes','êtes','sont'], answer:'sommes',
      hints:['être: je suis, tu es, il est, <b>nous …</b>'], note:'être: je suis · tu es · il est · <b>nous sommes</b> · vous êtes · ils sont',
      learn:[{fr:'nous sommes', de:'wir sind', gram:'être: nous sommes · vous êtes · ils sont'}] },
    { type:'command', cmd:'assis', fr:'Le prof dit : « Tout le monde s’assoit ! » Et {N} ?', de:'Der Lehrer sagt: „Alle setzen sich!“ Und {N}?', hints:['<b>As…</b>'] },
    { type:'choice', fr:'___ heure est-il ?', full:'Quelle heure est-il ?', de:'Wie spät ist es?', options:['Quelle','Quel','Qui'], answer:'Quelle',
      hints:['<b>l\'heure</b> ist weiblich → quel<b>le</b>'], note:'<b>Quelle heure est-il ?</b> = Wie spät ist es? · Il est dix heures.',
      learn:[{fr:'Quelle heure est-il ?', de:'Wie spät ist es?', gram:'quel (m) / quelle (f)'}] },
    { type:'teach', deck:'ecole', range:[4,8], fr:'Encore des mots de l’école !', de:'Noch mehr Schulwörter!' },
    { type:'build', fr:'Construis la question !', de:'Bau die Frage: „Hast du einen Kuli?“', tiles:['Est-ce que','tu','as','un','stylo','une'], answer:'Est-ce que tu as un stylo',
      hints:['Fragen beginnen oft mit <b>Est-ce que</b>'], learn:[{fr:'Est-ce que tu as un stylo ?', de:'Hast du einen Kuli?', gram:'Frage mit est-ce que'}] },
    { type:'command', cmd:'tableau', fr:'Le prof appelle {N} au tableau !', de:'Der Lehrer ruft {N} an die Tafel!', hints:['à + le = <b>au</b> → <b>Va au t…</b>'] },
    { type:'command', cmd:'dors', fr:'La leçon est très longue… {N} s’endort !', de:'Die Stunde ist sehr lang … {N} schläft ein!', hints:['dormir = schlafen → <b>Dors !</b>'] },
  ],
};
