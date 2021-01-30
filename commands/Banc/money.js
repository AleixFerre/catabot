const Discord = require("discord.js");

module.exports = {
    name: 'money',
    description: 'Et mostra els diners que tens',
    usage: '[ @user ]',
    aliases: ['diners'],
    type: 'banc',
    execute(message, args, servers, userData) {

        let mention = {};
        let posicio = 1;

        if (message.mentions.users.first()) {
            mention = message.mentions.users.first();
        } else {
            mention = message.author;
        }

        if (mention.bot) {
            return message.reply("els Bots no tenen diners... pobres Bots 😫");
        }

        let money = userData[message.guild.id + mention.id].money;

        message.guild.members.cache.forEach(member => {
            if (userData[message.guild.id + member.id].money > money) {
                posicio++;
            }
        });


        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("💰 Banc 💰")
            .setThumbnail(mention.avatarURL)
            .addField('❯ Compte', mention.username, true)
            .addField('❯ Diners', money, true)
            .addField('❯ Top', posicio, true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};