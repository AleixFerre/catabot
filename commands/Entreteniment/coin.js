const Discord = require("discord.js");
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "entreteniment";

module.exports = {
    name: 'coin',
    description: 'Te la jugues al 50%',
    type: TYPE,
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
            .setColor(getColorFromCommand(TYPE))
            .setTitle("**CARA O CREU**")
            .setThumbnail('http://bit.ly/CataBot_' + img)
            .addField('❯ Resultat', result, true)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);
    },
};