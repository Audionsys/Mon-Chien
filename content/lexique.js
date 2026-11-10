// =============================================================
//  LEXIQUE – Wörterbuch für "Wort antippen" (Kleinschreibung als Schlüssel)
//  Einfach neue Zeilen ergänzen: 'französisch': 'deutsch'
//  Mehrwort-Einträge (z. B. "il y a") werden vor Einzelwörtern erkannt.
// =============================================================
export const LEXIQUE = {
  // kleine Wörter
  'le':'der/das (männlich)', 'la':'die/das (weiblich)', 'les':'die (Plural)', "l'":'der/die/das (vor Vokal)',
  'un':'ein', 'une':'eine', 'des':'(einige) – Plural von un/une', 'de':'von / zu', 'du':'vom (de + le)',
  'au':'zum / in den (à + le)', 'aux':'zu den (à + les)', 'à':'zu / nach / an', 'et':'und', 'ou':'oder', 'avec':'mit',
  'il':'er', 'elle':'sie', 'tu':'du', 'je':'ich', 'on':'man / wir', 'ton':'dein (m)', 'ta':'deine (f)', 'son':'sein (m)', 'sa':'seine (f)',
  'est':'ist (être)', 'es':'bist (être)', 'a':'hat (avoir)', 'as':'hast (avoir)', 'ne':'nicht (ne … pas)', 'pas':'nicht (ne … pas)',
  'il y a':'es gibt / da ist', 'où':'wo', 'qui':'wer', 'quel':'welcher', 'comment':'wie', 'voici':'hier ist',
  'oui':'ja', 'non':'nein', 'merci':'danke', 'bravo':'super!', 'bonjour':'hallo / guten Tag', 'super':'super',
  'maintenant':'jetzt', 'allez':'los!', 'aussi':'auch', 'très':'sehr', 'petit':'klein', 'petite':'klein (f)', 'nouveau':'neu',
  'deux':'zwei', 'trois':'drei', 'sept':'sieben', 'mots':'Wörter', 'mot':'Wort', 'phrase':'Satz', 'joli':'hübsch / schön', 'quel joli nom':'was für ein schöner Name',
  // Verben
  "s'appelle":'heißt', "s'asseoir":'sich setzen', 'se coucher':'sich hinlegen', 'coucher':'(sich) hinlegen', 'se lever':'aufstehen',
  'venir':'kommen', 'dis-lui':'sag ihm', 'demande-lui':'bitte ihn um', 'envoie-le':'schick ihn', 'dire':'sagen', 'doit':'muss / soll',
  'veut':'will', 'connaît':'kennt', 'joue':'spiel! / spielt', 'jouer':'spielen', 'tourner':'(sich) drehen', 'aboyer':'bellen',
  'apporter':'bringen', 'touche':'tippe an / berühre', 'trouve':'finde', 'regarde':'schau', 'construis':'bau', 'choisis':'wähle', 'complète':'ergänze',
  'est fatigué':'ist müde', 'fatigué':'müde', 'timide':'schüchtern', 'content':'froh', 'faim':'Hunger', 'soif':'Durst', 'a faim':'hat Hunger',
  // Dinge
  'chien':'Hund', 'maison':'Haus / Zuhause', 'patte':'Pfote', 'danse':'Tanz', 'nom':'Name', 'animal':'Tier', 'animaux':'Tiere',
  'panier':'(Hunde-)Körbchen', 'gamelle':'Napf', 'balle':'Ball', 'canapé':'Sofa', 'fenêtre':'Fenster', 'tapis':'Teppich',
  'plante':'Pflanze', 'tableau':'Bild', 'coussin':'Kissen', 'chambre':'Zimmer', 'salon':'Wohnzimmer',
  // weitere
  "d'":'zu / von', "s'":'sich', "qu'":'dass / was', 'mon':'mein', 'ma':'meine', 'dehors':'draußen / nach draußen', 'regarder':'schauen',
  'choses':'Sachen / Dinge', 'chose':'Sache', 'entendre':'hören', 'pour':'um zu / für', 'dans':'in', 'sur':'auf', 'lui':'ihm',
  'comment dit-on':'wie sagt man', 'dit-on':'sagt man', 'beaucoup de':'viele', 'beaucoup':'viel', 'chapitre':'Kapitel', 'terminé':'fertig / beendet',
  'génial':'genial', 'révision':'Wiederholung', 'va':'geh! / geht', 'ton nouveau chien':'dein neuer Hund',
  // Orte & Szenen
  'jardin':'Garten', 'cuisine':'Küche', 'niche':'Hundehütte', 'arbre':'Baum', 'fleurs':'Blumen', 'portail':'Gartentor', 'barrière':'Zaun',
  'table':'Tisch', 'chaise':'Stuhl', 'frigo':'Kühlschrank', 'placard':'Schrank', 'coussin':'Kissen', 'goûter':'Nachmittagssnack',
  "l'heure":'die Zeit / Stunde', 'heure':'Stunde / Uhrzeit', 'rêve':'träumt', 'bonnes':'gute / leckere', 'partout':'überall', 'voit':'sieht', 'compte':'zählt',
  'croquettes':'Trockenfutter', 'saut':'Sprung', 'joie':'Freude', 'pour finir':'zum Schluss', 'toute':'ganze', 'appelle':'ruft', 'connaître':'kennenlernen',
  'famille':'Familie', 'journée':'Tag', 'finie':'vorbei', 'récré':'Pause', 'regarde':'schau / schaut', 'sac':'Tasche', 'toi':'du / dich',
  "d'abord":'zuerst', 'aide-le':'hilf ihm', 'apprends-lui':'bring ihm bei', 'encore':'noch / nochmal', 'pense':'denkt', 'quelque chose':'etwas',
  'en français':'auf Französisch', 'nouveau mot':'neues Wort', 'apprend':'lernt', 'aller':'gehen', 'fait':'macht', 'font':'machen / ergeben',
  'bien':'gut', 'mangé':'gegessen', 'aime':'mag / liebt', 'couleur':'Farbe', 'quelle':'welche', 'mais':'aber', 'il voit':'er sieht', 'veut':'will',
  'oh non':'oh nein', 'déchire':'zerreißt', 'creuse':'gräbt', 'court':'rennt', 'partout dans':'überall in', 'vole':'klaut', 'queue':'Schwanz', 'sa queue':'seinen Schwanz',
  'sol':'Boden', 'va venir':'wird kommen', 'une chose':'eine Sache', 'tu entends':'du hörst', 'caresse':'streichle', 'touche-le':'tippe ihn an', 'dans ma bulle':'in meiner Sprechblase', 'bulle':'Blase', 'ouvre':'öffne', 'carnet':'Heft', 'le carnet':'das Heft (Vokabelheft)',
  'lampe':'Lampe', "l'étagère":'das Regal', 'étagère':'Regal', 'télé':'Fernseher', "l'horloge":'die Uhr', 'horloge':'Uhr', 'porte':'Tür', 'table basse':'Couchtisch', 'tasse':'Tasse', 'livre':'Buch', 'mur':'Wand', 'soleil':'Sonne', 'nuage':'Wolke', 'banc':'Bank', 'cuisinière':'Herd', "l'évier":'die Spüle', 'évier':'Spüle', 'poubelle':'Mülleimer', 'poignée':'Griff', 'écran':'Bildschirm',
  "je m'appelle":'ich heiße', "m'appelle":'heiße', "tu t'appelles":'du heißt', "t'appelles":'heißt (du)', 'salut':'hi / tschüss', 'bonsoir':'guten Abend', 'au revoir':'auf Wiedersehen', 'à bientôt':'bis bald', 'bonne nuit':'gute Nacht', 'ça va':'wie geht’s / es geht', 'tout le monde':'alle', 'le matin':'morgens', 'le soir':'abends', 'en france':'in Frankreich', 'poli':'höflich', 'être':'sein', 'dis-lui de dire':'sag ihm, er soll sagen', 'dis':'sag!', 'coco dit':'Coco sagt', 'dit':'sagt', 'pour':'um zu / für', 'tout':'alles',
  'chat':'Katze', 'oiseau':'Vogel', "l'oiseau":'der Vogel', 'voisins':'Nachbarn', 'boîte aux lettres':'Briefkasten', 'rideau':'Vorhang', 'vitre':'Fensterscheibe', 'ciel':'Himmel', 'tour eiffel':'Eiffelturm',
  'rue':'Straße', 'boulangerie':'Bäckerei', 'café':'Café / Kaffee', 'métro':'U-Bahn', 'feu':'Ampel', 'vélo':'Fahrrad', 'bus':'Bus', 'voiture':'Auto', 'là-bas':'dort drüben', 'ville':'Stadt', 'à gauche':'links', 'à droite':'rechts', 'tout droit':'geradeaus', 'on a faim':'wir haben Hunger', 'ça coûte':'das kostet', 'combien':'wie viel', 'euros':'Euro', 'euro':'Euro', 'écoute':'hör zu', 'on rentre':'wir fahren heim', 'chut':'pssst', 'classe':'Klasse', 'salle de classe':'Klassenzimmer', 'prof':'Lehrer(in)', 'arrive':'kommt', 'nous':'wir', 'sommes':'sind (wir)', 'quelle heure est-il':'wie spät ist es', 'leçon':'Unterrichtsstunde', 'longue':'lang', "s'endort":'schläft ein', 'appelle':'ruft', 'tableau':'Tafel / Bild', 'collège':'Schule (Klasse 6–9)', 'est-ce que':'(Fragewort)', "s'il vous plaît":'bitte (höflich)', 'tout le monde':'alle',
  'aboie':'bellt / bell!', 'ouf':'puh!', 'fou':'verrückt', 'comme':'wie', 'après':'nach / hinter', 'court après':'jagt', 'arrête':'hör auf!', 'lâche':'lass los!', 'la prochaine fois':'nächstes Mal', 'ça marche':'das klappt',
  // Unité 1 & 2: neue Freunde, Zahlen, Hobbys
  'nouvelle':'neue', 'nouveaux':'neue (Pl.)', 'amie':'Freundin', 'amis':'Freunde', 'ami':'Freund', 'voisine':'Nachbarin', 'voisin':'Nachbar', 'minou':'Minou (Kätzchen)', 'marche':'läuft / tritt', 'pardon':'Entschuldigung', 'excuse-moi':'entschuldige', 'gentil':'lieb, nett (m)', 'gentille':'lieb, nett (f)', 'très bien':'sehr gut', 'comme ci, comme ça':'so lala', 'pas mal':'nicht schlecht', 'sois':'sei', 'sage':'brav', 'nombres':'Zahlen', 'onze':'elf', 'douze':'zwölf', "jusqu'à":'bis', 'week-end':'Wochenende', 'joues':'spielst', 'jouons':'spielen (wir)', 'jouez':'spielt (ihr)', 'jouent':'spielen (sie)', 'ensemble':'zusammen', 'aimes':'magst', 'aiment':'mögen (sie)', 'loisirs':'Hobbys / Freizeit', 'musique':'Musik', 'foot':'Fußball', 'tennis':'Tennis', 'dessin':'Zeichnen', 'natation':'Schwimmen', 'cinéma':'Kino', 'école':'Schule', 'sont':'sind (sie)', 'êtes':'seid (ihr)', 'suis':'bin', 'ce que':'was', "qu'est-ce que c'est":'was ist das?', "c'est":'das ist',
  // Ergänzungen Lernstufen 1–3
  'visiteurs':'Besucher', 'détective':'Detektiv', 'est-ce':'(Frageform)', 'voilà':'da ist / hier ist', 'dame':'Dame', 'monsieur':'Herr', 'garçon':'Junge', 'fille':'Mädchen', 'copain':'Freund (Kumpel)', 'copine':'Freundin', "d'où":'woher', 'ici':'hier', "d'ici":'von hier', 'bizarre':'komisch', 'fantastique':'fantastisch', 'attention':'Achtung', 'vite':'schnell', 'bof':'na ja', 'crie':'ruft', 'route':'Straße', 'presse':'Presse / Zeitschriften', 'cherche':'sucht / suche', 'cherchez':'sucht (ihr)', 'parti':'weg', 'habites':'wohnst', 'habite':'wohne / wohnt', 'entrons':'gehen hinein (wir)', 'regardent':'schauen (sie)', 'parlez':'sprecht / sprechen Sie', 'carton':'Karton', 'journal':'Zeitung', 'affiche':'Poster', 'gomme':'Radiergummi', 'magasin':'Laden', 'vacances':'Ferien', 'villes':'Städte', 'France':'Frankreich', 'Allemagne':'Deutschland', 'rentre':'gehen heim', 'demain':'morgen', "d'abord":'zuerst', 'puis':'dann', 'cadeau':'Geschenk', 'cadeaux':'Geschenke', 'mes':'meine (Pl.)', 'tes':'deine (Pl.)', 'ses':'seine / ihre (Pl.)', 'frère':'Bruder', 'sœur':'Schwester', 'idée':'Idee', 'avons':'haben (wir)', 'avez':'habt (ihr)', 'préfère':'mag lieber', 'numéro':'Nummer', 'téléphone':'Telefon', 'carte':'Karte', 'cher':'lieber', 'chère':'liebe', 'bisous':'Küsschen', 'ravi':'überglücklich', 'surprise':'Überraschung', "d'accord":'einverstanden',
};
