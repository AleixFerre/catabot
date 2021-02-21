const Discord = require("discord.js");
const { getRandomColor } = require('../../lib/common.js');

module.exports = {
    name: 'info',
    description: 'Diu la informació del bot.',
    type: 'altres',
    cooldown: 1,
    aliases: ['stats', 'bot'],
    execute(message, _args, servers, _userData, client) {

        let description = "Soc un **BOT** de discord **en català**! Espero que sigui agradable la meva presencia en aquest servidor, " + message.author.username + ". Pots veure totes les meves comandes amb " + servers[message.guild.id].prefix + "help.";

        let info = `• **Desenvolupador:** ${process.env.ownerDiscordUsername}\n` +
            `• **Pagina web: [catalahd.github.io/CataBot](${process.env.website})**\n` +
            `• **Servidor Oficial: [discord.gg/k75qvYM](${process.env.officialServerLink})**`;

        let nMembers = 0;
        client.guilds.cache.forEach(guild => {
            nMembers += guild.memberCount;
        });

        let stats = "• **Membres:** `" + nMembers + "`\n" +
            "• **Servers:** `" + client.guilds.cache.size + "`\n" +
            "• **Comandes:** `" + client.commands.size + "`";

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setAuthor(`CataBOT [v${process.env.version}] by Català HD`, 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/gif_frames/icon_new.gif', 'https://github.com/CatalaHD/CataBot')
            .setDescription(description)
            .addField('❯ Informació:', info, true)
            .addField('❯ Estadistiques:', stats, true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};