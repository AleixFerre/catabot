const { MessageEmbed } = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
  name: 'reves',
  description: 'Posa un text al revés',
  type: TYPE,
  usage: '< text >',
  aliases: ['flip', 'alreves'],
  execute(message, args, server) {
    if (!args[0]) {
      message.reply('no se què girar!');
      message.channel.send(server.prefix + 'help reves');
      return;
    }

    function reverseString(str) {
      return str.split('').reverse().join('');
    }

    let word = args.join(' ');
    word = reverseString(word);

    let msg = new MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('**TEXT AL REVÉS**')
      .setThumbnail('https://bit.ly/CataBot_RawIcon')
      .addField('❯ SÉVER LA TXET', word, true)
      .setTimestamp()
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    message.channel.send(msg);
  },
};
