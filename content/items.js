// =============================================================
//  SACHEN FÜR DEN HUND – Leckerli, Spielzeug, Accessoires
//  kind  : 'treat' (wird gefressen) | 'toy' (liegt im Zimmer, kann apportiert werden) | 'wear' (trägt der Hund)
//  price : Preis in 🦴 in der Boutique (Zahl wird auf Französisch angesagt!)
//  model : Bauplan in engine/items.js (für Spielzeug & Accessoires)
//  rare  : 1 = normal, 2 = selten, 3 = sehr selten (für Geschenke)
// =============================================================
export const ITEMS = {
  // ---------- Leckerli (les friandises) ----------
  biscuit:   { kind:'treat', pic:'🍪', fr:'le biscuit',         de:'der Hundekeks',        price:5,  rare:1 },
  os:        { kind:'treat', pic:'🦴', fr:"l'os",                de:'der Knochen',          price:8,  rare:1 },
  osmacher:  { kind:'treat', pic:'🦴', fr:"l'os à mâcher",       de:'der Kauknochen',       price:15, rare:2 },
  baton:     { kind:'treat', pic:'🥖', fr:'le bâton à mâcher',   de:'die Kaustange',        price:12, rare:1 },
  saucisse:  { kind:'treat', pic:'🌭', fr:'la saucisse',         de:'das Würstchen',        price:10, rare:1 },
  fromage:   { kind:'treat', pic:'🧀', fr:'le fromage',          de:'der Käse',             price:7,  rare:1 },
  carotte:   { kind:'treat', pic:'🥕', fr:'la carotte',          de:'die Karotte',          price:4,  rare:1 },
  poulet:    { kind:'treat', pic:'🍗', fr:'le poulet séché',     de:'das Trockenhühnchen',  price:14, rare:2 },
  croquette: { kind:'treat', pic:'🟤', fr:'les croquettes',      de:'das Trockenfutter',    price:3,  rare:1 },
  gateau:    { kind:'treat', pic:'🎂', fr:'le gâteau pour chien',de:'der Hundekuchen',      price:30, rare:3 },
  // ---------- Spielzeug (les jouets) ----------
  tennis:    { kind:'toy',  pic:'🎾', fr:'la balle de tennis',  de:'der Tennisball',       price:12, rare:1, model:'tennis' },
  corde:     { kind:'toy',  pic:'🪢', fr:'la corde',            de:'das Zerrseil',         price:15, rare:1, model:'rope' },
  frisbee:   { kind:'toy',  pic:'🥏', fr:'le frisbee',          de:'die Frisbee',          price:20, rare:2, model:'frisbee' },
  peluche:   { kind:'toy',  pic:'🧸', fr:'la peluche',          de:'das Kuscheltier',      price:25, rare:2, model:'plush' },
  canard:    { kind:'toy',  pic:'🦆', fr:'le canard qui couine',de:'die Quietscheente',    price:18, rare:2, model:'duck' },
  ballon:    { kind:'toy',  pic:'⚽', fr:'le ballon',           de:'der Fußball',          price:22, rare:2, model:'football' },
  anneau:    { kind:'toy',  pic:'⭕', fr:"l'anneau",            de:'der Wurfring',         price:16, rare:1, model:'ring' },
  // ---------- Accessoires ----------
  collier:   { kind:'wear', pic:'📿', fr:'le collier',          de:'das Halsband',         price:20, rare:1, model:'collar', slot:'neck' },
  bandana:   { kind:'wear', pic:'🧣', fr:'le bandana',          de:'das Halstuch',         price:18, rare:1, model:'bandana', slot:'neck' },
  noeud:     { kind:'wear', pic:'🎀', fr:'le nœud',             de:'die Schleife',         price:15, rare:1, model:'bow', slot:'head' },
  chapeau:   { kind:'wear', pic:'🎩', fr:'le chapeau',          de:'der Hut',              price:35, rare:2, model:'tophat', slot:'head' },
  couronne:  { kind:'wear', pic:'👑', fr:'la couronne',         de:'die Krone',            price:60, rare:3, model:'crown', slot:'head' },
  casquette: { kind:'wear', pic:'🧢', fr:'la casquette',        de:'die Kappe',            price:25, rare:2, model:'cap', slot:'head' },
};
