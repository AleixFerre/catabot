const Discord = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
  name: 'f',
  description: 'F en el chat chavales',
  usage: ' [ description ]',
  type: TYPE,
  execute(message, args) {
    const msg = new Discord.MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('**F**')
      .setDescription(args.join(' '))
      .setImage('https://media.giphy.com/media/j6ZlX8ghxNFRknObVk/giphy.gif')
      .setTimestamp()
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    message.channel.send(msg);
  },
};
