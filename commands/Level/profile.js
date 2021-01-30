const Discord = require("discord.js");
const { ranks } = require("../../Storage/ranks.json");

module.exports = {
    name: 'profile',
    description: 'Mostra el teu perfil',
    type: 'level',
    aliases: ['perfil'],
    execute(message, _args, _servers, userData) {

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

        message.guild.members.cache.forEach(member => {
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

        let barra = "";
        let max = 10;

        // ⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        for (let i = 0; i < (progress / 10); i++) {
            barra += "🟦";
            max--;
        }

        while (max > 0) {
            barra += "⬜";
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

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("💠 Perfil 💠")
            .setThumbnail(rankLink)
            .addField('❯ Compte', mention.username, true)
            .addField('❯ Nivell', level, true)
            .addField('❯ XP', xp + "/1000", true)
            .addField('❯ Top XP', posicio, true)
            .addField('❯ Rang', `${ranks[rankIndex - 1]} _[${rankIndex}/19]_`, true)
            .addField('❯ BarraXP', barra + " *[" + progress + "%]*", false)
            .addField('❯ Diners', money, true)
            .addField('❯ Top Diners', posicioMoney, true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);

    },
};