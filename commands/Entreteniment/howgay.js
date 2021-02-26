const Discord = require("discord.js");
const {
    getRandomColor
} = require('../../lib/common.js');

module.exports = {
    name: 'howgay',
    description: 'Et diu lo gay que ets',
    type: 'entreteniment',
    cooldown: 0,
    aliases: ['gay'],
    execute(message, args) {

        let gay = Math.round(Math.random() * 99 + 1); // Clamped bewteen 1% : 100%

        let mention = message.author;

        if (args[0]) {
            mention = message.mentions.users.first();
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**QUANT GAY ETS?**")
            .setThumbnail('https://i.imgur.com/jr5elyc.png')
            .addField('❯ Resultat', `${mention.username}, ets ` + gay + '% gay!', true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};