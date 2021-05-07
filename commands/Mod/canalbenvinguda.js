const { db } = require('../../lib/common.js');
const { updateServer } = require('../../lib/database.js');

const TYPE = 'mod';

module.exports = {
  name: 'canalbenvinguda',
  description:
    "Adjudica el canal de benvinguda al canal que s'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument",
  type: TYPE,
  usage: '[ null ]',
  aliases: ['setwelcome'],
  execute(message, args) {
    let paraula = 'adjudicat';
    let welcomeChannel = null;

    if (args[0] && args[0].toLowerCase() === 'null') {
      welcomeChannel = null;
      paraula = 'des' + paraula;
    } else {
      welcomeChannel = message.channel.id;
    }

    updateServer(message.guild.id, {
      welcomeChannel: welcomeChannel,
    }).then(console.log(db(`DB: Actualitzat el canal de benvinguda del servidor ${message.guild.name} correctament!`)));

    message.reply(
      'has ' + paraula + ' el canal <#' + message.channel.id + '> com a canal de benvinguda del bot de forma correcta!'
    );
  },
};
