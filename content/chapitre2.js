// Kapitel 2 – La maison  (Gegenstände, le/la, il y a, à + Artikel, Plural -aux, avoir faim)
export default {
  id: 'ch2',
  titre: 'La maison',
  titel: 'Das Zuhause',
  scene: 'salon',
  icon:'🏠', story:'{N} erkundet sein neues Zuhause: Körbchen, Napf, Sofa, Ball … Lerne die Dinge kennen und schick ihn überall hin.',
  intro: { fr:'La maison de {N}', ziel:'Du lernst die Sachen im Wohnzimmer auf Französisch (Körbchen, Napf, Ball …) und schickst {N} überall hin. Dazu: zum = au / à la, und es gibt = il y a.' },
  steps: [
    { type:'dialogue', lines:[
      { fr:'Voici la maison de {N} ! Il y a un canapé, un panier, une gamelle et une balle.',
        de:'Das ist das Zuhause von {N}! Es gibt ein Sofa, ein Körbchen, einen Napf und einen Ball.' },
      { fr:'Touche les choses pour entendre les mots !', de:'Tippe die Sachen an, um die Wörter zu hören!' },
    ]},

    { type:'object', target:'panier',
      fr:'Où est le panier ? Touche le panier !', de:'Wo ist das Körbchen? Tippe das Körbchen an!',
      hints:['Der <b>panier</b> ist lila und rund.'] },

    { type:'object', target:'gamelle',
      fr:'Et la gamelle ? Touche la gamelle !', de:'Und der Napf? Tippe den Napf an!',
      hints:['Die <b>gamelle</b> ist blau – da frisst {N}.'] },

    { type:'object', target:'balle',
      fr:'Trouve la balle !', de:'Finde den Ball!',
      hints:['Die <b>balle</b> ist klein und gelb.'] },

    { type:'command', cmd:'panier',
      fr:'{N} est fatigué. Envoie-le au panier !', de:'{N} ist müde. Schick ihn ins Körbchen!',
      hints:['aller (gehen) → du-Form: <b>va</b> …', 'à + le = <b>au</b> → <b>Va au p…</b>'] },

    { type:'choice',
      fr:'{N} va ___ fenêtre.', de:'{N} geht zum Fenster.',
      options:['au','à la','aux'], answer:'à la',
      hints:['<b>la</b> fenêtre ist weiblich.'],
      note:'à + le = <b>au</b> · à + la = <b>à la</b> · à + les = <b>aux</b>',
      learn:[{fr:'au / à la / aux', de:'zum / zur / zu den', gram:'à + le = au · à + la = à la · à + les = aux'}] },

    { type:'command', cmd:'fenetre',
      fr:'Il veut regarder dehors. Envoie-le à la fenêtre !', de:'Er will nach draußen schauen. Schick ihn zum Fenster!',
      hints:['Wie eben: <b>Va à la f…</b>'] },

    { type:'choice',
      fr:'Un animal, deux ___ !', de:'Ein Tier, zwei Tiere!',
      options:['animaux','animals','animales'], answer:'animaux',
      hints:['Wörter auf <b>-al</b> haben im Plural eine besondere Endung.'],
      note:'‑al → ‑<b>aux</b>: un animal → des animaux',
      learn:[{fr:'un animal → des animaux', de:'ein Tier → Tiere', gram:'Plural: ‑al → ‑aux'}] },

    { type:'command', cmd:'balle',
      fr:"{N} veut jouer ! Dis-lui d'apporter la balle.", de:'{N} will spielen! Sag ihm, er soll den Ball bringen!',
      hints:['apporter = bringen → du-Form: <b>Apporte …</b>'] },

    { type:'build',
      fr:'Construis la phrase !', de:'Bau den Satz: „Es gibt einen Ball auf dem Teppich.“',
      tiles:['Il','y a','une','balle','sur','le tapis','un'], answer:'Il y a une balle sur le tapis',
      hints:['il y a = es gibt · <b>la</b> balle ist weiblich → <b>une</b>'],
      note:'<b>il y a</b> = es gibt / da ist',
      learn:[{fr:'il y a', de:'es gibt / da ist', gram:'Il y a une balle. = Da ist ein Ball.'}] },

    { type:'fill',
      fr:'{N} ___ faim !', de:'{N} hat Hunger!',
      answer:['a'],
      hints:['avoir = haben: j’ai, tu as, il <b>…</b>  (1 Buchstabe)'],
      note:'avoir faim = Hunger haben · il <b>a</b> = er hat',
      learn:[{fr:'il a faim', de:'er hat Hunger', gram:"avoir: j'ai · tu as · il a"}] },

    { type:'command', cmd:'gamelle',
      fr:'Il a faim ! Envoie-le à la gamelle.', de:'Er hat Hunger! Schick ihn zum Napf.',
      hints:['<b>Va à la g…</b>'] },
  ],
};
