const Discord = require("discord.js");

module.exports = {
    name: 'server',
    type: 'altres',
	description: 'Diu la informació del servidor.',
    aliases: ['serverinfo', 'guild'],
	execute(message, args, servers, userData) {

        let mesRicNom = "";
        let mesRicDiners = 0;
        let totalMoney = 0;

        message.guild.members.forEach(member => {
            
            if (!userData[message.guild.id + member.id] || member.user.bot) {
                return;
            }

            if (userData[message.guild.id + member.id].money > mesRicDiners) {
                mesRicDiners = userData[message.guild.id + member.id].money;
                mesRicNom = member.user.username;
            }
            
            totalMoney += userData[message.guild.id + member.id].money;

        });


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
        .setTitle(message.guild.name)
        .setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')
        .setThumbnail(message.guild.iconURL)
        .addField('Propietari', message.guild.owner.user.username, true)
        .addField('Num Membres', message.guild.memberCount, true)
        .addField('Diners totals', totalMoney, false)
        .addField('El mes ric', mesRicNom, true)
        .addField('Diners del mes ric', mesRicDiners, true)
        .setTimestamp().setFooter("Catabot 2020 © All rights reserved");

		message.channel.send(msg);
	},
};