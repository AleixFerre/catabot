const Discord = require("discord.js");
const {
    ranks
} = require("../../storage/ranks.json");
const {
    getRandomColor
} = require('../../lib/common.js');
const {
    getUsersFromServer
} = require('../../lib/database.js');

module.exports = {
    name: 'profile',
    description: 'Mostra el teu perfil',
    type: 'level',
    aliases: ['perfil'],
    cooldown: 0,
    async execute(message) {

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

        let usersData = await getUsersFromServer(message.guild.id);

        let userData = usersData.find((user) => user.IDs.userID === mention.id);
        let level = userData.level;
        let xp = userData.xp;
        let money = userData.money;

        usersData.forEach(member => {
            if (member.level > level) {
                posicio++;
            } else if (member.level === level) {
                if (member.xp > xp) {
                    posicio++;
                }
            }
            if (member.money > money) {
                posicioMoney++;
            }
        });


        let progress = xp / 10;
        if (progress > 100) {
            progress = 100;
        }

        let barra = "";
        let max = 10;

        // ▰▰▰▰▰▱▱▱▱▱▱▱
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

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("💠 Perfil 💠")
            .setThumbnail(rankLink)
            .addField('❯ Compte', mention.username, true)
            .addField('❯ Nivell', level, true)
            .addField('❯ XP', xp + "/1000", true)
            .addField('❯ Top XP', posicio || -1, true)
            .addField('❯ Rang', `${ranks[rankIndex - 1]} _[${rankIndex}/19]_`, true)
            .addField('❯ BarraXP', barra + " *[" + progress + "%]*", false)
            .addField('❯ Diners', money, true)
            .addField('❯ Top Diners', posicioMoney, true)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);

    },
};