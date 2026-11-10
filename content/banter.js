// =============================================================
//  NECKEREIEN – Coco und der Hund kabbeln sich (freundschaftlich!)
//  when : 'idle' (zwischendurch) | 'oops' (nach einem Fehler) | 'bravo' (nach Erfolg) | 'betise' (nach Quatsch)
//  dog  : Reaktion des Hundes: 'bark' | 'tilt' | 'sniff' | 'happy' | 'ignore' | 'growl'
//  back : Coco antwortet nochmal (optional)
// =============================================================
export const BANTER = [
  { when:'idle',  fr:'Oh là là, {N}… tu es un chien ou une pomme de terre ?', de:'Oh je, {N} … bist du ein Hund oder eine Kartoffel?', dog:'growl', back:{fr:'Ha ha ! Une pomme de terre !', de:'Haha! Eine Kartoffel!'} },
  { when:'idle',  fr:'Moi, je parle français. Toi, tu aboies !', de:'Ich spreche Französisch. Du bellst bloß!', dog:'bark' },
  { when:'idle',  fr:'Je suis plus intelligent que toi, {N} !', de:'Ich bin schlauer als du, {N}!', dog:'bark', back:{fr:'Pas de bruit, s’il te plaît !', de:'Bitte keinen Lärm!'} },
  { when:'idle',  fr:'Tu sens le fromage, {N} !', de:'Du riechst nach Käse, {N}!', dog:'sniff', back:{fr:'Oui, oui… le fromage !', de:'Jaja … nach Käse!'} },
  { when:'idle',  fr:'Attention ! Ici, le chef, c’est Coco !', de:'Achtung! Hier ist Coco der Chef!', dog:'tilt' },
  { when:'idle',  fr:'{N}, tu as encore faim ? Tu manges tout le temps !', de:'{N}, hast du schon wieder Hunger? Du isst die ganze Zeit!', dog:'happy' },
  { when:'idle',  fr:'Regarde-moi : je vole ! Et toi ? Rien !', de:'Schau mich an: Ich fliege! Und du? Nichts!', dog:'growl' },
  { when:'idle',  fr:'Tes oreilles sont très grandes, {N} !', de:'Deine Ohren sind sehr groß, {N}!', dog:'tilt', back:{fr:'Mais elles sont jolies.', de:'Aber sie sind hübsch.'} },
  { when:'oops',  fr:'Ha ha ! {N} ne comprend rien !', de:'Haha! {N} versteht gar nichts!', dog:'growl' },
  { when:'oops',  fr:'Oh non… même un poisson est plus rapide !', de:'Oh nein … sogar ein Fisch ist schneller!', dog:'bark' },
  { when:'oops',  fr:'Pas grave ! Moi aussi, je suis parfois bête. Non… jamais !', de:'Nicht schlimm! Ich bin auch manchmal doof. Nein … nie!', dog:'tilt' },
  { when:'bravo', fr:'Bravo… même un chien peut apprendre !', de:'Bravo … sogar ein Hund kann lernen!', dog:'growl', back:{fr:'Bon, d’accord : tu es un bon chien.', de:'Na gut: Du bist ein braver Hund.'} },
  { when:'bravo', fr:'Pas mal, {N} ! Mais moi, je suis encore meilleur.', de:'Nicht schlecht, {N}! Aber ich bin noch besser.', dog:'bark' },
  { when:'bravo', fr:'Tu vois ? Avec Coco, on apprend tout !', de:'Siehst du? Mit Coco lernt man alles!', dog:'happy' },
  { when:'betise',fr:'Quel chien ! Moi, je suis un perroquet parfait.', de:'Was für ein Hund! Ich bin ein perfekter Papagei.', dog:'growl' },
  { when:'betise',fr:'Oh là là, quel bazar !', de:'Oje, was für ein Durcheinander!', dog:'tilt' },
];
