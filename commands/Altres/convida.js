const Discord = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'altres';

module.exports = {
  name: 'convida',
  type: TYPE,
  aliases: ['invite'],
  description: "Vols convidar el bot? Aqui tens l'enllaç.",
  execute(message) {
    // Get the invite link With admin permissions
    let link = `https://discordapp.com/oauth2/authorize?client_id=${process.env.clientid}&permissions=8&scope=bot`;

    const embedMessage = new Discord.MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('Invite link')
      .setURL(link)
      .setAuthor(
        'CataBOT',
        'https://raw.githubusercontent.com/AleixFerre/CataBot/master/img/icon_cat.png',
        'https://github.com/AleixFerre/CataBot'
      )
      .setDescription('Aqui tens el link')
      .setThumbnail('https://raw.githubusercontent.com/AleixFerre/CataBot/master/img/icon_cat.png')
      .setTimestamp()
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    message.author.send(embedMessage).catch(console.error);
  },
};
