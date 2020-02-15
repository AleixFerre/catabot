const Discord = require("discord.js");

module.exports = {
	name: 'money',
	description: 'Et mostra els diners que tens',
    usage: '[ @user ]',
    aliases: ['profile', 'diners'],
	type: 'banc',
	execute(message, args, servers, userData) {

        let mention = {};
    
        if (message.mentions.users.first()) {
            mention = message.mentions.users.first();
        } else {
            mention = message.author;
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
        .setTitle("💰 Banc 💰")
        .setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')
        .setThumbnail(mention.avatarURL)
        .addField('Conta', mention.username, true)
        .addField('Balanç', userData[message.guild.id + mention.id].money, true)
        .setTimestamp().setFooter("Catabot 2020 © All rights reserved");

        message.channel.send(msg);
	},
};