const { db } = require('../../lib/common.js');
const { getUser, updateUser } = require('../../lib/database.js');

const TYPE = 'privat';

module.exports = {
  name: 'generar',
  description: 'Ingresa una quantitat a una persona. Comanda privada.',
  type: TYPE,
  aliases: ['generate', 'ingressar'],
  usage: '< quantitat > < @usuari >',
  async execute(message, args, server) {
    // ************* Precondicions *************
    if (message.author.id != process.env.IdOwner) {
      message.reply('aquesta comanda només pot ser executada per administradors del bot!');
      return message.channel.send(`${server.prefix}help generar`);
    }

    // Si no hi ha diners
    if (!args[0]) {
      message.reply('no has posat els diners!');
      return message.channel.send(`${server.prefix}help generar`);
    } else if (isNaN(args[0])) {
      // Si els diners no es un numero
      message.reply('els diners han de ser un numero!');
      return message.channel.send(`${server.prefix}help generar`);
    } else if (args[0] <= 0) {
      // si el numero de diners es negatiu
      message.reply('els diners a ingressar han de ser més grans que 0!');
      return message.channel.send(`${server.prefix}help generar`);
    }

    // si no hi ha usuari mencionat
    if (!args[1]) {
      message.reply("no has posat l'usuari a ingressar!");
      return message.channel.send(`${server.prefix}help generar`);
    } else if (!message.mentions.members.first()) {
      message.reply("no has posat l'usuari a ingressar!");
      return message.channel.send(`${server.prefix}help generar`);
    }

    let amount = parseInt(args[0]);
    let otherUser = message.mentions.users.first();

    if (otherUser.bot) {
      // si el mencionat es un bot
      return message.reply('no pots ingressar diners a un bot!');
    }

    if (!message.guild.member(otherUser.id)) {
      // si el mencionat no esta al servidor
      return message.reply("l'usuari mencionat no es troba al servidor!");
    }

    // ************* Transacció *************

    // Posar diners a otherUser
    let userData = await getUser(otherUser.id, message.guild.id);
    userData.money += amount;
    updateUser([userData.IDs.userID, userData.IDs.serverID], {
      money: userData.money,
    }).then(db(`DB: Usuari ${otherUser.username} actualitzat ${userData.money}`));

    message.reply(`has ingressat ${amount} monedes a ${otherUser.username} correctament! 💸`);
  },
};
