# CHANGELOG

_All **ÇÇ** strings are representations of the server prefix_

\[v1.5.1\]

- Arreglat el bug de `Error: input stream: Status code: 403`
  - Ara el bot comprova si hi ha hagut un error en la reproducció de la cançó i ho torna a intentar un màxim de 5 cops.
- Ja es pot fer ÇÇplay d'una playlist!
  - Ara es detecta si el link és una playlist o no i es reprodueix respectivament.
  - Això fa que puguis fer `ÇÇplay <URL>` d'una playlist i funcioni correctament.
- Es reprèn la reproducció automàticament
  - Ara el `ÇÇplay` reprèn la reproducció si aquesta està pausada.,
  - També funciona amb altres comandes com `ÇÇplaynow` que reprenen el reproductor si aquest està pausat abans de reproduir la nova cançó.
- La comanda ÇÇbot no tarda 3s en executar-se
  - S'ha optimitzat el conteig de membres i ara es instantàni!.
- Altres canvis
  - Arreglats bugs menors i errors gramaticals.
  - S'ha actualitzat totes les dependències a la ultima versió.

\[v1.5\]

- S'ha actualitzat la icona del bot apuntant cap un disseny més modern.
- Noves comandes de musica.
  - `ÇÇseek`: Posa la cançó actual al segon dit.
  - Ara es detecta quan el bot s'enva del canal i es borra la llista corresponentment.
- S'han esborrat diverses comandes que no s'utilitzaven (penis i gay) que a part es consideraven NSFW.
- Ara totes les comandes tenen la seva traducció al català.
- Actualitzats els paquets de les dependències i nova versió de Node.js.
- Ara cal crear un perfil abans de fer servir qualsevol comanda de tipus **Jocs**, **Nivell** o **Banc**.
- El modul de la música deix d'estar en manteniment. El bug de `Error: input stream 404` ja està arreglat.

\[v1.4\]

- Esborrats els cooldowns de les comandes i els avisos de no fer servir els canals correctament.
  - Molestaven massa, millor esborrar una cosa que molesta més que ajuda.
- Afegides noves comandes de música.
  - `ÇÇplayNow`: Posa una cançó ara mateix. La comanda respectarà la cua següent però es passarà la cançó actual.
  - `ÇÇplayNext`: Posa una cançó al principi de la cua.
  - `ÇÇnp`: Et mostra la cançó que s'està reproduint ara mateix.
  - `ÇÇq [ nPagina ]`: Et mostra la llista de reproducció a la pàgina que vulguis.
  - `ÇÇclear [ n ]`: Esborra algunes o totes les cançons de la llista.
  - `ÇÇpause`: Posa la reproducció en pausa.
  - `ÇÇresume`: Repren la reproducció pausada.
  - `ÇÇvolume`: Posa un nou volum de la reproducció. Et mostra el volum actual si no es passa cap paràmetre.
  - `ÇÇloop`: Alterna el mode LOOP. Quan està activat, el bot reproduirà la mateixa cançó una i altra vegada.
  - `ÇÇsilent`: Alterna el mode SILENT. Aquest fa que el bot no mostri la cançó actual quan passa a la següent cançó.
  - `ÇÇshuffle`: Barreja la cua de reproducció.
  - `ÇÇinvert`: Inverteix la cua de reproducció.
  - Ara es pot veure la duració de les cançons i el temps al afegir cançons a la cua.
  - Ara el bot s'espera uns segons abans de desconnectar-se.
  - Més info amb la comanda `ÇÇmusic`.
- S'ha afegit una nova comanda de `ÇÇpoll` per generar enquestes
  - Es recomana que es facin servir al canal adequat perque quedin guardades i que es vegin en el temps.

\[v1.3\]

- Nova comanda `lol` amb la que pots buscar tota la informació del League of Legends.
  - Aquesta comanda té diferents subcomandes: `champ`, `spell` i `item`.
  - Més info amb la comanda `ÇÇhelp lol`.
- S'ha implementat un sistema de predicció on si es posa una lletra malament, s'avisa i es corregeix ràpidament.
- Nova comamanda `advice` que dona consells de la vida.
  - Més info amb la comanda `ÇÇhelp advice`.
- Nova comanda `exchange` que permet fer la conversió de monedes de forma ràpida i fàcil.
  - Més info amb la comanda `ÇÇhelp exchange`.
- Nou sistema de Mod per administrar els Rols. Si ets Administrador pots:
  - Afegir un Rol a un Usuari amb `ÇÇaddrole < @user > < @rol >`. Més info amb la comanda `ÇÇhelp addrole`.
  - Esborrar un Rol d'un Usuari amb `ÇÇremoverole < @user > < @rol >`. Més info amb la comanda `ÇÇhelp removerole`.
- Afegida nova comanda `setcounter` que adjudica el canal de text com a contador de membres.
  - El comptador s'actualitza cada 12h o manualment amb la comanda `refresh` que només poden executar els Administradors.
- Nova comanda `morsify` / `demorsify` que tradueix un text a Morse i al revés.
  - Més info amb la comanda `ÇÇhelp morsify`.
- S'ha afegit un Cooldown entre cada comanda.
  - Pots veure la informació del cooldown de cada comanda amb `ÇÇhelp < nom de la comanda >`.
- Nova comanda `lastupdate` que et permet veure les notes de l'ultima actualització del bot.
  - Més info amb la comanda `ÇÇhelp lastupdate`.
- Nou mòdul de comandes `music`. Ara el bot pot entrar als canals de veu i reproduir la musica que vulguis!. Més info amb la comanda `ÇÇmusic`.
  - `ÇÇplay`: Pots cercar videos a youtube o entrar directament la URL.
  - `ÇÇskip`: Pots passar a la següent de la llista.
  - `ÇÇstop`: Pots parar el bot desconnectant-se del canal i esborrant totes les cançons de la llista.
  - (S'estan preparant properes comandes com `ÇÇlist/queue`, `ÇÇnowPlaying/np`, `ÇÇpause`, `ÇÇshuffle`, `ÇÇclearList`, `ÇÇskipTo` i `ÇÇloop`).

\[v1.2\]

- Ara l'esborrat de missatges és més ràpid i pot arribar a esborrar fins a 100 missatges alhora contant el missatge enviat amb la comanda.
- Ara la comanda `penis` no té cap imatge d'un penis, ja que es considera contingut NFSW.

\[v1.1\]

- Ara, per fi, el bot es **PÚBLIC**, per tant se'l pot convidar a qualsevol servidor.
- En quant el bot s'uneix a un canal nou, aquest envia un missatge privat amb totes les instuccions a qui l'ha convidat.
- Es poden desactivar tots els canals per defecte del bot fent servir la comanda `catasetwelcome null`
  - Aquesta, ara té un nou argument opcional, que permet desadjudicar aquell canal i fer que la funció automàtica del bot quedi inhabilitada.
  - En quant el bot **entra** en un nou canal, tots els canals són NULL per evitar spam.
  - Dins d'aquest conjunt hi entren les comandes `catasetbot` i `catasetalert`.
  - Recordar que aquestes comandes només poden ser executades per membres amb permís d'ADMINISTRADOR.
- Ara el prefix per defecte és `cata` així que, si el bot s'uneix al teu servidor, es farà servir aquest prefix.
- Recordar que també es pot cambiar amb la comanada `cataprefix [nou prefix]`.
- Arreglat el bug que impeia fer servir la pokedex de forma correcta.
- Arreglats bugs menors.
