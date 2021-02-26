const Discord = require("discord.js");
const {
    getRandomColor
} = require('../../lib/common.js');

module.exports = {
    name: 'dice',
    description: 'Tira els daus que vulguis com vulguis',
    usage: '[ size ] [ amount ]',
    aliases: ['roll'],
    cooldown: 0,
    type: 'entreteniment',
    execute(message, args) {

        let size = 6;
        let num = 1;

        if (args[0]) {
            if (!isNaN(args[0]))
                size = args[0];
            else
                return message.reply("has de posar un numero!");
        }
        if (args[1]) {
            if (!isNaN(args[1]))
                num = args[1];
            else
                return message.reply("has de posar un numero!");
        }

        if (size < 0) {
            return message.reply("la mida del dau ha de ser positiva!");
        }

        if (num < 1) {
            return message.reply("el numero de tirades ha de ser major que 1!");
        } else if (num > 25) {
            return message.reply("el numero de tirades no pot ser major que 25!");
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**TIRA ELS DAUS**")
            .setThumbnail('https://i.imgur.com/h2c4xWd.png')
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        for (let i = 0; i < num; i++) {
            msg.addField("❯ Resultat " + (i + 1), Math.round(Math.random() * (size - 1)) + 1, true); // Result 1:size
        }

        message.channel.send(msg);
    },
};