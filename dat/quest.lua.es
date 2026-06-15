-- NetHack quest.lua	$NHDT-Date: 1726894904 2024/09/21 05:01:44 $  $NHDT-Branch: NetHack-3.7 $:$NHDT-Revision: 1.10 $
-- Copyright (c) 2021 by Pasi Kallinen
-- NetHack may be freely redistributed.  See license for details.
-- TODO:
--  - output = "verbalize"
--  - export the quest string replacements to lua, instead of %H etc
--  - allow checking if hero is carrying item (see comments for %Cp Arc 00042)
--  - fold quest_portal, quest_portal_again, quest_portal_demand into one
--  - write tests to check questtext validity?
--  - qt_pager hack(?): if (qt_msg->delivery == 'p' && strcmp(windowprocs.name, "X11"))




-- text = "something"
-- Text is shown to the user.

-- synopsis = "something"
-- Synopsis is inserted into the message history.
--
-- output = "pline" | "menu" | "text"
-- The output can be manually set by using output = "menu"
-- Valid values for output are "pline", "text", and "menu, defaulting to
-- pline, unless the text contains newlines, or is too long to fit a message buffer,
-- then will be shown as a text window instead.



questtext = {
   -- If a role doesn't have a specific message, try a fallback
   msg_fallbacks = {
      goal_alt = "goal_next"
   },
   common = {
      TEST_PATTERN = {
         output = "text",
         text = [[%p: return(plname);
%c: return(pl character);
%r: return((char *)rank of(u.ulevel));
%R: return(char *)rank of(MIN QUEST LEVEL));
%s: return(flags.female) ? "sister" : "hermano" );
%S: return(flags.female) ? "daughter" : "hijo" );
%l: return(char *)ldrname());
%i: return(intermed());
%o: return(artiname());
%O: retorno(shortened(artiname()));
%n: return((char *)neminame());
%g: return(char *)guardname());
%G: return(char *)align gtitle(u.ualignbase[1]));
%H: return(char *)homebase());
%a: return(Alignnam(u.ualignbase[1]));
%A: return(Alignnam(u.ualign.type));
%d: return(char *)align gname(u.ualignbase[1]));
%D: return(char *)align gname(A LAWFUL));
%C: return("chaotic");
%N: return("neutral");
%L: return("lawful");
%x: return(Blind) ? "sense" : "see");
%Z: return("The Dungeons of Doom");
%%: retorno(porcent sign);
a sufijo: devolver un(root);
A suffix: return An(root);
C sufijo: retorno capitalizado (raíz);
h sufijo: retorno pronoun (he or she, mon of(root)); /* para %l,%n,%d,%o */
H suffix: return capitalized(pronoun(he or she, mon of(root)));
sufijo: retorno pronoun (him or her, mon of(root));
Sufijo: retorno capitalizado(pronoun(him or her, mon of(root)));
j sufijo: retorno pronoun (his or her, mon of(root));
J sufijo: retorno capitalizado(pronoun(his or her, mon of(root)));
p sufijo: retorno makeplural(root);
P sufijo: cambio de imagen (capitalizado(root));
s suffix: return s suffix(root);
S suffix: return s suffix(capitalized(root));
t suffix: return strip the prefix(root);]],
      },
      angel_cuss = {
         "\"Repent, and thou shalt be saved!\"",
         "\"Thou shalt pay for thine insolence!\"",
         "\"Very soon, my child, thou shalt meet thy maker.\"",
         "\"The great %D has sent me to make you pay for your sins!\"",
         "\"The wrath of %D is now upon you!\"",
         "\"Thy life belongs to %D now!\"",
         "\"Dost thou wish to receive thy final blessing?\"",
         "\"Thou art but a godless void.\"",
         "\"Thou art not worthy to seek the Amulet.\"",
         "\"No one expects the Spanish Inquisition!\"",
         "\"Judgment hath been passed upon thee, %p.\"",
         "\"Thy reckoning is at hand, %p.\"",
         "\"Thou shalt be brought before %D for thy crimes!\"",
         "\"With %D as my witness, I shall strike thee down.\"",
      },
      banished = {
         synopsis = "[You are banished from %H for betraying your allegiance to %d.]",
         output = "text",
         text = [["You have betrayed all those[["Has traicionado a todos los que tienen lealtad a %d, como lo hiciste una vez.
Mi lealtad a %d es rápida y no puedo tolerar ni aceptar lo que usted
lo han hecho.

Deja este lugar. Nunca volverás a poner un pie a la %H.
Lo que buscas ahora se pierde para siempre, porque sin la campana de apertura,
nunca podrás entrar en el lugar donde el que tiene el Amuleto
reside.

¡Vamos! Estás desterrado de este lugar.]]{
         "\"I first mistook thee for a statue, when I regarded thy head of stone.\"",
         "\"Come here often?\"",
         "\"Doth pain excite thee?  Wouldst thou prefer the whip?\"",
         "\"Thinkest thou it shall tickle as I rip out thy lungs?\"",
         "\"Eat slime and die!\"",
         "\"Go ahead, fetch thy mama!  I shall wait.\"",
         "\"Go play leapfrog with a herd of unicorns!\"",
         "\"Hast thou been drinking, or art thou always so clumsy?\"",
         "\"This time I shall let thee off with a spanking, but let it not happen again.\"",
         "\"I've met smarter (and prettier) acid blobs.\"",
         "\"Look!  Thy bootlace is undone!\"",
         "\"Mercy!  Dost thou wish me to die of laughter?\"",
         "\"Run away!  Live to flee another day!\"",
         "\"Thou hadst best fight better than thou canst dress!\"",
         "\"Twixt thy cousin and thee, Medusa is the prettier.\"",
         "\"Methinks thou wert unnaturally stirred by yon corpse back there, eh, varlet?\"",
         "\"Up thy nose with a rubber hose!\"",
         "\"Verily, thy corpse could not smell worse!\"",
         "\"Wait!  I shall polymorph into a grid bug to give thee a fighting chance!\"",
         "\"Why search for the Amulet?  Thou wouldst but lose it, cretin.\"",
         "\"Thou ought to be a comedian, thy skills are so laughable!\"",
         "\"Thy gaze is so vacant, I thought thee a floating eye!\"",
         "\"Thy head is unfit for a mind flayer to munch upon!\"",
         "\"Only thy reflection could love thee!\"",
         "\"Hast thou considered masking thine odour?\"",
         "\"Hold! Thy face is a most exquisite torture!\"",
         "\"I should fart in thy direction, but it might improve thy smell!\"",
      },
      legacy = {
         synopsis = "[%dC has chosen you to recover the Amulet of Yendor for %dI.]",
         output = "menu",
         text = [[It is written in the Book of [[Está escrito en el Libro de %d:

Después de la Creación, el dios cruel Moloch se rebeló
contra la autoridad de Marduk el Creador.
Moloch robó de Marduk el más poderoso de todos
los artefactos de los dioses, el Amuleto de Yendor,
y lo escondió en las cavidades oscuras de Gehennom,
Bajo el Mundo, donde ahora se esconde, y le ofrece su tiempo.

Su %G %d busca poseer el Amuleto, y con él
ganar merecida ascendencia sobre los otros dioses.

Tú, un recién entrenado %r, has sido heraldo
desde el nacimiento como instrumento de %d. Estás destinado
para recuperar el Amuleto para su deidad, o morir en el
Intente. Tu hora del destino ha llegado. Por favor.
¡Vamos valientemente con %d!]]uper' option set, last paragraph differs from normal legacy
      pauper_legacy = {
         synopsis = "[%dC has chosen you to recover the Amulet of Yendor for %dI.]",
         output = "menu",
         text = [[It is written in the Book of %d:

    After t[[Está escrito en el Libro de %d:

Después de la Creación, el dios cruel Moloch se rebeló
contra la autoridad de Marduk el Creador.
Moloch robó de Marduk el más poderoso de todos
los artefactos de los dioses, el Amuleto de Yendor,
y lo escondió en las cavidades oscuras de Gehennom,
Bajo el Mundo, donde ahora se esconde, y le ofrece su tiempo.

Su %G %d busca poseer el Amuleto, y con él
ganar merecida ascendencia sobre los otros dioses.

Usted, un %r sin entrenamiento, ha sido incapaz de
prepararse para ser el instrumento de %d. Sin embargo, usted
están destinados a recuperar el Amuleto para su deidad, o morir
en el intento. Tu hora del destino ha llegado. Para el
sake de todos nosotros: ¡Ve valientemente con %d!]]      text = [["The silver bell which was hoarded by %n will[["La campana de plata que fue acaparada por %n será
esencial para localizar el Amuleto de Yendor."]]ut = "pline",
         text = [[You receive a faint telepathic message fr[[Usted recibe un mensaje telepático débil de %l:
Su ayuda es urgente en %H!
Busca un transportador ic.
No podías distinguir el último mensaje.]]      text = "You again sense %l pleading for help.",
      },
      quest_portal_demand = {
         text = "You again sense %l demanding your attendance.",
      },
   },
   Arc = {
      assignquest = {
         synopsis = "[%nC has stolen %o.  Locate %i, defeat %ni, and return %O.]",
         output = "text",
         text = [["Grave times have befallen the college, for %na has
stolen %[["Los tiempos difíciles han caído en la universidad, para %na tiene
robado %o. Sin ella, la junta directiva de
la universidad pronto no tendrá más remedio que revocar nuestros subsidios de investigación.

"Usted debe localizar la entrada a %i. Dentro de ella,
encontrará %n.

"Entonces debes derrotar %n y regresar %o
para mí.

"Sólo así podremos evitar los recortes presupuestarios que podrían
cierra esta universidad.

"Que la sabiduría de %d sea tu guía."]] have strayed from the %a path.  Purify yourself!\"]",
         output = "text",
         text = [["%pC!  I've heard that you[[¡%pC! He oído que has estado usando técnicas descuidadas. Tu
resultados últimamente apenas se puede llamar adecuado para %ra!

"¿Cómo pudiste haberte alejado del camino %a? Ve de aquí, y ven.
sólo cuando te has purificado."]]{
         synopsis = "[%pC, a mere %r is too inexperienced.]",
         output = "text",
         text = [["%p, you are yet too inexperienced to[["%p, usted todavía está demasiado inexperto para emprender un tan exigente
búsqueda. Un mero %r no podría enfrentar los rigores demandados y
sobrevivir. Adelante, y ven aquí otra vez cuando tus aventuras tienen más
te enseñó."]]  "\"Try your best, %p.  You cannot defeat me.\"",
         "\"I shall rend the flesh from your body whilst you still breathe!\"",
         "\"First you, %p, then I shall destroy your mentor, %l.\"",
         "\"Tiring yet, %p?  I draw my power from my master and cannot falter!\"",
         "\"I shall rend thy soul from thy body and consume it!\"",
         "\"You are far too %a -- it weakens you.  You shall die in this place.\"",
         "\"%d has forsaken you!  You are lost now!\"",
         "\"A mere %r cannot hope to defeat me!\"",
         "\"If you are the best %l can send, I have nothing to fear.\"",
         "\"Die %c!  I shall exhibit your carcass as a trophy.\"",
      },
      encourage = {
         "\"Beware, for %n is powerful and cunning.\"",
         "\"To locate the entrance to %i, you must pass many traps.\"",
         "\"A %nt may be vulnerable to attacks by magical cold.\"",
         "\"Call upon %d when you encounter %n.\"",
         "\"You must destroy %n.  It will pursue you otherwise.\"",
         "\"%oC is a mighty talisman.  With it you can destroy %n.\"",
         "\"Go forth with the blessings of %d.\"",
         "\"I will have my %gP watch for your return.\"",
         "\"Remember not to stray from the true %a path.\"",
         "\"You may be able to sense %o when you are near.\"",
      },
      firsttime = {
         synopsis = "[You arrive at %H, but all is not well.]",
         output = "text",
         text = [[You are suddenly in familiar[[De repente estás en un entorno familiar. Los edificios en la distancia
parece que son de tu antigua alma mater, pero algo está mal. Se siente
como si hubiera habido un motín recientemente, o %H ha
He estado bajo asedio.

Todas las ventanas están cubiertas, y hay objetos diseminados alrededor
la entrada.

Las formas extrañas que prohíben parecen moverse en la distancia.]]         text = "You have returned to %ns lair.",
      },
      goal_first = {
         synopsis = "[This strange feeling must be the presence of %o.]",
         output = "text",
         text = [[A strange feeling wash[[Un extraño sentimiento se lava sobre ti, y piensas de nuevo en cosas que
aprendida durante las numerosas conferencias de %l.

Te das cuenta de que el sentimiento debe ser la presencia de %o.]]xt = {
         text = "The familiar presence of %o is in the ether.",
      },
      gotit = {
         synopsis = "[The power of %o flows through your body!  You must return it to %l.]",
         output = "text",
         t[[El poder de %o fluye a través de su cuerpo! Te sientes
como si ahora pudieras tomar el Mago de Yendor mismo y ganar, pero
Sabes que debes devolver %o %l.]] %l.]],
      },
      guardtalk_after = {
         "\"Did you see Lash LaRue in 'Song of Old Wyoming' the other night?\"",
         "\"Hey man, got any potions of hallucination for sale?\"",
         "\"I guess you are guaranteed to make full professor now.\"",
         "\"So, what was worse, %n or your entrance exams?\"",
         "\"%oC is impressive, but nothing like the bones I dug up!\"",
      },
      guardtalk_before = {
         "\"Did you see Lash LaRue in 'Song of Old Wyoming' the other night?\"",
         "\"Hey man, got any potions of hallucination for sale?\"",
         "\"Did you see the artifact %l brought back from the last dig?\"",
         "\"So what species do *you* think we evolved from?\"",
         "\"So you're %ls prize pupil!  I don't know what he sees in you.\"",
      },
      hasamulet = {
         synopsis = "[Take the Amulet to the Astral Plane and sacrifice it at the altar of %d.]",
         output = "text",
         tex[["Felicitaciones, %p. Me preguntaba si alguien podría prevalecer contra
el mago y los secuaces de Moloch. Ahora, debes embarcarte en uno.
aventura final.

"Toma el Amuleto, y encuentra tu camino hacia el Plano Astral.
Hay que encontrar el altar de %d y sacrificar el
Amuleto en ese altar para cumplir tu destino.

"Recordad, vuestro camino ahora debe ser siempre hacia arriba."]]."]],
      },
      killed_nemesis = {
         text = "The body of %n dissipates in a cloud of noxious fumes.",
      },
      leader_first = {
         synopsis = "[\"You have returned, %p, to a difficult task.\"]",
         output = "text"[["Finalmente has vuelto, %p. Siempre estabas
mi estudiante más prometedor. Permítanme ver si están listos para el
tarea más difícil de su carrera"]]of your career."]],
      },
      leader_last = {
         synopsis = "[\"%pC, you have failed us.  Begone!\"]",
         output = "text",
       [["%p, nos has fallado. Todo mi cuidadoso entrenamiento ha estado en
vano. ¡Begone! ¡Tu tenencia en esta universidad ha sido revocada!

"¡Eres una vergüenza para la profesión!"]]ssion!"]],
      },
      leader_next = {
[["De nuevo, %p, estás delante de mí.
Déjame ver si has adquirido experiencia en el ínterin"]] the interim."]],
      },
      leader_other = {
[["Una vez más, %p, has vuelto del campo.
¿Estás finalmente listo para la tarea que debe cumplirse?"]]accomplished?"]],
      },
      locate_first = {
         synopsis = "[This foreboding edifice must hide the entrance to %i.]",
         output = "text",
         text [[Una llanura se abre ante ti. Más allá de la llanura se encuentra un edificio precursor.

Tienes la sensación de que pronto encontrarás la entrada
%i.]]]],
      },
      locate_next = {
         text = "Once again, you are near the entrance to %i.",
      },
      nemesis_first = {
         synopsis = "[\"Come, %p, I shall destroy you!\"]",
         output = "text",
 [["Entonces, %p, usted piensa que puede tener éxito en la recuperación
%o, cuando su maestro, %l, ya ha fallado.

"¡Ven, prueba lo mejor que puedas! Te destruiré, y te roceré los huesos."]] your bones."]],
      },
      nemesis_next = {
         synopsis = "[\"Again you try to best me, %p?  You shall never recover %o.\"]",
         out[["¿De nuevo tratas de mejorarme, eh %p? Bueno, volverás a fallar.

"Nunca te recuperarás %o.

" Llevaré tu alma al Plano de Origen para el placer de mi amo."]]s for my master's pleasure."]],
      },
      nemesis_other = {
         text = "\"You persist yet %p!  Good.  Now, you shall die!\"",
      },
      nemesis_wantsit = [["Tendré %o de usted, %p, luego fiesta
sobre tus entrañas!"]] your entrails!"]],
      },
      nexttime = {
         text = "Once again, you are back at %H.",
      },
      offeredit = {
         synopsis = "[%lC instructs you to guard %o from now on.]",
         output = "text",
  [[%lC touches %o brevemente, miradas en ella,
entonces te sonríe y dice:

"Bien hecho, %p. Has derrotado a %n y
recuperado %o. Pero temo que nunca será seguro
Aquí.

Tome %o con usted. Usted, %p, puede
Vigílalo mejor que yo.

Que las bendiciones de %d te sigan y te protejan"]] guard you."]],
      },
      offeredit2 = {
         synopsis = "[\"Resume your search for the Amulet beyond the magic portal to %Z.\"]",
         output = "text",
         text = [["Care[["¡Cuidado, %p! %oC podría romper, y eso sería
una trágica pérdida. Ahora eres su guardián, y ha llegado el momento
reanudar su búsqueda por el Amuleto. %Z le espera
volver a través del portal mágico que te trajo aquí."]] },
      othertime = {
         text = [[You are[[Estás de vuelta en %H.
Tienes una extraña sensación de que puede ser la última vez que vengas aquí.]],
      posthanks = {
         synopsis = "[\"Have you progressed with your quest to regain the Amulet of Yendor for %d?\"]",
         output = "text",
         text =[["Bienvenido, %p. ¿Ha progresado con su búsqueda de
recuperar el Amuleto de Yendor para %d?"]]],
      },
   },
   Bar = {
      assignquest = {
         synopsis = "[\"Find %n, defeat %ni, and return %o to us.\"]",
         output = "text",
         text = [["[["El mundo necesita su ayuda, %p.

"Hace unos seis meses, aprendí que un misterioso hechicero, conocido
como %n, había comenzado a reunir un gran grupo de corroas y bandidos
sobre %ni.

"Al mismo tiempo, estas personas que alguna vez montaste con 'liberado' a
potente talismán mágico, %o, de una caravana turaniana.

"%nC y %nj Horda Negra descendieron sobre %i y derrotaron
la gente allí, conduciéndolos al desierto. Ha tomado
%o, y busca doblarlo a %nj voluntad. Detecté el
cambios sutiles en las corrientes del destino, y se unieron a estas personas.
Entonces envié una llamada para ti.

"Si %n puede doblar %o a %nj, se convertirá en
casi indestructible. Entonces será capaz de esclavizar las mentes de
hombres de todo el mundo. Eres la única esperanza. Los dioses sonríen sobre ti,
y con %d detrás de usted, usted solo puede derrotar %n.

"Debes ir a %i. Desde allí, puedes rastrear hacia abajo
%n, derrota %ni, y volver %o a nosotros. Sólo
entonces el mundo estará a salvo."]]     },
      badalign = {
         synopsis = "[\"You have wandered from the path of the %a.  Come back when you have atoned.\"]",
         output = "text",
        [[¡%pC! ¡Has vagado del camino del %a!
Si usted intenta superar %n en este estado, seguramente lo hará
esclaviza tu alma. Tu única esperanza, y la nuestra, radica en tu purificación.
Adelante, y regresa cuando te sientas listo."]]eady."]],
      },
      badlevel = {
         synopsis = "[\"You are too inexperienced.  Come back when you are %Ra.\"]",
         output = "text",
       [["%p, me temo que aún estás demasiado inexperto para enfrentarte
%n. Sólo e295eb5096a con la ayuda de %d podría esperar nunca
derrota %ni." %R]]t %ni."]],
      },
      discourage = {
         "\"My pets will dine on your carcass tonight!\"",
         "\"You are a sorry excuse for %ra.\"",
         "\"Run while you can, %c.  My next spell will be your last.\"",
         "\"I shall use your very skin to bind my next grimoire.\"",
         "\"%d cannot protect you now.  Here, you die.\"",
         "\"Your %a nature makes you weak.  You cannot defeat me.\"",
         "\"Come, %c.  I shall kill you, then unleash the horde on your tribe.\"",
         "\"Once you are dead, my horde shall finish off %l, and your tribe.\"",
         "\"Fight, %c, or are you afraid of the mighty %n?\"",
         "\"You have failed, %c.  Now, my victory is complete.\"",
      },
      encourage = {
         "\"%nC is strong in the dark arts, but not immune to cold steel.\"",
         "\"Remember that %n is a great sorcerer.  He lived in the time of Atlantis.\"",
         "\"If you fail, %p, I will not be able to protect these people long.\"",
         "\"To enter %i, you must be very stealthy.  The horde will be on guard.\"",
         "\"Call upon %d in your time of need.\"",
         "\"May %d protect you, and guide your steps.\"",
         "\"If you can lay hands upon %o, carry it for good fortune.\"",
         "\"I cannot stand against %ns sorcery.  But %d will help you.\"",
         "\"Do not fear %n.  I know you can defeat %ni.\"",
         "\"You have a great road to travel, %p, but only after you defeat %n.\"",
      },
      firsttime = {
         synopsis = "[You reach the vicinity of %H, but sense evil magic nearby.]",
         output[[Curiosamente exploras tu entorno, todos tus sentidos alertan por señales
de posible peligro. Fuera en la distancia, usted puede %x las formas familiares
de %H.

¿Pero por qué, crees, debería haber %l ahí?

De repente, los pelos en el cuello se paran al final mientras detectas el aura de
magia malvada en el aire.

Sin pensar, preparas tu arma, y murmuras bajo tu aliento:

"Por %d, hoy habrá sangre derramada."]]ll be blood spilt today."]],
      },
      goal_first = {
         synopsis = "[This is surely the lair of %n.]",
        [[Los pelos en la nuca de tu cuello levantan mientras sientes una energía en el
muy aire a tu alrededor. Luchas contra un pánico primordial que busca
Hazte girar y correr. Este es seguramente el heredero de %n.]]  This is surely the lair of %n.]],
      },
      goal_next = {
         text = "Yet again you feel the air around you heavy with malevolent magical energy.",
      },
      gotit = {
         synopsis = "[You feel the power of %o flowing through your hand[[Al recoger %o, usted siente el poder de él
fluyendo por tus manos. Parece estar en dos o más lugares
a la vez, aunque lo estés sosteniendo.]]laces
at once, even though you are holding it.]],
      },
      guardtalk_after = {
         "\"The battles here have been good -- our enemies' blood soaks the soil!\"",
         "\"Remember that glory is crushing your enemies beneath your feet!\"",
         "\"Times will be good again, now that the horde is vanquished.\"",
         "\"You have brought our clan much honor in defeating %n.\"",
         "\"You will be a worthy successor to %l.\"",
      },
      guardtalk_before = {
         "\"The battles here have been good -- our enemies' blood soaks the soil!\"",
         "\"Remember that glory is crushing your enemies beneath your feet!\"",
         "\"There has been little treasure to loot, since the horde arrived.\"",
         "\"The horde is mighty in numbers, but they have little courage.\"",
         "\"%lC is a strange one, but he has helped defend us.\"",
      },
      hasamulet = {
         synopsis = "[\"Take the Amulet to the altar of %d on the Astral Plane and offer it.\"]",
     [["Esto es maravilloso, %p. Temía que no pudieras
tener éxito en tu búsqueda, pero aquí estás en posesión del Amuleto
de Yendor!

"He estudiado los textos de los magos constantemente desde que te fuiste. In
el libro de Skelos, encontré esto:

%d hará que un niño sea enviado al mundo. Este niño debe
ser fuerte por la prueba de la batalla y la magia, por %d lo ha querido.
Se dice que el niño de %d recuperará el Amuleto de Yendor
que fue robado del Creador al principio del tiempo.

"Como ahora posees el amuleto, %p, sospecho que el Libro
habla de ti.

El niño de %d tomará el Amuleto, y viajará al Astral
Plane, donde se encuentra el Gran Templo de %d. El Amuleto
será sacrificado a %d, allí en %dJ altar. Entonces el niño lo hará.
stand by %d como campeón de los %cP para la eternidad.

"Esto es todo lo que sé, %p. Espero que te ayude"]]now, %p.  I hope it will help you."]],
      },
      killed_nemesis = {
         synopsis = "[%nC curses you, but you feel the overpowering aura of magic fading.]",
         output = "text",
         text = [[%nC falls to the ground, and utter[[%n C cae al suelo, y te dice una última maldición. Luego %nj
el cuerpo se desvanece lentamente, aparentemente dispersándose en el aire a su alrededor. Tú.
lentamente se vuelve consciente de que el aura de la magia en el aire tiene
Empezó a desvanecerse.]]       synopsis = "[\"At last you have returned.  There is a great quest you must undertake.\"]",
         output = "text",
         text = [["Ah[["Ah, %p. Has vuelto por fin. El mundo está en peligro.
Necesito tu ayuda. Hay una gran búsqueda que debes emprender.

"Pero primero, debo ver si estás listo para asumir tal desafío."]]   },
      leader_last = {
         synopsis = "[\"You have betrayed %d; soon %n will destroy us.  Begone!\"]",
         output = "text",
         text = [["Pah!  You ha[["¡Pah! Has traicionado a los dioses, %p. Nunca alcanzarás
la gloria a la que aspiras. Tu fracaso para seguir el verdadero camino ha
cerró este futuro para ti.

"Protegeré a estas personas lo mejor que pueda, pero pronto %n superará
y destruir a todos los que una vez te llamaron %s. ¡Ahora se ha pasado!"]]  leader_next = {
         text = "\"%p, you are back.  Are you ready now for the challenge?\"",
      },
      leader_other = {
         text = "\"Again, you stand before me, %p.  Surely you have prepared yourself.\"",
      },
      locate_first = {
         synopsis = "[You have located %i.]",
         output = "text",
         text = [[El olor del agua viene a ti en la brisa del desierto. Lo sabes.
has located %i.]],
      },
      locate_next = {
         text = "Yet again you have a chance to infiltrate %i.",
      },
      nemesis_first = {
         synopsis = "[%nC boasts that %nh has slain many.  \"Prepare to die, %c.\"]",
         output = "text",
         text = [["So.  Th[["Entonces. Esto es lo que el segundo brujo de tasa %l envía a hacer %lj licitación.
He matado a muchos antes de ti. Me darás un pequeño deporte.

"Preparado para morir, %c."]]
      nemesis_next = {
         text = "\"I have wasted too much time on you already.  Now, you shall die.\"",
      },
      nemesis_other = {
         text = "\"You return yet again, %c!  Are you prepared for death now?\"",
      },
      nemesis_wantsit = {
         te[["Tendré %o de vuelta, una excusa lamentable para %ca.
Y tu vida también."]]l."]],
      },
      nexttime = {
         tex[[Una vez más, usted cerca de %H. Sabes que %l
estará esperando.]]g.]],
      },
      offeredit = {
         synopsis = "[%lC tells you to guard %o, and to return when you have triumphed.]",
         output = "text",
         [[Cuando %l ve %o, sonríe, y dice:

Bien hecho, %p. Has salvado al mundo de cierta perdición.
¿Qué, ahora, debe hacerse con %o?

Estas personas, valientes como son, no pueden esperar protegerlo de
otros hechiceros que lo detectarán, así como %n lo hizo.

Tome %o con usted, %p. Te protegerá.
tus aventuras, y lo mejor es protegerlo. Usted se embarca en un
búsqueda mucho más grande de lo que te das cuenta.

Recuérdame, %p, y regresa cuando hayas triunfado. I
entonces te dirá lo que debes hacer. Usted comprenderá cuando el
Llega el momento.]]omes.]],
      },
      offeredit2 = {
         synopsis = "[\"You keep %o.  Return to %Z to search for the Amulet.\"]",
         output = "text",
         text = [[%l gazes reverently at %o[[%l miradas reverentemente en %o, luego de regreso a usted.

"Ahora eres su guardián, y ha llegado el momento de reanudar tu búsqueda
para el Amulet. %Z espera su regreso a través del
portal mágico que te trajo aquí."]]= {
         text = [[Again, and [[Una vez más, y usted piensa posiblemente por última vez, se acerca
%H.]]    posthanks = {
         text = "\"Tell us, %p, have you fared well on your great quest?\"",
      },
   },
   Cav = {
      assignquest = {
         synopsis = "[Find and defeat %n, recover %o, and return with it.]",
         output = "text",
         text = [["You a[["Realmente estás listo ahora, %p. Te contaré una historia
gran sufrimiento entre vuestro pueblo:

"Poco después de que te fuiste de tu búsqueda de visión, las cuevas fueron invadidas por
las criaturas enviadas contra nosotros por %n.

"Ella, ella misma, no pudo atacarnos debido a su gran tamaño, pero sus secuaces
nos han acosado desde entonces. En los primeros ataques, muchos murieron, y
de %n logró robar %o.
Lo llevaron a %i y allí, ninguno de nuestros
%g guerreros han sido capaces de ir.

"Usted debe encontrar %i, y dentro de ella lucha
%o de %n. Ella lo guarda como
celosamente mientras guarda todos los tesoros que ella consigue. Pero con él,
podemos hacer nuestras cuevas seguras una vez más.

"Por favor, %p, recuperar %o para nosotros, y devolverlo aquí."]]},
      badalign = {
         synopsis = "[\"You no longer follow the path of the %a. [["%pC! Te has desviado de mis enseñanzas. Ya no sigues
el camino del %a como usted debe. Te desterro de estas cuevas, a
ve y purificate. Entonces, usted podría lograr esto
búsqueda."]]nd purify yourself.  Then, you might be able to accomplish this
quest."]],
      },
      badlevel = {
         synopsis = "[\"%rA is too inexperienced.  Come back when you have progressed.\"]",
    [["Ay, %p, usted todavía está demasiado inexperto para embarcarse en tales
una misión difícil como la que propongo darle.

"%r A no podría sobrevivir los rigores demandados para encontrar
%i, no importa enfrentarse a la misma %n.

"Adventure un poco más, y usted aprenderá las habilidades que usted necesitará.
%d lo decreta."]]ls you will require.
%d decrees it."]],
      },
      discourage = {
         "\"You are weak, %c.  No challenge for the Mother of all Dragons.\"",
         "\"I grow hungry, %r.  You look like a nice appetizer!\"",
         "\"Join me for lunch?  You're the main course, %c.\"",
         "\"With %o, I am invincible!  You cannot succeed.\"",
         "\"Your mentor, %l has failed.  You are nothing to fear.\"",
         "\"You shall die here, %c.  %rA cannot hope to defeat me.\"",
         "\"You, a mere %r challenge the might of %n?  Hah!\"",
         "\"I am the Mother of all Dragons!  You cannot hope to defeat me.\"",
         "\"My claws are sharp now.  I shall rip you to shreds!\"",
         "\"%d has deserted you, %c.  This is my domain.\"",
      },
      encourage = {
         "\"%nC is immune to her own breath weapons. You should use magic upon her that she does not use herself.\"",
         "\"When you encounter %n, call upon %d for assistance.\"",
         "\"There will be nowhere to hide inside %ns inner sanctum.\"",
         "\"Your best chance with %n will be to keep moving.\"",
         "\"Do not be distracted by the great treasures in %ns lair. Concentrate on %o.\"",
         "\"%oC is the only object that %n truly fears.\"",
         "\"Do not be fooled by %ns size.  She is fast, and it is rumored that she uses magic.\"",
         "\"I would send a party of %gP with you, but we will need all of our strength to defend ourselves.\"",
         "\"Remember, be %a at all times.  This is your strength.\"",
         "\"If only we had an amulet of reflection, this would not have happened.\"",
      },
      firsttime = {
         synopsis = "[You arrive back at %H, but somethi[[Bajas por una escalera apenas conocida que recuerdas
%l mostrándote cuando te embarcaste en tu búsqueda de visión.

Llegas a %H, pero algo parece
mal aquí. El humo habitual y la luz brillante de los fuegos de los
las cuevas exteriores están ausentes, y una tranquila tranquila llena el aire húmedo.]]ter caves are absent, and an uneasy quiet fills the damp air.]],
      },
      goal_first = {
         synopsis = "[You enter a large cavern[[Te encuentras en una gran caverna, con paredes limpiamente pulidas, que
Sin embargo, muestre signos de ser acorralado por el fuego.

Los huesos iluminan el suelo, y hay objetos diseminados por todas partes.
El aire está cerca del hedor de vapores sulfurosos.

%nC es claramente visible, pero %nh parece estar dormido.]]us fumes.

%nC is clearly visible, but %nh seems to be asleep.]],
      },
      goal_next = {
         text = "Once again, you find yourself in the lair of %n.",
      },
      gotit = {
         synopsis = "[[Al recoger %o parece pesado al principio, pero como usted
Mantenga la fuerza fluye en sus brazos.

De repente te sientes lleno de poder, como si nada pudiera soportar
en tu camino.]]

You suddenly feel full of power, as if nothing could possibly stand
in your path.]],
      },
      guardtalk_after = {
         "\"The rains have returned and the land grows lush again.\"",
         "\"Peace has returned, give thanks to %d!\"",
         "\"Welcome back!  Did you find %o?\"",
         "\"So, %p, tell us the story of your fight with %n.\"",
         "\"%lC grows old.  Perhaps you will guide us after he ascends.\"",
      },
      guardtalk_before = {
         "\"We have not been able to gather as much food since the Giants sealed off our access to the outer world.\"",
         "\"Since %n sent her minions, we have been constantly fighting.\"",
         "\"I have heard your vision quest was successful.  Is this so?\"",
         "\"So, tell me, %p, how have you fared?\"",
         "\"%lC grows old.  We know not who will guide us after he ascends.\"",
      },
      hasamulet = {
         synopsis = "[\"Take the Amulet to the alt[["Has tenido éxito, ya veo, %p.

"Ahora que el Amuleto de Yendor es tuyo, esto es lo que debes hacer:

"Viaje al aire libre. El Amuleto que llevas entonces
te lleva a los Planes Astrales, donde el Gran Templo de %d
arroja su influencia en todo nuestro mundo.

"Sacrifica el Amuleto en el altar. Así %d será supremo!"]]roughout our world.

"Sacrifice the Amulet on the altar.  Thus shall %d become sup[[%nC se hunde en el suelo, sus cabezas colgando alrededor.
Mientras ella muere, una nube de humos nocivos se inclina sobre ella.]].
As she dies, a cloud of noxious fumes billows about her.]],
      },
      leader_first = {
         synopsis = "[\"You have returned.  W[["Has vuelto de tu búsqueda de visión, %p. Gracias %d.

"Estamos en extrema necesidad de su ayuda, mi %S.

"Pero primero, debo ver si aún eres capaz de la misión que haría
pedirte que te emprendas."]] I must see if you are yet capable of the quest I would
ask you to undertake."]],
      },
      leader_last = {
         synopsis = [["%pC! Has sellado nuestro destino. Pareces incapaz de reformarte,
Así que debo seleccionar otro para ocupar tu lugar.

"¡Begone de %H! Nos has traicionado eligiendo
el camino del %C sobre el verdadero camino del %L.

"Ya no vives en nuestros ojos."]]
the path of the %C over the true path of the %L.

"You no longer live in our eyes."]],
      },
      leader_next = {
         text = "\"Again, you return to us, %p.  Let me see if you are ready now.\"",
      },
      leader_other = {
         text = "\"Ah, %p.  Are you finally ready?\"",
      },
      locate_first = {
         synopsis = "[You %x many large claw m[[Usted %x muchas marcas de garras grandes en el suelo. Los túneles por delante
de ustedes son más grandes que la mayoría de los de cualquier complejo de cueva que tienen
Nunca había estado antes.

Tu nariz detecta el olor de carriona desde dentro, y los huesos se sumerge
los lados de los túneles.]]tects the smell of carrion from within, and bones litter
the sides of the tunnels.]],
      },
      locate_next = {
         text = "Once again, you approa[["Así que, seguidor de %l, usted busca invadir la guarida de
%n. Sólo mis comidas están permitidas aquí. Prepárate.
para ser comido!"]]        text = [["So, follower of [["Entonces, de nuevo me enfrentas, %c. Nadie me ha escapado.
Ahora te mataré."]]e eaten!"]],
      },
      nemesis_next = {
         text = [["So, again you face me, %c.  No one has ever before escaped me.
Now I shall kill you."]],
      },
      nemesis_other = {
         text = "\"You are getting annoying, %c.  Prepare to die.\"",
      },
      nemesis_wantsit = {
         text = "\"I'll have %o from you, %c.  You shall die.\"",
      },
      nexttime = {
         text = "Once again, you arrive back at %H.",
      },
      offeredit = {
 [[%lC vislumbra %o en su posesión.
Sonríe y dice:

¡Lo has hecho! Estamos salvados. Pero temo que %o
será siempre un objetivo para las fuerzas %C que lo querrán por sus
propio.

Para evitar más problemas, me gustaría que, %p,
para llevar %o con usted. Te ayudará como tú.
búsqueda para el Amuleto de Yendor.]]To prevent further trouble, I would like you, %p,
    to take %o away with you.  It will help you as you
    quest for the Amulet of Yendor.]],
      },
      offeredit2 = {
         synopsis = "[\"You a[[%l agarra %o orgullosamente por un momento, luego te mira.

"Ahora eres su guardián, y ha llegado el momento de reanudar tu búsqueda
para el Amuleto. %Z espera su regreso a través de la
portal mágico que te trajo aquí."]]o resume your search
for the Amulet.  %[[Por alguna razón, crees que esta puede ser la última vez que lo harás
enter %H.]],
      othertime = {
         text = [[For [[¡%pC! Bienvenido.
¿Cómo va su búsqueda de recuperar el Amuleto para %d?"]]
      },
      posthanks = {
         text = [["%pC!  Welcome back.
How goes your quest to recover the Amulet for %d?"]],
      },
   },
   Hea = {
      assignque[[Por primera vez, sientes una sonrisa en la cara %ls.

"Realmente has aprendido tanto como podemos enseñarte en preparación
para esta tarea. Déjame decirte lo que sé de los síntomas y esperanza
que usted puede proporcionar una cura.

"Hace poco tiempo, el temido %nt fue engañado por los dioses
en pensar que %nh podría utilizar %o para encontrar un
cura para la vejez. ¡Piensa en ello, eterna juventud! Pero %nj bueno
la salud se logra extrayendo la salud de los alrededor de %ni.

"Ha agotado %nj el suministro de personas sanas y ahora %nh busca
extender %nj influencia en nuestro mundo. Usted debe recuperarse de %ni
%o y romper el hechizo.

"Debes viajar a los pantanos a %i, y desde allí
seguir el sendero hasta %ns isla lair. Ten cuidado."]]pell.

    "You must travel into the swamps to %i, and from there
    follow the trail to %ns island lair.  Be careful."]],
      },
      badalign =[["Usted ha aprendido mucho de los remedios que benefician, pero también debe
saber qué físico para el cual. Por eso las enseñanzas de %ds son una
parte de tu entrenamiento.

Vuelve a nosotros cuando te hayas curado]]t is why %ds teachings are a
part of your training.

"Return to us when you have healed thyself."]],
      },
      badlevel = {
         syno[["Ay, %p, usted todavía está demasiado inexperto para tratar con los rigores
de tal tarea. Debes ser capaz de aprovechar el conocimiento de la botánica,
alquimia y prácticas veterinarias antes de poder enviarte en esta búsqueda
con buena conciencia.

"Regresa cuando usas el caduceo de %Ra"]]ctices before I can send you on this quest 
with good conscience.

"Return when you wear %Ra's caduceus."]],
      },
      discourage = {
         "\"They might as well give scalpels to wizards as to let you try to use %o!\"",
         "\"If I could strike %l, surrounded by %lj %gP, imagine what I can do to you here by yourself.\"",
         "\"I will put my %Rp to work making a physic out of your ashes.\"",
         "\"As we speak, Hades gathers your patients to join you.\"",
         "\"After I'm done with you, I'll destroy %l as well.\"",
         "\"You will have to kill me if you ever hope to leave this place.\"",
         "\"I will impale your head on my caduceus for all to see.\"",
         "\"There is no materia medica in your sack which will cure you of me!\"",
         "\"Do not fight too hard, I want your soul strong, not weakened!\"",
         "\"You should have stopped studying at veterinary.\"",
      },
      encourage = {
         "\"Remember, %p, to always wash your hands before operating.\"",
         "\"%nC has no real magic of %nj own.  To this %nh is vulnerable.\"",
         "\"If you have been true to %d, you can draw on the power of %o.\"",
         "\"Bring with you antidotes for poisons.\"",
         "\"Remember this, %n can twist the powers of %o to hurt instead of heal.\"",
         "\"I have sent for Chiron, but I am afraid he will come too late.\"",
         "\"Maybe when you return the snakes will once again begin to shed.\"",
         "\"The plague grows worse as we speak.  Hurry, %p!\"",
         "\"Many times %n has caused trouble in these lands.  It is time that %nh was eradicated like the diseases %nh has caused.\"",
         "\"With but one eye, %n should be easy to blind.  Remember this.\"",
      [[¿Qué hechicería te ha traído de vuelta a %H? El olor
de neumáticos funerarios frescos te dice que algo es malo con la curación
poderes que solían practicar aquí.

Ningún rinoceronte está cuidando los jardines de materia medica, y donde están los
¿La gente común que solía venir para las curas?

Sabes que debes llegar rápidamente al colegio, y
%ls iatreion, y descubrir lo que ha pasado en su ausencia.]]You know that you must quickly make your way to the collegium, and
%ls iatreion, and find out what has happened in your absence.]],
      },
      goal_first = {
 [[Estáis a la vista de la infame Isla %n. Incluso
las palabras de 4dc6bbe3fe no te habían preparado para esto.

Acecharse contra los velos de los enfermos que perforan sus oídos,
Date prisa en tu tarea. Tal vez con %o usted puede
curarlos a su regreso, pero no ahora. %l]]s of the ill that pierce your ears,
you hurry on your task.  Maybe with %o you can
heal them on your return, but not now.]],
      },
      goal_next = {
         text = "Once again, you %x the Isle of %n in the distance.",
      },
      gotit =[[Mientras recoges %o, sientes que su cura comienza a
caliente tu alma. Maldices a Zeus por quitarlo de su legítimo dueño,
pero al menos usted espera que %l puede ponerlo a buen uso una vez
otra vez.]]our soul.  You curse Zeus for taking it from its rightful owner,
but at least you hope that %l can put it to good use once
again.]],
      },
      guardtalk_after = {
         "\"Did you read that new treatise on the therapeutic use of leeches?\"",
         "\"Paint a red caduceus on your shield and monsters won't hit you.\"",
         "\"How are you feeling?  Perhaps a good bleeding will improve your spirits.\"",
         "\"Have you heard the absurd new theory that diseases are caused by microscopic organisms, and not ill humors?\"",
         "\"I see that you bring %o, now you can cure this plague!\"",
      },
      guardtalk_before = {
         "\"Did you read that new treatise on the therapeutic use of leeches?\"",
         "\"Paint a red caduceus on your shield and monsters won't hit you.\"",
         "\"I passed handwriting so they are demoting me a rank.\"",
         "\"I've heard that even %l has not been able to cure Chiron.\"",
         "\"We think %n has used %nj alchemists, and %o, to unleash a new disease we call 'the cold' on Gehennom.\"",
      },
      hasamulet = {
       [["Ah, has recuperado el Amuleto, %p. ¡Bien hecho!

"Ahora, usted debe saber que debe viajar a través de los Planes Elementales
al Astral, y allí devolver el Amuleto a %d. Adelante.
que nuestras oraciones sean como un viento en tu espalda."]]vel through the Elemental Planes
to the Astral, and there return the Amulet to %d.  Go forth and
may our prayers be as a wind u[[El cuerpo batido de %n desploma al suelo y los gases
una última maldición:

"Me has derrotado, %p, pero tendré mi venganza.
Como, no diré, pero esta maldición será como un cáncer
sobre ti."

Con ese %n muere.]]ave defeated me, %p, but I shall have my revenge.
    How, I shall not say, but this curse shall be like a cancer
    on you."

With that %n dies.]],
      },
      leader_first = {
        [[Feebly, %l levanta %lj cabeza para mirarte.

"Es bueno verte de nuevo, %p. Veo la preocupación en su
ojos, pero no te preocupes por mí. Aún no estoy listo para Hades. Tenemos
agotó gran parte de nuestros poderes curativos sosteniendo %n.
Necesito tu nueva fuerza para continuar nuestro trabajo.

"Acércate y déjame ponerte las manos sobre ti, y determinar si tienes
las habilidades necesarias para cumplir esta misión."]]rk.

"Come closer and let me lay hands on you, and determine if you have
the skills necessary to accomplish [["Nos has fallado, %p. ¡Eres un quack! ¡Un charlatán!

"Hades estará feliz de escuchar que estás practicando de nuevo
artes sobre la insuspección."]]e failed us, %p.  You are a quack!  A charlatan!

"Hades[["Regresa a mí, %p. Siento que cada viaje de vuelta
la pleurisía y los males de nuestra tierra comienzan a infectarte. Déjanos
esperanza y rezar a %d que usted está listo para su tarea antes
eres víctima de los malos humores."]]f our land begin to infect you.  Let us
hope and[["Chiron ha caído, Hermes ha caído, ¿qué más debo decirles que
¡Impresione sobre usted la importancia de su misión! Espero que usted
han venido preparados esta vez."]]es has fallen, what else must I tell you to
impress upon you the importance of your mission!  I hope that you
have come prepared this time."]][[Usted se encuentra ante la entrada a %i. Extraño
Los ruidos arañazos vienen de dentro del edificio.

El terreno pantanoso alrededor parece apestar con enfermedad.]]ore the entrance to %i.  Strange
scratching noises come from within the building.

The swampy ground around you seems to stink with disease.]],
      },
      locate_next = {
         text = "Once again you stand at the entrance t[["Han cometido un error en el envío de usted, %p.

"Cuando agregue tu juventud a la mía, sólo me hará más fácil
para derrotar a %l."]]",
         text = [["They have made a mistake in sending you, %p.

"When I add your youth to mine, it will just make it easier for me
to defeat %l."]],
      },
      nemesis_next = {
         text = "\"Unlike your patients, you seem to keep coming back, %p!\"",
      },
 [[Tendré %o de vuelta de ti, %r. Eres tú.
no va a vivir para escapar de este lugar."]]convulsions?\"",
      },
      nemesis_wantsi[[Después de su última experiencia que esperabas estar aquí, pero sin duda
no esperaba ver las cosas mucho peor. Esta vez debes tener éxito.]] text = [[After your last experience you expected to be here, but you certainly
did not expect to see things so much worse.  This time you must succeed.]],
      },
      offeredit = {[[Tan pronto como %l ve alimentado2cfdb11ed %lh convoca %lj
%gP.

Gently, %l alcanza y toca alimentados2cfdb11ed.
Instruye a cada uno de los reunidos a hacer lo mismo. Cuando todo el mundo
ha terminado %lh le habla.

"Ahora que hemos sido repletados podemos derrotar esta plaga. Debes
tomar alimentado2cfdb11ed con ustedes y reponer los mundos que tienen
fue llamado a viajar después. Desearía que pudieras llevar a Chiron al
Fin de tu viaje, pero necesito que me ayude a extender la cura. Vamos.
ahora y continuar su viaje." %o]]xt.  I wish you could ride Chiron to the
    end of your journey, but I need him to help me spread the cure.  Go
    now and continue [[%l maneja cuidadosamente %o mientras te observa.

"Ahora eres su guardián, y ha llegado el momento de reanudar tu búsqueda
para el Amuleto. %Z esperan su regreso a través de la
portal mágico que te trajo aquí."]]%o while watching you.

"You are its ke[[De nuevo, usted %x %H en la distancia.

El olor de la muerte y la enfermedad impregna el aire. No tienes
ser %Ra para saber que %n está al borde de la victoria.]] othertime = {
         text = [[Again, yo[["Volviste a nosotros, %p. Hemos hecho bien en tu
ausencia, ¿sí? ¿Cuán lejos estás en tu búsqueda del Amuleto?"]]e verge of victory.]],
      },
      posthanks = {
         text = [["You have again returned to us, %p.  We have done well in your
absence, yes?  How fare you upon your quest for the Amulet?[["Ah, %p. Estás verdaderamente listo, como no %c antes de ti
ha sido. Escucha ahora Nuestras palabras:

"Como te diste cuenta cuando te acercaste a %H, una gran batalla tiene
se luchó recientemente en estos campos. Conoces a Merlín mismo
vino a ayudarnos aquí mientras luchamos contra el enemigo %n. En medio de eso
Batalla, %n golpeó a Merlin un gran golpe, cayéndolo. Entonces, como Nuestro
fuerzas fueron presionadas hacia atrás, %n robó %o.

"Con el tiempo cambiamos la marea, pero perdimos muchos %cP en hacerlo.
Merlin fue quitado por su aprendiz, pero no se ha recuperado. Tenemos
se le dijo que mientras 87e20323900 posea %o,
Merlin no recuperará su salud.

"Por la presente te cobramos con esta tarea más importante:

"Salid de este lugar, a las hembras, y allí hallaréis
%i. Desde allí debes rastrear %n. Destruir el
bestia, y volver a Nosotros %o. Sólo entonces puede
Restauramos a Merlín a la salud"]]om this place, to the fens, and there thou wilt find
%i.  From there, thou must track down %n. [["Nos deshonrais, %p! Te has apartado del camino
¡Chivalry! Sal de Nuestra presencia y haz penitencia. Sólo cuando estés de nuevo
Que regreses de aquí."]] you are truly %a.]",
         output = "text",
         text = [["Thou dishonourest Us, %p!  Thou hast strayed from the path of
chivalry! Go from Our presence and do pena[["Realmente, %p, has hecho bien. Que has sobrevivido así
lejos es un crédito a tu valor, pero aún no estás preparado para
las demandas requeridas como Nuestro Campeón. %rA, no importa cómo
puro, nunca podría esperar derrotar al enemigo %n.

"Viaja desde este lugar, y perfecciona tus habilidades. Volver a
Nuestra presencia cuando has alcanzado el noble título de %R."]]required as Our Champion.  %rA, no matter how
pure, could never hope to defeat the foul %n.

"Journey forth from this place, and hone thy skills.  Return to
Our presence when thou hast attained the noble title of %R."]],
      },
      discourage = {
         "\"A mere %r can never withstand me!\"",
         "\"I shall kill thee now, and feast!\"",
         "\"Puny %c.  What manner of death dost thou wish?\"",
         "\"First thee, %p, then I shall feast upon %l.\"",
         "\"Hah!  Thou hast failed, %r.  Now thou shalt die.\"",
         "\"Die, %c.  Thou art as nothing against my might.\"",
         "\"I shall suck the marrow from thy bones, %c.\"",
         "\"Let's see...  Baked?  No.  Fried?  Nay.  Broiled?  Yea verily, that is the way I like my %c for dinner.\"",
         "\"Thy strength waneth, %p.  The time of thy death draweth near.\"",
         "\"Call upon thy precious %d, %p.  It shall not avail thee.\"",
      },
      encourage = {
         "\"Remember, %p, follow always the path of %d.\"",
         "\"Though %n is verily a mighty foe, We have confidence in thy victory.\"",
         "\"Beware, for %n hath surrounded %niself with hordes of foul creatures.\"",
         "\"Great treasure, 'tis said, is hoarded in the lair of %n.\"",
         "\"If thou possessest %o, %p, %ns magic shall therewith be thwarted.\"",
         "\"The gates of %i are guarded by forces unseen, %p. Go carefully.\"",
         "\"Return %o to Us quickly, %p.\"",
         "\"Destroy %n, %p, else %H shall surely fall.\"",
         "\"Call upon %d when th[[Te materializas en las sombras de 7739b069f9. Inmediatamente, te das cuenta
que algo está mal. Los campos alrededor del castillo son pisoteados y
marchitado, como si una gran batalla se hubiera librado recientemente.

Explorando más lejos, usted %x gouges largos en las paredes de 7739b069f9.
Sólo sabes de una criatura que hace esas marcas... %H]]The fields around the castle are trampled and
withered, as if some great battle has been recently fought.

Exploring f[[Al salir de los pantanos, usted %x antes de usted un enorme agujero de separación en el
lado de una colina. Desde dentro, hueles el olor de carriona.

Las piscinas de cada lado de la entrada están llenas de sangre, y
piezas de metal oxidado y armas rotas muestran sobre la superficie.]]e swamps, you %x before you a huge, gaping hole in the
side of a hill.  From within, you smell the foul stench of carrion.

The pools on either side of the entrance are fouled with blood, and
pieces of[[Mientras recoges %o, sientes sus campos de protección
forma alrededor de tu cuerpo. También sientes un débil revuelo en tu mente, como
si estás en dos lugares a la vez, y en el segundo, estás despertando
un sueño largo.]]e magic of %o.]",
         output = "text",
         text = [[As you pick up %o, you feel its protective fields
form around your body.  You also feel a faint stirring in your mind, as
if you are in two places at once, and in the second, you are waking from
a long sleep.]],
      },
      guardtalk_after = {
         "\"Hail, %p!  Verily, thou lookest well.\"",
         "\"So, %p, didst thou find %n in the fens near %i?\"",
         "\"Worthy %p, hast thou proven thy right purpose on the body of %n?\"",
         "\"Verily, %l could have no better champion, %p.\"",
         "\"Hast thou indeed recovered %o?\"",
      },
      guardtalk_before = {
         "\"Hail, %p!  Verily, thou lookest well.\"",
         "\"There is word, %p, that %n hath been sighted in the fens near %i.\"",
         "\"Thou art our only hope [["Tú has tenido éxito, ¡vemos, %p! Ahora te ordena tomar
el Amuleto para ser sacrificado a %d en el Plano del Astral.

"Merlin ha aconsejado Nosotros debemos viajar siempre hacia arriba
los Planes de los Elementos, para alcanzar este objetivo.

"Ve con %d, %p."]]    text = [["Thou hast succeeded, We see, %p!  Now thou art commanded to take
the Amulet to be sacrificed to %d in the Plane of the Astral[[Como %n se hunde al suelo, la sangre que brota de %nj boca abierta, %nh
te maldice desafiantemente y %l:

"Aún no has ganado, %r. Por los dioses, volveré
¡y perda tus pasos a la tumba!"

%nJ cola agitada locamente, %n intenta arrastrarse hacia ti, pero desploma
al suelo y muere en una piscina de %nj posee sangre.]]g from %nj open mouth, %nh
defiantly curses you and %l:

    "Thou hast not won yet, %r.  By the gods, I shall return
    and dog thy steps to the grave!"

%[["Ah, %p. Vemos que has recibido nuestra citación.
Estamos en extrema necesidad de su proeza. Pero primero, debemos necesitar
decidir si estás listo para esta gran empresa."]]s = "[%lC checks whether you are ready for a great undertaking.]",
         output = "text",
         text = [["Ah, %p.[["Usted deshonra a esta noble corte con su impuro presencia. Hemos estado
indulgente contigo, pero no más. Ya no se hablará tu nombre. Nosotros
Por la presente te despojarás de tu título, de tus tierras, y de tu pie como %ca.
¡Se ha pasado de Nuestra vista!"]]
         output = "text",
         text = [["Thou disgracest this noble court with thine impure presence.  We have been
lenient with thee, but no more.  Thy name shall be spoken no more.  We
hereby strip thee of thy title, thy lands, and thy standing as %ca.
Begone from Our sight!"]],
      },
      leader_next = {
         text = "\"Welco[[Usted está al pie de %i. Encima, puede %x un santuario.
Las energías extrañas parecen estar enfocadas aquí, y el pelo en la parte posterior de
tu cuello está al final.]]now?\"",
      },
      locate_first = {
         synopsis = "[You have reached %i and can %x a shrine.]",
         output = "text",
         text = [[You stand at the foot of %i.  Atop, you can %x a shrine.
Strange ene[["¡Hah! Otro puny %c busca la muerte. cenaré bien esta noche,
entonces mañana, %H caerá!"]]    locate_next = {
         text = "Again, you stand at the foot of %i.",
      },
      nemesis_first = {
         synopsis = "[%nC taunts you and issues a threat against %H.]",
         output = "text",
         text = [["Hah!  Another puny %c seeks death.  I shall dine well tonight,
the[["¡Así que, te atreves a tocar mi propiedad! Tendré ese bauble de vuelta,
puny %r. ¡Morirás en agonía!"]]me, %r?  So be it.  Thou wilt die here.\"",
      },
      nemesis_other = {
         text = "\"Thou art truly foolish, %r.  I shall dispatch thee anon.\"",
      },
      nemesis_wantsit = {
         text = [["So, thou darest touch MY property!  I s[[A medida que se acerca %l, %lh haces a usted y dice:

"¡Bien hecho! Eres verdaderamente el campeón de %H. Nosotros
han recibido noticias de que Merlín se está recuperando, y pronto
Reúnete con nosotros.

"Él nos ha instruido que ahora eres el guardián de
%o. Él siente que usted puede tener necesidad de
sus poderes en tus aventuras. Es nuestro deseo que guardes
%o contigo mientras buscas la fábula
Amuleto de Yendor."]] Merlin is recovering, and shall soon
    rejoin Us.

    "He hath instructed Us that thou art now to be the guardian of
    %o.  He feeleth that thou mayst have need of
    its powers[["¡Cuidado, %p! %oC podría romperse, y eso sería
ser una pérdida trágica. Tú eres su guardián ahora, y el tiempo ha llegado
para reanudar la búsqueda del Amuleto. %Z espera tu
volver a través del portal mágico que te trajo aquí."]]nd find the Amulet.]",
         output =[[Una vez más, usted está ante %H. Usted vagamente siente que esto
puede ser la última vez que se para antes de %l.]]its keeper now, and the time hath come
to resume thy search for the Amulet.  %Z await thy
return through the magic portal that brought thee here."]],
      },
      othertime = {
         text = [[Again, you stand before %H.  You vaguely sense that this
may be the last time you stand[["Sí, %p. Estás realmente listo ahora. Atenderme y yo lo haré.
Dile lo que ha pasado:

"Durante una de las grandes meditaciones hace poco, %n y
a legion of elementals invaded %H. Muchos %gP
fueron asesinados, incluyendo el que llevaba %o.

Ahora, apenas quedan %gP para mantener los elementales
a la bahía.

"Necesitamos que encuentres %i, entonces, desde allí,
viajar a %ns lair. Si usted puede conseguir derrotar %n y
regreso %o aquí, podemos entonces conducir fuera de las legiones
de elementales que matan a nuestros estudiantes.

"Ve con %d como tu guía, %p."]]the one bearing %o.

Now, there are barely enough %gP left to keep the elementals
at bay.

"We need you to find %i, then, fr[["Esto es terrible, %p. ¡Te has desviado del verdadero camino!
Sabes que %d requiere la devoción más estridente de esto
orden. La %shood debe soportar la máxima piedad.

"Id de aquí, expiad vuestros pecados contra %d. Regresa sólo cuando
te has purificado."]]en you are worthy of %d.]",
         output = "text",
         text = [["This is terrible, %p.  You have deviated from the true path!
You know that %d requires the m[["Alas, %p, todavía no está. Un mero %r nunca podría
soportar el poder de %n. Adelante, otra vez al mundo, y
cuando hayas alcanzado el puesto de %R."]]f."]],
      },
      badlevel = {
         synopsis = "[You are not ready to face %n.  Come back when you are %Ra.]",
         output = "text",
         text = [["Alas, %p, it is not yet to be.  A mere %r could never
withstand the might of %n.  Go forth, again into the world, and
return when you have attained the post of %R."]],
      },
      discourage = {
         "\"Submit to my will, %c, and I shall spare you.\"",
         "\"Your puny powers are no match for me, %c.\"",
         "\"I shall have you turned into a zombie for my pleasure!\"",
         "\"Despair now, %r.  %d cannot help you.\"",
         "\"I shall feast upon your soul for many days, %c.\"",
         "\"Your death will be slow and painful.  That I promise!\"",
         "\"You cannot defeat %n, you fool.  I shall kill you now.\"",
         "\"Your precious %lt will be my next victim.\"",
         "\"I feel your powers failing you, %r.  You shall die now.\"",
         "\"With %o, nothing can stand in my way.\"",
      },
      encourage = {
         "\"You can prevail, if you rely on %d.\"",
         "\"Remember that %n has great magic at his command.\"",
         "\"Be pure, my %S.\"",
         "\"Beware, %i is surrounded by hordes of earth elementals.\"",
         "\"Remember your studies, and you will prevail!\"",
         "\"Acquire and wear %o if you can.  They will aid you against %n.\"",
         "\"Call upon %d when your need is greatest.  You will be answered.\"",
         "\"Remember to use the elementals' strength against[[Te encuentras de pie a la vista de %H.
Algo está obviamente mal aquí. formas extrañas madera alrededor
fuera %H!

¡Te das cuenta de que %l necesita tu asistencia!]]firsttime = {
         synopsis = "[You have reached %H but something is wrong.  %lC needs your aid.]",
         output = "text",
         text = [[You fin[[El hedor de azufre es todo sobre ti, y los elementales se acercan
de todos los lados!

Ahead, hay un pequeño claro en medio de los agujeros de lava...]]
      },
      goal_first = {
         synopsis = "[You are surrounded by brimstone, lava, and elementals.]",
         output = "text",
         text = [[The stench of brimstone is all about you, and the elementals close in
from all sides!

Ahead, ther[[Mientras recoges el %o, sientes la esencia de
%d llena tu alma. Sabes ahora por qué %n robó %oi
%H, para con %oi, %ca de %d podría
fácilmente derrotar sus planes.

Usted siente un mensaje de %d. Aunque no verbal, tú
obtener la impresión de que debe volver a %l tan pronto
como sea posible.]]= "text",
         text = [[As you pick up %o, you feel the essence of
%d fill your soul.  You know now why %n stole %oi from
%H, for with %oi, %ca of %d could
easily defeat his plans.

You sense a message from %d.  Though not verbal, you
get the impression that you must return to %l as soon
as possible.]],
      },
      guardtalk_after = {
         "\"Greetings, honorable %r.  It is good to see you again.\"",
         "\"Ah, %p!  Our deepest gratitude for all of your help.\"",
         "\"Greetings, %s.  Perhaps you will take some time to meditate with us?\"",
         "\"With this test behind you, may %d bring you enlightenment.\"",
         "\"May %d be with you, %s.\"",
      },
      guardtalk_before = {
         "\"Greetings, honorable %r.  It is good to see you.\"",
         "\"Ah, %p!  Surely you can help us in our hour of need.\"",
  [[¡Has prevalecido, %p! %d seguramente está contigo. Ahora,
debe tomar el Amuleto, y sacrificarlo en %ds altar sobre
el Plano Astral. Sospecho que nunca volveré a verte en esto.
la vida, pero espero a %ds pies."]]the Amulet to the Astral Plane and deliver it to %d.]",
         output = "text",
         text = [["You have prevailed, %p!  %d is surely with you.[[%nC gasps:

"Sólo has derrotado a este cuerpo mortal. Conoce esto: mi espíritu
es fuerte. ¡Volveré y recuperaré lo que es mío!"

Con eso, %n expira.]]et."]],
      },
      killed_nemesis = {
         synopsis = "[As %n dies, %nh threatens to return.]",
         output = "text",
         text = [[%nC gasps:

    "You hav[["Ah, %p, mi %S. Por fin has vuelto a nosotros.
Un gran golpe ha acaecido nuestro orden; tal vez usted pueda ayudarnos.
Primero, sin embargo, debo determinar si usted está preparado para esto
gran desafío."]]%lC checks whether you are ready for the great challenge.]",
         output = "text",
         text = [["Ah, %p, my %S.  You hav[["¡Eres un hereje, %p! ¿Cómo puedes, %ra, desviarte así desde el
enseñanzas de %d? De este templo. Ya no.
%sa a esta orden. Rezaremos a %d por otra ayuda,
como nos has fallado completamente."]] "[You are a heretic and have failed utterly.]",
         output = "text",
         text = [["You are a heretic, %p!  How can you, %ra, deviate so from the
teachings of %d?  Begone from this temple.  You are no longer
%sa to this order.  We will pray to %d for other assistance,
as you have failed us utterly."]],
      },
      leader_next = {
         text = "\"Again, my %S, you stand before me.  Are you ready n[[Usted recuerda las descripciones de %i, dado
a usted por %l. Es por delante que encontrarás
%n's trail.]]e sanctum.  Are you ready now?\"",
      },
      locate_first = {
         synopsis = "[You have reached %i.  %nC lurks further ahead.]",
         output = "text",
         text = [[You remember the descriptions of %i, [["Ah, así que %l ha enviado otro %g para recuperar
%o.

"No, veo que no eres %g. Tal vez me divierto hoy.
después de todo. ¡Prepárate para morir, %r! Nunca recuperarás
%o."]] {
         synopsis = "[You are no %g.  You shall never regain %o.]",
         output = "text",
         text = [["Ah, so %l has sent another %g to retrieve
%o.

"No, I see you are no %g.  Perhaps I shall have some fun today
after all.  Prepare to die, %r!  You shall never regain
%o."]],
      },
      nemesis_next = {
         text = "\"So, %r.  Again you challenge me.\"",
      },
      nemesis_other = {
         text = "\"Die now, %r.  %d has no power here to aid you.\"",
      },
      nemesis_wantsit = {
         text[[Has vuelto, %p. Y con %o, ya veo.
Felicitaciones.

"He estado en meditación, y he recibido la dirección de
un minión de %d. %d comandos que usted retiene
Eef021e0fa19. Con %oi, usted debe recuperar el Amuleto
de Yendor.

"Ve y deja que %d guíe tus pasos."]]t",
         text = [["You have returned, %p.  And with %o, I see.
Congratulations.

"I have been in meditation, and have received direction from
a minion of %[[%lC estudios %o por un momento,
entonces vuelve su mirada hacia ti.

"%o C debe permanecer contigo. Uso %oi
mientras reanuda su búsqueda por el Amuleto.
%Z espera tu regreso a través del portal mágico
que te trajo aquí."]]search for the Amulet.]",
        [[De nuevo te enfrentas a %H. Tu intuición sugiere que esto
puede ser la última vez que vengas aquí.]]ou.

"%oC must remain with you.  Use %oi
as you resume your search for the Amulet.
%Z await your return through the magic portal
that brought you here."]],
      },
      othertime = {
         text = [[Again you face %H.  Your intuition hints that this
may be the final time you[["Sí, %p. Estás realmente listo ahora. Atenderme y yo lo haré.
Dile lo que ha pasado:

"En uno de los Grandes Festivales hace poco, %n y una legión
de muertos vivientes invadidos %H. Muchos %gP fueron asesinados, incluyendo
el que lleva %o.

"Como acto final de venganza, %n profanó aquí el altar.
Sin ella, no podíamos montar un contraataque. Ahora, hay
apenas suficiente %g P se fue para mantener a los muertos a raya.

"Necesitamos que encuentres %i, luego, desde allí, viajar
a %ns lair. Si usted puede conseguir derrotar %n y volver
%o aquí, podemos entonces conducir fuera de las legiones
sin morir que arrastre la tierra.

"Ve con %d como tu guía, %p."]]nt a counter-attack.  Now, there are
barely enough %gP left to keep the undead at bay.

"We need you to find %i, then, from there, travel
to %n[["Esto es terrible, %p. ¡Te has desviado del verdadero camino!
Usted sabe que %d requiere la devoción más estridente de esto
orden. El %shood debe soportar la máxima piedad.

"Id de aquí, expiad vuestros pecados contra %d. Regresa sólo cuando
te has purificado."]]rified yourself.]",
         output = "text",
         text = [["This is terrible, %p.  You have deviated from the true path!
You know that %d requires the[["Ay, %p, todavía no está. Una mera %r nunca podría
soportar la fuerza de %n. Sal, otra vez al mundo, y regresa
cuando usted ha alcanzado el puesto de %R."]]elf."]],
      },
      badlevel = {
         synopsis = "[%rA cannot withstand %n.  Come back when you are %Ra.]",
         output = "text",
         text = [["Alas, %p, it is not yet to be.  A mere %r could never
withstand the might of %n.  Go forth, again into the world, and return
when you have attained the post of %R."]],
      },
      discourage = {
         "\"Submit to my will, %c, and I shall spare you.\"",
         "\"Your puny powers are no match for me, %c.\"",
         "\"I shall have you turned into a zombie for my pleasure!\"",
         "\"Despair now, %r.  %d cannot help you.\"",
         "\"I shall feast upon your soul for many days, %c.\"",
         "\"Your death will be slow and painful.  That I promise!\"",
         "\"You cannot defeat %n, you fool.  I shall kill you now.\"",
         "\"Your precious %lt will be my next victim.\"",
         "\"I feel your powers failing you, %r.  You shall die now.\"",
         "\"With %o, nothing can stand in my way.\"",
      },
      encourage = {
         "\"You can prevail, if you rely on %d.\"",
         "\"Remember that %n has great magic at his command.\"",
         "\"Be pure, my %S.\"",
         "\"Beware, %i is surrounded by a great graveyard.\"",
         "\"You may be able to affect %n with magical cold.\"",
         "\"Acquire and wear %o if you can.  It will aid you against %n.\"",
         "\"Call upon %d when your need is greatest.  You will be answered.\"",
         "\"The undead legions are weakest during the d[[Te encuentras de pie ante %H. Algo
obviamente está equivocado aquí. Las puertas a %H, que generalmente
de pie abierto, cerrado. Las formas humanas extrañas se agitan alrededor
afuera.

¡Te das cuenta de que %l necesita tu asistencia!]]he doors are closed.  %lC needs your help!]",
         output = "text",
         text = [[You find yourself standing in sight of %H.  Something
is obviously wrong h[[El hedor de la piedra preciosa es todo sobre ti, y los arbustos y gemidos
de almas torturadas asaltan su psique.

Ahead, hay un pequeño claro en medio de los agujeros de lava...]]= {
         synopsis = "[The stench of brimstone surrounds you, the shrieks and moans are endless.]",
         output = "text",
         text = [[The stench of brimstone is all about you, and the shrieks and moans
of tortured[[Mientras recoges %o, sientes la esencia de
%d llena tu alma. ¿Sabes por qué F6bbe5fc65a0 lo robó?
%H, para ello, %ca de %d podría
fácilmente derrotar sus planes.

Usted siente un mensaje de %d. Aunque no verbal, tú
obtener la impresión de que debe volver a %l tan pronto
como sea posible. %n]].]",
         output = "text",
         text = [[As you pick up %o, you feel the essence of
%d fill your soul.  You know now why %n stole it from
%H, for with it, %ca of %d could
easily defeat his plans.

You sense a message from %d.  Though not verbal, you
get the impression that you must return to %l as soon
as possible.]],
      },
      guardtalk_after = {
         "\"Greetings, %r.  It is good to see you again.\"",
         "\"Ah, %p!  Our deepest gratitude for all of your help.\"",
         "\"Welcome back, %s!  With %o, no undead can stand against us.\"",
         "\"Praise be to %d, for delivering us from %n.\"",
         "\"May %d be with you, %s.\"",
      },
      guardtalk_before = {
         "\"Greetings, honored %r.  It is good to see you.\"",
         "\"Ah, %p!  Surely you can help us in our ho[[¡Has vencido, %p! %d seguramente está contigo. Ahora,
debe tomar el amuleto, y sacrificarlo en %ds altar sobre
el Plano Astral. Sospecho que nunca volveré a verte en esto.
la vida, pero espero a %ds pies."]]synopsis = "[Take the Amulet to the Astral Plane and offer it on %ds altar.]",
         output = "text",
         text = [["You have prevailed, %p!  %d is surely with[[Usted siente un giro desgarrador en el éter como %ns cuerpo disuelve
en una nube de gas nocivo.

De repente, una voz se agita:

"No has derrotado al menos de mis secuaces, %r.
Sabed ahora que Moloch es consciente de vuestra presencia.
En cuanto a ti, %n, haré frente a tu fracaso
en mi ocio."

Entonces escuchas la voz de A6ade71feab4, gritando en terror...]]ift in the ether as %ns body dissolves
into a cloud of noxious gas.

Suddenly, a voice booms out:

    "Thou hast defeated the least of my minions, %r.
[["Ah, 2a37c3aaf14, mi %S. Por fin has vuelto a nosotros.
Un gran golpe ha acaecido nuestro orden; tal vez usted pueda ayudarnos.
Primero, sin embargo, debo determinar si usted está preparado para esto
gran desafío." %p]]leader_first = {
         synopsis = "[You have returned and we need your help.  Are you ready?]",
         output = "text",
         t[["¡Eres un hereje, %p! ¿Cómo puedes, %ra, desviarte así desde el
enseñanzas de %d? De este templo. Ya no.
%sa a esta orden. Rezaremos a %d por otra ayuda,
como nos has fallado completamente."]]der_last = {
         synopsis = "[You are a heretic who has deviated from the teachings of %d.]",
         output = "text",
         text = [["You are a heretic, %p!  How can you, %ra, deviate so from the
teachings of %d?  Begone from this temple.  You are no longer
%sa to this order.  We will pray to %d for other assistance,
as you have failed us utterly."]],
      },
      leader_next = {
         text = "\"Ag[[Te enfrentas a un gran cementerio. El cielo arriba está lleno de nubes
que parece estar más grueso cerca del centro. Usted siente la presencia de
no muerto en números más grandes que nunca antes.

Usted recuerda las descripciones de %i, dadas a usted por
%l. Es por delante que encontrará %ns sendero.]]t",
         text = [[You stand facing a large graveyard.  The sky above is filled with clouds
that seem to get thicker closer to the center.  You sense the presence of
undead in larger numbers than you have ever encountered before.

You remember the[["Ah, así que %l ha enviado otro %gC para recuperar
%o.

"No, veo que no eres %gC. Tal vez me divierto hoy.
después de todo. ¡Prepárate para morir, %r! Nunca recuperarás
%o."]]   nemesis_first = {
         synopsis = "[%lC has sent you, but you are no %gC.  I shall destroy you.]",
         output = "text",
         text = [["Ah, so %l has sent another %gC to retrieve
%o.

"No, I see you are no %gC.  Perhaps I shall have some fun today
after all.  Prepare to die, %r!  You shall never regain
%o."]],
      },
      nemesis_next = {
         text = "\"So, %r.  Again you challenge me.\"",
      },
      nemesis_other = {
         text = "\"Die now, %r.  %d has no power here to aid you.\"",
      },
  [["Has vuelto, %p. Y con %o, ya veo.
Felicitaciones.

"He estado en meditación, y he recibido la dirección de
a minion of %d. %d comandos que usted retiene
%o. Con él, debes recuperar el Amuleto
de Yendor.

"Ve y deja que %d guíe tus pasos."]] the Amulet.]",
         output = "text",
         text = [["You have returned, %p.  And with %o, I see.
Congratulations.

"I have been in meditation, and have received directi[[%lC reitera que %o es suyo ahora.

"Ha llegado el momento de reanudar su búsqueda por el Amuleto.
%Z espera tu regreso a través del portal mágico
que te trajo aquí."]]feredit2 = {
         synopsis = "[%oC is your[[De nuevo te enfrentas a %H. Su intuición sugiere que esto puede ser
la última vez que vienes aquí.]]C reiterates that %o is yours now.

"The time has come to resume your search for the Amulet.
%Z await your return through the magic portal
that brought you here."]],
      },
      othertime = {
         text = [[Again you face %H.  Your intuition hints that this may be
the f[["Estás listo, %p. Te diré lo que ha pasado,
y por qué tan desesperadamente necesitamos su ayuda:

"Hace poco tiempo, los centauros de montaña al este invadieron
y esclavizó a las llanuras centauros en esta área. El local
líder es ahora sólo un cabeza de figura, y sirve %n.

"Durante nuestra última reunión de adoración aquí, estábamos acosados por hordas de
centauros hostiles, como presenciaste. En el primer grupo,
encabezado por %n %niself, logró violar el grove y robar
%o.

"Desde entonces, hemos sido asediados. No sabemos cuánto más
podremos mantener nuestras barreras mágicas.

"Si vamos a sobrevivir, usted, %p, debe infiltrarse
%i. Allí encontrarás un camino hacia abajo, hacia el
caverna subterránea de %n. Siempre ha codiciado
%o, y seguramente lo mantendrá.

"Recover %o para nosotros, %p! Sólo entonces %d estará seguro."]] We do not know how much longer
we will be able to maintain our magical barriers.

"If we are to survive, you, %p, must infiltrate
%i.  There, you will find a path[["¡Te has estraído, %p! Usted sabe que %d requiere que
mantenemos una devoción pura a las cosas %a!

"Debes ir de nosotros. Vuelve cuando te hayas purificado."]]  badalign = {
         synopsis = "[You are not sufficiently %a.  Come back when you have purified yourself.]",
         output = "text",
         text = [[["%p, usted todavía está demasiado inexperto para soportar las demandas de que
que necesitamos que hagas. c56d3dfd267 dA podría ser capaz de hacer esto.

"Regresa a nosotros cuando has aprendido más, mi %S." %R]] = {
         synopsis = "[You are too inexperienced.  Come back when you are %Ra.]",
         output = "text",
         text = [["%p, you are yet too inexperienced to withstand the demands of that
which we need you to do.  %RA might just be able to do this thing.

"Return to us when you have learned more, my %S."]],
      },
      discourage = {
         "\"Your %d is nothing, %c.  You are mine now!\"",
         "\"Run away little %c!  You can never hope to defeat %n!\"",
         "\"My servants will rip you to shreds!\"",
         "\"I shall display your head as a trophy.  What do you think about that wall?\"",
         "\"I shall break your %ls grove, and destroy all the %gP!\"",
         "\"%d has abandoned you, %c.  You are doomed.\"",
         "\"%rA?  %lC sends a mere %r against me?  Hah!\"",
         "\"%lC has failed, %c.  %oC will never leave here.\"",
         "\"You really think you can defeat me, eh %c?  You are wrong!\"",
         "\"You weaken, %c.  I shall kill you now.\"",
      },
      encourage = {
         "\"It is rumored that the Forest and Mountain Centaurs have resolved their ancient feud and now band together against us.\"",
         "\"%nC is strong, and very smart.\"",
         "\"Use %o, when you find it.  It will help you survive to reach us.\"",
         "\"Remember, let %d be your guide.\"",
         "\"Call upon %d when you face %n. The very act of doing so will infuriate him, and give you advantage.\"",
         "\"%n and his kind have always hated us.\"",
         "\"We cannot hold the grove much longer, %p.  Hurry!\""[[Llegas a un entorno familiar. En la distancia, usted %x el
bosque antiguo, el lugar de la adoración a %d.

Algo está mal, sin embargo. Alrededor de la ranura son centauros!
¡Y te han notado!]]rsttime = {
         synopsis = "[The ancient forest grove is surrounded by centaurs.]",
         output = "text",
         text = [[You arrive in familiar surroundings.  In the distance, y[[Bajas a un lugar extraño, en el que cortas paredes como cuevas
unirse con suaves, acabados, como si alguien estuviera en medio de
terminando la construcción de un complejo subterráneo.

En la distancia, escuchas un sonido como el ruido de muchos
pezuñas en la roca.]]",
         output = "text",
         text = [[You descend into a weird place, in which roughly cut cave-like walls
join with smooth, finished ones, as if someone was in the midst of
finishing off the construction of a subterranean complex.

Off in the distance, you[[Mientras recoges %o, parece brillar, y una calidez
Te llena completamente. Te das cuenta de que su poder es lo que ha protegido
su %sp contra sus enemigos durante tanto tiempo.

Ahora debe devolverlo a %l sin demora.
a tu velocidad.]] return %oh to %l.]",
         output = "text",
         text = [[As you pick up %o, it seems to glow, and a warmth
fills you completely.  You realize that its power is what has protected
your %sp against their enemies for so long.

You must now return it to %l without delay -- their lives depend
on your speed.]],
      },
      guardtalk_after = {
         "\"%pC!  I have not seen you in many moons.  How do you fare?\"",
         "\"Birdsong has returned to the grove, surely this means you have defeated %n.\"",
         "\"%lC seems to have regained some of his strength.\"",
         "\"So, tell us how you entered %i, in case some new evil arises there.\"",
         "\"Is that truly %o that I see you carrying?\"",
      },
      guardtalk_before = {
         "\"%pC!  I have not seen you in many moons.  How do you fare?\"",
         "\"%nC continues to threaten the grove.  But we hold fast.\"",
         "\"%lC is growing weak.  The magic required to defend the grove drains us.\"",
         "\"Remember[["¡Lo tienes! ¡Has recuperado el Amuleto de Yendor!
Ahora acércate a mí, %p, y te diré lo que hay que hacer:

"El Amuleto tiene dentro de ella magia, la capacidad de transportarte a
el Plano Astral, donde reside el círculo primario de %d.

"Para activar esta magia, debes viajar hacia arriba hasta donde puedas.
Cuando llegues al templo, sacrifica el Amuleto a %d.

"Así cumplirás tu destino."]]be done:

"The Amulet has within it magic, the capability to transport you to
the Astral Plane, where the primary circle of %d resides.

"To acti[[e312aaaeda2e4C colapsa al suelo, maldiciendo a usted y %l, luego dice:

"Me has derrotado, %r! Pero te maldigo una última vez, con
¡Mi aliento moribundo! ¡Morirás antes de salir de mi castillo!" %n]]  synopsis = "[%nC curses you as %nh dies.]",
         output = "text",
         text = [[%nC collapses to the ground, cursing you and %l, then says:

    "Y[["%pC! ¡Has vuelto! Gracias %d.

"Tenemos una gran necesidad de ti. Pero primero, debo ver si tienes el
requiere habilidades para asumir esta responsabilidad."]] {
         synopsis = "[You have returned, %p.  We need your help.  Are you ready?]",
         output = "text",
         text = [["%pC!  You have return[["¡%pC! Nos has condenado a todos. Usted bastante irradiar %L influencias
y debilitar el poder que hemos levantado en este bosque como resultado!

"¡Begone! ¡Renunciamos su %shood con nosotros! ¡Ahora eres un marginado!"]]t sufficiently %a.  We renounce your %shood.]",
         output = "text",
         text = [["%pC!  You have doomed us all.  You fairly radiate %L influences
and weaken the power we have raised in this grove as a result!

"Begone!  We renounce your %shood with us!  You are an outcast now!"]],
      },
      leader_next = {
         text = "\"Once again, %p, you stand in o[[Esto debe ser %i.

Usted está en una cueva construida de muchas habitaciones diferentes, todas interconectadas
por túneles. Tu búsqueda es encontrar y disparar el malvado wumpus que
reside en otro lugar de la cueva sin encontrarse en un
pozos o el uso de su suministro limitado de flechas. Buena suerte.

Estás en la habitación 9 de la cueva. Hay túneles en las habitaciones
5, 8 y 10.
*rustle* *rustle* (debe ser murciélagos cercanos).
*Sniff* (¡Puedo oler el mal wumpus cerca!)]]oot the evil wumpus that
resides elsewhere in the cave without running into any bottomless
pits or using up your li[[Una vez más, usted desciende %i.

*whoosh* (Siento un borrador de algunos pozos.)
*rustle* *rustle* (debe ser murciélagos cercanos)]]rustle* (must be bats nearby.)
*sniff* (I can smell the evil wumpus nearby!)]],
      },
      locate_next = {
         synopsis = "[You are in %i.  There a[["Entonces, %c. %lC le ha enviado a recuperar %o.

"Bueno, guardaré ese bauble. Me complace. Tú, %c, morirás."]]oosh* (I feel a draft from some pits.)
*rustle* *rustle* (must be bats nearby.)]],
      },
      nemesis_first = {
         synopsis = "[You have come to recover %o, but I shall keep %oh and you shall die.]",
         output = "text",
         text = [["So, %c.  %lC has sent you to recover %o.

"Well, I sh[["Tendré %o de ti, %r. Entonces lo haré.
matarte."]]]],
      },
      nemesis_next = {
         text = "\"Back again, eh?  Well, a mere %r is no threat to me!  Die, %c!\"",
      },
      nemesis_other = {
         text = "\"You haven't learned your lesson, %c.  You can't kill me!  You shall die now.\"[["%pC! ¡Has tenido éxito! ¡Temía que no fuera posible!

¡Has vuelto con %o!

"Me temo, ahora, que los Centauro se reagruparán y trazarán otra redada.
Esto llevará algún tiempo, pero si puedes recuperar el Amuleto de Yendor
para %d antes de que eso suceda, estaremos eternamente seguros.

"Toma %o contigo. Ayudará en su búsqueda para
el Amuleto."]]text = [["%pC!  You have succeeded!  I feared it was not possible!

"You have returned with %o!

"I fear, now, that the Centaurs will regroup and plot yet an[[%l flexes %o reverentemente.

"Con este arco maravilloso, uno nunca necesita salir de las flechas.
Ahora eres su guardián, y ha llegado el momento de reanudar tu
buscar el Amuleto. %Z espera tu regreso
a través del portal mágico que te trajo aquí."]]synopsis = "[You are the keeper of %o [[Tienes la sensación más extraña de que esta puede ser la última vez que
van a entrar %H.]]xes %o reverently.

"With this wondrou[["Bienvenido, %p. ¿Cómo has ido a tu búsqueda por el Amuleto
de Yendor?"]]has come to resume your
search for the Amulet.  %Z await your return
through the magic portal that brought you here."]],
      },
      othertime = {
     [["Todo el mundo no va a recuperar %o de eso
imbécil, %n, da un paso atrás. Buena elección,
%p, porque iba a enviarte de todos modos. Mi otro %gp
son demasiado valiosos para mí.

"Aquí está el trato. Quiero %o, %n
tiene %o. Vas a conseguir %o
y tráemela. Tan simple una asignación incluso usted puede entender
es."]]        output = "text",
         text = [["Will everyone not going to retrieve %o from that
jerk, %n, take one step backwards.  Good choice,
%p,[["Tal vez debería encadenarte a mi percha aquí por un tiempo. Tal vez mirando
Los hombres de %a reales en el trabajo te traerán algo de sentido. No.
Creo que podría soportarte por tanto tiempo. Vuelve.
cuando se puede confiar en actuar correctamente."]] {
         synopsis = "[Come back when you are really %a.]",
         output = "text",
         text = [["Maybe I should chain you to my perch he[["En el tiempo que te has ido solo has podido dominar el
artes de %ra? He entrenado diez veces más de %Rp
en ese momento. Tal vez debería enviar a uno de ellos, ¿no? ¿Dónde sería eso?
¿Te dejo, %p? ¡Oh sí, recuerdo, iba a matarte!"]][%rA is not adequately trained to handle this job.]",
         output = "text",
         text = [["In the time that you've been gone you've only been able to master the
arts of %ra?  I've trained ten times again as many %Rp
in that time.  Maybe I should send one of them, no?  Where would that
leave you, %p?  Oh yeah, I remember, I was going to kill you!"]],
      },
      discourage = {
         "\"May I suggest a compromise.  Are you interested in gold or gems?\"",
         "\"Please don't force me to kill you.\"",
         "\"Grim times are upon us all.  Will you not see reason?\"",
         "\"I knew %l, and you're no %lt, thankfully.\"",
         "\"It is a shame that we are not meeting under more pleasant circumstances.\"",
         "\"I was once like you are now, %p.  Believe in me -- our way is better.\"",
         "\"Stay with me, and I will make you %os guardian.\"",
         "\"When you return, with or without %o, %l will have you killed.\"",
         "\"Do not be fooled; I am prepared to kill to defend %o.\"",
         "\"I can reunite you with the Twain.  Oh, the stories you can swap.\"",
      },
      encourage = {
         "\"You don't seem to understand, %o isn't here so neither should you be!\"",
         "\"May %d curse you with lead fingers.  Get going!\"",
         "\"We don't have all year.  GET GOING!\"",
         "\"How would you like a scar necklace?  I'm just the jeweler to do it!\"",
         "\"Lazy S.O.B.  Maybe I should call up someone else...\"",
         "\"Maybe I should open your skull and see if my instructions are inside?\"",
         "\"This is not a task you can complete in the afterlife, you know.\"",
         "\"Inside every living person is a dead person trying to get out, and I have your key!\"",
[[Inesperadamente, te encuentras de vuelta en Ransmannsby, donde entrenaste para
Sé un ladrón. Rápidamente haces el signo del gremio, esperando que tú y tu palabra
de su llegada %ls den.]],
      },
      firsttime = {
         synopsis = "[You are in Ransmannsby, where you trained.  Find %l[[Usted siente una gran hinchazón de coraje, sintiendo la presencia de
%o. ¿O es miedo?]] Ransmannsby, where you trained to
be a thief.  Quickly you make the guild sign, hoping that you AND word
of your arrival reach %ls den.]],
      },
      goal_first = {
         synopsis = "[You sense %o.]",
         output = "text",
         text =[[Mientras recoges %o, los pelos en la parte posterior de tu
El cuello se cae. A la vez te das cuenta de por qué %n fue
dispuesto a morir para mantenerlo fuera de %ls manos. De alguna manera
Sabes que debes hacer lo mismo.]]fear.",
      },
      gotit = {
         synopsis = "[You pick up %o and know that %l should not have it.]",
         output = "text",
         text = [[As you pick up %o, the hairs on the back of your
neck fall out.  At once you realize why %n was
willing to die to keep it out of %ls hands.  Somehow
you know that you must do likewise.]],
      },
      guardtalk_after = {
         "\"I was sure wrong about Lady Tyvefelle's house; I barely got away with my life and lost my lock pick in the process.\"",
         "\"You're back?  Even the Twain don't come back anymore.\"",
         "\"Can you spare an old cutpurse a zorkmid for some grog?\"",
         "\"Fritz tried to join the other side, and now he's hell-hound chow.\"",
         "\"Be careful what you steal, I hear the boss has perfected turning rocks into worthless pieces of glass.\"",
      },
      guardtalk_before = {
         "\"I hear that Lady Tyvefelle's household is lightly guarded.\"",
         "\"You're back?  Even the Twain don't come back anymore.\"",
         "\"Can you spare an old cutpurse a zorkm[["Veo que con tus habilidades, y mis cerebros, podríamos gobernar este mundo.

"Todo lo que tendríamos que ser todopoderosos es para ti tomar ese pequeño
Tienes hasta el Plano Astral. Desde allí, %d
mostrarte qué hacer con eso. ¡Una vez hecho, seremos invencibles!"]]he Astral Plane and find %ds temple.]",
         output = "text",
         text = [["I see that with your abilities, and my brains, we could rule this world.

"All that we would [["Sé lo que estás pensando, %p. No es demasiado tarde para ti.
para utilizar %o sabiamente. Por el bien de tu gremio
%sp, haz lo correcto."

Te sientas y esperas a que la muerte venga por %n, y luego tú
¡Prepárate para tu próxima reunión con Fafc2a0ecff4! %l]]    synopsis = "[Before dying, %n tells you to use the %o wisely.]",
         output = "text",
         text = [["I know what you are thinking, %p.  It is not [["Bueno, mira quiénes son los chicos... %p ha vuelto a casa. Pareces tener
caídos en tus deudas. Debería matarte como ejemplo de esto.
otros recortes inútiles, pero tengo un mejor plan. Si estás listo
tal vez podrías arreglar tus deudas de espalda realizando un pequeño trabajo para
Déjame ver si estás listo..."]]ob.]",
         output = "text",
         text = [["Well, look who it is boys -- %p has come home.  You seem to have
fall[["Bueno %gp, parece que nuestro amigo ha olvidado quién es el jefe
por aquí. Nuestro amigo parece pensar que %rp han sido puestos
Cargo. Incorrecto. ¡Muerte!

Su repentino cambio en el entorno le impide escuchar el final
de %ls maldición.]]"]],
      },
      leader_last = {
         synopsis = "[You must go.]",
         output = "text",
         text = [["Well %gp, it looks li[["Bueno, no esperaba verte de vuelta. Muestra que eres estúpido,
o finalmente estás listo para aceptar mi oferta. Esperemos por su bien.
no es la estupidez que te trae de vuelta."]]aring the end
of %ls curse.]],
      },
      leader_next = {
 [["¿Tal vez me has confundido con otro %lt? Debes
Piensa que soy tan estúpido como tu comportamiento. Te advierto que no pruebes mi paciencia"]]back.  It shows that you are either stupid,
or you are finally ready to accept my offer.  Let us hope for your sake it
isn't stupidity that brings you back."]],
      },
      leader_other = {
         text = [["Did you perhaps mistake me for some other %lt?  You must
think me as stupid as your behavior.  I warn you not to try my patience."]],
      },
      locate_first = {
         text = "Those damn little hairs tell you that you are nearer to %o.",
      },
      locate_next = {
         text = "Not wanting to face %l without having stolen %o, you c[["Claro, %p, usted ha aprendido que usted no puede confiar en ninguna ganga
que %l ha hecho. Puedo mostrarte cómo continuar
tu búsqueda sin tener que encontrarte con él otra vez."]]ext = "\"We meet again.  Please reconsider your actions.\"",
      },
      nemesis_other = {
         synopsis = "[Y[["Por favor, piensa por un momento sobre lo que estás haciendo. ¿De verdad?
creer que %d querría que %l
¿%o?"]]rust any bargains
that %l has made.  I can show [[Una vez más, te encuentras de vuelta en Ransmannsby. Los recuerdos falsos son
reemplazado por el miedo, sabiendo que %l te está esperando.]]s = "[%lC should not have %o.]",
         output = "text",
         text = [["Please, think for a moment abo[["Bueno, seré condenado. Lo tienes. Estoy orgulloso de ti, un buen %r
Has resultado serlo.

"Mientras te fuiste, tuve que pensar, tú y %o
juntos podrían traerme más tesoro que cualquiera de ustedes separados, así que por qué no
Tómalo contigo. Todo lo que pido es un corte de cualquier botín que vengas.
Eso es mejor que ofrecí %n.

"Pero, usted ve lo que pasó a %n cuando se negó.
No me hagas encontrar otro que enviar después de ti esta vez."]]you've turned out to be.

"While you were gone I got to thinking, you and %o
together could bring me more treasure than either of[[%lC parece tentado a cambiar %o para
el mundano que detectas en su bolsillo, pero notando tu alerta,
evidentemente es una gallina.

"Ve a llenar el Amuleto antes de que alguien te golpee.
%Z están de vuelta por el camino que viniste, a través del portal mágico."]]],
      },
      offeredit2[[Te frotas las manos a través de tu cabello, esperando que los pequeños en
la parte posterior de tu cuello, y prepárate para tu reunión
con %l.]]ne you detect in his pocket, but noticing your alertness,
evidently chickens out.

"Go filch the Amulet before someone else beats you to it.[["Quita el pequeño ladrón, ¿no es así, %p. ¿Puedo interesarte en un
swap for %o? Mira a tu alrededor, cualquier cosa en la caja
es tuyo por la pregunta."]]ir, hoping that the little ones on
the back of your neck stay down, and prepare yourself for your meeting
with %l.]],
      },
      posthanks = {[["Domo %p-san, de hecho estás listo. Ahora puedo decirte qué
Es que te necesito.

"El daimyo, %n, nos ha traicionado. Nos ha robado.
%o y se lo llevó a su donjon profundo dentro
%i.

"Si no puedo mostrar al emperador %o cuando viene
para el festival sabrá que he fallado en mi deber, y
solicito que me comprometa seppuku.

"Debes ganar entrada a %i y recuperar el
Propiedad del emperador. ¡Rápido! El emperador estará aquí para el
Cha-no-you en 5 palos.

"¿Wakarimasu ka?"]].

"The daimyo, %n, has betrayed us.  He has stolen from us
%o and taken it to his donjon deep within
%i.

"If I cannot show the emperor %o when he comes
for the fe[["%p-san, haría mejor unirse al kyokaku.

"Tienes habilidades, pero hasta que puedas llamar al bushido para saber cuándo y cuándo
cómo utilizarlos no eres samurai. Cuando usted puede pensar %a y
actuar %a y luego regresar."]] sticks.

"Wakarimasu ka?"]],
      },
      badalign = {
         synopsis = "[When you can think %a and act %a then return.]",
         output [["%p-san, has aprendido bien y honrado a tu familia.
Requiero las habilidades de %Ra para derrotar %n.
Ve a buscar maestros. Aprende lo que han aprendido. Cuando tú
están listos, regresen a mí."]]n think %a and
act %a then return."]],
      },
      badlevel = {
         synopsis = "[\"I require %Ra to defeat %n.  Return when you are ready.\"]",
         output = "text",
         text = [["%p-san, you have learned well and honored your family.
I require the skills of %Ra in order to defeat %n.
Go and seek out teachers.  Learn what they have learned.  When you
are ready, return to me."]],
      },
      discourage = {
         "\"Ahh, I finally meet the daimyo of the kyokaku!\"",
         "\"There is no honor for me in your death.\"",
         "\"You know that I cannot resash my swords until they have killed.\"",
         "\"Your presence only compounds the dishonor of %l in not coming %liself.\"",
         "\"I will make tea with your hair and serve it to %l.\"",
         "\"Your fear shows in your eyes, coward!\"",
         "\"I have not heard of you, %p-san; has your life been that unworthy?\"",
         "\"If you will not obey me, you will die.\"",
         "\"Kneel now and make the two cuts of honor.  I will tell your %sp of your honorable death.\"",
         "\"Your master was a poor teacher.  You will pay for his mistakes in your teaching.\"",
      },
      encourage = {
         "\"To defeat %n you must overcome the seven emotions: hate, adoration, joy, anxiety, anger, grief, and fear.\"",
         "\"Remember your honor is my honor, you perform in my name.\"",
         "\"I will go to the temple and burn incense for your safe return.\"",
         "\"Sayonara.\"",
         "\"There can be honor in defeat, but no gain.\"",
         "\"Your kami must be strong in order to succeed.\"",
         "\"You are indeed a worthy %R, but [[Incluso antes de que sus sentidos se ajusten, usted reconoce el kami de
%H.

Usted %x el estándar de su teki, %n, volando por encima
la ciudad. ¿Cómo pudo haber pasado algo así? ¿Por qué son ninja?
vagando libremente; ¿dónde están los samuráis de tu daimyo, %l?

Usted dice rápidamente una oración a Izanagi e Izanami y caminar hacia
ciudad.]] town.  What has happened to %l?]",
         output = "text",
         text = [[Even before your senses adjust, you recognize the kami of
%H.

You %x the standard of your teki, %n, flying above
the town.  How could such a thing ha[[En su mente, usted escucha las taunts de %n.

Te vuelves como la planta de arroz y te inclinas al suelo, ofreciendo una
oración al %d. Pero cuando el viento ha pasado, estás de pie
orgullosa de nuevo. Poniendo a tus kami en manos del destino, avanzas.]] the home of %n.",
      },[[Al llegar una vez más a la casa de %n, sus pensamientos
girar sólo a %o.]]offering a prayer to %d, you proceed.]",
         output = "text",
         text = [[In your mind, you hear the taunts of %n.

You become [[Mientras recoges %o, sientes la fuerza de su karma.
Te das cuenta de por qué tantos buenos samuráis tuvieron que morir para defenderlo.
Eres humilde sabiendo que tienes uno de los artefactos de los
Diosa del sol.]]= {
         text = [[As you arrive once again at the home of %n, your thoughts
turn only to %o.]],
      },
      gotit = {
         synopsis = "[You feel the power of %o and are humbled.]",
         output = "text",
         text = [[As you pick up %o, you feel the strength of its karma.
You realize at once why so many good samurai had to die to defend it.
You are humbled knowing that you hold one of the artifacts of the
sun goddess.]],
      },
      guardtalk_after = {
         "\"Come, join us in celebrating with some sake.\"",
         "\"Ikaga desu ka?\"",
         "\"You have brought our clan and %l much honor.\"",
         "\"Please %r, sit for a while and tell us how you overcame the Ninja.\"",
         "\"%lC still lives!  You have saved us from becoming ronin.\"",
      }[["Ah, %p-sama. Has perdido tus esfuerzos para regresar a casa.
Ahora que usted está en posesión del Amuleto, usted está lleno de honor para
terminar la búsqueda que has emprendido. Habrá mucho tiempo
para saki e historias cuando has terminado.

"Ve ahora, y que nuestras oraciones sean un viento en tu espalda."]]   },
      hasamulet = {
         synopsis = "[Take the Amulet to the Astral Plane to finish your task.]",
     [[Tus habilidades curativas te dicen que las heridas de %n son mortales.

Sabes que el bushido te dice que lo termines y dejes que su kami
morir con honor, pero el pensamiento de tantos samuráis muertos debido a esto
La deshonra del hombre te impide dar el golpe final.

Usted ordena que su cabeza sin lavarse se dé a los cuervos y su cuerpo
arrojado al mar.]]   },
      killed_nemesis = {
         synopsis = "[%nC dies without honor.]",
         output = "text",
         text = [[Your healing skills tell [["Ah, %p-san, es bueno verte de nuevo. Necesito a alguien que pueda
dirigir mi samurai contra %n. Si estás listo, estarás
esa persona."]] samurai dead due to this
man's dishonor prevents you from giving the final blow.

You order that his unwashed head be given to the [["Ya no eres mi samurai, %p.

"Hara-kiri es denegada. Se te ordena afeitar la cabeza y luego a
convertirse en monje. Tu jefe y tu familia están perdidos. ¿Wakarimasu ka?"]]utput = "text",
         text = [["Ah, %p-san, it is[["Una vez más, %p-san, te arrodillas ante mí. ¿Todavía eres capaz de
ser mi vasallo?"]] ready, you will be
that person."]],
      },
      leader_last = {
         synopsis = "[Leave and do not come back.]",
    [["Empiezas a probar mi matsu, %p-san.
Si no puedes determinar lo que quiero en un samurai, ¿cómo puedo confiar en ti?
para averiguar lo que necesito de un samurai?"]]monk.  Your fief and family are forfei[[Instintivamente alcanzas tus espadas. No reconoces el
lay de esta tierra, pero sabes que tu teki está en todas partes.]]le of
being my vassal?"]],
      },
      leader_other = {
[[Gracias por su %sp en %H no puede ver
tu miedo, te preparas de nuevo para avanzar.]] text = [["You begin to test my matsu, %p-san.
If[["Ah, así que es ser tú, %p-san. Te ofrezco seppuku.
Seré tu segundo si quieres."]]d from a samurai?"]],
      },
      locate_first = {
      [["Te he ofrecido la salida honorable. Ahora tendré tu
cabeza para enviar sin lavar a %l."]], but you know that your teki are everywhere.]],
      },
      locate_next = {
         text = [[Thankful that your %sp at %H cannot see
your fear, you prepare agai[["Has luchado contra mi samurai; seguramente debes saber que tú
no será capaz de tomar %o de vuelta a
%H."]] offer you seppuku.
I will be your second if you wish."]],
      },
      nemesis_next = {
         text = [["I have offered you the honorable exit.  Now I will have your
head to send unwashed to %l."]],
      },
      nemesis_o[[Al inclinarse ante %l, le da la bienvenida:

"Has traído a tu familia un gran honor, %p-sama.

"Mientras se han ido los asesores del emperador han descubierto
los textos antiguos que el karma del samurai que busca recuperar
el Amuleto y el karma de %o se unen
mientras las estaciones se unen para hacer un año.

"Porque has mostrado tal fidelidad, el emperador pide
que usted toma licencia de otras obligaciones y continuar en
El camino que el destino ha puesto tus pies. Lo consideraría.
un honor si me permite ver su casa hasta
vuelves con el Amuleto."

Con eso, %l arcos, y pone su espada encima
%o.]] karma of the samurai who seeks to recover
    the Amulet and the karma of %o are joined
    as the seasons join to make a year.

    "Because you have shown such fidelity, the emperor requests
    that you take le[[%l mantiene %o firmemente por un momento, luego regresa
su mirada hacia ti.

"El tiempo está listo para recuperar el Amuleto. Regreso a %Z
a través del portal mágico que te transportó aquí para que puedas
alcanzar el destino que te espera."]]nd places his sword atop
%o.]],
      },
      offeredit2 = {
         synopsis = "[Take %o, return to %Z, a[[Estás de vuelta en %H.

Al instante sientes un cambio sutil en tu karma. Pareces saber que
si usted no tiene éxito en su búsqueda, %n habrá destruido
el kami de %H antes de volver.]]the magic portal that transported you here so that you may
achieve the destiny which awaits you."]],
      },
      othertime = {
         synopsis = "[%HC is threatened by %n.]",
         output = "text",
         text = [[You are back at %H.

Instantly you sense a subtle c[["De hecho te has demostrado un digno %c, %p.

"Pero ahora tu kinfolk y yo debemos pedirle que deje a un lado sus viajes y
Ayúdanos en nuestro tiempo de necesidad. Después de que nos dejaste elegimos un nuevo alcalde,
%n. Él demostró ser una criatura muy atroz y víspera.

"Pronto después de tomar el cargo se abstuvo con %o
huyó de la ciudad, dejando atrás a sus hombres para gobernar sobre nosotros. Para
para recuperar el control de nuestra ciudad, debe entrar en %i
y recuperar %o.

"No te distraigas en tu búsqueda. Si no regresas rápido, temo
que todo se perderá. Oremos ahora que %d les guiará
y mantenerte a salvo"]]  He proved to be a most heinous and vile creature.

"Soon after taking office he absconded with %o
and fled town, leaving behin[["Sería una afrenta a %d tener uno no verdadero a
%a sendero emprende su licitación.

"No debes regresar a nosotros hasta que te hayas purificado de estos
malas influencias en tus acciones. Recuerde, sólo siguiendo el %a
camino que puedes esperar para superar los obstáculos que enfrentarás."]]     badalign = {
         synopsis = "[You are not sufficiently %a.  Return when you are.]",
         output = "text[["Todavía hay demasiado que tienes que aprender antes de que puedas emprender
el siguiente paso. Volver a nosotros como un probado %R, y tal vez entonces
Estarás listo.

"Vuelve ahora, y que las enseñanzas de %d le sirvan bien."]]mber, only by following the %a
path can you hope to overcome the obstacles you will face."]],
      },
      badlevel = {
         synopsis = "[Return when you are %Ra.]",
         output = "text",
         text = [["There is still too much that you have to learn before you can undertake
the next step.  Return to us as a proven %R, and perhaps then
you will be ready.

"Go back now, and may the teachings of %d serve you well."]],
      },
      discourage = {
         "\"I defeated %l and I will defeat you, %p.\"",
         "\"Where is %d now!  You must realize no one can help you here.\"",
         "\"Beg for mercy now and I may be lenient on you.\"",
         "\"If you were not so %a, you might have stood a chance.\"",
         "\"Vengeance is mine at last, %p.\"",
         "\"I only wish that %l had a more worthy %r to send against me.\"",
         "\"With %o in my possession you cannot hope to defeat me.\"",
         "\"%nC has never been defeated, NEVER!\"",
         "\"Are you truly the best %H has to send against me?  I pity %l.\"",
         "\"How do you spell %p?  I want to ensure the marker on your grave is correct as a warning to your %sp.\"",
      },
      encourage = {
         "\"Do not be fooled by the false promises of %n.\"",
         "\"To enter %i you must pass many traps.\"",
         "\"If you do not return with %o, your quest will be in vain.\"",
         "\"Do not be afraid to call upon %d if you truly need help.\"",
         "\"If you do not destroy %n, he will follow you back here!\"",
         "\"Take %o from %n and you may be able to d[[Respiras un suspiro de alivio mientras te encuentras de vuelta en lo familiar
alrededores de %H.

Usted notará rápidamente que las cosas no aparecen como lo hicieron cuando usted
izquierda. El pueblo está oscuro y tranquilo. No hay sonidos provenientes de
detrás de las murallas de la ciudad, y ninguna fogata quema en los campos. Como
materia de hecho, no %x ningún movimiento en los campos en absoluto, y
los cultivos parecen haber sido desatendidos durante muchas semanas.]] text = [[You breathe a sigh of relief as you find yourself back in the familiar
surroundings of %H.

You quickly notice that things do not appear the way they di[[Ganas confianza, sabiendo que pronto estarás unido con
%o.]]ming from
behind the town walls, and no campfires burning in the fields.  As a
matter of fact, you do not %x any movement in the fields at all, and
the[[Mientras recoges %o, sientes un gran
El peso ha sido levantado de tus hombros. Tus únicos pensamientos
volver rápidamente a %H y encontrar %l.]]     },
      goal_first = {
         text = "You sense the presence of %o.",
      },
      goal_next = {
         text = [[You gain confidence, knowing that you may soon be united with
%o.]],
      },
      gotit = {
         synopsis = "[You pick up %o and feel relief.  Return it to %l.]",
         output = "text",
         text = [[As you pick up %o, you feel a great
weight has been lifted from your shoulders.  Your only thoughts are
to quickly return to %H and find %l.]],
      },
      guardtalk_after = {
         "\"Gehennom on 5 zorkmids a day -- more like 500 a day if you ask me.\"",
         "\"Do you know where I could find some nice postcards of The Gnomish Mines?\"",
         "\"Have you tried the weird toilets?\"",
         "\"If you stick around, I'll show you the pictures from my latest trip.\"",
         "\"Did you bring me back any souvenirs?\"",
      },
      guardtalk_before = {
         "\"Gehennom on 5 zorkmids a day -- more l[["Atrás y déjame verte, %p.
Ahora que has recuperado el Amuleto de Yendor, me temo vivir
tus días en un 73ef89151db parecerían bastante mal.

"Has llegado demasiado lejos para parar ahora, porque todavía hay más tareas que
nuestra historia oral te predice. Para siempre más, sin embargo, su nombre será
ser hablado por el %gP con asombro. Eres realmente una inspiración para tu
%sp!" %H]] Amulet.  Take it to the Astral Plane to finish your task.]",
         output = "text",
         text = [["Stand back and l[[Gire en la dirección de %n. Mientras su cuerpo terrenal comienza
para desaparecer delante de tus ojos, le oyes maldición:

"¡Nunca te librarás de mí, %p!
Te encontraré donde quiera que vayas y recuperes lo que es justo mío."]] foretells for you.  Forever more, though, your name shall
be spoken by the %gP with awe.  You are truly an inspiration to your
%sp!"]],
 [["Es realmente usted, %p! Había renunciado a la esperanza de su regreso.
Como usted puede %x, estamos desesperadamente en necesidad de sus talentos. Alguien debe
derrota %n si nuestra ciudad es para convertirse en lo que una vez fue.

"Déjame ver si estás listo para ser ese alguien."]]

    "You shall never be rid of me, %p!
    I will find you where ever you go an[["Es demasiado tarde, %p. Ni siquiera eres digno de morir entre nosotros.
Deja %H y nunca vuelve."]] must defeat %n.  Are your ready?]",
         output = "text",
         text = [["Is it really you, %p!  I had given up hope for your return.
As you can %x, we are desperately in need of your talents.  Someone must
defeat %n if our town is to become what it once was.

"Let me see if you are ready to be that someone."]],
      },
      leader_last = {
         synopsis = "[Leave %[[Sólo tu fe en %d te impide temblar. Usted %x
la obra de %ns henchlings en todas partes.]]en worthy to die amongst us.
Leave %H and never return."]],
      },
      leader_next = {
         text = "\"Things are getting worse, %p.  I hope that this time you are ready.\"",
      },
      leader_other = {
         text = "\"I hope th[["Entonces, %p, %l piensa que puedes luchar
%o de mí!

"Sólo demuestra lo desesperado que se ha convertido en que envía %ra a
tratar de derrotarme. Cuando este día termine, te haré esclavizar
en las minas donde se lamentará el día que hayas entrado
%i."]] You %x
the handiwork of %ns henchlings everywh[["Te dejé vivir la última vez porque me dio placer.
Esta vez te destruiré, %p."]] destroy %n.",
      },
      nemesis_first = {
         synopsis = "[%rA will not defeat me.]",
         output = "text",
         text = [["So, %p, %l th[["Estas reuniones vienen a aburrirme. Interrumpes mis trabajos con
%o.

"Si no huyes ahora, te infligiré tanto sufrimiento que
%l se sentirá culpable por haber enviado su %S a mí!"]]the day that you ever entered
%i."]],
      },
      nemesis_next = {
         text = [["I let you live the last time because it gave me pleasure.
This time I will[["Idiota. No sabes cómo invocar los poderes de
%o.

"Devuélvemelo y te enseñaré a usarla, y juntos
Regla %H. Pero hazlo ahora, mientras mi paciencia se adelgaza."]]  You disturb my workings with
%o.

"If you do not run away now, I will inflict so much suffering on you that
%l will feel guilty for ever having sent his %S to me!"]],
      },
      nemesis_wantsit = {
         synopsis = "[\"Return %o to me and we will r[[Como %l detecta la presencia de %o,
casi sonríe por primera vez en muchas lunas llenas.

Mientras mira desde %o dice:

"Has recuperado %o. Tú eres su
propietario ahora, pero no su amo. Que funcione contigo mientras continúas
tu viaje. Con su ayuda, y %d para guiarle en el
%a camino, todavía puede recuperar el Amuleto de Yendor."]]         synopsis = "[Take %o and with %ds guidance, recover the Amulet.]",
         output = "text",
         text = [[As %l detects the presence of %o,
he almost smile[["%oC es tuyo ahora. %Z
espera tu regreso a través del portal mágico que te trajo aquí."]]overed %o.  You are its
    owner now, but not it[[Has vuelto a la 6696a101045.
Las cosas parecen haberse vuelto tan malas que temes tan pronto
%H no estará aquí para volver a.]]ath, you may yet recover the Amulet[["No podría estar más orgulloso que si fueras mi propio %S, %p!
Cuéntame de tus aventuras en la búsqueda del Amuleto de Yendor."]] output = "text",
         text = [["%oC is yours now.  %Z
await your return through the magic portal that brought you here."]],
      },
      ot[["No está claro, %p, porque mi vista está limitada sin nuestra reliquia.
Pero ahora es probable que usted puede derrotar %n, y recuperar
%o.

"Hace poco tiempo, %n y sus secuaces atacaron este lugar. Ellos
abrió las enormes ventilaciones volcánicas que %x sobre la colina, y atacó. Lo sabía.
que esto iba a suceder, y había pedido %d para un grupo de %gP
para ayudar a defender este lugar. Los pocos que %x aquí son los más poderosos
El propio Valhalla, y son todos los que quedan de cien %d enviado.

"A pesar de la gran y gloriosa batalla que combatimos, %n logró
el último en robar %o. Esto ha alterado el equilibrio del universo,
y a menos que %oh sea devuelto a mi cuidado, %n puede comenzar Ragnarok.

"Usted debe encontrar la entrada a %i. Viaje hacia abajo
desde allí y encontrará %ns lair. Derrotadle y
devolverme %o."]]a group of %gP
to help defend this place.  The few you %x here are the mightiest of
Valhalla's own, and are all that are left of[["¡NO! Esto es terrible. Veo que te conviertes en un aliado de Aa53de991e29, y
liderando sus ejércitos en las grandes batallas finales. Esto no debe venir
¡Pasa! Se ha alejado del camino %a. Debes purgarte,
y regresar aquí sólo cuando has recuperado un estado de pureza." %n]]rom there and you will find %ns lair.  Defeat him and
return %o to me."]],
      },
      badalign = {
         syno[["Te veo y %n peleando, %p. Pero no estás preparado
morirá a mano de cfe62712578 si procede. No. Esto no va a hacer.
Regresa al mundo y crece más experimentado en los caminos de la guerra.
Sólo cuando hayas regresado %Ra podrás derrotar %n."]] You have strayed from the %a path.  You must purge yourself,
and return here only when you have regained a state of purity."]],
      },
      badlevel = {
         synopsis = "[Come back when you are %Ra.]",
         output = "text",
         text = [["I see you and %n fighting, %p.  But you are not prepared and
shall die at %ns hand if you proceed.  No.  This will not do.
Go back out into the world, and grow more experienced at the ways of war.
Only when you have returned %Ra will you be able to defeat %n."]],
      },
      discourage = {
         "\"I am your death, %c.\"",
         "\"You cannot prevail, %r.  I have foreseen your every move.\"",
         "\"With you out of the way, Valhalla will be mine for the taking.\"",
         "\"I killed scores of %ds best when I took %o. Do you really think that one %c can stand against me?\"",
         "\"Who bears the souls of %cP to Valhalla, %r?\"",
         "\"No, %d cannot help you here.\"",
         "\"Some instrument of %d you are, %p.  You are a weakling!\"",
         "\"Never have I seen %ca so clumsy in battle.\"",
         "\"You die now, little %s.\"",
         "\"Your body I destroy now, your soul when my hordes overrun Valhalla!\"",
      },
      encourage = {
         "\"Go with the blessings of %d.\"",
         "\"Call upon %d when you are in need.\"",
         "\"Use %o if you can.  It will protect you.\"",
         "\"Magical cold is very effective against %n.\"",
         "\"To face %n, you will need to be immune to fire.\"",
         "\"May %d strengthen your sword-arm.\"",
         "\"[[Te materializas en la base de una colina nevada. Sobre la colina se sienta
un lugar que conoces bien, %H. De inmediato te das cuenta
que algo aquí está muy mal!

En lugares, la nieve y el hielo se han fundido en piscinas de vapor de
agua. Fumaroles y piscinas de lava burbujeante rodean la colina.
El hedor de azufre se lleva por el aire, y ustedes %x criaturas
que no debe ser capaz de vivir en este ambiente moviéndose hacia ti.]]re is lava present.]",
         output = "text",
         text = [[You materialize at the base of a snowy hill.  Atop th[[A través de nubes de gases sulfurosos, agrega82f426da0 a roca palisade
rodeado de una fosa de lava burbujeante. Recuerdas la descripción
de algo que dijo %l. Esta es la guarida de %n. %x]]d pools of bubbling lava surround the hill.
The stench of sulphur is carried through the air, and you %x creatures
that should not be able to live in this environment moving towards you.]],
      },
      goal_[[Mientras recoges %o, tu mente de repente está llena de imágenes,
y usted percibe todas las posibilidades de cada elección potencial que usted
podría hacerlo. Al comenzar a controlar y canalizar sus pensamientos, usted
darse cuenta de que debe devolver %o a %l inmediatamente.]]%l said.  This is the lair of %n.]],
      },
      goal_next = {
         text = "Once again, you stand in sight of %ns lair.",
      },
      gotit = {
         synopsis = "[You must return %o to %l.]",
         output = "text",
         text = [[As you pick up %o, your mind is suddenly filled with images,
and you perceive all of the possibilities of each potential choice you
could make.  As you begin to control and channel your thoughts, you
realize that you must return %o to %l immediately.]],
      },
      guardtalk_after = {
         "\"Hail, and well met, brave %c.\"",
         "\"May %d guide your steps, %p.\"",
         "\"%lC told us you had succeeded!\"",
         "\"You recovered %o just in time, %p.\"",
         "\"Hail %d[["Excelente, %p. Veo que has recuperado el Amuleto.

"Debes llevar el Amuleto al Gran Templo de %d, en el Astral
Plane. Hay que ofrecer el Amuleto a %d.

"Ve ahora, mi %S. No puedo decirte tu destino, como el poder del
El amuleto interfiere con el mío. Espero su éxito"]]      "\"I would deal with this foul %n myself, but %d forbids it.\"",
      },
      hasamulet = {
         synopsis = "[Take the Amule[[Una mirada de sorpresa y horror aparece en la cara %ns.

"¡No! %o me ha mentido! ¡Me han engañado!"

De repente, %n agarra su cabeza y grita en agonía, luego muere.]]Amulet to the Great Temple of %d, on the Astral
Plane.  There you must offer the Amulet to %d.

"Go now, my %S.  I cannot tell you your fa[["Ah, %p, mi %S. Has vuelto a %H
Por fin. Estamos en extrema necesidad de su ayuda, pero debo determinar si usted
todavía están listos para tal empresa.

"Déjame leer tu destino..."]]     text = [[A look of surprise and horror appears on %ns face.

    "No!!!  %o has lied to me!  I have been misled!"

Suddenly, %n grasps his [["No, %p. Tu destino está sellado. Debo fundir para otro.
campeón. He pasado de mi presencia, y nunca volveré. Saber esto, que
Nunca tendrás éxito en esta vida, y Valhalla te es negado."]]rned to %H
at last.  We are in dire need of your aid, but I must d[["Déjame leer el futuro para ti ahora, %p, tal vez has logrado
cambiarlo lo suficiente..."]],
      leader_last = {
         synopsis = "[\"Be[["De nuevo, leeré tu destino, mi %S. Esperemos que ambos tengan
hizo cambios para estar listos para esta tarea..."]]I must cast about for another
champion.  Begone from my presence, and never return.  Know this, that
you shall never succeed in this [[El hielo y la nieve dan paso a un piso del valle. Usted %x por delante de usted
una enorme colina redonda rodeada de piscinas de lava. Esta es la entrada.
a %i. Parece que no vas a entrar sin
una pelea sin embargo.]]       text = [["Again, I shall read your fate, my %S.  Let us both hope that you have
made changes to become ready for this task..."]],
      },
      locate_first = {
         synopsis = "[This is the entrance to %i.]",
         output = "te[[%l C finalmente ha enviado %ca para desafiarme!

"Pensé que dominar %o me permitiría desafiar
%d, pero me ha mostrado que primero debo matarte! Así que ven, pequeño
%s. Una vez que te derrote, puedo por fin comenzar la batalla final con %d."]]     locate_next = {
         text = "Once again, you stand before the entrance to %i.",
      },
      nemesis_first = {
         synopsis = "[\"%oC has shown me that I must kill you.\"]",
         output = "text",
         text = [["So!  %lC has finally sent %ca to challenge me!

"I thought that mastering %o would enable me to challenge
%d, but it has shown me that first I must kill you!  So come, little
%s.  Once I defeat you, I can at last begin the final battle with %d."]],
      },
      nemesis_next = {
         text = "\"Again you challenge me, [[A medida que se acerca, %l se levanta y toca %o.

"Usted puede tomar %o con usted, %p. Me he retirado de
es el poder de predecir el futuro, para ese poder que ningún mortal debe
Sí. Sus otras habilidades, sin embargo, tienen a su disposición.

"Ahora debe comenzar en %ds nombre para buscar el Amuleto de Yendor.
Que sus pasos sean guiados por %d, mi %S."]]f %l.",
      },
      offeredit = {
         synopsis = "[Take %o.  Search for the Amulet.]",
         output = "text",
         text = [[As you approa[["¡Cuidado, %p! %o C podría romper, y eso sería
una trágica pérdida. Ahora eres su guardián, y ha llegado el momento
reanudar su búsqueda por el Amuleto. %Z espera tu
volver a través del portal mágico que te trajo aquí."]]t now begin in %ds name to search for the Amulet[[De nuevo se materializa cerca de %ls morada. Tienes una sensación de inflexión
que sea la última vez que vengas aquí.]]%os keeper now.  Return through the porta[["Saludos, %p. No he podido prestar tanta atención a
tu búsqueda por el Amuleto como he deseado. ¿Cómo te das cuenta?"]].  You are its keeper now, and the time has come to
resume your search for the Amulet.  %Z await your
return through the magic portal that brought you here."]],
      },
  [["Sí, %p, realmente estás listo para esta tarea terrible. Escucha,
cuidadosamente, porque lo que te digo ahora será de vital importancia.

"Desde que nos dejaste para perfeccionar tus habilidades en el mundo, llegamos inesperadamente
bajo ataque de las fuerzas del %n. Como sabes, pensamos
%n había muerto al final de la última era, pero, por desgracia, esto era
no es el caso.

"cf31bee6491 dC envió un ejército de abominaciones contra nosotros. Entre ellos había un
minion, insensato y ensorcelado, y así, en la confusión, fue
capaz de penetrar nuestras defensas. Alas, esta criatura ha robado
%o y me temo que ha entregado %oh a %n.

"Durante los años, había tejido la mayor parte de mi poder en este amuleto, y así,
sin ella, tengo una sombra de mi antiguo poder, y temo que
pronto perecerá.

"Debes viajar a %i, y dentro de sus mazmorras,
encontrar y superar %n, y devolver %o a mí.

"Ve ahora, con %d, y completa esta búsqueda antes de que sea demasiado tarde"]]mindless and ensorcelled, and thus, in the confusion, it was
able to[["Me sorprende, %p! ¿Cuántas veces te dije que el camino de una mage
es una exacta. Uno debe usar el mundo con cuidado, para que no lo deje
en ruinas y simplificar la tarea de %n.

"Debes volver y mostrar tu mérito. No regreses hasta que estés
realmente listo para esta búsqueda. Mayo %d le guía en esta tarea."]]rcome %n, and return %o to me.

"Go now, with %d, and complete this quest before it is too late."]],
      },
      badalign = {
     [["Alas, %p, usted todavía no ha mostrado su competencia como un digno
Deletreo. Como %ra, seguramente se superaría en el desafío
Adelante. Ve, ahora, expande tus horizontes, y regresa cuando hayas alcanzado
conocido como %Ra."]]ith care, lest one leave it
in ruins and simplify the task of %n.

"You must go back and show your worthiness.  Do not return until you are
truly ready for this quest.  May %d guide you in this task."]],
      },
      badlevel = {
         synopsis = "[Go; return when you are %Ra.]",
         output = "text",
         text = [["Alas, %p, you have not yet shown your proficiency as a worthy
spellcaster.  As %ra, you would surely be overcome in the challenge
ahead.  Go, now, expand your horizons, and return when you have attained
renown as %Ra."]],
      },
      discourage = {
         "\"Your puny powers are no match for me, fool!\"",
         "\"When you are defeated, your torment will last for a thousand years.\"",
         "\"After your downfall, %p, I shall devour %l for dessert!\"",
         "\"Are you ready yet to beg for mercy?  I could be lenient...\"",
         "\"Your soul shall join the enslaved multitude I command!\"",
         "\"Your lack of will is evident, and you shall die as a result.\"",
         "\"Your faith in %d is for naught!  Come, submit to me now!\"",
         "\"A mere %r is nothing compared to my skill!\"",
         "\"So, you are the best hope of %l?  How droll.\"",
         "\"Feel my power, %c!  My victory is imminent!\"",
      },
      encourage = {
         "\"Beware, for %n is immune to most magical attacks.\"",
         "\"To enter %i you must pass many traps.\"",
         "\"%nC may be vulnerable to physical attacks.\"",
         "\"%d will come to your aid when you call.\"",[[De repente estás en un entorno familiar. Te das cuenta de lo que parece
ser una gran estructura de piedra squat cerca. ¡Espera! Eso parece
torre de su antiguo maestro, %l.

Sin embargo, las cosas no son las mismas que cuando fuiste el último aquí. Mists and
áreas de oscuridad inexplicable rodean la torre. Hay movimiento en
las sombras.

Su maestro nunca permitiría que tales formas no estéticas rodearan a
torre... a menos que algo estuviera terriblemente mal!]]have arrived at %ls tower but something is very wrong.]",
         output = "text",
         text = [[You are suddenly in familiar surroundings.  You notice what appears to
be a large, squat stone structure nearby.  Wait!  That looks like the
tower of your former teacher, %l.

However, things are not the same as when you were last here.  Mists and
areas of unexplained darkness surround the tower.  There is movement in
the s[[Al tocar %o, su poder reconfortante le infunde
con nueva energía. Te sientes como si pudieras detectar pensamientos de otros fluyendo
a través de ella. Aunque anhelas usar %o y
ataca al mago de Yendor, sabes que debes devolverlo a su legítimo
propietario, %l.]]You feel your mentor's presence; perhaps %o is nearby.",
      },
      goal_next = {
         text = "The aura of %o tingles at the edge of your perception.",
      },
      gotit = {
         synopsis = "[You feel %os power and know you should return %oh to %l.]",
         output = "text",
         text = [[As you touch %o, its comforting power infuses you
with new energy.  You feel as if you can detect others' thoughts flowing
through it.  Although you yearn to wear %o and
attack the Wizard of Yendor, you know you must return it to its rightful
owner, %l.]],
      },
      guardtalk_after = {
         "\"I have some eye of newt to trade, do you have a spare blind-worm's sting?\"",
         "\"The magic portal now seems like it will remain stable for quite some time.\"",
         "\"Have you noticed how much stronger %l is since %o was recovered?\"",
         "\"Thank %d!  We weren't positive you would defeat %n.\"",
         "\"I, too, will venture into the world, because %n was but one of many evils to be vanquished.\"",
      },
      guardtalk_before = {
   [["Felicitaciones, %p. Siempre supe que si alguien pudiera tener éxito
en derrotar al mago de Yendor y sus secuaces, serías tú.

"Ve ahora, y lleva el Amuleto al Plano Astral. Una vez allí, presente
el Amuleto sobre el altar de %d. Por el camino pasarás
los cuatro Planes Elementales. Estos aviones no son como nada.
experimentado antes, así que prepárate!

"Por esto naciste, %s! Estoy muy orgullosa de ti."]]asamulet = {
         synopsis = "[Take the Amulet to %ds altar on the Astral Plane.]",
         output = "text",
         text = [["Congratulations, %p.  I always[[%nC, cuyo cuerpo comienza a brillar, se revuelve:

"Voy a perseguir su progreso hasta el final del tiempo. Mil
maldición sobre ti y %l."

Entonces, el cuerpo estalló en una nube de polvo de ahogamiento, y sopla.]]ay you shall pass through
the four Elemental Planes.  These planes are like nothing you have ever
experienced before, so be prepared!

"For this you were born, %s!  I am ve[["Acércate, %p, porque mi voz falte en mi vejez.
Sí, veo que has recorrido un largo camino desde que saliste a la
mundo, dejando los confines seguros de esta torre. Sin embargo, primero debo
determinar si usted tiene todas las habilidades necesarias para asumir la tarea
Te necesito"]]you and %l."

Then, the body bursts into a cloud of choking dust, and blows away.]],
      },
      leader_first = {
   [["Idiota, %p! ¿Por qué he perdido todos esos años enseñándote?
¿Las artes esotéricas? ¡Fuera de aquí! Encontraré otro."]]t = [["Come closer, %p, for my voice falters in my old age.
Yes, I see that you have come a long way since you went out into the
world, leaving the safe confines of this[["Esto se está poniendo tedioso, %p, pero la perseverancia es un signo de un verdadero sabio.
Ciertamente espero que estés realmente listo esta vez!"]]
      leader_last = {
         synopsis = "[\"Get out of here!\"]",
         output = "text",
         text = [["You fool, %p!  Why did I waste all of those years teaching you
the esoteric arts?  Get out of here!  I shall find another."]],
      },
      leader_next = {
         text = "\"Well, %p, you have returned.  Perhaps you are n[["Ah, te reconozco, %p. Así que %l te ha enviado a robar
Aadf11436ded de mí, hmmm? Bueno, %lh es un tonto para enviarlo
un debilidad mental contra mí.

"Tu destrucción, sin embargo, debe hacer para el buen deporte. Al final, tú
¡me rogará que te mate!" %o]]= "Wisps of fog swirl nearby.  You feel that %ns lair is close.",
      },
      locate_next = {
         text = "You believe that[["¡Qué amable de tu parte regresar, %p! Disfruté de nuestra última reunión. Eres tú.
¿Aún tiene hambre de más dolor?

"¡Ven! Tu alma, como %o, pronto será mía para mandar."]]t",
         text = [["Ah, I recognize[[Estoy seguro de que tu perseverancia será objeto de innumerables
baladas, pero no estarás cerca para escucharlas, ¡temo!"]]truction, however, should make for good sport.  In the end, [["Thief! %o C me pertenece, ahora. I shall feed
tu carne viva a mis secuaces."]]= "[\"Your soul shall soon be mine to command.\"]",
         output = "text",
         text = [["How nice of you to return, %p!  I enjoyed our last meeting.  Are you
still hungry for more pain?

"Come!  Your soul, like %o, shal[[%l C nota %o en su posesión,
vigas en ti y dice:

"Sabía que podrías derrotar a %n y recuperar
%o. Nunca olvidaremos esto
servicio valiente.

"Toma %oh contigo en tu búsqueda del Amuleto de Yendor.
Puedo sentir que ya te ha dado %oiself.

"Que %d te guíe en tu búsqueda, y te mantengas alejado del daño."]],
      },
      nexttime = {
         text = "Once again, you are back at %H.",
      },
      offeredit = {
         synopsis = "[Take %o with you in your quest for the Amulet.]",
         output = "text[["Ahora eres el guardián de %o. Es hora de
recuperar el /otro/Amuleto. %Z espera tu regreso
el portal mágico que te trajo aquí."]]forget this
    brave service.

    "Take %oh with you in your qu[[Has vuelto al %H.
Tienes una extraña sensación de que puede ser la última vez que vengas aquí.]]  "May %d guide you in your quest, and kee[["Acércate, mi %S, y comparte tus aventuras conmigo.
¿Has tenido éxito en tu búsqueda del Amuleto de Yendor?"]]he other Amulet.]",
         output = "text",
         text = [["You are the keeper of %o now.  It is time to
recover the /other/ Amulet.  %Z await your return through
the magic portal which brought you here."]],
      },
      othertime = {
         text = [[You are back at %H.
You have an odd feeling this may be the last time you ever come here.]],
      },
      posthanks = {
         text = [["Come near, my %S, and share your adventures with me.
So, have you succeeded in your quest for the Amulet of Yendor?"]],
      },
   },
}
