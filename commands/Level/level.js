const Discord = require("discord.js");
const { ranks } = require("../../Storage/ranks.json");

module.exports = {
    name: 'level',
    description: 'Et mostra el nivell que ets',
    type: 'level',
    aliases: ['xp', 'lvl'],
    execute(message, args, servers, userData) {

        let mention = {};
        let posicio = 1;

        if (message.mentions.users.first()) {
            mention = message.mentions.users.first();
        } else {
            mention = message.author;
        }

        if (mention.bot) {
            return message.reply("els Bots no tenen nivell... pobres Bots 😫");
        }

        let level = userData[message.guild.id + mention.id].level;
        let xp = userData[message.guild.id + mention.id].xp;

        message.guild.members.forEach(member => {
            if (userData[message.guild.id + member.id].level > level) {
                posicio++;
            } else if (userData[message.guild.id + member.id].level === level) {
                if (userData[message.guild.id + member.id].xp > xp) {
                    posicio++;
                }
            }
        });

        let progress = userData[message.guild.id + mention.id].xp / 10;
        if (progress > 100) {
            progress = 100;
        }

        // ▰▰▰▰▰▱▱▱▱▱▱▱
        let barra = "";
        let max = 10;

        for (let i = 0; i < (progress / 10); i++) {
            barra += "▰";
            max--;
        }

        while (max > 0) {
            barra += "▱";
            max--;
        }


        // Calculem el rank de l'usuari
        let rankIndex = Math.floor(level / 10) + 1;
        if (rankIndex > 19) { // Maxim rank -> 19
            rankIndex = 19;
        }

        let rankLink = "https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/rank_icons/" + rankIndex + ".png";


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
            .setTitle("💠 Nivell 💠")
            .setThumbnail(rankLink)
            .addField('❯ Conta', mention.username, true)
            .addField('❯ Nivell', level, true)
            .addField('❯ XP', xp + "/1000", true)
            .addField('❯ Top', posicio, true)
            .addField('❯ Rang', `${ranks[rankIndex - 1]} _[${rankIndex}/19]_`, true)
            .addField('❯ Barra', barra + " *[" + progress + "%]*", false)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(msg);
    },
};