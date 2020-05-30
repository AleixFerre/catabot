const Discord = require("discord.js");

module.exports = {
    name: 'howgay',
    description: 'Et diu lo gay que ets',
    type: 'entreteniment',
    aliases: ['gay'],
    execute(message, args) {

        let gay = Math.round(Math.random() * 99 + 1); // Clamped bewteen 1% : 100%

        let mention = message.author;

        if (args[0]) {
            mention = message.mentions.users.first();
        }

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let msg = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("**QUANT GAY ETS?**")
            .setThumbnail('https://i.imgur.com/jr5elyc.png')
            .addField('❯ Resultat', `${mention.username}, ets ` + gay + '% gay!', true)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(msg);
    },
};