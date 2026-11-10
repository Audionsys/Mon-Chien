// =============================================================
//  KURS – Reihenfolge der Kapitel
//  Neues Kapitel: Datei content/chapitreN.js anlegen und hier eintragen.
//
//  SCHRITT-TYPEN (step.type) – gemeinsame Felder:
//    fr, de   : Aufgabe auf Französisch + Übersetzung ({N} = Name des Hundes)
//    hints    : zusätzliche Tipps (HTML). Die Tippleiter ist immer:
//               Übersetzung → hints… → Lösung
//    note     : Grammatik-Notiz nach dem Lösen
//    learn    : [{fr,de,gram}] Einträge fürs Carnet
//
//  'name'     : Hund bekommt einen Namen (Il s'appelle …)
//  'dialogue' : lines:[{fr,de}] – Coco erzählt, weiter per Tipp
//  'command'  : cmd:'<id aus commands.js>' – Kommando eintippen
//  'choice'   : options:[…], answer:'…' – Lücke ___ per Antippen füllen
//  'fill'     : answer:['…'] – Lücke ___ eintippen
//  'build'    : tiles:[…], answer:'…' – Satz aus Wortkacheln bauen
//  'object'   : target:'<prop-id>' – Gegenstand in der Szene antippen
//  'teach'    : deck:'<id aus vocab.js>', range:[von,bis] – dem Hund Vokabeln beibringen
//  'defi'     : Hundeshow = Mini-Test über das Kapitel (wird automatisch angehängt)
//  full       : (choice/fill) ganzer Satz, falls Lücke nicht einfach ersetzbar
// =============================================================
import ch1 from './chapitre1.js';
import ch1b from './chapitre1b.js';
import ch2 from './chapitre2.js';
import ch3 from './chapitre3.js';
import ch4 from './chapitre4.js';
import ch5 from './chapitre5.js';
import ch6 from './chapitre6.js';
import ch7 from './chapitre7.js';
import ch8 from './chapitre8.js';
import ch9 from './chapitre9.js';
import ch1c from './chapitre1c.js';
import ch10 from './chapitre10.js';
import ch11 from './chapitre11.js';
import ch12 from './chapitre12.js';
import ch13 from './chapitre13.js';
import ch14 from './chapitre14.js';
import ch15 from './chapitre15.js';
import ch1d from './chapitre1d.js';
import ch10b from './chapitre10b.js';
import ch11b from './chapitre11b.js';

// Reihenfolge nach dem Schulbuch (Découvertes 1 Bayern). Kapitel werden über ihre id gemerkt –
// Umsortieren oder Einfügen verliert keinen Spielstand.
const chapters=[ ch1, ch1b, ch1c, ch1d, ch10, ch10b, ch2, ch3, ch6, ch11, ch11b, ch5, ch9, ch12, ch4, ch8, ch13, ch7, ch14, ch15 ];
// Zuordnung zur Unité im Buch (wird im Spiel angezeigt)
const UNITE={ ch1b:'Au début', ch1c:'1', ch1d:'1', ch10:'2', ch10b:'2', ch11b:'3', ch6:'3', ch11:'3', ch5:'4', ch9:'4', ch12:'4', ch4:'5', ch8:'5', ch13:'5', ch7:'6', ch14:'6', ch15:'7' };
chapters.forEach(ch=>{ ch.unite ??= UNITE[ch.id]; });
// Am Ende jedes Kapitels: "Le grand concours" – versteckte Stegreifaufgabe über das Kapitel
chapters.forEach(ch=>{ if(ch.intro && ch.steps[0]?.type!=='intro') ch.steps.unshift({ type:'intro', tipp:'Du kannst jederzeit auch einfach mit deinem Hund reden – er macht, was er versteht! Und wenn du nicht weiterweißt: unten links auf die gelbe 💡 tippen.', ...ch.intro });
  if(!ch.noDefi && ch.steps.at(-1)?.type!=='defi') ch.steps.push({ type:'defi', count:8 }); });

export const COURSE = {
  titre: 'Mon chien parle français',
  chapters,
};
