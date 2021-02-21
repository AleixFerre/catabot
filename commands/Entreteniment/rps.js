const Discord = require("discord.js");
const { getRandomColor } = require('../../lib/common.js');

module.exports = {
    name: 'rps',
    description: 'Juga a pedra-paper-tissora amb el bot',
    type: 'entreteniment',
    cooldown: 1,
    usage: '< rock/paper/scissors >',
    execute(message, args, servers) {

        let server = servers[message.guild.id];

        let player = "rock";
        if (!args[0]) {
            message.reply("no se què jugar!");
            return message.channel.send(server.prefix + "help rps");
        } else {
            player = args[0].toLowerCase();
            if (player != 'rock' && player != 'paper' && player != 'scissors') {
                message.reply("has posat una opció que no es vàlida!");
                return message.channel.send(server.prefix + "help rps");
            }
        }

        const logic = { // Reference: https://rosettacode.org/wiki/Rock-paper-scissors#JavaScript
            rock: { w: 'scissors', l: 'paper' },
            paper: { w: 'rock', l: 'scissors' },
            scissors: { w: 'paper', l: 'rock' }
        };

        let choices = Object.keys(logic);
        let IA = choices[Math.floor(Math.random() * choices.length)];
        let guanyador = "";

        if (player === IA) {
            // si hi ha empat
            guanyador = "Empat";
        } else {
            // Si no hi ha empat, comprova el guanyador
            // Retorna true si guanya el player
            guanyador = logic[player].w === IA;
            if (guanyador) {
                guanyador = "Player";
            } else {
                guanyador = "IA";
            }
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**PEDRA PAPER TISORA**")
            .setThumbnail('https://bit.ly/CataBot_RawIcon')
            .addField('❯ Player', player, true)
            .addField('❯ IA', IA, true)
            .addField('❯ Resultat', guanyador)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};