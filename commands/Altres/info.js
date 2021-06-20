const Discord = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');
const { getUserCount } = require('../../lib/database.js');

const TYPE = 'altres';

module.exports = {
  name: 'info',
  description: 'Diu la informació del bot.',
  type: TYPE,
  aliases: ['stats', 'bot'],
  async execute(message, _args, server, client) {
    const description = `Soc un **BOT** de discord **en català**! Espero que sigui agradable la meva presencia en aquest servidor, ${message.author.username}. Pots veure totes les meves comandes amb ${server.prefix}help.`;

    const info = `• **Desenvolupador:** ${process.env.ownerDiscordUsername}
• **Pagina web: [Pàgina del CataBot](${process.env.website})**
• **Servidor Oficial: [Vull entrar-hi](${process.env.officialServerLink})**`;

    let nMembresSenseBots = 0;
    let nMembresAmbBots = 0;
    for await (let guild of client.guilds.cache) {
      guild = guild[1];
      nMembresAmbBots += guild.memberCount;
      await guild.members.fetch();
      nMembresSenseBots += guild.members.cache.filter((member) => !member.user.bot).size;
    }

    const stats = `• **Membres Totals: **\`${nMembresAmbBots}\`
• **Membres Sense Bots: **\`${nMembresSenseBots}\`
• **Perfils Guardats: **\`${await getUserCount()}\`
• **Servidors: **\`${client.guilds.cache.size}\`
• **Comandes: **\`${client.commands.size}\``;

    const msg = new Discord.MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setAuthor(
        `CataBOT [v${process.env.version}] by Català HD`,
        'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/gif_frames/icon_new.gif',
        'https://github.com/CatalaHD/CataBot'
      )
      .setDescription(description)
      .addField('❯ Estadistiques:', stats, true)
      .addField('❯ Informació:', info, true)
      .setTimestamp()
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    message.channel.send(msg);
  },
};
