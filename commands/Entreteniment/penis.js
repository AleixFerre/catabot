const Discord = require("discord.js");

module.exports = {
    name: 'penis',
    description: 'Mostra la mida del teu penis',
    type: 'entreteniment',
    aliases: ['pene'],
    execute(message, args) {

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

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
            .setColor(getRandomColor())
            .setTitle("**MIDA DEL TEU PENIS**")
            .addField(`❯ Mida del penis de ${mention.username}`, penisString, true)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(msg);
    },
};