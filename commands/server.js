const Discord = require("discord.js");

module.exports = {
	name: 'server',
	description: 'Diu la informació del servidor.',
    aliases: ['serverinfo'],
	execute(message) {

        let msg = new Discord.RichEmbed()
        .setColor('0xFF0000')
        .setTitle(message.guild.name)
        .setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')
        .setThumbnail(message.guild.iconURL)
        .addField('Propietari', message.guild.owner.user.username, true)
        .addField('Num Membres', message.guild.memberCount, true)
        .setTimestamp();

		message.channel.send(msg);
	},
};