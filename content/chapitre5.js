// Kapitel 5 – À l'école  (Schulsachen, mon/ma/mes, ne … pas, Fragen)
export default {
  id:'ch5', titre:"À l'école", titel:'In der Schule', scene:'salon',
  icon:'🎒', story:'{N} will mit in die Schule! Pack mit ihm die Schultasche und lerne Fragen zu stellen.',
  intro: { fr:"À l'école", ziel:'{N} will mit in die Schule! Du lernst Schulsachen, mein/meine (mon/ma/mes) und wie man Fragen stellt.' },
  steps:[
    { type:'dialogue', lines:[
      { fr:"{N} veut aller à l'école avec toi !", de:'{N} will mit dir in die Schule gehen!' },
      { fr:"Regarde dans ton sac. Qu'est-ce qu'il y a ?", de:'Schau in deine Tasche. Was ist da drin?' } ]},
    { type:'teach', deck:'ecole', range:[0,4], fr:'{N} pense à ton sac… Apprends-lui les mots !', de:'{N} denkt an deine Schultasche … Bring ihm die Wörter bei!' },
    { type:'choice', fr:"C'est ___ livre.", de:'Das ist mein Buch.', options:['mon','ma','mes'], answer:'mon', hints:['<b>le</b> livre ist männlich.'], note:'<b>mon</b> (m) · <b>ma</b> (f) · <b>mes</b> (Plural)',
      learn:[{fr:'mon / ma / mes', de:'mein / meine / meine (Pl.)', gram:'mon livre · ma règle · mes cahiers'}] },
    { type:'choice', fr:"C'est ___ règle.", de:'Das ist mein Lineal.', options:['ma','mon','mes'], answer:'ma', hints:['<b>la</b> règle ist weiblich.'], note:'la règle → <b>ma</b> règle' },
    { type:'teach', deck:'ecole', range:[4,8], fr:'Encore des mots pour l’école !', de:'Noch mehr Wörter für die Schule!' },
    { type:'choice', fr:'Ce sont ___ cahiers.', de:'Das sind meine Hefte.', options:['mes','mon','ma'], answer:'mes', hints:['Plural → <b>mes</b>'], note:'Plural: <b>mes</b> cahiers' },
    { type:'fill', fr:"{N} ne va ___ à l'école.", de:'{N} geht nicht in die Schule.', answer:['pas'], hints:['ne … <b>p…</b>'], note:'<b>ne … pas</b> = nicht' },
    { type:'command', cmd:'tourne', fr:'Pour la récré, une petite danse !', de:'Für die Pause ein kleines Tänzchen!', hints:['<b>Tou…</b>'] },
    { type:'build', fr:'Construis la question !', de:'Bau die Frage: „Was ist das?“', tiles:["Qu'est-ce",'que',"c'est",'est-ce'], answer:"Qu'est-ce que c'est",
      hints:["Fängt an mit <b>Qu'est-ce</b>"], note:"<b>Qu'est-ce que c'est ?</b> = Was ist das?", learn:[{fr:"Qu'est-ce que c'est ?", de:'Was ist das?', gram:'Fragesatz mit est-ce que'}] },
    { type:'choice', fr:'___ est ton prof ?', full:'Qui est ton prof ?', de:'Wer ist dein Lehrer?', options:['Qui','Où','Quoi'], answer:'Qui', hints:['wer = <b>qui</b> · wo = où'],
      note:'<b>qui</b> = wer · <b>où</b> = wo · <b>quoi</b> = was', learn:[{fr:'qui / où', de:'wer / wo', gram:'Qui est-ce ? · Où est la balle ?'}] },
    { type:'command', cmd:'panier', fr:'La journée est finie. {N} est fatigué…', de:'Der Tag ist vorbei. {N} ist müde …', hints:['<b>Va au p…</b>'] },
  ],
};
