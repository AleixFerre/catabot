const { getUser, updateUser } = require('../../lib/database');

const TYPE = 'banc';

module.exports = {
  name: 'pagar',
  description: 'Paga una quantitat a una persona',
  type: TYPE,
  aliases: ['bizum', 'pay', 'paga'],
  usage: '< quantitat/tot > < @usuari >',
  async execute(message, args, server) {
    // ************* Precondicions *************

    let all = false;

    // Si no hi ha diners
    if (!args[0]) {
      message.reply('no has posat els diners!');
      return message.channel.send(server.prefix + 'help pay');
    } else if (isNaN(args[0])) {
      // Si els diners no es un numero
      if (args[0] === 'tot') {
        all = true;
      } else {
        message.reply('els diners han de ser un numero!');
        return message.channel.send(server.prefix + 'help pay');
      }
    } else if (args[0] <= 0) {
      // si el numero de diners es negatiu
      message.reply('els diners han de ser més grans que 0!');
      return message.channel.send(server.prefix + 'help pay');
    }

    // si no hi ha usuari mencionat
    if (!args[1]) {
      message.reply("no has posat l'usuari a pagar!");
      return message.channel.send(server.prefix + 'help pay');
    } else if (!message.mentions.members.first()) {
      message.reply("no has posat l'usuari a pagar!");
      return message.channel.send(server.prefix + 'help pay');
    }

    let user = await getUser(message.author.id, message.guild.id);

    let amount = 0;
    if (all) {
      amount = user.money;
    } else {
      amount = parseInt(args[0]);
    }

    if (amount % 1 !== 0) {
      message.reply('només pots apostar nombres enters!');
      return message.channel.send(server.prefix + 'help pay');
    }

    let otherUser = message.mentions.users.first();
    let other = await getUser(otherUser.id, message.guild.id);

    if (otherUser.bot) {
      // si el mencionat es un bot
      return message.reply('no pots pagar a un bot!');
    }

    if (otherUser.id === message.author.id) {
      // si el mencionat es un mateix
      return message.reply('no et pots pagar a tu mateix!');
    }

    if (!message.guild.member(otherUser.id)) {
      // si el mencionat no esta al servidor
      return message.reply("l'usuari mencionat no es troba al servidor!");
    }

    // Si no tens els diners suficients
    let dinersActuals = user.money;

    if (dinersActuals < amount) {
      return message.channel.send(`**❌Error: ${message.author} no tens prous diners!**
Téns $${dinersActuals} i vols pagar $${amount}.`);
    }

    // ************* Transacció *************

    // Treure diners de message.author
    user.money -= amount;

    // Posar diners a otherUser
    other.money += amount;

    await updateUser([message.author.id, message.guild.id], {
      money: user.money,
    });

    await updateUser([otherUser.id, message.guild.id], {
      money: other.money,
    });

    message.reply('has pagat ' + amount + ' monedes a ' + otherUser.username + ' correctament! 💸');
  },
};
