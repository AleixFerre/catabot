# CataBot
This is our new BETA Discord Bot called CataBot

## To keep it up to date:

Dowload it and download dependencies with
``` 
sudo apt-get install ffmpeg
npm install --save discord.js
npm install --save ffmpeg 
npm install --save opusscript 
npm install --save ytdl-core
npm install simple-youtube-api
npm install canvas
npm install node-fetch --save
```
If you are running this locally
You also need to install [FFmpeg](https://www.youtube.com/watch?v=qjtmgCb8NcE).

## **COMANDES DEL CATABOT**
### **COMANDES DE MUSICA**
```
-> !join                :: Entra dins del teu canal de veu.
-> !play <search>       :: Posa la musica que vulguis amb un link.
-> !playlist <link>     :: Posa les primeres 20 cançons d'una llista de reproducció.
-> !skip/next           :: Passa a la següent de la cua.
-> !delete <pos>        :: Esborra a la posicio de la cua que vulguis.
-> !q/queue             :: Mostra la cua.
-> !shuffle             :: Barreja la cua.
-> !clear               :: Neteja la cua.
-> !loop [true/false]   :: Activa el Mode Loop <Quan s'activa, no para de reproduir-se la cançó actual>.
-> !stop                :: Borra tota la cua i desconnecta el bot del canal.
-> !delete <position>   :: Esborra la cançó de la posició que vulguis; per defecte, la següent.
-> !leave               :: Se'n va del canal de veu.
-> !pause               :: Pausa la transmisió.
-> !resume              :: Continua amb la transmisió pausada.
```

### **COMANDES DE MODERACIÓ**
```
-> !kick <@user> [desc] :: Expulsa permanentment un usuari del servidor
-> !ban  <@user> [desc] :: Beta un usuari del servidor
-> !randomize [max]     :: Posa un valor aleatori de monedes a tots els usuaris del servidor
-> !clearmessages <n>   :: Borra n missatges del canal de text on s'estigui executant la comanda
-> !generate <n> <@u>   :: Ingresa una quantitat a una persona
```

### **COMANDES DE BANC**
```
-> !money [@user]       :: Mostra el teu balanç de monedes al servidor o al de la persona que mencionis
-> !leaderboard         :: Mostra la classificació de monedes del servidor
-> !pay <n> <@user>     :: Paga una quantitat a una persona
```

### **COMANDES D'ENTRETENIMENT**
```
-> !cat                 :: Mostra una imatge d'un gat aleatori.
-> !dog                 :: Mostra una imatge d'un gos aleatori.
-> !meme                :: Mostra una imatge d'un gat aleatori.
-> !welcome             :: Et dóna la benvinguda; també s'executa al entrar un nou membre.
-> !say <word>          :: Fés que el bot digui el que vulguis.
-> !pokedex <pokemon>   :: Mostra la pokedex del pokemon.
-> !penis               :: Mostra la mida del teu penis.
-> !coin                :: Te la jugues al 50%.
-> !8ball <question>    :: Et permet preguntar-li a la bola de la sort el que et passarà al futur.
-> !howgay              :: Et diu lo gay que ets.
-> !flipword <word>     :: Posa la paraula al revés.
-> !dice [max] [n]      :: Tira els daus que vulguis com vulguis.
-> !rps                 :: Juga a pedra-paper-tissora amb el bot.
-> !choice              :: Deix que el bot escolleixi per tu.
```

### **ALTRES COMANDES**
```
-> !ping                :: Comprova la latencia del bot i dels teus missatges.
-> !invite              :: T'envia un missatge amb el invite link del bot.
-> !prefix [new]        :: Et mostra el prefix i et permet cambiar-lo amb un segon argument.
-> !server              :: Et mostra informació sobre el servidor.
-> !help [cmd]          :: Et mostra informació sobre les comandes del bot.
```

## CURRENT VERSION
0.4
