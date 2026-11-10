// Kapitel 7 – Couleurs & nombres  (Farben, Zahlen, Adjektiv-Angleichung, combien de)
export default {
  id:'ch7', titre:'Couleurs et nombres', titel:'Farben & Zahlen', scene:'jardin',
  icon:'🎨', story:'Der große Abschluss im Garten: Farben, Zahlen – und eine Show, in der {N} alles zeigt, was er kann!',
  intro: { fr:'Couleurs et nombres', ziel:'Im Garten zählt {N} und sieht Farben: Du lernst Farben, Zahlen bis 12 und dass Adjektive sich anpassen (vert → verte).' },
  steps:[
    { type:'dialogue', lines:[
      { fr:'{N} est noir. Coco est vert. Et toi, tu aimes quelle couleur ?', de:'{N} ist schwarz. Coco ist grün. Und welche Farbe magst du?' } ]},
    { type:'teach', deck:'couleurs', fr:'{N} voit des couleurs partout ! Apprends-lui les mots !', de:'{N} sieht überall Farben! Bring ihm die Wörter bei!' },
    { type:'choice', fr:'{N} est ___.', de:'{N} ist schwarz.', options:['noir','vert','jaune'], answer:'noir', hints:['schwarz = <b>n…</b>'],
      fem:{ options:['noire','verte','jaune'], answer:'noire', hints:['schwarz = <b>n…</b> – und weil sie ein Mädchen ist, mit <b>-e</b> am Ende!'] } },
    { type:'choice', fr:'La pomme est ___.', de:'Der Apfel ist grün.', options:['verte','vert','vertes'], answer:'verte',
      hints:['<b>la</b> pomme ist weiblich → Adjektiv bekommt ein <b>‑e</b>'], note:'Adjektiv passt sich an: vert (m) → <b>verte</b> (f)',
      learn:[{fr:'vert → verte', de:'grün (m → f)', gram:'weibliches Adjektiv: + e'}] },
    { type:'teach', deck:'nombres', fr:'{N} compte ses croquettes ! Apprends-lui les nombres !', de:'{N} zählt sein Trockenfutter! Bring ihm die Zahlen bei!' },
    { type:'choice', fr:'Deux et trois font ___.', full:'Deux et trois font cinq.', de:'Zwei und drei macht fünf.', options:['cinq','six','quatre'], answer:'cinq', hints:['2 + 3 = 5'] },
    { type:'fill', fr:'{N} a ___ pattes.', de:'{N} hat vier Pfoten.', answer:['quatre','4'], hints:['4 = <b>qu…</b>'] },
    { type:'choice', fr:'___ balles ?', full:'Combien de balles ?', de:'Wie viele Bälle?', options:['Combien de','Combien des','Quel'], answer:'Combien de',
      hints:['wie viele = <b>combien de</b>'], note:'<b>combien de</b> + Nomen = wie viel(e)', learn:[{fr:'combien de', de:'wie viel(e)', gram:'Combien de balles ?'}] },
    { type:'command', cmd:'balle', fr:"Joue avec {N} ! Dis-lui d'apporter la balle.", de:'Spiel mit {N}! Sag ihm, er soll den Ball bringen.', hints:['<b>Apporte …</b>'] },
    { type:'command', cmd:'saute', fr:'Et pour finir : un grand saut de joie !', de:'Und zum Schluss: ein großer Freudensprung!', hints:['sauter = springen → <b>Sau…</b>'] },
  ],
};
