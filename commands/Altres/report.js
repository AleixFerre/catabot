const Discord = require("discord.js");
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "altres";

module.exports = {
    name: 'report',
    description: 'Avisa al propietari del servidor d\'algun usuari amb mal comportament.',
    type: TYPE,
    cooldown: 10,
    usage: '< @userToReport >',
    async execute(message, _args, server) {

        let reported = message.mentions.members.first();

        if (!reported) {
            message.reply("has de mencionar a qui vols reportar!");
            return message.channel.send(server.prefix + "help report");
        }

        if (reported.user.id == message.author.id) {
            return message.reply("no et pots reportar a tu mateix!");
        }

        if (reported.user.bot) {
            return message.reply("no pots reportar a un bot!");
        }

        message.reply("has rebut tota la info necessaria per DM");

        message.author.send("**------------- REPORT a " + reported.user.username + " -------------**\n" +
            "Omple els camps per enviar l'informe.");
        let assumpte = "";
        let cos = "";

        let msg = await message.author.send("**1.- ASSUMPTE DEL REPORT** _Posa la paraula `\"Cancel\"` per cancel·lar la operació_");
        // Esperem resposta
        const filter = _m => true;
        await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 600000,
            errors: ['time']
        }).then(collected => {
            assumpte = collected.first().content;
        }).catch(error => {
            console.error(error);
            return message.author.send("S'ha acabat el temps! La pròxima vegada vés més ràpid!");
        });

        if (assumpte === "Cancel") {
            return message.author.send("Operació cancel·lada correctament");
        }

        await message.author.send("**2.- COS DEL REPORT** _Posa la paraula `\"Cancel\"` per cancel·lar la operació_");
        // Esperem resposta
        await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 600000,
            errors: ['time']
        }).then(collected => {
            cos = collected.first().content;
        }).catch(error => {
            console.error(error);
            return message.author.send("S'ha acabat el temps! La pròxima vegada vés més ràpid!");
        });

        if (cos === "Cancel") {
            return message.author.send("Operació cancel·lada correctament");
        }

        // Enviem el missatge a l'owner del servidor
        let embed = new Discord.MessageEmbed()
            .setColor(getColorFromCommand(TYPE))
            .setTitle("**REPORT**")
            .addField('❯ Reportant', message.author.tag, true)
            .addField('❯ Reportat', reported.user.tag, true)
            .addField('❯ Servidor', message.guild.name, true)
            .addField('❯ Assumpte', assumpte, false)
            .addField('❯ Cos', cos, false)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        await message.guild.owner.send(embed);
        await message.author.send(embed);

        // Confirmem l'enviament
        await message.author.send(`Gràcies per informar.\nAquí tens un confirmant del report.\nHem avisat al propietari del servidor. Estarem atents de \`${reported.user.username}\``);

    },
};