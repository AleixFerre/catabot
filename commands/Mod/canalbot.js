const { db } = require('../../lib/common.js');
const { updateServer } = require('../../lib/database.js');

const TYPE = 'mod';

module.exports = {
  name: 'canalbot',
  description:
    "Adjudica el canal d'alertes al canal que s'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument",
  type: TYPE,
  usage: '[ null ]',
  aliases: ['setbot'],
  execute(message, args) {
    let paraula = 'adjudicat';
    let botChannel = null;

    if (args[0] && args[0].toLowerCase() === 'null') {
      botChannel = null;
      paraula = 'des' + paraula;
    } else {
      botChannel = message.channel.id;
    }

    updateServer(message.guild.id, {
      botChannel: botChannel,
    }).then(console.log(db(`DB: Actualitzat el canal del bot del servidor ${message.guild.name} correctament!`)));

    message.reply(
      'has ' + paraula + ' el canal <#' + message.channel.id + '> com a canal principal del bot de forma correcta!'
    );
  },
};
