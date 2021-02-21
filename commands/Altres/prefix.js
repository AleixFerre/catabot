const Discord = require('discord.js');
const fs = require('fs');
const { getRandomColor } = require('../../lib/common.js');

module.exports = {
    name: 'prefix',
    description: 'Et mostra el prefix i et permet cambiar-lo amb un segon argument',
    type: "altres",
    cooldown: 10,
    usage: '[ new ]',
    async execute(message, args, servers) {

        let server = servers[message.guild.id];

        let prefixEmbed = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle('**PREFIX**')
            .setTimestamp().setFooter('CataBOT ' + new Date().getFullYear() + ' © All rights reserved');

        if (!args[0]) {
            prefixEmbed.setDescription("Pots canviar el prefix del CataBOT");
            prefixEmbed.addField("❯ Prefix actual", "`" + server.prefix + "`");
            prefixEmbed.addField("❯ Per cambiar el prefix", "`" + server.prefix + "prefix [ new ]`");
            prefixEmbed.addField("❯ Validació", "`Qualsevol string com a màxim 5 caràcters`");
            message.channel.send(prefixEmbed);
        } else {
            // Si hi ha un segon argument, intentem cambiar el prefix
            let server = servers[message.guild.id];
            let newPrefix = args[0];
            const roleNeeded = "ADMINISTRATOR";

            if (!message.member.hasPermission(roleNeeded)) {
                return message.reply("no tens permisos per executar aquesta comanda!\nEs necessita `" + roleNeeded + "`");
            }

            if (newPrefix.length > 5) {
                return message.reply("el prefix ha de tenir com a màxim 5 caràcters");
            }

            prefixEmbed.addField("❯ Prefix anterior", server.prefix, true);

            server.prefix = newPrefix;

            prefixEmbed.addField("❯ Prefix nou", server.prefix, true);
            prefixEmbed.setDescription("El prefix s'ha cambiat correctament!");

            servers[message.guild.id].prefix = newPrefix;
            fs.writeFile('./Storage/servers.json', JSON.stringify(servers), (err) => { if (err) console.error(err); });

            let newName = "[ " + server.prefix + " ] CataBOT";
            await message.guild.me.setNickname(newName);
            message.channel.send(prefixEmbed);
        }
    },
};