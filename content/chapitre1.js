// Kapitel 1 – Il arrive !  (Ankunft, erste Kommandos, Name)
// Deutsch erzählt, Französisch kommt «eingewoben» dazu. {N} = Name des Hundes.
export default {
  id: 'ch1',
  titre: 'Il arrive !',
  titel: 'Dein Hund zieht ein',
  scene: 'salon',
  icon:'🛋️', story:'Ein Sturm weht Coco, einen Papagei aus Paris, in deinen Garten – genau als dein neuer Hund einzieht. Und der versteht nur Französisch!',
  intro: { fr:'Bienvenue !', willkommen:'Hier wohnt dein neuer Hund. Er versteht nur Französisch – du bringst es ihm bei und lernst dabei selbst. Keine Sorge: Du musst noch kein einziges Wort können!', ziel:'Coco, ein Papagei aus Paris, landet bei dir. Du gibst deinem Hund einen Namen und lernst die ersten Kommandos: kommen, sitzen, Platz, aufstehen, Pfote geben, bellen, drehen.' },
  steps: [
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Hilfe, was für ein Sturm! … Oh – hallo! Ich bin Coco, ein Papagei aus «Paris». Der Wind hat mich bis zu dir geweht.' },
      { who:'Coco', erz:'Und wer ist das da? Ein neuer Hund! Aber Achtung: Dieser Hund versteht nur Französisch. Kein einziges Wort Deutsch!' },
      { who:'Coco', erz:'Keine Sorge – ich bringe euch beiden Französisch bei, Wort für Wort. Und später hilfst du mir, nach Hause zu kommen. Abgemacht?' } ]},

    { type:'command', cmd:'bonjour', open:true,
      erz:'Erstes Wort: «Bonjour» (sprich: bong-schuhr) heißt <i>Hallo</i>. Sag es deinem Hund – schreib es unten ins Feld oder tippe aufs 🎤.',
      hints:['Tippe unten auf <b class="fr">Dis bonjour !</b>, wenn du es nicht schreiben magst.'] },

    { type:'name' },

    { type:'tuto', tasks:[
      { wait:'floor', fr:'Touche le sol !',      de:'Tippe irgendwo auf den Boden – {N} läuft hin. (Zweimal schnell tippen: {N} rennt!)' },
      { wait:'prop',  fr:'Touche une chose !',   de:'Tippe auf einen Gegenstand, z. B. das Sofa oder den Ball – du hörst das französische Wort.' },
      { wait:'pet',   fr:'Caresse {N} !',        de:'Tippe auf {N} – so streichelst du ihn.' },
      { wait:'word',  fr:'Touche un mot !',      de:'Tippe ein französisches Wort hier in meiner Karte an – ich sage es dir vor und übersetze es.', pulse:'#bubble' },
      { wait:'help',  fr:"Demande de l'aide !",  de:'Wenn du nicht weiterweißt: Tippe auf die gelbe 💡 unten links. Probier es aus!', pulse:'#helpBtn' },
    ]},

    { type:'command', cmd:'viens', open:true,
      erz:'{N} ist noch schüchtern und versteckt sich. Ruf ihn zu dir: «Viens !» (sprich: wjäng) heißt <i>Komm!</i>' },

    { type:'command', cmd:'assis', open:true,
      erz:'Super! Jetzt soll {N} sich hinsetzen: «Assis !» (sprich: a-ssi) heißt <i>Sitz!</i>' },

    { type:'command', cmd:'viens', recall:true,
      erz:'Huch, {N} schnüffelt schon wieder in der Ecke herum. Weißt du noch, wie du ihn rufst?',
      hints:['„Komm!“ fängt mit <b class="fr">Vi…</b> an.'] },

    { type:'command', cmd:'couche', open:true,
      erz:'Der Umzug war anstrengend – {N} ist müde. «Couché !» (sprich: ku-schee) heißt <i>Platz!</i>' },

    { type:'command', cmd:'debout', open:true,
      erz:'Genug ausgeruht! «Debout !» (sprich: dö-buh) heißt <i>Steh auf!</i>' },

    { type:'command', cmd:'assis', recall:true,
      erz:'Und jetzt ganz ohne Hilfe: Lass {N} wieder sitzen!',
      hints:['„Sitz!“ fängt mit <b class="fr">As…</b> an.'] },

    { type:'command', cmd:'patte', open:true,
      erz:'Hunde begrüßen mit der Pfote. «Donne la patte !» heißt <i>Gib Pfötchen!</i> – «la patte» ist die Pfote.' },

    { type:'command', cmd:'aboie', open:true,
      erz:'{N} will mich begrüßen – auf Hundeart! «Aboie !» (sprich: a-bwa) heißt <i>Bell!</i>' },

    { type:'command', cmd:'tourne', open:true,
      erz:'Zum Schluss ein Tänzchen: «Tourne !» (sprich: turn) heißt <i>Dreh dich!</i>' },

    { type:'rappel', n:3, erz:'Mal sehen, was du dir schon gemerkt hast! Keine Angst – Fehler sind hier erlaubt.' },

    { type:'choice', erz:'Jetzt ein ganzer Satz: «{N} est un chien.» heißt <i>{N} ist ein Hund.</i> Welches Wort bedeutet <i>ist</i>?',
      fr:'{N} est un chien.', options:['est','un','chien'], answer:'est',
      hints:['{N} = {N} · <b class="fr">un</b> = ein · <b class="fr">chien</b> = Hund'],
      note:'<b>être</b> = sein · il/elle <b>est</b> = er/sie ist',
      learn:[{fr:'il est', de:'er ist', gram:'être: je suis · tu es · il est'}] },

    { type:'build', erz:'Erzähl mir auf Französisch, wie dein Hund heißt: «Mon chien s\'appelle {N}.» heißt <i>Mein Hund heißt {N}.</i> Bau den Satz!',
      tiles:['Mon','chien',"s'appelle",'{N}','Ma'], answer:"Mon chien s'appelle {N}",
      fem:{ erz:'Erzähl mir auf Französisch, wie deine Hündin heißt: «Ma chienne s\'appelle {N}.» heißt <i>Meine Hündin heißt {N}.</i> Bau den Satz!', tiles:['Ma','chienne',"s'appelle",'{N}','Mon'], answer:"Ma chienne s'appelle {N}" },
      hints:['Fang mit <b class="fr">Mon</b> (= mein) an.'],
      note:'<b>mon</b> chien (männlich) · <b>ma</b> chienne (weiblich)',
      learn:[{fr:"Mon chien s'appelle {N}.", de:'Mein Hund heißt {N}.', gram:"mon (m) / ma (f) · s'appeler → il s'appelle"}] },

    { type:'dialogue', lines:[
      { who:'Coco', erz:'«Bravo !» Du hast heute schon zehn französische Wörter gelernt – und {N} versteht sie alle.' },
      { who:'Coco', erz:'Du kannst {N} übrigens jederzeit Kommandos geben, auch ohne Aufgabe. Probier\'s einfach aus! «À bientôt !» – <i>Bis bald!</i>' } ]},
  ],
};
