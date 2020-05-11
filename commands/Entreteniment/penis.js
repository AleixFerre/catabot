const Discord = require("discord.js");

module.exports = {
    name: 'penis',
    description: 'Mostra la mida del teu penis',
    type: 'entreteniment',
    aliases: ['pene'],
    execute(message) {

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let penis = Math.round(Math.random() * 9 + 1); // Clamped bewteen 1 : 10
        penisString = "8";
        for (let i = 0; i < penis; i++) {
            penisString += "=";
        }
        penisString += 'D';

        let msg = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("**PENIS LENGTH**")
            .setThumbnail('https://bit.ly/CataBot_RawIcon')
            .addField('❯ Mida del teu penis', penisString, true)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(msg);
    },
};