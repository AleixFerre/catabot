const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
  name: 'insulta',
  description: 'Insulta a qui vulguis',
  usage: '[ @usuari ]',
  aliases: ['insult'],
  type: TYPE,
  async execute(message, args) {
    let insultLink = 'https://insult.mattbas.org/api/insult.json';
    let title = '**INSULT';
    let insult = '';

    if (args[0]) {
      let who = args.join(' ');
      if (message.mentions.users.first()) {
        who = message.mentions.users.first().username;
      }
      title += ' a ' + who + '**';
      insultLink += '?who=' + who;
    } else {
      title += '**';
    }

    async function getData() {
      await fetch(insultLink)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.error) {
            return message.reply('hi ha hagut un error!\n' + data.error_message);
          } else {
            insult = data.insult;
            await translate(insult, {
              to: 'ca',
            }).then((res) => {
              insult = res.text;
            });
          }
        });
    }

    await getData();

    let msg = new MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle(title)
      .setDescription(insult)
      .setTimestamp()
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    message.channel.send(msg);
  },
};
