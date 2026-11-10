// Kapitel 4 – À table !  (Essen, avoir faim/soif, je voudrais, du/de la/des, beaucoup de)
export default {
  id:'ch4', titre:'À table !', titel:'Essen & Trinken', scene:'cuisine',
  icon:'🍳', story:'Es duftet aus der Küche! {N} hat Hunger – und du auch. Lerne Essen, Trinken und wie man höflich bestellt.',
  intro: { fr:'À table !', ziel:"In der Küche geht's ums Essen: Du bringst {N} Essenswörter bei und lernst, wie man sagt „Ich habe Hunger“ und höflich bestellt (je voudrais)." },
  steps:[
    { type:'dialogue', lines:[
      { fr:"C'est l'heure du goûter ! {N} a faim. Et toi ?", de:'Zeit für den Nachmittagssnack! {N} hat Hunger. Und du?' } ]},
    { type:'teach', deck:'manger', range:[0,5], fr:'{N} rêve de bonnes choses… Apprends-lui les mots !', de:'{N} träumt von leckeren Sachen … Bring ihm die Wörter bei!' },
    { type:'choice', fr:"J'___ faim.", full:"J'ai faim.", de:'Ich habe Hunger.', options:['ai','as','a'], answer:'ai',
      hints:["avoir: <b>j'…</b>, tu as, il a"], note:"avoir: j'<b>ai</b> · tu as · il a", learn:[{fr:"J'ai faim.", de:'Ich habe Hunger.', gram:"avoir: j'ai · tu as · il a"}] },
    { type:'fill', fr:'Tu ___ soif ?', de:'Hast du Durst?', answer:['as'], hints:['avoir mit tu: tu <b>…</b> (2 Buchstaben)'], note:'tu <b>as</b> = du hast · avoir soif = Durst haben',
      learn:[{fr:'Tu as soif ?', de:'Hast du Durst?', gram:'avoir soif = Durst haben'}] },
    { type:'teach', deck:'manger', range:[5,9], fr:'Encore à manger ! Apprends-lui les mots !', de:'Noch mehr Essen! Bring ihm die Wörter bei!' },
    { type:'choice', fr:"Je ___ un croissant, s'il te plaît.", de:'Ich hätte gern ein Croissant, bitte.', options:['voudrais','suis','as'], answer:'voudrais',
      hints:['höflich bestellen: <b>je voudrais</b> = ich hätte gern'], note:"<b>je voudrais</b> = ich hätte gern · s'il te plaît = bitte",
      learn:[{fr:'je voudrais', de:'ich hätte gern', gram:'höflicher Wunsch'}] },
    { type:'command', cmd:'gamelle', fr:'{N} a faim aussi ! Envoie-le à la gamelle.', de:'{N} hat auch Hunger! Schick ihn zum Napf.', hints:['<b>Va à la g…</b>'] },
    { type:'choice', fr:"C'est la gamelle ___ chien.", de:'Das ist der Napf des Hundes.', options:['du','de la','des'], answer:'du',
      hints:['de + le = <b>?</b>'], note:'de + le = <b>du</b> · de + la = de la · de + les = <b>des</b>',
      learn:[{fr:'du / de la / des', de:'des / der (Genitiv)', gram:'de + le = du · de + les = des'}] },
    { type:'build', fr:'Construis la phrase !', de:'Bau den Satz: „Ich hätte gern einen Apfel.“', tiles:['Je','voudrais','une','pomme','un'], answer:'Je voudrais une pomme',
      hints:['<b>la</b> pomme → <b>une</b> pomme'] },
    { type:'choice', fr:'Il y a ___ croissants !', de:'Es gibt viele Croissants!', options:['beaucoup de','beaucoup des','très'], answer:'beaucoup de',
      hints:['Nach <b>beaucoup</b> kommt nur <b>de</b> – ohne Artikel.'], note:'<b>beaucoup de</b> + Nomen = viel(e)', learn:[{fr:'beaucoup de', de:'viel(e)', gram:'beaucoup de croissants'}] },
    { type:'command', cmd:'bon', fr:'{N} a bien mangé. Dis-lui que c’est un bon chien !', de:'{N} hat brav gegessen. Sag ihm, dass er ein braver Hund ist!', hints:['<b>Bon ch…</b>'] },
  ],
};
