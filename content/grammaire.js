import { DECKS } from './vocab.js';
// =============================================================
//  GRAMMATIK-TRAINER (Découvertes 1 – Grundgrammatik)
//  Eigene Lektionen, jederzeit aus dem Menü startbar. Schritt-Typen wie in den Kapiteln,
//  plus 'conj' (Konjugationstabelle: ansehen → antippen → selbst schreiben).
//  fill mit strict:true = Endungen müssen exakt stimmen (keine Tippfehler-Toleranz).
// =============================================================
const ER=(stem,de,deP)=>[
  [ /^[aeiouhéè]/i.test(stem)?"j'":'je', stem+'e', 'ich '+de[0]],
  ['tu', stem+'es', 'du '+de[1]],
  ['il/elle/on', stem+'e', 'er/sie/man '+de[2]],
  ['nous', (stem.endsWith('g')?stem+'e':stem)+'ons', 'wir '+deP],
  ['vous', stem+'ez', 'ihr/Sie '+de[3]],
  ['ils/elles', stem+'ent', 'sie '+deP],
];
const F=(erz,fr,answer,o={})=>({type:'fill',strict:true,erz,fr,answer:[].concat(answer),...o});
const C=(erz,fr,options,answer,o={})=>({type:'choice',erz,fr,options,answer,...o});
const D=(...l)=>({type:'dialogue',lines:l.map(x=>({who:'Coco',erz:x}))});


// ---------- Lesetexte (im Stil der Lehrbuch-Aufgaben, eigene Inhalte) ----------
export const LIRE=[
  { title:'Perdu !', erz:'Am Baum im Park hängt ein Zettel …', text:`<b style="font-size:20px">🐶 PERDU !</b><br>Chien noir, 3 ans.<br>Il s'appelle <b>Rex</b>. Il est très gentil.<br>Il aime les balles et les enfants.<br>Vu mardi dans le parc Monceau.<br>📞 Téléphone : 06 12 15 18 20<br><b>Récompense : 50 €</b><br>Merci !`,
    qs:[ {q:'Was ist passiert?',options:['Ein Hund ist verschwunden.','Ein Hund wurde gefunden.','Ein Hund wird verkauft.'],answer:'Ein Hund ist verschwunden.',why:'«Perdu» = verloren'},
         {q:'Wie alt ist Rex?',options:['3 Jahre','13 Jahre','2 Jahre'],answer:'3 Jahre'},
         {q:'Wann hat man ihn zuletzt gesehen?',options:['am Dienstag','am Donnerstag','am Samstag'],answer:'am Dienstag',why:'«mardi» = Dienstag'},
         {q:'Was bedeutet «Récompense»?',options:['Belohnung','Telefon','Park'],answer:'Belohnung'},
         {q:'Was mag Rex?',options:['Bälle und Kinder','Katzen und Vögel','Wurst und Brot'],answer:'Bälle und Kinder'} ]},
  { title:'École des chiens', erz:'Coco hat einen Flyer gefunden. Was kann {N} hier lernen?', text:`<b style="font-size:18px">🎓 École des chiens « Toutou »</b><br>• <b>Lundi</b>, 17 h : cours pour les chiots (petits chiens)<br>• <b>Mercredi</b>, 15 h : tours et jeux 🎪<br>• <b>Samedi</b>, 10 h : agility – sauter et courir !<br>Prix : 12 € le cours<br>Infos : www.toutou-ecole.fr`,
    qs:[ {q:'Dein Hund soll Kunststücke lernen. Wann gehst du hin?',options:['Mittwoch, 15 Uhr','Montag, 17 Uhr','Samstag, 10 Uhr'],answer:'Mittwoch, 15 Uhr',why:'«tours» = Kunststücke'},
         {q:'Was kostet ein Kurs?',options:['12 €','17 €','10 €'],answer:'12 €'},
         {q:'Was sind «les chiots»?',options:['junge Hunde','alte Hunde','Katzen'],answer:'junge Hunde',why:'«petits chiens» steht in Klammern'},
         {q:'Was macht man am Samstag?',options:['springen und rennen','schlafen','Kunststücke'],answer:'springen und rennen'} ]},
  { title:'En ville', erz:'{N} und du seid in der Stadt. Diese Schilder seht ihr:', text:`🥖 <b>BOULANGERIE</b> &nbsp; 💊 <b>PHARMACIE</b><br>📚 <b>LIBRAIRIE – PAPETERIE</b><br>🚉 <b>GARE</b> &nbsp; 🏦 <b>BANQUE</b><br>🐾 <b>ANIMALERIE</b> &nbsp; 🎬 <b>CINÉMA</b>`,
    qs:[ {q:'Du brauchst Brot. Wohin gehst du?',options:['BOULANGERIE','PHARMACIE','BANQUE'],answer:'BOULANGERIE'},
         {q:'Du brauchst ein Heft und Stifte.',options:['LIBRAIRIE – PAPETERIE','GARE','ANIMALERIE'],answer:'LIBRAIRIE – PAPETERIE'},
         {q:'{N} braucht neues Hundefutter.',options:['ANIMALERIE','CINÉMA','BOULANGERIE'],answer:'ANIMALERIE',why:'«animal» steckt drin'},
         {q:'Ihr wollt mit dem Zug nach Paris.',options:['GARE','BANQUE','PHARMACIE'],answer:'GARE'} ]},
  { title:'Un message', erz:'Eine Nachricht von Léa an ihre neue Brieffreundin:', text:`Salut !<br>Je m'appelle Léa. J'ai onze ans et j'habite à Lyon. J'ai un frère, il s'appelle Hugo. Il a quatorze ans.<br>Nous avons un chien, Malo. Il est petit et très drôle.<br>J'aime la musique et le tennis, mais je préfère la danse. Je déteste le foot !<br>Le mercredi, je joue avec Malo dans le parc.<br>Et toi ? Tu as un animal ?<br>Bisous, Léa`,
    qs:[ {q:'Wie alt ist Léa?',options:['11','14','12'],answer:'11'},
         {q:'Wer ist Hugo?',options:['ihr Bruder','ihr Hund','ihr Vater'],answer:'ihr Bruder',why:'«frère» = Bruder'},
         {q:'Was macht Léa am liebsten?',options:['Tanzen','Tennis','Fußball'],answer:'Tanzen',why:'«je préfère la danse»'},
         {q:'Richtig oder falsch: Léa mag Fußball.',options:['falsch','richtig'],answer:'falsch',why:'«je déteste le foot»'},
         {q:'Wann spielt sie mit Malo im Park?',options:['mittwochs','montags','sonntags'],answer:'mittwochs'} ]},
];

export const GRAM = {

  er: { icon:'🔤', titre:'Les verbes en -er', titel:'Verben auf -er (Endungen)', steps:[
    D('Hier kommt der wichtigste Trick im Französischen! Die meisten Verben enden auf «-er»: «parler» (sprechen), «jouer» (spielen), «aimer» (mögen), «regarder» (anschauen).',
      'Man streicht das «-er» weg – übrig bleibt der Stamm: parl-er → «parl». Und dann hängt man eine Endung dran, je nachdem WER etwas tut. Genau wie im Deutschen: ich spiel<b>e</b>, du spiel<b>st</b>!',
      'Die Endungen sind immer dieselben: <b>-e, -es, -e, -ons, -ez, -ent</b>. Merkspruch: „<b>E – ES – E, ONS – EZ – ENT</b>“. Sag ihn dreimal laut, wie einen Rap! 🎤',
      'Und das Gemeine: <b>-e, -es, -e</b> und <b>-ent</b> hört man gar nicht! «je parle», «tu parles», «ils parlent» klingen alle gleich: „parl“. Darum muss man sie beim Schreiben auswendig wissen.'),
    { type:'rapstep', rap:'er', erz:'Hier ist der <b>-er-Rap</b>! Mach den Ton an, hör zu – und rap beim zweiten Mal mit. 🎤' },
    { type:'conj', verb:'parler', erz:'So sieht «parler» (sprechen) aus. Die Endungen sind <b>fett</b> markiert – lies die Tabelle in Ruhe und lass sie dir vorlesen.', forms:ER('parl',['spreche','sprichst','spricht','sprecht'],'sprechen').map(f=>[f[0],f[1],f[2]]), tip:'Stamm <b>parl</b> + Endung: -e · -es · -e · -ons · -ez · -ent' },
    C('Welche Endung gehört zu <b>tu</b> (du)?','tu jou___',['es','e','ez','ons'],'es',{de:'du spielst',full:'tu joues',note:'tu → <b>-es</b> (wie im Deutschen das -st: du spiel<b>st</b>)'}),
    C('Welche Endung gehört zu <b>nous</b> (wir)?','nous jou___',['ons','ent','ez','es'],'ons',{full:'nous jouons',note:'nous → <b>-ons</b> · Eselsbrücke: n<b>o</b>us – <b>o</b>ns'}),
    C('Welche Endung gehört zu <b>vous</b> (ihr)?','vous jou___',['ez','es','ent','ons'],'ez',{full:'vous jouez',note:'vous → <b>-ez</b> · Eselsbrücke: vou<b>s</b> und -e<b>z</b> – beide enden „scharf“'}),
    C('Welche Endung gehört zu <b>ils / elles</b> (sie, mehrere)?','ils jou___',['ent','ons','es','e'],'ent',{full:'ils jouent',note:'ils/elles → <b>-ent</b> – das <b>-ent</b> spricht man NICHT!'}),
    { type:'conj', verb:'jouer', phase:'pick', erz:'Jetzt «jouer» (spielen). {N} will mit dir spielen – füll die Tabelle!', forms:ER('jou',['spiele','spielst','spielt','spielt'],'spielen') },
    { type:'apporte', n:6, erz:'Spielzeit! 🦴 Auf jedem Knochen steht eine Endung. Tippe den richtigen Knochen an – {N} holt ihn dir!' },
    F('Schreib die richtige Form von «regarder» (anschauen): Je ___ la télé.','Je ___ la télé.','regarde',{de:'Ich schaue fern.',hints:['je → <b>-e</b>']}),
    F('{N} fragt: Tu ___ le chocolat ? (aimer = mögen)','Tu ___ le chocolat ?','aimes',{de:'Magst du Schokolade?',hints:['tu → <b>-es</b>']}),
    F('Nous ___ au foot. (jouer)','Nous ___ au foot.','jouons',{de:'Wir spielen Fußball.',hints:['nous → <b>-ons</b>']}),
    F('Vous ___ français ? (parler)','Vous ___ français ?','parlez',{de:'Sprecht ihr Französisch?',hints:['vous → <b>-ez</b>']}),
    F('Les filles ___ un film. (regarder)','Les filles ___ un film.','regardent',{de:'Die Mädchen schauen einen Film.',hints:['„die Mädchen“ = elles → <b>-ent</b>']}),
    F('Coco ___ beaucoup ! (parler)','Coco ___ beaucoup !','parle',{de:'Coco redet viel!',hints:['Coco = il → <b>-e</b>']}),
    D('Achtung, Sonderfall! Fängt das Verb mit einem Vokal an (a, e, i, o, u – oder h), wird aus «je» ein «j\'»: «j\'aime», «j\'habite», «j\'écoute».'),
    C('Wie heißt es richtig?','___ aime les chiens.',["J'","Je"],"J'",{full:"J'aime les chiens.",de:'Ich mag Hunde.',note:"je + Vokal → <b>j'</b> : j'aime, j'habite"}),
    { type:'conj', verb:'aimer', phase:'type', erz:'Profi-Runde: «aimer» (mögen, lieben) – diesmal schreibst du alles selbst, in gemischter Reihenfolge!', forms:ER('aim',['mag','magst','mag','mögt'],'mögen') },
    { type:'build', erz:'Bau den Satz: <i>Wir spielen mit {N}.</i>', tiles:['Nous','jouons','avec','{N}','jouez','joue'], answer:'Nous jouons avec {N}', learn:[{fr:'nous jouons',de:'wir spielen',gram:'-er: e · es · e · ons · ez · ent'}] },
  ]},

  er2: { icon:'🎯', titre:'-er : entraînement', titel:'-er-Verben: Endungen-Training', steps:[
    D('Training! Ich gebe dir einen Satz, du schreibst das Verb mit der richtigen Endung. Denk an den Rap: „E – ES – E, ONS – EZ – ENT“ 🎤'),
    { type:'apporte', n:8, erz:'Aufwärmen mit {N}: Tippe den Knochen mit der richtigen Endung an! 🦴' },
    F('Tu ___ où ? (habiter = wohnen)','Tu ___ où ?','habites',{de:'Wo wohnst du?'}),
    F("J'___ à Munich. (habiter)","J'___ à Munich.",'habite',{de:'Ich wohne in München.'}),
    F('Elle ___ la radio. (écouter = hören)','Elle ___ la radio.','écoute',{de:'Sie hört Radio.'}),
    F('Nous ___ la porte. (fermer = schließen)','Nous ___ la porte.','fermons',{de:'Wir schließen die Tür.'}),
    F('Vous ___ {N} ? (chercher = suchen)','Vous ___ {N} ?','cherchez',{de:'Sucht ihr {N}?'}),
    F('Ils ___ dans le parc. (jouer)','Ils ___ dans le parc.','jouent',{de:'Sie spielen im Park.'}),
    F('On ___ une pizza ? (commander = bestellen)','On ___ une pizza ?','commande',{de:'Bestellen wir eine Pizza?',hints:['on = man → wie il: <b>-e</b>']}),
    F('Tu ___ bien ! (chanter = singen)','Tu ___ bien !','chantes',{de:'Du singst gut!'}),
    F('Max et Léa ___ le bus. (chercher)','Max et Léa ___ le bus.','cherchent',{de:'Max und Léa suchen den Bus.',hints:['Max et Léa = ils → <b>-ent</b>']}),
    F('Nous ___ français. (parler)','Nous ___ français.','parlons',{de:'Wir sprechen Französisch.'}),
    F('Vous ___ quoi ? (regarder)','Vous ___ quoi ?','regardez',{de:'Was schaut ihr an?'}),
    { type:'conj', verb:'écouter', phase:'type', erz:'Zum Schluss «écouter» (hören) – komplett auswendig! Denk an <b>j\'</b> vor dem Vokal.', forms:ER('écout',['höre','hörst','hört','hört'],'hören') },
  ]},

  etre: { icon:'⭐', titre:'Le verbe être', titel:'être (sein)', steps:[
    D('«être» heißt <i>sein</i>. Es ist unregelmäßig – also kein Trick, nur Auswendiglernen. Aber es ist so wichtig, dass es sich lohnt!',
      'Merkhilfe: «je suis» (ich bin) · «tu es» (du bist) · «il est» (er ist) … und das «s» am Ende hört man nie.'),
    { type:'rapstep', rap:'etre', erz:'Erst der <b>être-Rap</b> – damit bleibt es im Kopf! 🎤' },
    { type:'conj', verb:'être', erz:'Schau dir «être» an und lass es dir vorlesen:', forms:[['je','suis','ich bin'],['tu','es','du bist'],['il/elle/on','est','er/sie/man ist'],['nous','sommes','wir sind'],['vous','êtes','ihr seid / Sie sind'],['ils/elles','sont','sie sind']], tip:'Eselsbrücke: „<b>suis – es – est – sommes – êtes – sont</b>“' },
    { type:'conj', verb:'être', phase:'pick', erz:'Jetzt du! Tippe die richtigen Formen an.', forms:[['je','suis','ich bin'],['tu','es','du bist'],['il/elle/on','est','er/sie/man ist'],['nous','sommes','wir sind'],['vous','êtes','ihr seid'],['ils/elles','sont','sie sind']] },
    { type:'apporte', set:'etre', n:8, erz:'Spielzeit! 🦴 Auf den Knochen stehen die Formen von être. Tippe den richtigen an – {N} holt ihn!' },
    F('{N} ___ un chien. (être)','{N} ___ un chien.','est',{de:'{N} ist ein Hund.'}),
    F('Nous ___ en classe. (être)','Nous ___ en classe.','sommes',{de:'Wir sind in der Klasse.'}),
    F('Tu ___ où ? (être)','Tu ___ où ?','es',{de:'Wo bist du?'}),
    F('Vous ___ de Paris ? (être)','Vous ___ de Paris ?','êtes',{de:'Seid ihr aus Paris?'}),
    F('Je ___ content. (être)','Je ___ content.','suis',{de:'Ich bin froh.'}),
    F('Les chats ___ dans le jardin. (être)','Les chats ___ dans le jardin.','sont',{de:'Die Katzen sind im Garten.'}),
    F('Coco ___ un perroquet. (être)','Coco ___ un perroquet.','est',{de:'Coco ist ein Papagei.'}),
    F('Tu ___ sympa ! (être)','Tu ___ sympa !','es',{de:'Du bist nett!'}),
    F('Léa et Max ___ copains. (être)','Léa et Max ___ copains.','sont',{de:'Léa und Max sind Freunde.',hints:['Léa et Max = ils → <b>sont</b>']}),
    F('Nous ___ fatigués. (être)','Nous ___ fatigués.','sommes',{de:'Wir sind müde.'}),
    F('Vous ___ où ? (être)','Vous ___ où ?','êtes',{de:'Wo seid ihr?'}),
    C('es oder est?','Elle ___ dans le jardin.',['est','es'],'est',{note:'il/elle <b>est</b> (mit t) · tu <b>es</b> (ohne t)'}),
    C('es oder est?','Tu ___ là ?',['es','est'],'es'),
    C('sommes oder sont?','Les chiens ___ dans le parc.',['sont','sommes'],'sont'),
    { type:'build', erz:'Bau den Satz: <i>Ich bin elf.</i> Achtung, Falle: Beim Alter nimmt man avoir! → <i>Ich habe elf Jahre.</i>', tiles:["J'",'ai','onze','ans','suis'], answer:"J' ai onze ans", note:'Alter immer mit <b>avoir</b>: J\'ai onze ans.' },
    { type:'apporte', set:'etre', n:6, erz:'Noch eine Runde Apportieren mit être – schneller jetzt! 🦴' },
    { type:'conj', verb:'être', phase:'type', erz:'Profi-Runde: «être» ganz allein schreiben!', forms:[['je','suis','ich bin'],['tu','es','du bist'],['il/elle/on','est','er/sie/man ist'],['nous','sommes','wir sind'],['vous','êtes','ihr seid'],['ils/elles','sont','sie sind']] },
  ]},

  avoir: { icon:'🎒', titre:'Le verbe avoir', titel:'avoir (haben)', steps:[
    D('«avoir» heißt <i>haben</i>. Auch unregelmäßig. Weil es mit einem Vokal anfängt, heißt es «j\'ai» – nicht „je ai“!',
      'Achtung, Verwechslungsgefahr: «tu as» (du hast) – aber «il a» (er hat), ohne s! Und «ils ont» (sie haben) klingt anders als «ils sont» (sie sind): ont = „õ“, sont = „ßõ“.'),
    { type:'rapstep', rap:'avoir', erz:'Und hier der <b>avoir-Rap</b>! 🎤' },
    { type:'conj', verb:'avoir', erz:'So sieht «avoir» aus:', forms:[["j'",'ai','ich habe'],['tu','as','du hast'],['il/elle/on','a','er/sie/man hat'],['nous','avons','wir haben'],['vous','avez','ihr habt'],['ils/elles','ont','sie haben']], tip:'„<b>ai – as – a – avons – avez – ont</b>“' },
    { type:'conj', verb:'avoir', phase:'pick', erz:'Tippe die richtigen Formen an:', forms:[["j'",'ai','ich habe'],['tu','as','du hast'],['il/elle/on','a','er/sie/man hat'],['nous','avons','wir haben'],['vous','avez','ihr habt'],['ils/elles','ont','sie haben']] },
    { type:'apporte', set:'avoir', n:8, erz:'Spielzeit! 🦴 Jetzt die Formen von avoir. Tippe den richtigen Knochen an!' },
    F("J'___ un chien. (avoir)","J'___ un chien.",'ai',{de:'Ich habe einen Hund.'}),
    F('{N} ___ faim ! (avoir)','{N} ___ faim !','a',{de:'{N} hat Hunger!',note:'avoir faim = Hunger haben'}),
    F('Tu ___ un stylo ? (avoir)','Tu ___ un stylo ?','as',{de:'Hast du einen Stift?'}),
    F('Nous ___ un perroquet. (avoir)','Nous ___ un perroquet.','avons',{de:'Wir haben einen Papagei.'}),
    C('sont oder ont? <i>Sie haben eine Katze.</i>','Ils ___ un chat.',['ont','sont'],'ont',{note:'ils <b>ont</b> = sie haben · ils <b>sont</b> = sie sind'}),
    C('sont oder ont? <i>Sie sind nett.</i>','Elles ___ sympa.',['sont','ont'],'sont'),
    F('Vous ___ quel âge ? (avoir)','Vous ___ quel âge ?','avez',{de:'Wie alt seid ihr?',note:'Alter mit <b>avoir</b>: J\'ai onze ans. = Ich bin 11 (wörtlich: habe 11 Jahre).'}),
    F("Coco a 20 ans. Et toi ? – J'___ onze ans.","J'___ onze ans.",'ai',{de:'Ich bin elf Jahre alt.'}),
    { type:'conj', verb:'avoir', phase:'type', erz:'Profi-Runde: «avoir» selbst schreiben!', forms:[["j'",'ai','ich habe'],['tu','as','du hast'],['il/elle/on','a','er/sie/man hat'],['nous','avons','wir haben'],['vous','avez','ihr habt'],['ils/elles','ont','sie haben']] },
  ]},

  art: { icon:'📌', titre:'le, la, l\', les', titel:'Der bestimmte Artikel', steps:[
    D('Im Französischen gibt es nur zwei Geschlechter: männlich und weiblich. «le» = der (männlich), «la» = die (weiblich).',
      'Vor einem Vokal oder h werden beide zu «l\'»: «l\'ami», «l\'école». Und in der Mehrzahl heißt es immer «les» – egal ob männlich oder weiblich!',
      'Wichtig: Das Geschlecht ist oft anders als im Deutschen! «le chat» = die Katze (männlich), «la balle» = der Ball (weiblich). Darum Wörter immer mit Artikel lernen!'),
    { type:'apporte', set:'art', n:8, erz:'Apportieren mit Artikeln! 🦴 le, la, l\' oder les – {N} holt den richtigen.' },
    C('Welcher Artikel? (chien ist männlich)','___ chien',['le','la',"l'",'les'],'le',{full:'le chien'}),
    C('Welcher Artikel? (maison ist weiblich)','___ maison',['la','le',"l'",'les'],'la',{full:'la maison'}),
    C('Welcher Artikel? (ami fängt mit Vokal an)','___ami',["l'",'le','la','les'],"l'",{full:"l'ami",note:"Vor Vokal: le/la → <b>l'</b>"}),
    C('Welcher Artikel? (Mehrzahl!)','___ chats',['les','le','la',"l'"],'les',{full:'les chats',note:'Mehrzahl immer <b>les</b> – und das Nomen bekommt meist ein -s.'}),
    C('Welcher Artikel? (école fängt mit Vokal an)','___école',["l'",'la','le','les'],"l'",{full:"l'école"}),
    C('Welcher Artikel? (copine = Freundin)','___ copine',['la','le','les',"l'"],'la',{full:'la copine'}),
    C('Welcher Artikel? (copains = Freunde, Mehrzahl)','___ copains',['les','le','la'],'les',{full:'les copains'}),
    D('Und dann gibt es noch den unbestimmten Artikel: «un» = ein (männlich), «une» = eine (weiblich) – und in der Mehrzahl «des» (= einige; im Deutschen oft gar kein Wort).'),
    { type:'apporte', set:'unune', n:6, erz:'Und jetzt un, une oder des – {N} wartet schon! 🦴' },
    C('un, une oder des?','J\'ai ___ chien.',['un','une','des'],'un',{de:'Ich habe einen Hund.'}),
    C('un, une oder des?','C\'est ___ fille.',['une','un','des'],'une',{de:'Das ist ein Mädchen.'}),
    C('un, une oder des?','Il y a ___ chats dans le jardin.',['des','un','une'],'des',{de:'Es gibt Katzen im Garten.',note:'Mehrzahl → <b>des</b>'}),
    C('un, une oder des?','Coco est ___ perroquet.',['un','une','des'],'un'),
    C('un, une oder des?','Elle a ___ copines.',['des','une','un'],'des',{de:'Sie hat Freundinnen.'}),
  ]},

  neg: { icon:'🚫', titre:'ne … pas', titel:'Verneinung (nicht)', steps:[
    D('So sagt man „nicht“: Das Verb kommt in ein Sandwich! 🥪 «ne» davor, «pas» dahinter: «Je <b>ne</b> parle <b>pas</b>.» = Ich spreche nicht.',
      'Vor einem Vokal wird «ne» zu «n\'»: «Je <b>n\'</b>aime <b>pas</b> les chats.» – sagt {N}. 🐶'),
    { type:'build', erz:'Bau das Sandwich: <i>Ich spiele nicht.</i>', tiles:['Je','ne','joue','pas'], answer:'Je ne joue pas' },
    { type:'build', erz:'<i>{N} ist nicht traurig.</i> (triste = traurig)', tiles:['{N}','n\'','est','pas','triste','ne'], answer:"{N} n' est pas triste", hints:['Vor «est» (Vokal): <b>n\'</b>'] },
    { type:'apporte', set:'neg', n:6, erz:'Apportieren: ne oder n\'? 🦴' },
    C('ne oder n\'?','Tu ___ aimes pas le foot ?',["n'",'ne'],"n'",{note:"Vor Vokal: ne → <b>n'</b>"}),
    C('ne oder n\'?','Nous ___ regardons pas la télé.',['ne',"n'"],'ne'),
    C('Wo steht das «pas»?','Il ne parle ___ .',['pas – nach dem Verb','vor dem Verb'],'pas – nach dem Verb',{fr:null,note:'ne + Verb + pas'}),
    { type:'build', erz:'<i>Sie haben keine Katze.</i> (Nach «pas» wird un/une zu «de»!)', tiles:['Ils','n\'','ont','pas','de','chat','un'], answer:"Ils n' ont pas de chat", note:'pas + un/une/des → <b>pas de</b> (pas d\' vor Vokal)' },
    F('Schreib das fehlende Wort: Je ne suis ___ triste.','Je ne suis ___ triste.','pas',{de:'Ich bin nicht traurig.'}),
  ]},

  poss: { icon:'👜', titre:'mon, ma, mes', titel:'mein, dein, sein (Possessiv)', steps:[
    D('„Mein“ richtet sich nach dem Ding, das einem gehört – nicht nach dem Besitzer! «mon» vor männlich, «ma» vor weiblich, «mes» in der Mehrzahl.',
      'Genauso: «ton/ta/tes» = dein, «son/sa/ses» = sein ODER ihr. Trick: vor Vokal immer «mon/ton/son», auch bei weiblichen Wörtern: «mon amie».'),
    { type:'apporte', set:'poss', n:8, erz:'Apportieren: mon, ma oder mes? 🦴' },
    C('mein ___ chien',"___ chien",['mon','ma','mes'],'mon',{full:'mon chien'}),
    C('meine ___ sœur (Schwester)','___ sœur',['ma','mon','mes'],'ma',{full:'ma sœur'}),
    C('meine ___ copains (Mehrzahl)','___ copains',['mes','mon','ma'],'mes',{full:'mes copains'}),
    C('deine Katze: ___ chat (chat ist männlich!)','___ chat',['ton','ta','tes'],'ton',{full:'ton chat'}),
    C('seine/ihre Familie: ___ famille','___ famille',['sa','son','ses'],'sa',{full:'sa famille',note:'<b>sa</b> famille = seine ODER ihre Familie'}),
    C('meine Freundin: ___ amie (Vokal!)','___ amie',['mon','ma'],'mon',{full:'mon amie',note:'Vor Vokal: <b>mon</b> amie, auch wenn weiblich'}),
    C('ihre Hunde: ___ chiens','___ chiens',['ses','son','sa'],'ses',{full:'ses chiens'}),
  ]},

  u3: { icon:'🛒', titre:'préférer, acheter, il y a', titel:'préférer, acheter, il y a, Fragen', steps:[
    D('Zwei besondere -er-Verben aus Unité 3: «préférer» (lieber mögen) und «acheter» (kaufen). Die Endungen kennst du schon – E, ES, E, ONS, EZ, ENT!',
      'Der Trick: Bei <b>je, tu, il/elle, ils/elles</b> ändert sich der Akzent im Stamm: «je préf<b>è</b>re», «j\'ach<b>è</b>te». Bei <b>nous</b> und <b>vous</b> bleibt er wie im Infinitiv: «nous préf<b>é</b>rons», «nous achetons».',
      'Merkhilfe: Die vier Formen, bei denen man die Endung NICHT hört, bekommen den „Dach-Akzent“ <b>è</b>. Die zwei mit hörbarer Endung (-ons, -ez) nicht.'),
    { type:'conj', verb:'préférer', erz:'So sieht «préférer» aus – achte auf <b>è</b> und <b>é</b>:', forms:[['je','préfère','ich mag lieber'],['tu','préfères','du magst lieber'],['il/elle/on','préfère','er/sie mag lieber'],['nous','préférons','wir mögen lieber'],['vous','préférez','ihr mögt lieber'],['ils/elles','préfèrent','sie mögen lieber']], tip:'è bei je · tu · il · ils — é bei nous · vous' },
    { type:'conj', verb:'préférer', phase:'pick', erz:'Tippe die richtigen Formen an!', forms:[['je','préfère'],['tu','préfères'],['il/elle/on','préfère'],['nous','préférons'],['vous','préférez'],['ils/elles','préfèrent']] },
    { type:'apporte', set:'pref', n:8, erz:'Apportieren mit préférer! 🦴 Achte auf die Endung UND den Akzent.' },
    { type:'conj', verb:'acheter', erz:'Und «acheter» (kaufen). Achtung: «j\'achète» – mit Apostroph!', forms:[["j'",'achète','ich kaufe'],['tu','achètes','du kaufst'],['il/elle/on','achète','er/sie kauft'],['nous','achetons','wir kaufen'],['vous','achetez','ihr kauft'],['ils/elles','achètent','sie kaufen']], tip:'è bei je · tu · il · ils — kein Akzent bei nous · vous' },
    { type:'conj', verb:'acheter', phase:'pick', erz:'Tippe die richtigen Formen von acheter an!', forms:[["j'",'achète'],['tu','achètes'],['il/elle/on','achète'],['nous','achetons'],['vous','achetez'],['ils/elles','achètent']] },
    F('Papa ___ un cadeau. (acheter)','Papa ___ un cadeau.','achète',{de:'Papa kauft ein Geschenk.'}),
    F('Nous ___ une BD. (acheter)','Nous ___ une BD.','achetons',{de:'Wir kaufen einen Comic.'}),
    F('Tu ___ le foot ou le tennis ? (préférer)','Tu ___ le foot ou le tennis ?','préfères',{de:'Magst du lieber Fußball oder Tennis?'}),
    F('Vous ___ la musique ? (préférer)','Vous ___ la musique ?','préférez',{de:'Mögt ihr lieber Musik?'}),
    D('«il y a» heißt <i>es gibt</i> oder <i>da ist / da sind</i>. Es ändert sich nie: «Il y a un chien.» – «Il y a trois chats.»',
      'Fragen: «Qu\'est-ce que c\'est ?» = <i>Was ist das?</i> (für Sachen). «Qui est-ce ?» = <i>Wer ist das?</i> (für Personen – und Tiere mit Namen).'),
    C('Was fragst du? 📚 (ein Buch)','___',["Qu'est-ce que c'est ?",'Qui est-ce ?'],"Qu'est-ce que c'est ?",{note:'Sache → <b>Qu\'est-ce que c\'est ?</b>'}),
    C('Was fragst du? 👧 (ein Mädchen)','___',['Qui est-ce ?',"Qu'est-ce que c'est ?"],'Qui est-ce ?',{note:'Person → <b>Qui est-ce ?</b>'}),
    C('Was fragst du? ✏️ (ein Stift)','___',["Qu'est-ce que c'est ?",'Qui est-ce ?'],"Qu'est-ce que c'est ?"),
    C('Was fragst du? 👴 (der Opa)','___',['Qui est-ce ?',"Qu'est-ce que c'est ?"],'Qui est-ce ?'),
    C('<i>Im Zimmer gibt es einen Hund.</i>','Dans la chambre, ___ un chien.',['il y a','il est','il a'],'il y a',{note:'<b>il y a</b> = es gibt'}),
    C('<i>Es gibt drei Katzen im Garten.</i>','___ trois chats dans le jardin.',['Il y a','Ils sont','Ils ont'],'Il y a'),
    { type:'build', erz:'Bau den Satz: <i>Was ist das? – Das ist ein Knochen.</i> (l\'os = der Knochen)', tiles:["Qu'est-ce que c'est ?","C'est",'un','os','Qui est-ce ?'], answer:"Qu'est-ce que c'est ? C'est un os" },
  ]},

  nombres: { icon:'🔢', titre:'Les nombres', titel:'Zahlen 0–31', steps:[
    D('Zahlen! 0 bis 16 haben eigene Wörter: zéro, un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze, douze, treize, quatorze, quinze, seize.',
      'Ab 17 wird zusammengesetzt: «dix-sept» (10+7), «dix-huit», «dix-neuf». Dann «vingt» (20), «vingt et un» (21 – mit «et»!), «vingt-deux», … «trente» (30), «trente et un» (31).',
      'Achtung, typische Fehler: «cinq» (mit q), «six» und «dix» (mit x), «vingt» (mit gt). Und bei 21 und 31 steht «et» ohne Bindestrich.'),
    { type:'apporte', set:'nombre', n:8, erz:'Apportieren mit Zahlen! 🦴 Tippe den Knochen mit dem richtigen Zahlwort an.' },
    { type:'listen', erz:'Hör zu! Welche Zahl ist das?', say:'quatorze', options:['14','4','40'], answer:'14' },
    { type:'listen', erz:'Und diese?', say:'seize', options:['16','6','13'], answer:'16' },
    { type:'listen', erz:'Und diese?', say:'vingt et un', options:['21','20','12'], answer:'21' },
    F('Schreib als Wort: <b>5</b>','___',['cinq'],{hints:['mit q am Ende']}),
    F('Schreib als Wort: <b>12</b>','___',['douze'],{}),
    F('Schreib als Wort: <b>15</b>','___',['quinze'],{}),
    F('Schreib als Wort: <b>18</b>','___',['dix-huit','dix huit'],{hints:['10 + 8 → dix-…']}),
    F('Schreib als Wort: <b>20</b>','___',['vingt'],{hints:['mit gt am Ende']}),
    F('Schreib als Wort: <b>21</b>','___',['vingt et un'],{hints:['20 <b>et</b> 1']}),
    C('Wie alt ist {N}? «{N} a trois ans.»','{N} a trois ans.',['3 Jahre','13 Jahre','30 Jahre'],'3 Jahre'),
    C('Telefonnummer! «C\'est le 06 15 12 18.» Was ist «quinze»?','quinze',['15','5','50'],'15'),
    { type:'apporte', set:'nombre', n:8, erz:'Noch eine Runde – diesmal mit anderen Zahlen! 🦴' },
  ]},

  jours: { icon:'📅', titre:'Les jours', titel:'Wochentage', steps:[
    D('Die Wochentage: «lundi» (Montag), «mardi», «mercredi», «jeudi», «vendredi», «samedi», «dimanche» (Sonntag).',
      'Wichtig: Sie werden <b>klein</b> geschrieben! Und alle außer dimanche enden auf «-di». «le lundi» heißt <i>montags</i> (jeden Montag).',
      'Eselsbrücke: lun<b>di</b> = Mond (lune) · mar<b>di</b> = Mars · mercre<b>di</b> = Merkur · jeu<b>di</b> = Jupiter · vendre<b>di</b> = Venus.'),
    { type:'apporte', set:'jour', n:8, erz:'Apportieren mit Wochentagen! 🦴 7 Knochen, 7 Tage.' },
    { type:'build', erz:'Bring die Wochentage in die richtige Reihenfolge!', tiles:['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].sort(()=>Math.random()-.5), answer:'lundi mardi mercredi jeudi vendredi samedi dimanche' },
    F('Schreib: <b>Mittwoch</b>','___',['mercredi'],{}),
    F('Schreib: <b>Donnerstag</b>','___',['jeudi'],{}),
    F('Schreib: <b>Samstag</b>','___',['samedi'],{}),
    C('Heute ist «mardi». Was ist morgen?','Demain, c\'est ___.',['mercredi','lundi','jeudi'],'mercredi',{de:'Morgen ist Mittwoch.'}),
    C('«Le samedi, {N} joue au parc.» Was heißt das?','Le samedi, {N} joue au parc.',['Samstags spielt {N} im Park.','Am Sonntag spielt {N} im Park.','{N} spielt im Park einkaufen.'],'Samstags spielt {N} im Park.'),
    { type:'apporte', set:'jour', n:6, erz:'Schnelle Runde! 🦴' },
  ]},

  lire: { icon:'📖', titre:'Lire et comprendre', titel:'Lesen & verstehen', steps:[
    D('Lesen wie in der Schulaufgabe! Du bekommst kurze Texte: Zettel, Flyer, Schilder, Briefe. Die Fragen sind auf Deutsch.',
      'Strategie aus dem Buch: Du musst <b>nicht jedes Wort</b> verstehen! Such nur die Information, nach der gefragt wird. Viele Wörter kennst du aus dem Deutschen oder Englischen.'),
    ...LIRE.map(t=>({type:'lire',...t})),
  ]},

};

// Hundeschul-Rahmen vor jeder Lektion
const HS={
  er:'🎓 Willkommen in der <b>Hundeschule</b>! {N} lernt mit dir: Bei jeder richtigen Antwort zeigt {N} einen Trick – oft genau das, was im Satz steht! 🔥 3 richtig in Folge = Bonus-Knochen. Am Ende jeder Lektion gibt es ein Abzeichen und manchmal ein Geschenk für {N}.',
  er2:'🎓 Hundeschule, Stunde 2! {N} wedelt schon. Schaffst du eine 🔥-Serie von 6?',
  etre:'🎓 Hundeschule: Heute lernt {N} das wichtigste Verb der Welt. Wenn du être und avoir schaffst, bekommt {N} ein Halstuch! 🧣',
  avoir:'🎓 Hundeschule: avoir! Noch diese Lektion – dann gibt es das Halstuch für {N}. 🧣',
  art:'🎓 Hundeschule: Artikel! {N} sitzt brav und hört zu.',
  neg:'🎓 Hundeschule: Heute sagt {N} auch mal NEIN. 🥪',
  u3:'🎓 Hundeschule: Unité 3! {N} hat Hunger – wir gehen einkaufen. 🛒',
  nombres:'🎓 Hundeschule: Zählen! Wie viele Leckerlis bekommt {N}? 🦴',
  jours:'🎓 Hundeschule: Wochentage! An welchem Tag geht {N} in den Park?',
  lire:'🎓 Hundeschule: Lesen! {N} kann nicht lesen – aber du! 📖',
  poss:'🎓 Hundeschul-Stunde mon/ma/mes! Danach bekommt {N} den Doktorhut 🎩 – und du bist bereit für die Probe-Schulaufgabe.',
};
for(const id in HS) GRAM[id].steps.unshift({type:'dialogue',lines:[{who:'Coco',erz:HS[id]}]});

// Schulaufgaben-Mix: zufällige Aufgaben aus allen Lektionen (ohne Erklärungen)
export function mixLesson(n=14){
  const pool=Object.values(GRAM).flatMap(l=>l.steps.filter(s=>s.type==='fill'||s.type==='choice'||(s.type==='conj'&&s.phase==='type')));
  const pick=[]; const p=[...pool]; while(pick.length<n-6&&p.length) pick.push(p.splice(Math.floor(Math.random()*p.length),1)[0]); for(let i=0;i<6;i++) pick.splice(Math.floor(Math.random()*pick.length),0,GEN[R(['ending','ending','endingPick','etre','avoir','unUne','poss'])]());
  return { titre:'Schulaufgaben-Mix', steps:[ {type:'dialogue',lines:[{who:'Coco',erz:'Schulaufgaben-Training! Ich mische Aufgaben aus allen Lektionen. Keine Hilfe am Anfang – wie in der echten Schulaufgabe. Los geht\'s! 💪'}]}, ...pick ] };
}

// =============================================================
//  PROBE-SCHULAUFGABE: jedes Mal neu gemischt, verschiedene Aufgabentypen
//  (Vokabeln beide Richtungen, Hören, Endungen, être/avoir, Artikel, Verneinung,
//   Possessiv, Sätze bauen). Wird am Ende mit Punkten und Note bewertet.
// =============================================================
const R=a=>a[Math.floor(Math.random()*a.length)];
const SH=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const VOCAB_DECKS=['salut','famille','ecole','nombres','animaux','couleurs','rue','loisirs','petitsmots','ausrufe'];
const ERV=[['parler','parl','sprechen','français'],['jouer','jou','spielen','au foot'],['aimer','aim','mögen','les chiens'],['regarder','regard','anschauen','la télé'],['habiter','habit','wohnen','à Paris'],['écouter','écout','hören','de la musique'],['chercher','cherch','suchen','le chat'],['chanter','chant','singen','une chanson'],['danser','dans','tanzen','avec {N}'],['travailler','travaill','arbeiten','beaucoup'],['rester','rest','bleiben','à la maison'],['arriver','arriv','ankommen','à l\'école']];
const PRON=[['je','e'],['tu','es'],['il','e'],['elle','e'],['on','e'],['nous','ons'],['vous','ez'],['ils','ent'],['elles','ent']];
const ETRE={je:'suis',tu:'es',il:'est',elle:'est',on:'est',nous:'sommes',vous:'êtes',ils:'sont',elles:'sont'};
const AVOIR={je:'ai',tu:'as',il:'a',elle:'a',on:'a',nous:'avons',vous:'avez',ils:'ont',elles:'ont'};
const vowel=s=>/^[aeiouhéèê]/i.test(s);
const subj=(p,w)=>p==='je'&&vowel(w)?"J'":p.charAt(0).toUpperCase()+p.slice(1)+' ';
let USED=new Set();
const pickW=(all)=>{ const f=all.filter(w=>!USED.has(w.fr)); const w=R(f.length?f:all); USED.add(w.fr); return w; };
const words=()=>VOCAB_DECKS.flatMap(d=>(DECKS[d]?.words||[]).map(w=>({...w,deck:d}))).filter(w=>w.fr&&w.de);

const GEN={
  vocDeFr(){ const all=words(), w=pickW(all); const bare=[w.fr,...(w.alt||[])].map(x=>x.replace(/^(le |la |les |l'|un |une )/,'')); return {type:'fill',erz:`Übersetze ins Französische: <b>${w.de}</b>`,answer:[w.fr,...(w.alt||[]),...bare],_topic:'Vokabeln'}; },
  vocFrDe(){ const all=words(), w=pickW(all), o=SH(all.filter(x=>x.de!==w.de)).slice(0,3).map(x=>x.de);
    return {type:'choice',erz:`Was heißt «${w.fr}»?`,options:SH([w.de,...o]),answer:w.de,_topic:'Vokabeln'}; },
  vocArt(){ const all=words().filter(w=>/^(le|la) /.test(w.fr)), w=R(all); if(!w) return GEN.vocFrDe(); const n=w.fr.replace(/^(le|la) /,'');
    return {type:'choice',erz:`le oder la? <i>${w.de}</i>`,fr:`___ ${n}`,options:['le','la'],answer:w.fr.slice(0,2),full:w.fr,_topic:'Artikel'}; },
  ecoute(){ const all=words(), w=pickW(all), o=SH(all.filter(x=>x.fr!==w.fr)).slice(0,2).map(x=>x.fr);
    return {type:'listen',erz:'Hör genau hin – welches Wort war das?',options:[w.fr,...o],answer:w.fr,note:`<b>${w.fr}</b> = ${w.de}`,_topic:'Hören'}; },
  ending(){ const [inf,st,de,obj]=R(ERV), [p,e]=R(PRON); const form=st+(p==='nous'&&st.endsWith('g')?'e':'')+e;
    return {type:'fill',strict:true,erz:`Setze «${inf}» (${de}) richtig ein:`,fr:`${subj(p,form)}___ ${obj}.`.replace("' ___","'___"),answer:[form],full:`${subj(p,form)}${form} ${obj}.`.replace("' ","'"),note:`${p} → <b>-${e}</b>`,_topic:'-er-Endungen'}; },
  endingPick(){ const [inf,st,de]=R(ERV), [p,e]=R(PRON);
    return {type:'choice',erz:`Welche Endung? (${inf} = ${de})`,fr:`${p} ${st}___`,options:SH(['e','es','ons','ez','ent']),answer:e,full:`${p} ${st}${e}`,_topic:'-er-Endungen'}; },
  etre(){ const p=R(Object.keys(ETRE)); return {type:'fill',strict:true,erz:'Setze «être» (sein) ein:',fr:`${p.charAt(0).toUpperCase()+p.slice(1)} ___ ${R(['à la maison','content','en classe','de Munich','sympa'])}.`,answer:[ETRE[p]],_topic:'être'}; },
  avoir(){ const p=R(Object.keys(AVOIR)); const s=p==='je'?"J'":p.charAt(0).toUpperCase()+p.slice(1)+' ';
    return {type:'fill',strict:true,erz:'Setze «avoir» (haben) ein:',fr:`${s}___ ${R(['un chien','une sœur','faim','onze ans','un stylo'])}.`.replace("' ___","'___"),answer:[AVOIR[p]],_topic:'avoir'}; },
  esEst(){ const it=R([['Tu ___ content ?','es'],['Il ___ à Paris.','est'],['Elle ___ sympa.','est'],['Tu ___ où ?','es'],['On ___ en classe.','est']]); return {type:'choice',erz:'es oder est?',fr:it[0],options:['es','est'],answer:it[1],_topic:'être'}; },
  sontOnt(){ const has=Math.random()<.5; return {type:'choice',erz:has?'<i>Sie haben einen Hund.</i>':'<i>Sie sind in der Schule.</i>',fr:has?'Ils ___ un chien.':'Ils ___ à l\'école.',options:['ont','sont'],answer:has?'ont':'sont',_topic:'être/avoir'}; },
  article(){ const w=R(words().filter(w=>/^(le|la|l'|les) /.test(w.fr)||/^l'/.test(w.fr))); if(!w) return GEN.vocArt();
    const art=w.fr.match(/^(le|la|les|l')/)[1], n=w.fr.replace(/^(le |la |les |l')/,'');
    return {type:'choice',erz:`Welcher Artikel? <i>${w.de}</i>`,fr:`___ ${n}`,options:['le','la',"l'",'les'],answer:art,full:w.fr,_topic:'Artikel'}; },
  unUne(){ const it=R([['chien','un','Hund'],['fille','une','Mädchen'],['garçon','un','Junge'],['maison','une','Haus'],['livre','un','Buch'],['copine','une','Freundin'],['chats','des','Katzen (Mehrzahl)'],['stylo','un','Stift'],['école','une','Schule'],['amis','des','Freunde (Mehrzahl)']]);
    return {type:'choice',erz:`un, une oder des? <i>${it[2]}</i>`,fr:`C'est ___ ${it[0]}.`.replace("C'est ___ chats","Ce sont ___ chats").replace("C'est ___ amis","Ce sont ___ amis"),options:['un','une','des'],answer:it[1],_topic:'Artikel'}; },
  neg(){ const it=R([['Je','parle','allemand','Ich spreche nicht Deutsch.'],['Tu','regardes','la télé','Du schaust nicht fern.'],['{N}','aime','les chats','{N} mag keine Katzen.'],['Nous','jouons','au foot','Wir spielen nicht Fußball.'],['Il','est','fatigué','Er ist nicht müde.'],['Elles','habitent','à Paris','Sie wohnen nicht in Paris.']]);
    const ne=vowel(it[1])?"n'":'ne'; return {type:'build',erz:`Verneine den Satz: <i>${it[3]}</i>`,fr:`${it[0]} ${it[1]} ${it[2]}.`,tiles:[it[0],ne,it[1],'pas',...it[2].split(' '),vowel(it[1])?'ne':"n'"],answer:`${it[0]} ${ne} ${it[1]} pas ${it[2]}`,_topic:'ne … pas'}; },
  poss(){ const it=R([['mein','chien','mon'],['meine','sœur','ma'],['meine (Mz.)','copains','mes'],['dein','livre','ton'],['deine','maison','ta'],['sein/ihr','chat','son'],['seine/ihre','famille','sa'],['meine','amie','mon'],['deine (Mz.)','parents','tes']]);
    const opts={m:['mon','ma','mes'],t:['ton','ta','tes'],s:['son','sa','ses']}[it[2][0]];
    return {type:'choice',erz:`<i>${it[0]} …</i>`,fr:`___ ${it[1]}`,options:opts,answer:it[2],full:`${it[2]} ${it[1]}`,_topic:'mon/ma/mes'}; },
  nombre(){ const i=1+Math.floor(Math.random()*31); return Math.random()<.5? {type:'fill',erz:`Schreib als Wort: <b>${i}</b>`,answer:[NUMW[i],NUMW[i].replace(/-/g,' ')],_topic:'Zahlen'} : {type:'listen',erz:'Hör zu! Welche Zahl?',say:NUMW[i],options:SH([String(i),String((i+10)%31||1),String((i+3)%31||2)].filter((x,j,a)=>a.indexOf(x)===j)),answer:String(i),_topic:'Zahlen'}; },
  jour(){ const k=Math.floor(Math.random()*7); return Math.random()<.5? {type:'fill',erz:`Schreib auf Französisch: <b>${JDE[k]}</b>`,answer:[JOURS[k]],_topic:'Wochentage'} : {type:'choice',erz:`Nach «${JOURS[(k+6)%7]}» kommt …`,options:SH([JOURS[k],JOURS[(k+2)%7],JOURS[(k+5)%7]]),answer:JOURS[k],_topic:'Wochentage'}; },
  pref(){ const [p,f]=R(PREF); return {type:'fill',strict:true,erz:'Setze «préférer» ein (Akzent beachten!):',fr:`${cap(p)} ___ le chocolat.`,answer:[f],_topic:'préférer/acheter'}; },
  achat(){ const A={je:"achète",tu:'achètes',il:'achète',nous:'achetons',vous:'achetez',ils:'achètent'}; const p=R(Object.keys(A)); return {type:'fill',strict:true,erz:'Setze «acheter» (kaufen) ein:',fr:`${p==='je'?"J'":cap(p)+' '}___ un cadeau.`.replace("' ___","'___"),answer:[A[p]],_topic:'préférer/acheter'}; },
  quiQuoi(){ const it=R([['📚 ein Buch',0],['👧 ein Mädchen',1],['✏️ ein Stift',0],['👨 der Lehrer',1],['🏠 ein Haus',0],['👵 die Oma',1]]); return {type:'choice',erz:`Was fragst du? ${it[0]}`,options:["Qu'est-ce que c'est ?",'Qui est-ce ?'],answer:it[1]?'Qui est-ce ?':"Qu'est-ce que c'est ?",_topic:'Fragen'}; },
  ilya(){ return {type:'choice',erz:'<i>Es gibt einen Park.</i>',fr:'___ un parc.',options:['Il y a','Il est','Il a'],answer:'Il y a',_topic:'il y a'}; },
  lire(){ const t=R(LIRE); const qs=SH(t.qs).slice(0,2); return {type:'lire',title:t.title,erz:t.erz,text:t.text,qs,_topic:'Lesen'}; },
  phrase(){ const it=R([['Ich heiße Léa.',"Je m'appelle Léa"],['Wie geht\'s?','Ça va'],['Wo wohnst du?','Tu habites où'],['Wir spielen Fußball.','Nous jouons au foot'],['Das ist meine Schwester.',"C'est ma sœur"],['Ich habe einen Hund.',"J'ai un chien"],['Sie sind nett.','Ils sont sympa']]);
    const t=it[1].split(' '); return {type:'build',erz:`Bau den Satz: <i>${it[0]}</i>`,tiles:SH([...t,R(['est','es','ma','les','nous'].filter(x=>!t.includes(x)))]),answer:it[1],_topic:'Sätze'}; },
};
// Probe-Schulaufgabe: feste Mischung der Aufgabentypen, Reihenfolge zufällig
export function examLesson(){
  const plan=['lire','lire','nombre','nombre','jour','jour','pref','achat','quiQuoi','ilya','vocDeFr','vocDeFr','vocFrDe','ecoute','vocArt','ending','ending','ending','endingPick','etre','etre','avoir','avoir','sontOnt','esEst','article','unUne','neg','poss','phrase'];
  USED=new Set(); const steps=SH(plan).map(k=>GEN[k]());
  return { titre:'Probe-Schulaufgabe', exam:true, steps:[ {type:'dialogue',lines:[{who:'Coco',erz:`Probe-Schulaufgabe! ${steps.length} Aufgaben: Lesen, Vokabeln, Hören, Zahlen, Wochentage, Endungen, être, avoir, préférer/acheter, Artikel, Verneinung … Jedes Mal anders gemischt.`},{who:'Coco',erz:'Wie in der echten Schulaufgabe: Tipps (💡) kosten den Punkt. Für jede richtige Antwort zeigt {N} einen Trick, und 🔥-Serien bringen Bonus-Knochen. Am Ende bekommst du eine Note – und siehst, was du noch üben solltest. «Bon courage !» 💪'}]}, ...steps ] };
}

// Runden fürs Knochen-Apportieren – verschiedene Sets
// Runde: { pre, post, ans, de, tip }  → Anzeige: pre + ___ + post
const cap=x=>x.charAt(0).toUpperCase()+x.slice(1);

const NUMW=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf','vingt','vingt et un','vingt-deux','vingt-trois','vingt-quatre','vingt-cinq','vingt-six','vingt-sept','vingt-huit','vingt-neuf','trente','trente et un'];
const JOURS=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'], JDE=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const PREF=[['je','préfère'],['tu','préfères'],['il','préfère'],['elle','préfère'],['nous','préférons'],['vous','préférez'],['ils','préfèrent'],['elles','préfèrent']];
const SETS={
  er:{ labels:['e','es','ons','ez','ent'], tip:'Denk an den Rap: E – ES – E, ONS – EZ – ENT!', make(){ const [inf,st,de,obj]=R(ERV), [p,e]=R(PRON); const sb=subj(p,st+e);
      return { pre:`${sb}${sb.endsWith("'")?'':''}${st}`, post:` ${obj}`, ans:e, de:`${inf} = ${de}`, tip:`${p} → -${e}`, key:p }; } },
  etre:{ labels:['suis','es','est','sommes','êtes','sont'], tip:'Denk an den être-Rap: suis – es – est – sommes – êtes – sont!', make(){ const p=R(Object.keys(ETRE)); const o=R(['à la maison','content','en classe','de Munich','sympa','dans le jardin']);
      return { pre:`${cap(p)} `, post:` ${o}.`, ans:ETRE[p], de:'être = sein', tip:`${p} → ${ETRE[p]}`, key:p }; } },
  avoir:{ labels:['ai','as','a','avons','avez','ont'], tip:'Denk an den avoir-Rap: ai – as – a – avons – avez – ont!', make(){ const p=R(Object.keys(AVOIR)); const o=R(['un chien','une sœur','faim','onze ans','un stylo','un vélo']);
      return { pre:p==='je'?"J'":`${cap(p)} `, post:` ${o}.`, ans:AVOIR[p], de:'avoir = haben', tip:`${p==='je'?"j'":p} → ${AVOIR[p]}`, key:p }; } },
  art:{ labels:['le','la',"l'",'les'], tip:"männlich → le · weiblich → la · vor Vokal → l' · Mehrzahl → les", make(){ const w=R(words().filter(w=>/^(le|la|les) |^l'/.test(w.fr))); const a=w.fr.match(/^(le|la|les|l')/)[1], n=w.fr.replace(/^(le |la |les |l')/,'');
      return { pre:'', post:` ${n}`, ans:a, de:w.de, tip:`${w.fr}`, key:'art' }; } },
  unune:{ labels:['un','une','des'], tip:'un = männlich · une = weiblich · des = Mehrzahl', make(){ const it=R([['chien','un','ein Hund'],['fille','une','ein Mädchen'],['garçon','un','ein Junge'],['maison','une','ein Haus'],['livre','un','ein Buch'],['copine','une','eine Freundin'],['chats','des','Katzen'],['stylo','un','ein Stift'],['école','une','eine Schule'],['amis','des','Freunde'],['balle','une','ein Ball'],['vélos','des','Fahrräder']]);
      return { pre:"C'est ".replace("C'est ",it[1]==='des'?'Ce sont ':"C'est "), post:` ${it[0]}.`, ans:it[1], de:it[2], tip:`${it[1]} ${it[0]}`, key:'unune' }; } },
  poss:{ labels:['mon','ma','mes'], tip:'mon = männlich (oder Vokal) · ma = weiblich · mes = Mehrzahl', make(){ const it=R([['chien','mon','mein Hund'],['sœur','ma','meine Schwester'],['copains','mes','meine Freunde'],['livre','mon','mein Buch'],['maison','ma','mein Haus'],['amie','mon','meine Freundin (Vokal!)'],['parents','mes','meine Eltern'],['chambre','ma','mein Zimmer'],['école','mon','meine Schule (Vokal!)']]);
      return { pre:'', post:` ${it[0]}`, ans:it[1], de:it[2], tip:`${it[1]} ${it[0]}`, key:'poss' }; } },
  pref:{ labels:['préfère','préfères','préférons','préférez','préfèrent'], tip:'è bei je/tu/il/ils (Endung stumm) · é bei nous/vous', make(){ const [p,f]=R(PREF); const o=R(['le foot','la musique','les chats','le tennis','la danse','les BD']);
      return { pre:`${cap(p)} `, post:` ${o}.`, ans:f, de:'préférer = lieber mögen', tip:`${p} → ${f}`, key:p }; } },
  nombre:{ dyn:true, init(){ const pool=SH([...Array(32).keys()].slice(1)).slice(0,6); return pool; }, tip:'17 = dix-sept · 21 = vingt et un', make(pool){ const i=R(pool); return { pre:`${i} = `, post:'', ans:NUMW[i], de:'Zahl als Wort', tip:`${i} = ${NUMW[i]}`, key:'n'+i }; } },
  jour:{ labels:JOURS, tip:'lundi · mardi · mercredi · jeudi · vendredi · samedi · dimanche', make(){ const k=Math.floor(Math.random()*7), t=Math.floor(Math.random()*3);
      if(t===0) return { pre:`${JDE[k]} = `, post:'', ans:JOURS[k], de:'Wochentag', tip:`${JDE[k]} = ${JOURS[k]}`, key:'j'+k };
      if(t===1){ const a=(k+6)%7; return { pre:`Nach «${JOURS[a]}» kommt `, post:'', ans:JOURS[k], de:'Welcher Tag kommt danach?', tip:`${JOURS[a]} → ${JOURS[k]}`, key:'j'+k }; }
      const b=(k+1)%7; return { pre:'', post:` kommt vor «${JOURS[b]}»`, ans:JOURS[k], de:'Welcher Tag kommt davor?', tip:`${JOURS[k]} → ${JOURS[b]}`, key:'j'+k }; } },
  neg:{ labels:['ne',"n'"], tip:"Vor einem Vokal wird ne zu n'", make(){ const it=R([['Je','parle','pas allemand'],['Tu','aimes','pas le foot'],['Il','est','pas là'],['Nous','jouons','pas'],['Elle','habite','pas à Paris'],['Vous','regardez','pas la télé'],['Ils','ont','pas de chat'],['Je','suis','pas fatigué']]);
      const v=vowel(it[1]); return { pre:`${it[0]} `, post:`${v?'':' '}${it[1]} ${it[2]}.`, ans:v?"n'":'ne', de:'Verneinung', tip:v?`vor Vokal (${it[1]}) → n'`:'vor Konsonant → ne', key:'neg', dpost:` ${it[1]} ${it[2]}.` }; } },
};
export function fetchSet(set='er',n=8){ const S=SETS[set]||SETS.er; const out=[]; let last=''; const pool=S.init?S.init():null;
  for(let k=0;k<200&&out.length<n;k++){ const r=S.make(pool); if(r.ans===last) continue; last=r.ans; out.push(r); }
  return { labels:pool?pool.map(i=>NUMW[i]):S.labels, tip:S.tip, rounds:out }; }

// =============================================================
//  ERKLÄRUNGEN BEI FEHLERN: Was war falsch – und wie geht es richtig (mit Beispiel)
// =============================================================
const strip=x=>String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const ENDS=['ent','ons','ez','es','e'];
const ENDWHO={e:'je und il/elle/on',es:'tu',ons:'nous',ez:'vous',ent:'ils/elles'};
const ENDEX={e:'je parle · il joue',es:'tu parles · tu joues',ons:'nous parlons · nous jouons',ez:'vous parlez · vous jouez',ent:'ils parlent · elles jouent'};
const PRONS=['je',"j'",'tu','il','elle','on','nous','vous','ils','elles'];
// Subjekt vor der Lücke erkennen → Pronomen
export function subjectOf(fr){ const pre=String(fr||'').split('___')[0].replace(/^(oui|non),?\s*/i,'').trim(); const low=pre.toLowerCase();
  const last=low.split(/\s+/).pop().replace(/['’]$/,"'");
  if(last==="j'"||low.endsWith("j'")) return {p:'je',s:pre};
  if(PRONS.includes(last)) return {p:last,s:pre};
  if(/ et |^les |^des /.test(low+' ')) return {p:'ils',s:pre,many:true};
  if(!pre) return null;
  return {p:'il',s:pre,name:true}; }
const pWho=S=>S.name?`«${S.s}» (eine Person/ein Ding = wie il/elle)`:S.many?`«${S.s}» (mehrere = wie ils/elles)`:`«${S.s}»`;
const endOf=w=>{ const n=strip(w); return ENDS.find(e=>n.endsWith(e)); };
const ETREF={je:'suis',tu:'es',il:'est',elle:'est',on:'est',nous:'sommes',vous:'êtes',ils:'sont',elles:'sont'};
const AVOIRF={je:'ai',tu:'as',il:'a',elle:'a',on:'a',nous:'avons',vous:'avez',ils:'ont',elles:'ont'};
const whoHas=(map,form)=>Object.keys(map).filter(k=>strip(map[k])===strip(form)).map(k=>k==='je'&&map===AVOIRF?"j'":k);
const box=(t)=>`<span class="expl">🧠 ${t}</span>`;

export function explain(st,given){
  const want=String([].concat(st.answer||'')[0]||''), g=String(given||'').trim(); if(!want) return '';
  const W=strip(want), G=strip(g); const S=subjectOf(st.fr||''); const full=(st.full||(st.fr?st.fr.replace('___',want).replace("' ","'"):''));
  const ex= full? `<br>✅ Richtig: <b class="fr">${full}</b>`:`<br>✅ Richtig: <b class="fr">${want}</b>`;
  // nur Akzent falsch
  if(G===W && g!==want) return box(`Fast! Nur der <b>Akzent</b> fehlt oder ist falsch: <b class="fr">${want}</b>. ${/è/.test(want)?'Bei je/tu/il/ils (stumme Endung) steht <b>è</b>.':/é/.test(want)?'Bei nous/vous (hörbare Endung) bleibt das <b>é</b>.':''}`);
  // être / avoir
  const inE=Object.values(ETREF).map(strip), inA=Object.values(AVOIRF).map(strip);
  if((inE.includes(W)||inA.includes(W))&&S&&g){ const verb=inE.includes(W)?'être':'avoir', map=verb==='être'?ETREF:AVOIRF, other=verb==='être'?AVOIRF:ETREF;
    if(Object.values(other).map(strip).includes(G)&&!Object.values(map).map(strip).includes(G)) return box(`«${g}» ist eine Form von <b>${verb==='être'?'avoir (haben)':'être (sein)'}</b>. Gesucht ist <b>${verb}</b> (${verb==='être'?'sein':'haben'}).${verb==='être'?' Merke: ils <b>sont</b> = sie sind · ils <b>ont</b> = sie haben.':' Merke: ils <b>ont</b> = sie haben · ils <b>sont</b> = sie sind.'}${ex}`);
    const who=whoHas(map,g); if(who.length) return box(`«${g}» gehört zu <b>${who.join(' / ')}</b>. Hier ist das Subjekt ${pWho(S)} → <b class="fr">${S.p==='je'&&verb==='avoir'?"j'":S.p} ${map[S.p]}</b>.${G==='es'||W==='es'?' Achtung: tu <b>es</b> (ohne t) · il <b>est</b> (mit t).':''}${ex}`);
    return box(`Bei <b>${verb}</b> heißt es mit ${pWho(S)}: <b class="fr">${map[S.p]}</b>. Sag die Reihe auf: ${Object.entries(map).filter(([k])=>!['elle','on','elles'].includes(k)).map(([k,v])=>`${k} ${v}`).join(' · ')}${ex}`); }
  // -er-Endungen (auch préférer/acheter)
  const we=endOf(want); const stem=we? strip(want).slice(0,-we.length):'';
  if(we&&S&&stem.length>=3&&G.startsWith(stem.slice(0,3))){ const gr=strip(g).startsWith(stem)? strip(g).slice(stem.length):null;
    if(gr==='') return box(`Du hast nur den <b>Stamm</b> geschrieben (${stem}). Es fehlt die Endung! Zu ${pWho(S)} gehört <b>-${we}</b>.${ex}`);
    if(gr&&ENDS.includes(gr)) return box(`Die Endung <b>-${gr}</b> gehört zu <b>${ENDWHO[gr]}</b>. Hier ist das Subjekt ${pWho(S)} → Endung <b>-${we}</b>.<br>Beispiel: <span class="fr">${ENDEX[we]}</span>${ex}`);
    if(gr==='er') return box(`«${g}» ist die <b>Grundform</b> (Infinitiv). Im Satz musst du konjugieren: ${pWho(S)} → <b>-${we}</b>.<br>Beispiel: <span class="fr">${ENDEX[we]}</span>${ex}`);
    return box(`Achte auf die Endung: Zu ${pWho(S)} gehört <b>-${we}</b>. Merkspruch: E – ES – E, ONS – EZ – ENT.${ex}`); }
  // Artikel
  const art=['le','la',"l'",'les'], ind=['un','une','des'], pos=['mon','ma','mes','ton','ta','tes','son','sa','ses'];
  const after=String(st.fr||'').split('___')[1]?.trim()||''; const noun=after.split(/\s+/)[0]?.replace(/[.!?]/g,'')||''; const voc=/^[aeiouhéèê]/i.test(noun);
  if(art.includes(want)){ let why= want==="l'"?`«${noun}» fängt mit einem <b>Vokal</b> an → <b>l'</b> (aus le/la wird l').`: want==='les'?`«${noun}» ist <b>Mehrzahl</b> → immer <b>les</b>, egal ob männlich oder weiblich.`:`«${noun}» ist im Französischen <b>${want==='le'?'männlich':'weiblich'}</b> → <b>${want}</b>.${g==="l'"?' l\' steht nur vor einem Vokal.':''} Tipp: Lern Nomen immer mit Artikel!`;
    return box(why+ex); }
  if(ind.includes(want)) return box((want==='des'?`Mehrzahl → <b>des</b> (im Deutschen oft gar kein Wort: „Katzen“).`:`«${noun}» ist <b>${want==='un'?'männlich':'weiblich'}</b> → <b>${want}</b>.`)+ex);
  if(pos.includes(want)){ const base={m:'mon',t:'ton',s:'son'}[want[0]]; return box((voc&&want===base?`«${noun}» fängt mit Vokal an → <b>${want}</b>, auch wenn das Wort weiblich ist (sonst stoßen zwei Vokale aneinander).`:want.endsWith('es')?`Mehrzahl → <b>${want}</b>.`:want.endsWith('a')?`«${noun}» ist <b>weiblich</b> → <b>${want}</b>.`:`«${noun}» ist <b>männlich</b> → <b>${want}</b>.`)+ ' Wichtig: Es richtet sich nach dem <b>Ding</b>, nicht nach der Person!'+ex); }
  if(want==='ne'||want==="n'") return box((want==="n'"?`Das Verb fängt mit einem <b>Vokal</b> an → <b>n'</b> statt ne.`:`Das Verb fängt mit einem <b>Konsonanten</b> an → <b>ne</b>. n' nur vor Vokal.`)+' Sandwich: ne + Verb + pas.'+ex);
  if(want==='Il y a'||want==='il y a') return box('«il y a» = <i>es gibt</i> – es bleibt immer gleich, egal wie viele Dinge. «il est» = er ist, «il a» = er hat.'+ex);
  if(/Qui est-ce/.test(want)) return box('Bei <b>Personen</b> (und Tieren mit Namen) fragt man <b>Qui est-ce ?</b> = Wer ist das? Bei Sachen: Qu\'est-ce que c\'est ?'+ex);
  if(/Qu'est-ce que/.test(want)) return box('Bei <b>Sachen</b> fragt man <b>Qu\'est-ce que c\'est ?</b> = Was ist das? Bei Personen: Qui est-ce ?'+ex);
  if(NUMW.includes(want)){ const i=NUMW.indexOf(want); const tip= i>=17&&i<=19?'17–19 werden zusammengesetzt: dix-sept (10+7), dix-huit, dix-neuf – mit Bindestrich.': i===21||i===31?'Bei 21 und 31 steht «et»: vingt et un, trente et un – ohne Bindestrich.': i>21?'Ab 22 mit Bindestrich: vingt-deux, vingt-trois …': /x$/.test(want)?'Endet auf x!':/q$/.test(want)?'Endet auf q!':/gt$/.test(want)?'vingt schreibt man mit gt.':'';
    return box(`${i} = <b class="fr">${want}</b>. ${tip}`); }
  if(JOURS.includes(want)){ const k=JOURS.indexOf(want); return box(`Die Reihenfolge: ${JOURS.map((j,x)=>x===k?`<b>${j}</b>`:j).join(' · ')}. <b>${want}</b> = ${JDE[k]}. Wochentage schreibt man <b>klein</b>.`); }
  return box(`Richtig ist <b class="fr">${want}</b>${full&&full!==want?` – also: <span class="fr">${full}</span>`:''}.`); }
