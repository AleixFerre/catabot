const { db } = require('../../lib/common.js');
const { updateServer } = require('../../lib/database.js');

const TYPE = 'mod';

module.exports = {
  name: 'canalcomptador',
  description:
    "Adjudica el canal contador de membres al canal que s'executa la comanda\nEs pot desadjudicar el canal passant **treure** com a argument",
  type: TYPE,
  usage: '[ treure ]',
  aliases: ['setcount', 'setcounter', 'canalcontador'],
  execute(message, args, server) {
    let paraula = 'adjudicat';

    if (args[0] && args[0].toLowerCase() === 'treure') {
      // Treure
      let id = server.counterChannel;
      let nomAnterior = server.counterChannelName;

      if (!nomAnterior) {
        return message.reply("no s'ha trobat cap canal adjudicat per treure!");
      }

      server.counterChannel = null;
      server.counterChannelName = null;
      paraula = `des${paraula}`;

      message.guild.channels.resolve(id).setName(nomAnterior);
    } else {
      // Posar
      if (server.counterChannel) {
        return message.reply(
          `ja hi ha un canal adjudicat!
Desadjudica'l amb \`${server.prefix}canalComptador treure\`
i torna a executar la comanda \`${server.prefix}canalComptador\` al canal que vols adjudicar com a comptador.`
        );
      }

      server.counterChannel = message.channel.id;
      server.counterChannelName = message.channel.name;

      let memberCount = message.guild.memberCount;

      message.guild.channels.resolve(message.channel.id).setName(`membres ${memberCount}`);
    }

    updateServer(message.guild.id, {
      counterChannel: server.counterChannel,
      counterChannelName: server.counterChannelName,
    }).then(console.log(db(`DB: Actualitzat el canal comptador del servidor ${message.guild.name} correctament!`)));

    message.reply(
      `has ${paraula} el canal <#${message.channel.id}> com a canal comptador de membres de forma correcta!\nEspera uns minuts per veure reflexats els canvis.`
    );
  },
};
