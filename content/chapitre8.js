// Kapitel – Dans la rue  (Paris: Wegbeschreibung, Bäckerei, Preise, au/à la)
export default {
  id:'ch8', titre:'Dans la rue', titel:'Unterwegs in Paris', scene:'rue',
  icon:'🥖', story:'Ab durchs Gartentor – {N} entdeckt die Straße! Bäckerei, Café, Métro und ganz hinten der Eiffelturm. Zeig ihm den Weg und kauft zusammen ein Baguette.',
  intro: { fr:'Bienvenue dans la rue !', ziel:'Du lernst Wörter für die Stadt, den Weg beschreiben (à gauche, à droite, tout droit) und höflich in der Bäckerei bestellen (je voudrais …).' },
  steps:[
    { type:'dialogue', lines:[
      { fr:'Voici la rue ! Il y a une boulangerie, un café et le métro.', de:'Das ist die Straße! Es gibt eine Bäckerei, ein Café und die U-Bahn.' },
      { fr:'Et là-bas, regarde : la tour Eiffel !', de:'Und da hinten, schau: der Eiffelturm!' } ]},
    { type:'teach', deck:'rue', range:[0,4], fr:'{N} veut connaître la ville ! Apprends-lui les mots !', de:'{N} will die Stadt kennenlernen! Bring ihm die Wörter bei!' },
    { type:'object', target:'boulangerie', fr:'Où est la boulangerie ? Touche la boulangerie !', de:'Wo ist die Bäckerei? Tippe die Bäckerei an!', hints:['Da gibt es Baguettes und Croissants im Schaufenster.'] },
    { type:'choice', fr:'La boulangerie est ___ du café.', full:'La boulangerie est à gauche du café.', de:'Die Bäckerei ist links vom Café.', options:['à gauche','à droite','tout droit'], answer:'à gauche',
      hints:['Schau ins Bild: Die Bäckerei ist auf der linken Seite.'], note:'<b>à gauche</b> = links · <b>à droite</b> = rechts · <b>tout droit</b> = geradeaus',
      learn:[{fr:'à gauche / à droite / tout droit', de:'links / rechts / geradeaus', gram:'Wegbeschreibung'}] },
    { type:'command', cmd:'droite', fr:'{N} doit aller à droite. Dis-lui !', de:'{N} soll nach rechts gehen. Sag es ihm!', hints:['<b>Va à dr…</b>'] },
    { type:'command', cmd:'boulangerie', fr:'On a faim ! Envoie {N} à la boulangerie.', de:'Wir haben Hunger! Schick {N} zur Bäckerei.', hints:['<b>Va à la b…</b>'] },
    { type:'choice', fr:"Bonjour ! Je ___ une baguette, s'il vous plaît.", de:'Guten Tag! Ich hätte gern ein Baguette, bitte.', options:['voudrais','veux pas','suis'], answer:'voudrais',
      hints:['Höflich bestellen: <b>je voudrais</b>'], note:"<b>s'il vous plaît</b> = bitte (höflich, zu Erwachsenen) · s'il te plaît = bitte (zu Freunden)" },
    { type:'listen', fr:'Écoute : ça coûte combien ?', de:'Hör zu: Wie viel kostet es?', options:['un euro','deux euros','douze euros'], answer:'deux euros',
      hints:['deux = 2 · douze = 12'], note:'<b>Ça coûte deux euros.</b> = Das kostet zwei Euro.' },
    { type:'teach', deck:'rue', range:[4,8], fr:'Encore des mots de la ville !', de:'Noch mehr Stadt-Wörter!' },
    { type:'command', cmd:'cafe', fr:'Maintenant, un petit café ! Envoie {N} au café.', de:'Jetzt einen kleinen Kaffee! Schick {N} zum Café.', hints:['à + le = <b>au</b> → <b>Va au c…</b>'] },
    { type:'build', fr:'Construis la question !', de:'Bau die Frage: „Wo ist die U-Bahn?“', tiles:['Où','est','le','métro','la'], answer:'Où est le métro',
      hints:['wo = <b>où</b>'], learn:[{fr:'Où est le métro ?', de:'Wo ist die U-Bahn?', gram:'Frage mit où'}] },
    { type:'command', cmd:'metro', fr:'On rentre ? Envoie {N} au métro !', de:'Fahren wir heim? Schick {N} zur U-Bahn!', hints:['<b>Va au m…</b>'] },
  ],
};
