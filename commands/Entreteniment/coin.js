const Discord = require("discord.js");
const { getRandomColor } = require('../../lib/common.js');

module.exports = {
    name: 'coin',
    description: 'Te la jugues al 50%',
    type: 'entreteniment',
    cooldown: 1,
    aliases: ['cflip', 'caraocreu'],
    execute(message) {

        let coin = Math.round(Math.random()); // We round between 0-1 so we have randomly true or false
        coin = coin === 1;
        let img = "";
        let result = "";

        if (coin) {
            img = 'Cara_';
            result = 'Cara';
        } else {
            img = 'Creu';
            result = img;
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**CARA O CREU**")
            .setThumbnail('http://bit.ly/CataBot_' + img)
            .addField('❯ Resultat', result, true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};