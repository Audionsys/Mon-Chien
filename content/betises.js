// =============================================================
//  BÊTISES – Quatsch, den der Hund macht, wenn's ruhig ist
//  kind  : Verhalten in engine/dog.js (shred, tail, window, steal, dig, zoomies)
//  {X}   : wird durch das Wort des Gegenstands ersetzt (z. B. "la plante")
//  stop  : Kommandos, die am besten passen (aus commands.js)
// =============================================================
export const BETISES = {
  shred:   { fr:'Oh non ! {N} déchire le coussin !',     de:'Oh nein! {N} zerfetzt das Kissen!',          stop:['lache','arrete','non'], tip:'Sag: <b class="fr">Lâche !</b> (Lass los!)' },
  tail:    { fr:'{N} court après sa queue !',            de:'{N} jagt seinen eigenen Schwanz!',           stop:['arrete','non'],         tip:'Sag: <b class="fr">Arrête !</b> (Hör auf!)' },
  window:  { fr:'{N} aboie, aboie, aboie…',              de:'{N} bellt und bellt und bellt …',            stop:['arrete','non'],         tip:'Sag: <b class="fr">Arrête !</b> oder <b class="fr">Non !</b>' },
  steal:   { fr:'Oh non ! {N} vole la balle !',          de:'Oh nein! {N} klaut den Ball und rennt weg!', stop:['lache','arrete','non'], tip:'Sag: <b class="fr">Lâche !</b> (Lass los!)' },
  dig:     { fr:'Oh non ! {N} creuse dans {X} !',        de:'Oh nein! {N} buddelt in der Erde!',          stop:['non','arrete'],         tip:'Sag: <b class="fr">Non !</b> (Nein!)' },
  zoomies: { fr:'{N} court partout comme un fou !',      de:'{N} rennt herum wie verrückt!',              stop:['arrete','assis'],       tip:'Sag: <b class="fr">Arrête !</b> – oder <b class="fr">Assis !</b>' },
  sausage: { fr:'Oh non ! {N} vole le saucisson !',      de:'Oh nein! {N} klaut die Salami!',             stop:['lache','arrete','non'], tip:'Sag: <b class="fr">Lâche !</b> (Lass los!)' },
  flour:   { fr:'Oh là là ! {N} renverse la farine !',    de:'Oje! {N} wirft den Mehlsack um!',            stop:['arrete','non'],         tip:'Sag: <b class="fr">Arrête !</b> (Hör auf!)' },
};
