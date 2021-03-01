const Discord = require("discord.js");
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "entreteniment";

module.exports = {
    name: 'penis',
    description: 'Mostra la mida del teu penis',
    type: TYPE,
    cooldown: 0,
    aliases: ['pene'],
    execute(message, args) {

        let penis = Math.round(Math.random() * 9 + 1); // Clamped bewteen 1 : 10

        let mention = message.author;

        if (args[0]) {
            mention = message.mentions.users.first();
        }

        let penisString = "8";
        for (let i = 0; i < penis; i++) {
            penisString += "=";
        }
        penisString += 'D';

        let msg = new Discord.MessageEmbed()
            .setColor(getColorFromCommand(TYPE))
            .setTitle("**MIDA DEL TEU PENIS**")
            .addField(`❯ Mida del penis de ${mention.username}`, penisString, true)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);
    },
};