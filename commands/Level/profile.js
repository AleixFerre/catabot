const Discord = require("discord.js");

module.exports = {
    name: 'profile',
    description: 'Mostra el teu perfil',
    type: 'level',
    aliases: ['perfil'],
    execute(message, args, servers, userData) {

        let mention = {};
        let posicio = 1;
        let posicioMoney = 1;

        if (message.mentions.users.first()) {
            mention = message.mentions.users.first();
        } else {
            mention = message.author;
        }

        if (mention.bot) {
            return message.reply("els Bots no tenen perfil... pobres Bots 😫");
        }

        let level = userData[message.guild.id + mention.id].level;
        let xp = userData[message.guild.id + mention.id].xp;
        let money = userData[message.guild.id + mention.id].money;

        message.guild.members.forEach(member => {
            if (userData[message.guild.id + member.id].level > level) {
                posicio++;
            } else if (userData[message.guild.id + member.id].level === level) {
                if (userData[message.guild.id + member.id].xp > xp) {
                    posicio++;
                }
            }
            if (userData[message.guild.id + member.id].money > money) {
                posicioMoney++;
            }
        });


        let progress = userData[message.guild.id + mention.id].xp / 10;
        if (progress > 100) {
            progress = 100;
        }

        let barra = "[";
        let max = 10;

        for (let i = 0; i < (progress / 10); i++) {
            barra += "x";
            max--;
        }

        while (max > 0) {
            barra += "-";
            max--;
        }

        barra += "]";

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
            .setTitle("💠 Perfil 💠")
            .setThumbnail(mention.avatarURL)
            .addField('Conta', mention.username, true)
            .addField('Nivell', level, true)
            .addField('XP', xp, true)
            .addField('RankXP', posicio, true)
            .addField('ProgressXP', progress + "%", true)
            .addField('BarraXP', barra, false)
            .addField('Diners', money, true)
            .addField('Rank Diners', posicioMoney, true)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(msg);

    },
};