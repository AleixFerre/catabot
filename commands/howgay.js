const Discord = require("discord.js");

module.exports = {
	name: 'howgay',
	description: 'Et diu lo gay que ets',
	type: 'entreteniment',
    aliases: ['gay'],
	execute(message) {

        let gay = Math.round(Math.random()*99+1); // Clamped bewteen 1% : 100%

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
        .setTitle("**HOW GAY ARE YOU?**")
        .setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')
        .setThumbnail('http://bit.ly/CataBot_Icon')
        .addField('Resultat', 'You are ' + gay + '% gay', true)
        .setTimestamp().setFooter("Catabot 2020 © All rights reserved");

        message.channel.send(msg);
	},
};