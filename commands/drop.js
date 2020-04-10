const Discord = require("discord.js");

module.exports = {
	name: 'drop',
	description: 'Et toca un drop de la beta de Valorant',
	type: 'entreteniment',
	execute(message) {
        const attachment = new Discord.Attachment("https://i.imgur.com/xR1Pz8r.png");
        message.reply(`Riot Games te ha concedido acceso a la beta de Valorant`, attachment);
	},
};