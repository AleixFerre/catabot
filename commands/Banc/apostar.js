const { getUser, updateUser } = require('../../lib/database');

const TYPE = 'banc';

module.exports = {
  name: 'apostar',
  description: 'Tens un 50% de guanyar apostant monedes.',
  type: TYPE,
  usage: '< quantitat/tot > [ multiplicador ]',
  aliases: ['gamble'],
  async execute(message, args, server) {
    let amount = 0;
    let multiplyer = 1; // Per defecte x1
    let multiplicant = false;
    let content = '';
    let all = false;
    let user = await getUser(message.author.id, message.guild.id);
    const money = user.money;

    if (!args[0]) {
      message.reply('no se quant vols apostar!');
      return message.channel.send(server.prefix + 'help gamble');
    }

    if (args[1]) {
      if (!isNaN(args[1])) {
        multiplicant = true;
        multiplyer = parseInt(args[1]);
        if (multiplyer < 1) {
          message.reply('només pots multiplicar per 1 (per defecte) o més!');
          return message.channel.send(server.prefix + 'help gamble');
        } else if (multiplyer % 1 !== 0) {
          message.reply('només pots multiplicar nombres enters!');
          return message.channel.send(server.prefix + 'help gamble');
        }
      } else {
        message.reply('el multiplicador ha de ser un numero!');
        return message.channel.send(server.prefix + 'help gamble');
      }
    }

    if (args[0] === 'all') {
      amount = money;
      all = true;
    } else if (isNaN(args[0])) {
      message.reply('has de posar un numero vàlid o all');
      return message.channel.send(server.prefix + 'help gamble');
    } else {
      amount = parseInt(args[0]);
    }

    if (amount % 1 !== 0) {
      message.reply('només pots apostar nombres enters!');
      return message.channel.send(server.prefix + 'help gamble');
    }

    if (amount <= 0) {
      return message.reply('només pots apostar una quantitat superior a 0!');
    }

    if (amount > money) {
      return message.reply('no tens prous diners!!');
    }

    // Comprovem si guanyem o no
    let coin = Math.round(Math.random() * multiplyer); // We round between 0:n so we have randomly true or false
    if (coin === 1) {
      // Guanyem
      amount *= multiplyer; // Multipliquem per m per qui hagi apostat multiplicant
      user.money += parseInt(amount);
      content = message.author.username + ' has guanyat😆!\n💰' + amount + ' monedes afegides a la teva conta.💰';
      if (multiplicant) {
        content += '\nHas utilitzat el multiplicador x' + multiplyer;
      }
    } else {
      // Perdem
      user.money -= parseInt(amount);
      if (all) {
        content = message.author.username + ' HAS PERDUT TOT';
      } else {
        content = message.author.username + ' has perdut';
      }
      content += '😞!\n💰' + amount + ' monedes esborrades de la teva conta.💰';
      if (multiplicant) {
        content +=
          '\nHas utilitzat el multiplicador x' +
          multiplyer +
          '.\nRecorda que només tens menys probabilitats de perdre, però perds la quantitat apostada.';
      }
    }

    await updateUser([message.author.id, message.guild.id], {
      money: user.money,
    });

    let xpMax = amount;

    if (coin === 1) {
      // Si guanyes
      xpMax *= multiplyer * 3;
    } else {
      // Si perds
      xpMax *= 2;
    }

    if (xpMax > 1000) {
      xpMax = 1000;
    }

    xpMax = Math.floor(Math.random() * (xpMax - 1) + 1); // Numero aleatori entre 1 i max

    message.channel.send(server.prefix + 'progresa ' + xpMax + ' <@' + message.author.id + '>');
    message.channel.send('```' + content + '```');
  },
};
