const { updateServer } = require('../../lib/database.js');
const { db } = require('../../lib/common.js');

const TYPE = 'mod';

module.exports = {
  name: 'setalertchannel',
  description:
    "Adjudica el canal d'alertes al canal que s'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument",
  type: TYPE,
  usage: '[ null ]',
  aliases: ['alerthere', 'setalert'],
  execute(message, args) {
    let paraula = 'adjudicat';
    let alertChannel = null;

    if (args[0] && args[0].toLowerCase() === 'null') {
      alertChannel = null;
      paraula = 'des' + paraula;
    } else {
      alertChannel = message.channel.id;
    }

    updateServer(message.guild.id, {
      alertChannel: alertChannel,
    }).then(console.log(db(`DB: Actualitzat el canal de alertes del servidor ${message.guild.name} correctament!`)));

    message.reply(
      'has ' + paraula + ' el canal <#' + message.channel.id + "> com a canal d'alertes del bot de forma correcta!"
    );
  },
};
