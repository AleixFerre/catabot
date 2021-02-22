const Discord = require("discord.js");
const { getRandomColor } = require('../../lib/common.js');
const { getUsersFromServer } = require("../../lib/database.js");

module.exports = {
    name: 'server',
    type: 'altres',
    cooldown: 1,
    description: 'Diu la informació del servidor.',
    aliases: ['serverinfo', 'guild'],
    async execute(message, _args, server) {

        let mesRicNom = "";
        let mesRicDiners = -1;
        let totalMoney = 0;
        let mesNivellNom = "";
        let mesNivellLevel = -1;
        let mesNivellXP = -1;

        let canalAvisos = `<#${server.alertChannel}>`;
        if (!server.alertChannel) {
            canalAvisos = "*No adjudicat*";
        }

        let canalBot = `<#${server.botChannel}>`;
        if (!server.botChannel) {
            canalBot = "*No adjudicat*";
        }

        let canalBenvinguda = `<#${server.welcomeChannel}>`;
        if (!server.welcomeChannel) {
            canalBenvinguda = "*No adjudicat*";
        }

        let canalCounter = `<#${server.counterChannel}>`;
        if (!server.counterChannel) {
            canalCounter = "*No adjudicat*";
        }

        let userData = await getUsersFromServer(message.guild.id);

        userData.forEach(member => {

            let id = member.IDs.userID;
            
            if (member.money > mesRicDiners) {
                mesRicDiners = member.money;
                mesRicNom = message.guild.members.resolve(id).user.username;
            }

            if (member.level > mesNivellLevel) {
                mesNivellLevel = member.level;
                mesNivellXP = member.xp;
                mesNivellNom = message.guild.members.resolve(id).user.username;
            } else if (member.level === mesNivellLevel) {
                if (member.xp > mesNivellXP) {
                    mesNivellLevel = member.level;
                    mesNivellXP = member.xp;
                    mesNivellNom = message.guild.members.resolve(id).user.username;
                }
            }

            totalMoney += member.money;

        });

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .addField('❯ Propietari', message.guild.owner.user.username, true)
            .addField('❯ Num Membres', message.guild.memberCount, true)
            .addField('❯ Diners totals', totalMoney, true)
            .addField('❯ El mes ric', mesRicNom || "*Ningu*", true)
            .addField('❯ Diners del mes ric', mesRicDiners, true)
            .addField('❯ Amb mes nivell', mesNivellNom || "*Ningu*", true)
            .addField('❯ Màxim Nivell', mesNivellLevel, true)
            .addField('❯ Màxima XP', mesNivellXP, true)
            .addField('❯ Canal d\'avisos', canalAvisos, true)
            .addField('❯ Canal del bot', canalBot, true)
            .addField('❯ Canal de benvinguda', canalBenvinguda, true)
            .addField('❯ Canal comptador', canalCounter, true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};