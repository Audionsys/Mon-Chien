// Kapitel 1 – Il arrive !  (Name, Kommandos, être)
// {N} wird überall durch den Namen des Hundes ersetzt.
export default {
  id: 'ch1',
  titre: 'Il arrive !',
  titel: 'Dein Hund zieht ein',
  scene: 'salon',
  icon:'🛋️', story:'Ein kleiner Hund zieht bei dir ein – schüchtern, und er versteht nur Französisch. Gib ihm einen Namen und bring ihm die ersten Tricks bei!',
  intro: { fr:'Bienvenue !', willkommen:'Hier wohnt dein neuer Hund. Er versteht nur Französisch – du bringst es ihm bei und lernst dabei selbst. Keine Sorge: Du musst noch kein einziges Wort können!', ziel:'Du bekommst einen Hund, der nur Französisch versteht. Du gibst ihm einen Namen und bringst ihm die ersten Kommandos bei: kommen, sitzen, Pfote geben, Platz, aufstehen, bellen, drehen.' },
  steps: [
    { type:'command', cmd:'bonjour', open:true,
      fr:'Dis bonjour à ton chien !', de:'Sag Hallo zu deinem Hund! Auf Französisch heißt Hallo: Bonjour (sprich: bong-schuhr). Schreib es unten ins Feld – oder tippe aufs 🎤 und sag es laut.',
      hints:['Tippe unten auf <b class="fr">Dis bonjour !</b>, wenn du es nicht schreiben magst.'] },

    { type:'name' },

    { type:'tuto', tasks:[
      { wait:'floor', fr:'Touche le sol !',      de:'Tippe irgendwo auf den Boden – {N} läuft hin. (Zweimal schnell tippen: {N} rennt!)' },
      { wait:'prop',  fr:'Touche une chose !',   de:'Tippe auf einen Gegenstand, z. B. das Sofa oder den Ball – du hörst das französische Wort.' },
      { wait:'pet',   fr:'Caresse {N} !',        de:'Tippe auf {N} – so streichelst du ihn.' },
      { wait:'word',  fr:'Touche un mot !',      de:'Tippe ein unterstrichenes Wort hier in meiner Karte an – ich sage es dir vor und übersetze es.', pulse:'#bubble' },
      { wait:'help',  fr:"Demande de l'aide !",  de:'Wenn du nicht weiterweißt: Tippe auf die gelbe 💡 unten links. Probier es aus!', pulse:'#helpBtn' },
    ]},

    { type:'command', cmd:'viens', open:true,
      fr:'{N} est timide. Dis-lui de venir !', de:'{N} ist schüchtern. Sag ihm, er soll kommen!',
      hints:['„Komm!“ fängt auf Französisch mit <b>Vi…</b> an.'] },

    { type:'command', cmd:'assis',
      fr:"Maintenant, {N} doit s'asseoir.", de:'Jetzt soll {N} sich hinsetzen.',
      hints:['„Sitz!“ fängt mit <b>As…</b> an.'] },

    { type:'choice',
      fr:'{N} ___ un chien.', de:'{N} ist ein Hund.',
      options:['est','a','es'], answer:'est',
      hints:['être = sein: je suis, tu es, il/elle <b>…</b>'],
      note:'être (sein): je suis · tu es · il/elle <b>est</b>',
      learn:[{fr:'il est', de:'er ist', gram:'être: je suis · tu es · il est'}] },

    { type:'command', cmd:'patte',
      fr:'{N} veut dire bonjour. Demande-lui la patte !', de:'{N} will Hallo sagen. Bitte ihn um die Pfote!',
      hints:['„Gib Pfötchen!“ = <b>Donne la p…</b>'] },

    { type:'command', cmd:'couche',
      fr:'{N} est fatigué. Il veut se coucher.', de:'{N} ist müde. Er will sich hinlegen.',
      hints:['„Platz!“ fängt mit <b>Cou…</b> an.'] },

    { type:'command', cmd:'debout',
      fr:'Allez ! {N} doit se lever.', de:'Los geht’s! {N} soll aufstehen.',
      hints:['„Steh auf!“ fängt mit <b>Deb…</b> an.'] },

    { type:'fill',
      fr:'Tu ___ un bon chien, {N} !', de:'Du bist ein braver Hund, {N}!',
      answer:['es'],
      hints:['être mit <b>tu</b>: tu …  (2 Buchstaben)'],
      note:'tu <b>es</b> = du bist  ·  il est = er ist',
      learn:[{fr:'tu es', de:'du bist', gram:'être: je suis · tu es · il est'}] },

    { type:'command', cmd:'aboie',
      fr:'{N} veut dire bonjour à Coco… en chien !', de:'{N} will Coco begrüßen … auf Hundeart!',
      hints:['aboyer = bellen. „Bell!“ fängt mit <b>Ab…</b> an.'] },

    { type:'command', cmd:'tourne',
      fr:'Et maintenant, une petite danse : il doit tourner !', de:'Und jetzt ein kleiner Tanz: Er soll sich drehen!',
      hints:['tourner = drehen. „Dreh dich!“ fängt mit <b>Tou…</b> an.'] },

    { type:'build',
      fr:'Construis la phrase !', de:'Bau den Satz: „Mein Hund heißt {N}.“',
      tiles:['Mon','chien',"s'appelle",'{N}','Ma'], answer:"Mon chien s'appelle {N}",
      hints:['mon = mein (vor männlichen Wörtern: <b>le</b> chien)'],
      note:'<b>mon</b> chien (m) · <b>ma</b> maison (f)',
      learn:[{fr:"Mon chien s'appelle {N}.", de:'Mein Hund heißt {N}.', gram:"mon (m) / ma (f) · s'appeler → il s'appelle"}] },
  ],
};
