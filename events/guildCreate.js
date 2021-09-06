const { bot, db } = require('../lib/common.js');
const { updateServer } = require('../lib/database.js');

module.exports = {
  name: 'guildCreate',
  execute(guild) {
    updateServer(guild.id, {
      serverID: guild.id,
      prefix: process.env.prefix,
    }).then(console.log(db(`DB: Guardada la nova guild ${guild.name} correctament!`)));

    try {
      let newName = `[ ${process.env.prefix} ] CataBOT`;
      guild.me.setNickname(newName);
    } catch (err) {
      console.error(err);
    }

    // Enviem el missatge al owner de la guild
    let introMessage = `**DONA LA BENVINGUDA AL CATABOT!**
  El primer bot de Discord en català!
  
  **CONFIGURACIÓ GENERAL**
  El bot permet executar una serie de comandes automàtiques sempre que un ADMINISTRADOR ho decideixi. També cal saber que totes les comandes de tipus MOD requereixen un rol d'ADMINISTRADOR per ser executades.
  - El bot permet cambiar el prefix per defecte amb la comanda \`${process.env.prefix}prefix [prefix nou]\` amb un màxim de 5 caràcters.
  - També es pot configurar un canal de benvinguda perque digui Hola i Adeu a tots els integrants nous i passats del servidor amb \`${process.env.prefix}setwelcome\`. També pots provar amb \`${process.env.prefix}welcome\` i \`${process.env.prefix}bye\`
  - Es pot configurar un canal d'avisos amb \`${process.env.prefix}setalert\`. En aquest canal s'avisarà de totes les novetats del bot.
  - Finalment, es pot configurar un canal del bot amb \`${process.env.prefix}setbot\`. Això el que farà serà avisar a tothom qui estigui usant el bot fora d'aquest canal.
  Aquestes tres comandes es poden desactivar en qualsevol moment amb el paràmetre \`treure\`. P.E. \`${process.env.prefix}setwelcome treure\`
  Per veure tota la informació dels canals, fes servir la comanda \`${process.env.prefix}server\`.
  
  Més informació de les comandes amb \`${process.env.prefix}help\` o \`${process.env.prefix}help [nom de la comanda]\`.`;

    try {
      guild.members.fetch(guild.ownerID).then((owner) => {
        owner.send(introMessage);
      });
    } catch (err) {
      console.error(err);
    }

    console.log(bot(`El bot ha entrat al servidor "${guild.name}"`));
  },
};
