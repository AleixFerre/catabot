const Discord = require("discord.js");
const { getRandomColor } = require('../../common.js');

module.exports = {
    name: 'test',
    description: 'Comanda de prova',
    type: 'altres',
    cooldown: 1,
    execute(message) {
        
        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setAuthor("CataBOT", "https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/gif_frames/icon_new.gif", "https://github.com/CatalaHD/CataBot")
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .addField('❯ Test', "testing...", true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);

    }
};