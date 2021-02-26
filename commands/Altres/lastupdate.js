const Discord = require('discord.js');
const {
    getRandomColor,
} = require("../../lib/common.js");
const changelog = require('../../storage/CHANGELOG.json');

module.exports = {
    name: 'lastupdate',
    description: 'Mostra les notes d\'una actualització del bot escollida. Si no es posa cap paràmetre s\'escolleix la actual',
    usage: '[ versió: x.x ]',
    type: 'altres',
    cooldown: 0,
    example: '1.3',
    aliases: ['parche', 'notes', 'changes', 'changelog', 'canvis'],
    async execute(message, args, server) {

        const prefix = server.prefix;

        let versio = process.env.version;

        if (args[0]) {
            if (args[0].match(/\d{1,2}\.\d{1,2}/g)) {
                versio = args[0];
            } else {
                message.reply("la versió té un format incorrecte!");
                return message.channel.send(prefix + "help lastupdate");
            }
        }
        
        changes = changelog[versio];
        if (!changes) {
            let keys = Object.keys(changelog);
            keys = keys.map((i) => "`" + i + "`");
            return message.reply("no existeix aquesta versió!\nPots escollir entre les versions disponibles: " + keys.join(", "));
        }

        versio = changes.nom;
        const dades = changes.dades;

        const embed = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**NOTES DEL CATABOT " + versio + "**")
            .setTimestamp().setFooter('CataBOT ' + new Date().getFullYear() + ' © All rights reserved');

        for (let nota of dades) {
            let cos = nota.secondary;
            nota.main = "❯ " + nota.main.replace(/ÇÇ/ig, prefix);
            if (cos.length === 0) {
                embed.addField(nota.main, "_No hi ha més informació._", false);
            } else {
                cos = cos.map((i) => "• " + i.replace(/ÇÇ/ig, prefix));
                embed.addField(nota.main, cos.join("\n"), false);
            }
        }

        await message.channel.send(embed);

        if (message.author.bot)
            message.delete();
    }
};