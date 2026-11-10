// Kapitel – Les amis (Lernstufe 1: être Sg., je/tu/il/elle, un/une, Zahlen 1–12, Befinden, Dank & Entschuldigung)
export default {
  id:'ch1c', titre:'Les nouveaux amis', titel:'Neue Freunde', scene:'salon',
  icon:'🤝', story:'{N} lernt neue Freunde kennen: Minou, die Katze von nebenan – und zählt mit Coco Leckerlis.',
  intro: { fr:'Les nouveaux amis', ziel:'{N} findet neue Freunde! Du lernst dich vorzustellen, un/une, sein (être), Zahlen bis 12 und „Entschuldigung“.' },
  steps:[
    { type:'dialogue', lines:[
      { fr:'Regarde, {N} a une nouvelle amie : Minou, le chat de la voisine !', de:'Schau, {N} hat eine neue Freundin: Minou, die Katze der Nachbarin!' },
      { fr:"Bonjour ! Je m'appelle Coco. Et toi, tu t'appelles comment ?", de:'Hallo! Ich heiße Coco. Und du, wie heißt du?' } ]},
    { type:'choice', fr:'Je ___ Coco.', full:"Je m'appelle Coco.", de:'Ich heiße Coco.', options:["m'appelle","t'appelles","s'appelle"], answer:"m'appelle",
      hints:['ich → <b>je m’…</b>'], note:"je <b>m'appelle</b> · tu <b>t'appelles</b> · il/elle <b>s'appelle</b>",
      learn:[{fr:"je m'appelle · tu t'appelles", de:'ich heiße · du heißt', gram:"s'appeler: je m'appelle · tu t'appelles · il/elle s'appelle"}] },
    { type:'choice', fr:"C'est ___ chien.", de:'Das ist ein Hund.', options:['un','une','des'], answer:'un', hints:['<b>le</b> chien ist männlich → <b>un</b>'],
      fem:{ fr:"C'est ___ chienne.", de:'Das ist eine Hündin.', options:['un','une','des'], answer:'une', hints:['<b>la</b> chienne ist weiblich → <b>une</b>'] },
      note:'<b>un</b> = ein (männlich) · <b>une</b> = eine (weiblich)', learn:[{fr:'un / une', de:'ein / eine', gram:'unbestimmter Artikel: un chien · une balle'}] },
    { type:'choice', fr:"C'est ___ balle.", de:'Das ist ein Ball.', options:['une','un','des'], answer:'une', hints:['<b>la</b> balle → <b>une</b> balle'], note:'la balle → <b>une</b> balle' },
    { type:'choice', fr:'Minou est ___ chat.', de:'Minou ist eine Katze.', options:['un','une','le'], answer:'un', hints:['Achtung: <b>le</b> chat ist im Französischen männlich!'], note:'le chat → <b>un</b> chat (männlich!)' },
    { type:'build', fr:'Dis que Minou est gentil !', de:'Bau den Satz: „Minou ist lieb.“', tiles:['Minou','est','gentil','es','suis'], answer:'Minou est gentil',
      hints:['être: il/elle <b>est</b>'], note:'il est <b>gentil</b> · elle est <b>gentille</b>', learn:[{fr:'gentil / gentille', de:'lieb, nett', gram:'il est gentil · elle est gentille'}] },
    { type:'fill', fr:'Tu ___ Lisa ? – Non, je suis Lena.', de:'Bist du Lisa? – Nein, ich bin Lena.', answer:['es'], hints:['être: je suis · tu <b>…</b>'],
      note:'être: je <b>suis</b> · tu <b>es</b> · il/elle <b>est</b>', learn:[{fr:'je suis · tu es · il/elle est', de:'ich bin · du bist · er/sie ist', gram:'être im Singular'}] },
    { type:'dialogue', lines:[
      { fr:'Coco compte les croquettes de {N}. Un, deux, trois…', de:'Coco zählt die Leckerlis von {N}. Eins, zwei, drei …' } ]},
    { type:'teach', deck:'nombres', range:[0,6], fr:'{N} pense à des chiffres… Apprends-lui les nombres !', de:'{N} denkt an Zahlen … Bring ihm die Zahlen bei!' },
    { type:'teach', deck:'nombres', range:[6,12], fr:"Et jusqu'à douze !", de:'Und bis zwölf!' },
    { type:'listen', fr:'Écoute : combien de croquettes ?', de:'Hör zu: Wie viele Leckerlis?', options:['douze','deux','onze'], answer:'douze',
      hints:['deux = 2 · onze = 11 · douze = 12'], note:'<b>douze</b> = zwölf' },
    { type:'choice', fr:'Six et cinq, ça fait ___.', de:'Sechs und fünf macht elf.', options:['onze','douze','dix'], answer:'onze', hints:['11 = <b>o…</b>'], note:'6 + 5 = <b>onze</b>' },
    { type:'command', cmd:'bonjour', fr:'Minou est là ! {N}, dis bonjour à Minou !', de:'Minou ist da! Sag {N}, sie soll Hallo sagen!', hints:['<b>Dis b…</b>'] },
    { type:'dialogue', lines:[
      { fr:'Oh ! {N} marche sur la queue de Minou… Pardon, Minou !', de:'Oh! {N} tritt Minou auf den Schwanz … Entschuldigung, Minou!' } ]},
    { type:'teach', deck:'salut', range:[8,12], fr:'Pour être poli : apprends-lui ces mots !', de:'Um höflich zu sein: Bring ihm diese Wörter bei!' },
    { type:'choice', fr:'– Comment ça va, Minou ? – ___, merci !', full:'– Comment ça va, Minou ? – Très bien, merci !', de:'– Wie geht’s, Minou? – Sehr gut, danke!', options:['Très bien','Au revoir','Pardon'], answer:'Très bien',
      hints:['sehr gut = <b>très bien</b>'], note:'<b>Très bien</b> · <b>Comme ci, comme ça</b> (so lala) · <b>Pas mal</b> (nicht schlecht)' },
    { type:'command', cmd:'assis', fr:'Et maintenant, sois sage avec Minou : assis !', de:'Und jetzt sei brav bei Minou: Sitz!', hints:['<b>Ass…</b>'] },
  ],
};
