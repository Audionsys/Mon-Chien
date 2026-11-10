// Kapitel 3 – Les animaux  (Tiere beibringen, le/la, Plural -eaux, ne … pas)
export default {
  id:'ch3', titre:'Les animaux', titel:'Tiere', scene:'jardin',
  icon:'🌳', story:'Ab in den Garten! Vögel, Katzen, Kaninchen – {N} will alles wissen. Bring ihm die Tiernamen bei.',
  intro: { fr:'Les animaux', ziel:'Im Garten sieht {N} Tiere – aber er kennt die Wörter nicht. Du bringst ihm Tiernamen bei (mit le/la) und lernst Mehrzahl und Verneinung (ne … pas).' },
  steps:[
    { type:'dialogue', lines:[
      { fr:'{N} joue dans le jardin. Il voit des animaux !', de:'{N} spielt im Garten. Er sieht Tiere!' },
      { fr:"Mais il ne connaît pas les mots… Aide-le !", de:'Aber er kennt die Wörter nicht … Hilf ihm!' } ]},
    { type:'command', cmd:'niche', fr:"D'abord, envoie {N} à la niche !", de:'Schick {N} zuerst zu seiner Hütte!', hints:['<b>la</b> niche → <b>Va à la n…</b>'] },
    { type:'object', target:'arbre', fr:"Où est l'arbre ? Touche l'arbre !", de:'Wo ist der Baum? Tippe den Baum an!', hints:['Der Baum ist groß und grün.'] },
    { type:'teach', deck:'animaux', range:[0,4], fr:'{N} pense à des animaux… Apprends-lui les mots !', de:'{N} denkt an Tiere … Bring ihm die Wörter bei!' },
    { type:'choice', fr:'___ chat est noir.', de:'Die Katze ist schwarz.', options:['Le','La','Les'], answer:'Le',
      hints:['Achtung: Im Französischen ist die Katze <b>männlich</b>!'], note:'<b>le</b> chat – Katze ist im Französischen männlich' },
    { type:'teach', deck:'animaux', range:[4,8], fr:'Encore des animaux ! Apprends-lui les mots !', de:'Noch mehr Tiere! Bring ihm die Wörter bei!' },
    { type:'choice', fr:'Un oiseau, deux ___ !', de:'Ein Vogel, zwei Vögel!', options:['oiseaux','oiseaus','oiseau'], answer:'oiseaux',
      hints:['Wörter auf <b>‑eau</b> bekommen im Plural ein <b>x</b>.'], note:'‑eau → ‑eaux: un oiseau → des oiseaux · un cadeau → des cadeaux',
      learn:[{fr:'un oiseau → des oiseaux', de:'ein Vogel → Vögel', gram:'Plural: ‑eau → ‑eaux'}] },
    { type:'fill', fr:'Coco ___ un perroquet.', de:'Coco ist ein Papagei.', answer:['est'], hints:['être: je suis, tu es, il <b>…</b>'], note:'il/elle <b>est</b> = er/sie ist' },
    { type:'build', fr:'Construis la phrase !', de:'Bau den Satz: „Die Katze ist auf dem Sofa.“', tiles:['Le','chat','est','sur','le canapé','La'], answer:'Le chat est sur le canapé',
      hints:['sur = auf'], learn:[{fr:'sur', de:'auf', gram:'Le chat est sur le canapé.'}] },
    { type:'command', cmd:'aboie', fr:"Il y a un chat dans le jardin ! Dis à {N} d'aboyer !", de:'Da ist eine Katze im Garten! Sag {N}, er soll bellen!', hints:['<b>Ab…</b>'] },
    { type:'choice', fr:'{N} ___ aime ___ les chats.', full:"{N} n'aime pas les chats.", de:'{N} mag keine Katzen.', options:["n'… pas","ne… rien","pas… ne"], answer:"n'… pas",
      hints:['Verneinung: <b>ne … pas</b> um das Verb herum. Vor Vokal: <b>n\'</b>'], note:"ne … pas = nicht · vor Vokal: n'aime pas",
      learn:[{fr:"{N} n'aime pas les chats.", de:'{N} mag keine Katzen.', gram:"ne … pas · vor Vokal n'"}] },
  ],
};
