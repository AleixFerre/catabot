const Discord = require('discord.js');
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
  name: '8ball',
  description: 'Et permet preguntar-li a la bola de la sort el que et passarà al futur...',
  type: TYPE,
  usage: '< question >',
  aliases: ['8', 'ball'],
  async execute(message, args, server) {
    if (!args[0]) {
      message.reply('no se el que li vols preguntar a la pilota...');
      message.channel.send(server.prefix + 'help 8ball');
      return;
    }

    let link = 'https://8ball.delegator.com/magic/JSON/';
    let params = encodeURIComponent(args.join(' '));

    let answer = '';
    let question = '';
    let type = '';

    await fetch(link + params)
      .then((response) => response.json())
      .then(async (json) => {
        type = json.magic.type;
        question = json.magic.question;
        answer = json.magic.answer;

        await translate(answer, {
          to: 'ca',
        }).then((res) => {
          answer = res.text;
        });
      });

    let msg = new Discord.MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('**8BALL**')
      .setThumbnail('http://bit.ly/CataBot_' + type)
      .addField('❯ Pregunta', question, true)
      .addField('❯ Resposta', answer, true)
      .setTimestamp()
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    message.channel.send(msg);
  },
};
