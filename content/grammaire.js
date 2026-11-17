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

export const GRAM = {

  er: { icon:'🔤', titre:'Les verbes en -er', titel:'Verben auf -er (Endungen)', steps:[
    D('Hier kommt der wichtigste Trick im Französischen! Die meisten Verben enden auf «-er»: «parler» (sprechen), «jouer» (spielen), «aimer» (mögen), «regarder» (anschauen).',
      'Man streicht das «-er» weg – übrig bleibt der Stamm: parl-er → «parl». Und dann hängt man eine Endung dran, je nachdem WER etwas tut. Genau wie im Deutschen: ich spiel<b>e</b>, du spiel<b>st</b>!',
      'Die Endungen sind immer dieselben: <b>-e, -es, -e, -ons, -ez, -ent</b>. Merkspruch: „<b>E – ES – E, ONS – EZ – ENT</b>“. Sag ihn dreimal laut, wie einen Rap! 🎤',
      'Und das Gemeine: <b>-e, -es, -e</b> und <b>-ent</b> hört man gar nicht! «je parle», «tu parles», «ils parlent» klingen alle gleich: „parl“. Darum muss man sie beim Schreiben auswendig wissen.'),
    { type:'conj', verb:'parler', erz:'So sieht «parler» (sprechen) aus. Die Endungen sind <b>fett</b> markiert – lies die Tabelle in Ruhe und lass sie dir vorlesen.', forms:ER('parl',['spreche','sprichst','spricht','sprecht'],'sprechen').map(f=>[f[0],f[1],f[2]]), tip:'Stamm <b>parl</b> + Endung: -e · -es · -e · -ons · -ez · -ent' },
    C('Welche Endung gehört zu <b>tu</b> (du)?','tu jou___',['es','e','ez','ons'],'es',{de:'du spielst',full:'tu joues',note:'tu → <b>-es</b> (wie im Deutschen das -st: du spiel<b>st</b>)'}),
    C('Welche Endung gehört zu <b>nous</b> (wir)?','nous jou___',['ons','ent','ez','es'],'ons',{full:'nous jouons',note:'nous → <b>-ons</b> · Eselsbrücke: n<b>o</b>us – <b>o</b>ns'}),
    C('Welche Endung gehört zu <b>vous</b> (ihr)?','vous jou___',['ez','es','ent','ons'],'ez',{full:'vous jouez',note:'vous → <b>-ez</b> · Eselsbrücke: vou<b>s</b> und -e<b>z</b> – beide enden „scharf“'}),
    C('Welche Endung gehört zu <b>ils / elles</b> (sie, mehrere)?','ils jou___',['ent','ons','es','e'],'ent',{full:'ils jouent',note:'ils/elles → <b>-ent</b> – das <b>-ent</b> spricht man NICHT!'}),
    { type:'conj', verb:'jouer', phase:'pick', erz:'Jetzt «jouer» (spielen). Juna will mit dir spielen – füll die Tabelle!', forms:ER('jou',['spiele','spielst','spielt','spielt'],'spielen') },
    F('Schreib die richtige Form von «regarder» (anschauen): Je ___ la télé.','Je ___ la télé.','regarde',{de:'Ich schaue fern.',hints:['je → <b>-e</b>']}),
    F('Juna fragt: Tu ___ le chocolat ? (aimer = mögen)','Tu ___ le chocolat ?','aimes',{de:'Magst du Schokolade?',hints:['tu → <b>-es</b>']}),
    F('Nous ___ au foot. (jouer)','Nous ___ au foot.','jouons',{de:'Wir spielen Fußball.',hints:['nous → <b>-ons</b>']}),
    F('Vous ___ français ? (parler)','Vous ___ français ?','parlez',{de:'Sprecht ihr Französisch?',hints:['vous → <b>-ez</b>']}),
    F('Les filles ___ un film. (regarder)','Les filles ___ un film.','regardent',{de:'Die Mädchen schauen einen Film.',hints:['„die Mädchen“ = elles → <b>-ent</b>']}),
    F('Coco ___ beaucoup ! (parler)','Coco ___ beaucoup !','parle',{de:'Coco redet viel!',hints:['Coco = il → <b>-e</b>']}),
    D('Achtung, Sonderfall! Fängt das Verb mit einem Vokal an (a, e, i, o, u – oder h), wird aus «je» ein «j\'»: «j\'aime», «j\'habite», «j\'écoute».'),
    C('Wie heißt es richtig?','___ aime les chiens.',["J'","Je"],"J'",{full:"J'aime les chiens.",de:'Ich mag Hunde.',note:"je + Vokal → <b>j'</b> : j'aime, j'habite"}),
    { type:'conj', verb:'aimer', phase:'type', erz:'Profi-Runde: «aimer» (mögen, lieben) – diesmal schreibst du alles selbst, in gemischter Reihenfolge!', forms:ER('aim',['mag','magst','mag','mögt'],'mögen') },
    { type:'build', erz:'Bau den Satz: <i>Wir spielen mit Juna.</i>', tiles:['Nous','jouons','avec','Juna','jouez','joue'], answer:'Nous jouons avec Juna', learn:[{fr:'nous jouons',de:'wir spielen',gram:'-er: e · es · e · ons · ez · ent'}] },
  ]},

  er2: { icon:'🎯', titre:'-er : entraînement', titel:'-er-Verben: Endungen-Training', steps:[
    D('Training! Ich gebe dir einen Satz, du schreibst das Verb mit der richtigen Endung. Denk an den Rap: „E – ES – E, ONS – EZ – ENT“ 🎤'),
    F('Tu ___ où ? (habiter = wohnen)','Tu ___ où ?','habites',{de:'Wo wohnst du?'}),
    F("J'___ à Munich. (habiter)","J'___ à Munich.",'habite',{de:'Ich wohne in München.'}),
    F('Elle ___ la radio. (écouter = hören)','Elle ___ la radio.','écoute',{de:'Sie hört Radio.'}),
    F('Nous ___ la porte. (fermer = schließen)','Nous ___ la porte.','fermons',{de:'Wir schließen die Tür.'}),
    F('Vous ___ Juna ? (chercher = suchen)','Vous ___ Juna ?','cherchez',{de:'Sucht ihr Juna?'}),
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
    { type:'conj', verb:'être', erz:'Schau dir «être» an und lass es dir vorlesen:', forms:[['je','suis','ich bin'],['tu','es','du bist'],['il/elle/on','est','er/sie/man ist'],['nous','sommes','wir sind'],['vous','êtes','ihr seid / Sie sind'],['ils/elles','sont','sie sind']], tip:'Eselsbrücke: „<b>suis – es – est – sommes – êtes – sont</b>“' },
    { type:'conj', verb:'être', phase:'pick', erz:'Jetzt du! Tippe die richtigen Formen an.', forms:[['je','suis','ich bin'],['tu','es','du bist'],['il/elle/on','est','er/sie/man ist'],['nous','sommes','wir sind'],['vous','êtes','ihr seid'],['ils/elles','sont','sie sind']] },
    F('Juna ___ un chien. (être)','Juna ___ un chien.','est',{de:'Juna ist ein Hund.'}),
    F('Nous ___ en classe. (être)','Nous ___ en classe.','sommes',{de:'Wir sind in der Klasse.'}),
    F('Tu ___ où ? (être)','Tu ___ où ?','es',{de:'Wo bist du?'}),
    F('Vous ___ de Paris ? (être)','Vous ___ de Paris ?','êtes',{de:'Seid ihr aus Paris?'}),
    F('Je ___ content. (être)','Je ___ content.','suis',{de:'Ich bin froh.'}),
    F('Les chats ___ dans le jardin. (être)','Les chats ___ dans le jardin.','sont',{de:'Die Katzen sind im Garten.'}),
    { type:'conj', verb:'être', phase:'type', erz:'Profi-Runde: «être» ganz allein schreiben!', forms:[['je','suis','ich bin'],['tu','es','du bist'],['il/elle/on','est','er/sie/man ist'],['nous','sommes','wir sind'],['vous','êtes','ihr seid'],['ils/elles','sont','sie sind']] },
  ]},

  avoir: { icon:'🎒', titre:'Le verbe avoir', titel:'avoir (haben)', steps:[
    D('«avoir» heißt <i>haben</i>. Auch unregelmäßig. Weil es mit einem Vokal anfängt, heißt es «j\'ai» – nicht „je ai“!',
      'Achtung, Verwechslungsgefahr: «tu as» (du hast) – aber «il a» (er hat), ohne s! Und «ils ont» (sie haben) klingt anders als «ils sont» (sie sind): ont = „õ“, sont = „ßõ“.'),
    { type:'conj', verb:'avoir', erz:'So sieht «avoir» aus:', forms:[["j'",'ai','ich habe'],['tu','as','du hast'],['il/elle/on','a','er/sie/man hat'],['nous','avons','wir haben'],['vous','avez','ihr habt'],['ils/elles','ont','sie haben']], tip:'„<b>ai – as – a – avons – avez – ont</b>“' },
    { type:'conj', verb:'avoir', phase:'pick', erz:'Tippe die richtigen Formen an:', forms:[["j'",'ai','ich habe'],['tu','as','du hast'],['il/elle/on','a','er/sie/man hat'],['nous','avons','wir haben'],['vous','avez','ihr habt'],['ils/elles','ont','sie haben']] },
    F("J'___ un chien. (avoir)","J'___ un chien.",'ai',{de:'Ich habe einen Hund.'}),
    F('Juna ___ faim ! (avoir)','Juna ___ faim !','a',{de:'Juna hat Hunger!',note:'avoir faim = Hunger haben'}),
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
    C('Welcher Artikel? (chien ist männlich)','___ chien',['le','la',"l'",'les'],'le',{full:'le chien'}),
    C('Welcher Artikel? (maison ist weiblich)','___ maison',['la','le',"l'",'les'],'la',{full:'la maison'}),
    C('Welcher Artikel? (ami fängt mit Vokal an)','___ami',["l'",'le','la','les'],"l'",{full:"l'ami",note:"Vor Vokal: le/la → <b>l'</b>"}),
    C('Welcher Artikel? (Mehrzahl!)','___ chats',['les','le','la',"l'"],'les',{full:'les chats',note:'Mehrzahl immer <b>les</b> – und das Nomen bekommt meist ein -s.'}),
    C('Welcher Artikel? (école fängt mit Vokal an)','___école',["l'",'la','le','les'],"l'",{full:"l'école"}),
    C('Welcher Artikel? (copine = Freundin)','___ copine',['la','le','les',"l'"],'la',{full:'la copine'}),
    C('Welcher Artikel? (copains = Freunde, Mehrzahl)','___ copains',['les','le','la'],'les',{full:'les copains'}),
    D('Und dann gibt es noch den unbestimmten Artikel: «un» = ein (männlich), «une» = eine (weiblich) – und in der Mehrzahl «des» (= einige; im Deutschen oft gar kein Wort).'),
    C('un, une oder des?','J\'ai ___ chien.',['un','une','des'],'un',{de:'Ich habe einen Hund.'}),
    C('un, une oder des?','C\'est ___ fille.',['une','un','des'],'une',{de:'Das ist ein Mädchen.'}),
    C('un, une oder des?','Il y a ___ chats dans le jardin.',['des','un','une'],'des',{de:'Es gibt Katzen im Garten.',note:'Mehrzahl → <b>des</b>'}),
    C('un, une oder des?','Coco est ___ perroquet.',['un','une','des'],'un'),
    C('un, une oder des?','Elle a ___ copines.',['des','une','un'],'des',{de:'Sie hat Freundinnen.'}),
  ]},

  neg: { icon:'🚫', titre:'ne … pas', titel:'Verneinung (nicht)', steps:[
    D('So sagt man „nicht“: Das Verb kommt in ein Sandwich! 🥪 «ne» davor, «pas» dahinter: «Je <b>ne</b> parle <b>pas</b>.» = Ich spreche nicht.',
      'Vor einem Vokal wird «ne» zu «n\'»: «Je <b>n\'</b>aime <b>pas</b> les chats.» – sagt Juna. 🐶'),
    { type:'build', erz:'Bau das Sandwich: <i>Ich spiele nicht.</i>', tiles:['Je','ne','joue','pas'], answer:'Je ne joue pas' },
    { type:'build', erz:'<i>Juna ist nicht müde.</i> (fatigué = müde)', tiles:['Juna','n\'','est','pas','fatiguée','ne'], answer:"Juna n' est pas fatiguée", hints:['Vor «est» (Vokal): <b>n\'</b>'] },
    C('ne oder n\'?','Tu ___ aimes pas le foot ?',["n'",'ne'],"n'",{note:"Vor Vokal: ne → <b>n'</b>"}),
    C('ne oder n\'?','Nous ___ regardons pas la télé.',['ne',"n'"],'ne'),
    C('Wo steht das «pas»?','Il ne parle ___ .',['pas – nach dem Verb','vor dem Verb'],'pas – nach dem Verb',{fr:null,note:'ne + Verb + pas'}),
    { type:'build', erz:'<i>Sie haben keine Katze.</i> (Nach «pas» wird un/une zu «de»!)', tiles:['Ils','n\'','ont','pas','de','chat','un'], answer:"Ils n' ont pas de chat", note:'pas + un/une/des → <b>pas de</b> (pas d\' vor Vokal)' },
    F('Schreib das fehlende Wort: Je ne suis ___ triste.','Je ne suis ___ triste.','pas',{de:'Ich bin nicht traurig.'}),
  ]},

  poss: { icon:'👜', titre:'mon, ma, mes', titel:'mein, dein, sein (Possessiv)', steps:[
    D('„Mein“ richtet sich nach dem Ding, das einem gehört – nicht nach dem Besitzer! «mon» vor männlich, «ma» vor weiblich, «mes» in der Mehrzahl.',
      'Genauso: «ton/ta/tes» = dein, «son/sa/ses» = sein ODER ihr. Trick: vor Vokal immer «mon/ton/son», auch bei weiblichen Wörtern: «mon amie».'),
    C('mein ___ chien',"___ chien",['mon','ma','mes'],'mon',{full:'mon chien'}),
    C('meine ___ sœur (Schwester)','___ sœur',['ma','mon','mes'],'ma',{full:'ma sœur'}),
    C('meine ___ copains (Mehrzahl)','___ copains',['mes','mon','ma'],'mes',{full:'mes copains'}),
    C('deine Katze: ___ chat (chat ist männlich!)','___ chat',['ton','ta','tes'],'ton',{full:'ton chat'}),
    C('seine/ihre Familie: ___ famille','___ famille',['sa','son','ses'],'sa',{full:'sa famille',note:'<b>sa</b> famille = seine ODER ihre Familie'}),
    C('meine Freundin: ___ amie (Vokal!)','___ amie',['mon','ma'],'mon',{full:'mon amie',note:'Vor Vokal: <b>mon</b> amie, auch wenn weiblich'}),
    C('ihre Hunde: ___ chiens','___ chiens',['ses','son','sa'],'ses',{full:'ses chiens'}),
  ]},
};

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
const ERV=[['parler','parl','sprechen','français'],['jouer','jou','spielen','au foot'],['aimer','aim','mögen','les chiens'],['regarder','regard','anschauen','la télé'],['habiter','habit','wohnen','à Paris'],['écouter','écout','hören','de la musique'],['chercher','cherch','suchen','le chat'],['chanter','chant','singen','une chanson'],['danser','dans','tanzen','avec Juna'],['travailler','travaill','arbeiten','beaucoup'],['rester','rest','bleiben','à la maison'],['arriver','arriv','ankommen','à l\'école']];
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
  sontOnt(){ const has=Math.random()<.5; return {type:'choice',erz:has?'<i>Sie haben einen Hund.</i>':'<i>Sie sind in der Schule.</i>',fr:has?'Ils ___ un chien.':'Ils ___ à l\'école.',options:['ont','sont'],answer:has?'ont':'sont',_topic:'être/avoir'}; },
  article(){ const w=R(words().filter(w=>/^(le|la|l'|les) /.test(w.fr)||/^l'/.test(w.fr))); if(!w) return GEN.vocArt();
    const art=w.fr.match(/^(le|la|les|l')/)[1], n=w.fr.replace(/^(le |la |les |l')/,'');
    return {type:'choice',erz:`Welcher Artikel? <i>${w.de}</i>`,fr:`___ ${n}`,options:['le','la',"l'",'les'],answer:art,full:w.fr,_topic:'Artikel'}; },
  unUne(){ const it=R([['chien','un','Hund'],['fille','une','Mädchen'],['garçon','un','Junge'],['maison','une','Haus'],['livre','un','Buch'],['copine','une','Freundin'],['chats','des','Katzen (Mehrzahl)'],['stylo','un','Stift'],['école','une','Schule'],['amis','des','Freunde (Mehrzahl)']]);
    return {type:'choice',erz:`un, une oder des? <i>${it[2]}</i>`,fr:`C'est ___ ${it[0]}.`.replace("C'est ___ chats","Ce sont ___ chats").replace("C'est ___ amis","Ce sont ___ amis"),options:['un','une','des'],answer:it[1],_topic:'Artikel'}; },
  neg(){ const it=R([['Je','parle','allemand','Ich spreche nicht Deutsch.'],['Tu','regardes','la télé','Du schaust nicht fern.'],['Juna','aime','les chats','Juna mag keine Katzen.'],['Nous','jouons','au foot','Wir spielen nicht Fußball.'],['Il','est','fatigué','Er ist nicht müde.'],['Elles','habitent','à Paris','Sie wohnen nicht in Paris.']]);
    const ne=vowel(it[1])?"n'":'ne'; return {type:'build',erz:`Verneine den Satz: <i>${it[3]}</i>`,fr:`${it[0]} ${it[1]} ${it[2]}.`,tiles:[it[0],ne,it[1],'pas',...it[2].split(' '),vowel(it[1])?'ne':"n'"],answer:`${it[0]} ${ne} ${it[1]} pas ${it[2]}`,_topic:'ne … pas'}; },
  poss(){ const it=R([['mein','chien','mon'],['meine','sœur','ma'],['meine (Mz.)','copains','mes'],['dein','livre','ton'],['deine','maison','ta'],['sein/ihr','chat','son'],['seine/ihre','famille','sa'],['meine','amie','mon'],['deine (Mz.)','parents','tes']]);
    const opts={m:['mon','ma','mes'],t:['ton','ta','tes'],s:['son','sa','ses']}[it[2][0]];
    return {type:'choice',erz:`<i>${it[0]} …</i>`,fr:`___ ${it[1]}`,options:opts,answer:it[2],full:`${it[2]} ${it[1]}`,_topic:'mon/ma/mes'}; },
  phrase(){ const it=R([['Ich heiße Léa.',"Je m'appelle Léa"],['Wie geht\'s?','Ça va'],['Wo wohnst du?','Tu habites où'],['Wir spielen Fußball.','Nous jouons au foot'],['Das ist meine Schwester.',"C'est ma sœur"],['Ich habe einen Hund.',"J'ai un chien"],['Sie sind nett.','Ils sont sympa']]);
    const t=it[1].split(' '); return {type:'build',erz:`Bau den Satz: <i>${it[0]}</i>`,tiles:SH([...t,R(['est','es','ma','les','nous'].filter(x=>!t.includes(x)))]),answer:it[1],_topic:'Sätze'}; },
};
// Probe-Schulaufgabe: feste Mischung der Aufgabentypen, Reihenfolge zufällig
export function examLesson(){
  const plan=['vocDeFr','vocDeFr','vocDeFr','vocFrDe','vocFrDe','ecoute','vocArt','ending','ending','ending','ending','endingPick','endingPick','etre','etre','avoir','avoir','sontOnt','article','unUne','unUne','neg','poss','poss','phrase','phrase'];
  USED=new Set(); const steps=SH(plan).map(k=>GEN[k]());
  return { titre:'Probe-Schulaufgabe', exam:true, steps:[ {type:'dialogue',lines:[{who:'Coco',erz:`Probe-Schulaufgabe! ${steps.length} Aufgaben: Vokabeln, Hören, Endungen, être, avoir, Artikel, Verneinung … Jedes Mal anders gemischt.`},{who:'Coco',erz:'Wie in der echten Schulaufgabe: Tipps (💡) kosten den Punkt. Am Ende bekommst du eine Note – und siehst, was du noch üben solltest. «Bon courage !» 💪'}]}, ...steps ] };
}
