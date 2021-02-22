const Discord = require("discord.js");
let conversions = require('../../Storage/conversions.json');
const {
    getRandomColor
} = require('../../lib/common.js');

module.exports = {
    name: 'exchange',
    description: 'Et permet canviar de moneda facilment',
    usage: '< quantitat > < monedaIn > < monedaOut >',
    type: 'entreteniment',
    aliases: ['canvi'],
    example: "10 EUR USD",
    cooldown: 5,
    async execute(message, args, server) {

        if (args.length < 3) {
            message.reply("falten paràmetres!");
            return message.channel.send(server.prefix + "help exchange");
        }

        if (isNaN(args[0])) {
            message.reply("la quantitat de diners ha de ser un numero!");
            return message.channel.send(server.prefix + "help exchange");
        }

        if (!conversions[args[1].toUpperCase()]) {
            message.reply("el primer tipus de moneda no existeix!");
            return message.channel.send(server.prefix + "help exchange");
        }

        if (!conversions[args[2].toUpperCase()]) {
            message.reply("el segon tipus de moneda no existeix!");
            return message.channel.send(server.prefix + "help exchange");
        }

        let canviAUSD = conversions[args[1].toUpperCase()];
        let canviDeUSD = conversions[args[2].toUpperCase()];
        let res = (parseFloat(args[0]) * canviAUSD / canviDeUSD).toFixed(3);

        const msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**CANVI**")
            .setDescription("Quants " + args[2].toUpperCase() + " són " + args[0] + " " + args[1].toUpperCase() + "?")
            .addField("❯ Resultat", res + " " + args[2].toUpperCase())
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);

    }
};