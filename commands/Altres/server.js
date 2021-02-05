const Discord = require("discord.js");
const { getRandomColor } = require('../../common.js');

module.exports = {
    name: 'server',
    type: 'altres',
    description: 'Diu la informació del servidor.',
    aliases: ['serverinfo', 'guild'],
    execute(message, _args, servers, userData) {

        let mesRicNom = "";
        let mesRicDiners = 0;
        let totalMoney = 0;
        let mesNivellNom = "";
        let mesNivellLevel = 0;
        let mesNivellXP = 0;

        let server = servers[message.guild.id];
        let canalAvisos = `<#${server.alertChannel}>`;
        if (!server.alertChannel) {
            canalAvisos = "No adjudicat";
        }

        let canalBot = `<#${server.botChannel}>`;
        if (!server.botChannel) {
            canalBot = "No adjudicat";
        }

        let canalBenvinguda = `<#${server.welcomeChannel}>`;
        if (!server.welcomeChannel) {
            canalBenvinguda = "No adjudicat";
        }

        message.guild.members.cache.forEach(member => {

            if (!userData[message.guild.id + member.id] || member.user.bot) {
                return;
            }

            if (userData[message.guild.id + member.id].money > mesRicDiners) {
                mesRicDiners = userData[message.guild.id + member.id].money;
                mesRicNom = member.user.username;
            }

            if (userData[message.guild.id + member.id].level > mesNivellLevel) {
                mesNivellLevel = userData[message.guild.id + member.id].level;
                mesNivellXP = userData[message.guild.id + member.id].xp;
                mesNivellNom = member.user.username;
            } else if (userData[message.guild.id + member.id].level === mesNivellLevel) {
                if (userData[message.guild.id + member.id].xp > mesNivellXP) {
                    mesNivellLevel = userData[message.guild.id + member.id].level;
                    mesNivellXP = userData[message.guild.id + member.id].xp;
                    mesNivellNom = member.user.username;
                }
            }

            totalMoney += userData[message.guild.id + member.id].money;

        });

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .addField('❯ Propietari', message.guild.owner.user.username, true)
            .addField('❯ Num Membres', message.guild.memberCount, true)
            .addField('❯ Diners totals', totalMoney, true)
            .addField('❯ El mes ric', mesRicNom, true)
            .addField('❯ Diners del mes ric', mesRicDiners, true)
            .addField('❯ Amb mes nivell', mesNivellNom, true)
            .addField('❯ Nivell del MAX', mesNivellLevel, true)
            .addField('❯ XP del MAX', mesNivellXP, true)
            .addField('❯ Canal d\'avisos', canalAvisos, true)
            .addField('❯ Canal del bot', canalBot, true)
            .addField('❯ Canal de benvinguda', canalBenvinguda, true)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};