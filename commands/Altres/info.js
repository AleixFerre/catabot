const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: 'info',
    description: 'Diu la informació del bot.',
    type: 'altres',
    aliases: ['stats'],
    execute(message, args, servers, userData, client) {

        let description = "Soc un **BOT** de discord **en català**! Espero que sigui agradable la meva presencia en aquest servidor, " + message.author.username + ". Pots veure totes les meves comandes amb " + servers[message.guild.id].prefix + "help.";

        let info = `• **Desenvolupador:** ${config.ownerDiscordUsername}\n` +
            `• **Pagina web: [catalahd.github.io/CataBot](${config.website})**\n` +
            `• **Servidor Oficial: [discord.gg/k75qvYM](${config.officialServerLink})**`;

        let nMembers = 0;
        client.guilds.cache.forEach(guild => {
            nMembers += guild.memberCount;
        });

        let stats = "• **Membres:** `" + nMembers + "`\n" +
            "• **Servers:** `" + client.guilds.cache.size + "`\n" +
            "• **Comandes:** `" + client.commands.size + "`";

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setAuthor(`CataBOT by Català HD`, 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png', 'https://github.com/CatalaHD/CataBot')
            .setDescription(description)
            .addField('❯ Informació:', info, true)
            .addField('❯ Estadistiques:', stats, true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};