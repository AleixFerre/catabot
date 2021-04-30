const Discord = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
  name: 'howgay',
  description: 'Et diu quant gay ets',
  type: TYPE,
  aliases: ['gay'],
  execute(message) {
    let gay = Math.round(Math.random() * 99 + 1); // Clamped bewteen 1% : 100%

    let mention = message.author;

    if (message.mentions.users.first()) {
      mention = message.mentions.users.first();
    }

    let msg = new Discord.MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('**QUANT GAY ETS?**')
      .setThumbnail('https://i.imgur.com/jr5elyc.png')
      .addField('❯ Resultat', `${mention.username}, ets ` + gay + '% gay!', true)
      .setTimestamp()
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    message.channel.send(msg);
  },
};
