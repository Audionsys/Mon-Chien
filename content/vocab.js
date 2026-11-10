// =============================================================
//  VOKABELN – Wortpakete zum "Dem Hund beibringen"
//  pic : Emoji (Bild in der Gedankenblase)
//  fr  : mit Artikel (le/la/l'/un/une) – wird so verlangt
//  de  : deutsch
//  alt : weitere akzeptierte Schreibweisen (optional)
//  Neue Pakete einfach anhängen, z. B. später pro Schulbuch-Lektion.
// =============================================================
export const DECKS = {
  rue: { titre:'Dans la rue', titel:'In der Stadt', words:[
    { pic:'🥖', fr:'la boulangerie', de:'die Bäckerei' }, { pic:'☕', fr:'le café', de:'das Café' },
    { pic:'🚇', fr:'le métro', de:'die U-Bahn' },          { pic:'🚦', fr:'le feu', de:'die Ampel' },
    { pic:'🚲', fr:'le vélo', de:'das Fahrrad' },          { pic:'🚌', fr:'le bus', de:'der Bus' },
    { pic:'🚗', fr:'la voiture', de:'das Auto' },          { pic:'🗼', fr:'la tour Eiffel', de:'der Eiffelturm' },
  ]},
  salut: { titre:'Bonjour !', titel:'Begrüßen & Höflichkeit', words:[
    { pic:'👋', fr:'bonjour', de:'hallo / guten Tag' },  { pic:'🙌', fr:'salut', de:'hi / tschüss (locker)' },
    { pic:'🌙', fr:'bonsoir', de:'guten Abend' },          { pic:'🚶', fr:'au revoir', de:'auf Wiedersehen' },
    { pic:'🙏', fr:'merci', de:'danke' },                  { pic:'🥺', fr:"s'il te plaît", de:'bitte (zu einem Freund)', alt:['s il te plait','sil te plait'] },
    { pic:'😴', fr:'bonne nuit', de:'gute Nacht' },        { pic:'⏰', fr:'à bientôt', de:'bis bald', alt:['a bientot'] },
    { pic:'😬', fr:'pardon', de:'Entschuldigung' },        { pic:'🙇', fr:'excuse-moi', de:'entschuldige (mich)', alt:['excuse moi'] },
    { pic:'😄', fr:'très bien', de:'sehr gut', alt:['tres bien'] }, { pic:'😐', fr:'comme ci, comme ça', de:'so lala', alt:['comme ci comme ca','comme ci comme ça'] },
  ]},
  animaux: { titre:'Les animaux', titel:'Tiere', words:[
    { pic:'🐶', fr:'le chien',  de:'der Hund' },
    { pic:'🐱', fr:'le chat',   de:'die Katze' },
    { pic:'🐦', fr:"l'oiseau",  de:'der Vogel', alt:['le oiseau','oiseau'] },
    { pic:'🐴', fr:'le cheval', de:'das Pferd' },
    { pic:'🐰', fr:'le lapin',  de:'das Kaninchen' },
    { pic:'🐟', fr:'le poisson',de:'der Fisch' },
    { pic:'🐭', fr:'la souris', de:'die Maus' },
    { pic:'🦜', fr:'le perroquet', de:'der Papagei' },
  ]},
  manger: { titre:'À table !', titel:'Essen & Trinken', words:[
    { pic:'🍎', fr:'la pomme',    de:'der Apfel' },
    { pic:'🥖', fr:'la baguette', de:'das Baguette' },
    { pic:'🍞', fr:'le pain',     de:'das Brot' },
    { pic:'🧀', fr:'le fromage',  de:'der Käse' },
    { pic:'🥛', fr:'le lait',     de:'die Milch' },
    { pic:'💧', fr:"l'eau",       de:'das Wasser', alt:['la eau','eau'] },
    { pic:'🥐', fr:'le croissant',de:'das Croissant' },
    { pic:'🍰', fr:'le gâteau',   de:'der Kuchen' },
    { pic:'🍌', fr:'la banane',   de:'die Banane' },
  ]},
  ecole: { titre:"À l'école", titel:'In der Schule', words:[
    { pic:'📕', fr:'le livre',   de:'das Buch' },
    { pic:'🖊️', fr:'le stylo',   de:'der Kuli' },
    { pic:'📒', fr:'le cahier',  de:'das Heft' },
    { pic:'✏️', fr:'le crayon',  de:'der Bleistift' },
    { pic:'🎒', fr:'le sac',     de:'die Tasche / der Ranzen', alt:['le sac a dos','le sac à dos'] },
    { pic:'📏', fr:'la règle',   de:'das Lineal' },
    { pic:'👩‍🏫', fr:'la prof',   de:'die Lehrerin', alt:['la professeure','le professeur','la professeur'] },
    { pic:'🏫', fr:"l'école",    de:'die Schule', alt:['la ecole','ecole'] },
  ]},
  couleurs: { titre:'Les couleurs', titel:'Farben', words:[
    { pic:'🔴', fr:'rouge', de:'rot' },   { pic:'🔵', fr:'bleu', de:'blau' },  { pic:'🟢', fr:'vert', de:'grün' },
    { pic:'🟡', fr:'jaune', de:'gelb' },  { pic:'⚫', fr:'noir', de:'schwarz' },{ pic:'⚪', fr:'blanc', de:'weiß' },
    { pic:'🟠', fr:'orange', de:'orange' },{ pic:'🟣', fr:'violet', de:'lila' },
  ]},
  famille: { titre:'La famille', titel:'Familie', words:[
    { pic:'👩', fr:'la mère', de:'die Mutter', alt:['maman','la maman'] }, { pic:'👨', fr:'le père', de:'der Vater', alt:['papa','le papa'] },
    { pic:'👧', fr:'la sœur', de:'die Schwester', alt:['la soeur'] },        { pic:'👦', fr:'le frère', de:'der Bruder' },
    { pic:'👵', fr:'la grand-mère', de:'die Oma', alt:['mamie','la mamie'] }, { pic:'👴', fr:'le grand-père', de:'der Opa', alt:['papi','le papi'] },
    { pic:'👶', fr:'le bébé', de:'das Baby' },
  ]},
  nombres: { titre:'Les nombres', titel:'Zahlen 1–12', words:[
    { pic:'1️⃣', fr:'un', de:'eins', alt:['une'] }, { pic:'2️⃣', fr:'deux', de:'zwei' }, { pic:'3️⃣', fr:'trois', de:'drei' }, { pic:'4️⃣', fr:'quatre', de:'vier' },
    { pic:'5️⃣', fr:'cinq', de:'fünf' }, { pic:'6️⃣', fr:'six', de:'sechs' }, { pic:'7️⃣', fr:'sept', de:'sieben' }, { pic:'8️⃣', fr:'huit', de:'acht' },
    { pic:'9️⃣', fr:'neuf', de:'neun' }, { pic:'🔟', fr:'dix', de:'zehn' },
    { pic:'🕚', fr:'onze', de:'elf' }, { pic:'🕛', fr:'douze', de:'zwölf' },
  ]},
  loisirs: { titre:'Les loisirs', titel:'Hobbys & Freizeit', words:[
    { pic:'⚽', fr:'le foot', de:'der Fußball', alt:['le football','foot'] }, { pic:'🎵', fr:'la musique', de:'die Musik' },
    { pic:'💃', fr:'la danse', de:'das Tanzen' },                        { pic:'🎾', fr:'le tennis', de:'das Tennis' },
    { pic:'🎨', fr:'le dessin', de:'das Zeichnen' },                    { pic:'🏊', fr:'la natation', de:'das Schwimmen' },
    { pic:'🎮', fr:'les jeux vidéo', de:'die Videospiele', alt:['les jeux video'] }, { pic:'🎬', fr:'le cinéma', de:'das Kino', alt:['le cinema'] },
  ]},
  // ---------- Découvertes Unité 3–7 ----------
  anniversaire: { titre:'Joyeux anniversaire !', titel:'Geburtstag', words:[
    { pic:'🎂', fr:'le gâteau', de:'der Kuchen', alt:['le gateau'] },   { pic:'🕯️', fr:'la bougie', de:'die Kerze' },
    { pic:'🎁', fr:'le cadeau', de:'das Geschenk' },                    { pic:'🎈', fr:'le ballon', de:'der Luftballon' },
    { pic:'🎉', fr:'la fête', de:'das Fest / die Party', alt:['la fete'] }, { pic:'💌', fr:"l'invitation", de:'die Einladung', alt:['la invitation','invitation'] },
    { pic:'🎶', fr:'la chanson', de:'das Lied' },                       { pic:'👪', fr:'la famille', de:'die Familie' },
  ]},
  nombres2: { titre:'Les nombres', titel:'Zahlen 13–39', words:[
    { pic:'1️⃣3️⃣', fr:'treize', de:'dreizehn' }, { pic:'1️⃣4️⃣', fr:'quatorze', de:'vierzehn' }, { pic:'1️⃣5️⃣', fr:'quinze', de:'fünfzehn' }, { pic:'1️⃣6️⃣', fr:'seize', de:'sechzehn' },
    { pic:'1️⃣7️⃣', fr:'dix-sept', de:'siebzehn', alt:['dix sept'] }, { pic:'2️⃣0️⃣', fr:'vingt', de:'zwanzig' }, { pic:'2️⃣1️⃣', fr:'vingt et un', de:'einundzwanzig', alt:['vingt-et-un'] }, { pic:'3️⃣0️⃣', fr:'trente', de:'dreißig' },
  ]},
  mois: { titre:'Les mois', titel:'Die Monate', words:[
    { pic:'❄️', fr:'janvier', de:'Januar' }, { pic:'💘', fr:'février', de:'Februar', alt:['fevrier'] }, { pic:'🌱', fr:'mars', de:'März' }, { pic:'🌧️', fr:'avril', de:'April' },
    { pic:'🌸', fr:'mai', de:'Mai' }, { pic:'☀️', fr:'juin', de:'Juni' }, { pic:'🏖️', fr:'juillet', de:'Juli' }, { pic:'🌻', fr:'août', de:'August', alt:['aout'] },
    { pic:'🍂', fr:'septembre', de:'September' }, { pic:'🎃', fr:'octobre', de:'Oktober' }, { pic:'🍁', fr:'novembre', de:'November' }, { pic:'🎄', fr:'décembre', de:'Dezember', alt:['decembre'] },
  ]},
  jours: { titre:'Les jours', titel:'Die Wochentage', words:[
    { pic:'1️⃣', fr:'lundi', de:'Montag' }, { pic:'2️⃣', fr:'mardi', de:'Dienstag' }, { pic:'3️⃣', fr:'mercredi', de:'Mittwoch' }, { pic:'4️⃣', fr:'jeudi', de:'Donnerstag' },
    { pic:'5️⃣', fr:'vendredi', de:'Freitag' }, { pic:'6️⃣', fr:'samedi', de:'Samstag' }, { pic:'7️⃣', fr:'dimanche', de:'Sonntag' },
  ]},
  matieres: { titre:'Les matières', titel:'Schulfächer', words:[
    { pic:'🇫🇷', fr:'le français', de:'Französisch', alt:['le francais'] }, { pic:'🇩🇪', fr:"l'allemand", de:'Deutsch', alt:['allemand'] },
    { pic:'🇬🇧', fr:"l'anglais", de:'Englisch', alt:['anglais'] },        { pic:'➗', fr:'les maths', de:'Mathe' },
    { pic:'🏃', fr:"l'EPS", de:'Sport (Schulfach)', alt:['eps','le sport'] }, { pic:'🏰', fr:"l'histoire", de:'Geschichte', alt:['histoire'] },
    { pic:'🔬', fr:'la SVT', de:'Biologie', alt:['svt','la bio'] },       { pic:'🎨', fr:'les arts plastiques', de:'Kunst' },
  ]},
  nombres3: { titre:'Les grands nombres', titel:'Zahlen bis 100', words:[
    { pic:'4️⃣0️⃣', fr:'quarante', de:'vierzig' }, { pic:'5️⃣0️⃣', fr:'cinquante', de:'fünfzig' }, { pic:'6️⃣0️⃣', fr:'soixante', de:'sechzig' },
    { pic:'7️⃣0️⃣', fr:'soixante-dix', de:'siebzig', alt:['soixante dix'] }, { pic:'8️⃣0️⃣', fr:'quatre-vingts', de:'achtzig', alt:['quatre vingts','quatre-vingt'] },
    { pic:'9️⃣0️⃣', fr:'quatre-vingt-dix', de:'neunzig', alt:['quatre vingt dix'] }, { pic:'💯', fr:'cent', de:'hundert' },
  ]},
  snack: { titre:'Au snack', titel:'Essen & Trinken bestellen', words:[
    { pic:'🥪', fr:'un sandwich', de:'ein Sandwich' }, { pic:'🥞', fr:'une crêpe', de:'ein Crêpe', alt:['une crepe'] },
    { pic:'🧀', fr:'un croque-monsieur', de:'ein überbackener Schinken-Käse-Toast', alt:['un croque monsieur'] }, { pic:'🍕', fr:'une pizza', de:'eine Pizza' },
    { pic:'🍊', fr:"un jus d'orange", de:'ein Orangensaft', alt:['un jus d orange'] }, { pic:'🍋', fr:'une limonade', de:'eine Limonade' },
    { pic:'💧', fr:"de l'eau", de:'Wasser', alt:['de l eau',"l'eau"] },      { pic:'☕', fr:'un chocolat chaud', de:'ein Kakao' },
  ]},
  fete: { titre:'La fête de la musique', titel:'Fest & Musik', words:[
    { pic:'🎶', fr:'la musique', de:'die Musik' }, { pic:'🎸', fr:'la guitare', de:'die Gitarre' }, { pic:'🎹', fr:'le piano', de:'das Klavier' }, { pic:'🥁', fr:'la batterie', de:'das Schlagzeug' },
    { pic:'🎤', fr:'le chanteur', de:'der Sänger' }, { pic:'👩‍🎤', fr:'la chanteuse', de:'die Sängerin' }, { pic:'🎪', fr:'la scène', de:'die Bühne', alt:['la scene'] }, { pic:'🎆', fr:"le feu d'artifice", de:'das Feuerwerk', alt:['le feu d artifice'] },
  ]},
  paris: { titre:'Paris', titel:'Sehenswürdigkeiten', words:[
    { pic:'🗼', fr:'la tour Eiffel', de:'der Eiffelturm', alt:['la tour eiffel'] }, { pic:'🖼️', fr:'le musée', de:'das Museum', alt:['le musee'] },
    { pic:'🏛️', fr:"l'Arc de Triomphe", de:'der Triumphbogen', alt:["l'arc de triomphe",'arc de triomphe'] }, { pic:'🌊', fr:'la Seine', de:'die Seine (Fluss)', alt:['la seine'] },
    { pic:'🌉', fr:'le pont', de:'die Brücke' },                       { pic:'⛪', fr:"l'église", de:'die Kirche', alt:['eglise',"l'eglise"] },
    { pic:'🌳', fr:'le parc', de:'der Park' },                         { pic:'🏬', fr:'le magasin', de:'das Geschäft' },
  ]},
  transports: { titre:'Les transports', titel:'Verkehrsmittel & Tickets', words:[
    { pic:'🚆', fr:'le train', de:'der Zug' }, { pic:'🚕', fr:'le taxi', de:'das Taxi' }, { pic:'🚋', fr:'le tram', de:'die Straßenbahn' }, { pic:'⛴️', fr:'le bateau', de:'das Schiff' },
    { pic:'✈️', fr:"l'avion", de:'das Flugzeug', alt:['avion'] }, { pic:'🎫', fr:'le billet', de:'die Fahrkarte' }, { pic:'🗺️', fr:'le plan', de:'der Stadtplan' }, { pic:'✉️', fr:'la carte postale', de:'die Postkarte' },
  ]},
  // ---------- aus dem Cahier, Unités 1–3 ----------
  gens: { titre:'Les gens', titel:'Leute', words:[
    { pic:'👦', fr:'un garçon', de:'ein Junge' }, { pic:'👧', fr:'une fille', de:'ein Mädchen' },
    { pic:'🧑', fr:'un copain', de:'ein Freund (Kumpel)' }, { pic:'👩', fr:'une copine', de:'eine Freundin' },
    { pic:'🤝', fr:'un ami', de:'ein Freund' }, { pic:'💁‍♀️', fr:'une amie', de:'eine Freundin' },
    { pic:'🧔', fr:'un monsieur', de:'ein Herr' }, { pic:'👵', fr:'une dame', de:'eine Dame' },
  ]},
  ausrufe: { titre:'Petits mots', titel:'Ausrufe', words:[
    { pic:'⚠️', fr:'Attention !', de:'Achtung!', alt:['attention'] }, { pic:'💨', fr:'Vite !', de:'Schnell!', alt:['vite'] },
    { pic:'😬', fr:'Pardon !', de:'Entschuldigung!', alt:['pardon'] }, { pic:'🤩', fr:'Super !', de:'Super!', alt:['super'] },
    { pic:'✨', fr:'Fantastique !', de:'Fantastisch!', alt:['fantastique'] }, { pic:'🤨', fr:'Bizarre !', de:'Komisch!', alt:['bizarre'] },
    { pic:'🤷', fr:'Bof !', de:'Na ja …', alt:['bof'] }, { pic:'👋', fr:'À plus !', de:'Bis später!', alt:['a plus','à plus'] },
  ]},
  presse: { titre:'La maison de la presse', titel:'Im Zeitschriftenladen', words:[
    { pic:'💬', fr:'la BD', de:'der Comic', alt:['la bd','bd'] }, { pic:'📖', fr:'le livre', de:'das Buch' },
    { pic:'📰', fr:'le journal', de:'die Zeitung' }, { pic:'🖼️', fr:"l'affiche", de:'das Poster', alt:['affiche','la affiche'] },
    { pic:'🧽', fr:'la gomme', de:'der Radiergummi' }, { pic:'📦', fr:'le carton', de:'der Karton' },
    { pic:'🏪', fr:'le magasin', de:'der Laden' }, { pic:'🏖️', fr:'les vacances', de:'die Ferien' },
  ]},
  petitsmots: { titre:'Petits mots importants', titel:'Kleine wichtige Wörter', words:[
    { pic:'1️⃣', fr:"d'abord", de:'zuerst', alt:['d abord','dabord'] }, { pic:'2️⃣', fr:'puis', de:'dann' },
    { pic:'📆', fr:'demain', de:'morgen' }, { pic:'👫', fr:'ensemble', de:'zusammen' },
    { pic:'↔️', fr:'mais', de:'aber' }, { pic:'👍', fr:"d'accord", de:'einverstanden / okay', alt:['d accord','daccord'] },
    { pic:'😘', fr:'bisous', de:'Küsschen (Grußformel)', alt:['bises'] }, { pic:'🎈', fr:'une surprise', de:'eine Überraschung', alt:['la surprise','surprise'] },
  ]},
};
