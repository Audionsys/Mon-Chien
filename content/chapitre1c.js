// Kapitel 3 – Les nouveaux amis (être Sg., un/une, Zahlen 1–12, Entschuldigung)
export default {
  id:'ch1c', titre:'Les nouveaux amis', titel:'Neue Freunde', scene:'salon',
  icon:'🤝', story:'{N} trifft Minou, die Katze von nebenan – und Coco zählt mit euch Leckerlis.',
  intro: { fr:'Les nouveaux amis', willkommen:'Heute bekommt {N} Besuch von nebenan. Mal sehen, ob die beiden Freunde werden …', ziel:'Du lernst un/une (ein/eine), „sein“ (je suis, tu es, il est), die Zahlen bis 12 und „Entschuldigung“.' },
  steps:[
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Psst – schau mal zum Fenster! Da sitzt eine Katze. Sie heißt Minou und wohnt bei der Nachbarin.' },
      { who:'Minou', erz:'«Bonjour !» … «Je m\'appelle Minou.»' },
      { who:'Coco', erz:'Hast du verstanden? Sie hat gesagt, wie sie heißt. Das kennst du schon aus dem letzten Kapitel!' } ]},
    { type:'command', cmd:'bonjour', recall:true, erz:'Höflich sein! Sag {N}, er soll Minou Hallo sagen.', hints:['<b class="fr">Dis b…</b>'] },
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Im Französischen hat jedes Ding ein Geschlecht – wie im Deutschen. «un» heißt <i>ein</i>, «une» heißt <i>eine</i>.' },
      { who:'Coco', erz:'«un chien» = <i>ein Hund</i>. «une balle» = <i>ein Ball</i> … Achtung: Der Ball ist auf Französisch weiblich! Darum lernst du Wörter immer mit «un» oder «une».' } ]},
    { type:'choice', erz:'Das da ist ein Hund. Welches Wort fehlt? «C\'est ___ chien.»', fr:"C'est ___ chien.", de:'Das ist ein Hund.', options:['un','une'], answer:'un', hints:['Schau oben: <b class="fr">un chien</b>'],
      fem:{ erz:'Das da ist eine Hündin. Welches Wort fehlt? «C\'est ___ chienne.»', fr:"C'est ___ chienne.", de:'Das ist eine Hündin.', options:['un','une'], answer:'une', hints:['<b class="fr">la chienne</b> ist weiblich → <b class="fr">une</b>'] },
      note:'<b>un</b> = ein (männlich) · <b>une</b> = eine (weiblich)', learn:[{fr:'un / une', de:'ein / eine', gram:'unbestimmter Artikel: un chien · une balle'}] },
    { type:'choice', erz:'Und der Ball? «C\'est ___ balle.»', fr:"C'est ___ balle.", de:'Das ist ein Ball.', options:['une','un'], answer:'une', hints:['Der Ball ist auf Französisch weiblich: <b class="fr">une balle</b>'], note:'<b>une</b> balle – auf Französisch weiblich!', learn:[{fr:'une balle', de:'ein Ball', gram:'la balle (weiblich)'}] },
    { type:'choice', erz:'Und Minou? Die Katze heißt auf Französisch «le chat» – männlich! Also: «Minou est ___ chat.»', fr:'Minou est ___ chat.', de:'Minou ist eine Katze.', options:['un','une'], answer:'un', hints:['<b class="fr">le chat</b> → <b class="fr">un chat</b>'], note:'le chat → <b>un</b> chat', learn:[{fr:'un chat', de:'eine Katze', gram:'le chat (männlich)'}] },
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Jetzt das wichtigste Verb überhaupt: <i>sein</i>. Du kennst schon «il est» = <i>er ist</i>.' },
      { who:'Coco', erz:'Dazu kommen «je suis» = <i>ich bin</i> und «tu es» = <i>du bist</i>. Lies es ruhig zweimal laut!' } ]},
    { type:'choice', erz:'Minou fragt mich: «Tu es un perroquet ?» – <i>Bist du ein Papagei?</i> Ich antworte: «Oui, je ___ un perroquet.»', fr:'Oui, je ___ un perroquet.', de:'Ja, ich bin ein Papagei.', options:['suis','es','est'], answer:'suis',
      hints:['<b class="fr">je</b> = ich → ich <b>bin</b>'], note:'je <b>suis</b> · tu <b>es</b> · il/elle <b>est</b>', learn:[{fr:'je suis', de:'ich bin', gram:'être: je suis · tu es · il est'}] },
    { type:'build', erz:'Minou ist nett! «Minou est gentil.» = <i>Minou ist lieb.</i> Bau den Satz!', tiles:['Minou','est','gentil','suis'], answer:'Minou est gentil',
      hints:['er/sie <b>ist</b> = <b class="fr">est</b>'], note:'il est <b>gentil</b> · elle est <b>gentille</b>', learn:[{fr:'gentil', de:'lieb, nett', gram:'il est gentil · elle est gentille'}] },
    { type:'fill', erz:'Jetzt du – sag {N}, dass er ein guter Hund ist: «Tu ___ un bon chien !» Schreib das fehlende Wort.', fr:'Tu ___ un bon chien !', de:'Du bist ein guter Hund!', answer:['es'],
      hints:['<b class="fr">tu</b> = du → du bist = <b class="fr">tu e…</b>'], note:'tu <b>es</b> = du bist', learn:[{fr:'tu es', de:'du bist', gram:'être: je suis · tu es · il est'}] },
    { type:'rappel', n:3, erz:'Minou schaut zu – zeig ihr, was {N} schon kann!' },
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Zeit für Leckerlis! Ich zähle: «un, deux, trois» – <i>eins, zwei, drei</i>. Zahlen sind überall: beim Einkaufen, an der Uhr, im Zug nach Paris …' } ]},
    { type:'teach', deck:'nombres', range:[0,6], fr:'Un, deux, trois…', de:'Die Zahlen 1 bis 6: Tippe die Karten an und hör genau hin!' },
    { type:'listen', erz:'Hör zu! Wie viele Leckerlis bekommt {N}?', fr:'trois', options:['trois','deux','six'], answer:'trois',
      hints:['deux = 2 · trois = 3 · six = 6'], note:'<b>trois</b> = drei' },
    { type:'teach', deck:'nombres', range:[6,12], fr:"… jusqu'à douze !", de:'Und weiter bis zwölf!' },
    { type:'listen', erz:'Minou will auch welche. Wie viele sind noch in der Dose?', fr:'douze', options:['douze','deux','onze'], answer:'douze',
      hints:['deux = 2 · onze = 11 · douze = 12'], note:'<b>douze</b> = zwölf' },
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Oh nein! {N} ist Minou auf den Schwanz getreten … Da sagt man: «Pardon !» = <i>Entschuldigung!</i>' },
      { who:'Minou', erz:'«Ça va, ça va …» – <i>Schon gut, schon gut …</i>' } ]},
    { type:'teach', deck:'salut', range:[8,12], fr:'Pardon !', de:'Wörter, um sich zu entschuldigen und höflich zu sein:' },
    { type:'command', cmd:'assis', recall:true, erz:'Damit {N} nicht noch mal drauftritt: Lass ihn ganz brav sitzen!', hints:['<b class="fr">Ass…</b>'] },
    { type:'dialogue', lines:[
      { who:'Coco', erz:'Seht ihr – jetzt sind {N} und Minou Freunde. «Ce sont des amis !» = <i>Das sind Freunde!</i>' },
      { who:'Coco', erz:'Und weißt du was? Ich vermisse Paris ein bisschen … Aber dazu später mehr. «À bientôt !»' } ]},
  ],
};
