const { MessageEmbed } = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');
const TYPE = 'altres';

module.exports = {
	name: 'ping',
	description: 'Retorna el ping del servidor i de la API!',
	type: TYPE,
	aliases: ['status', 'estat', 'check'],
	execute(message) {
		const ping = Math.floor(message.client.ws.ping);

		const pingEmbed = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle('**❌ Oof alguna cosa ha anat malament!**')
			.addField('❯ 🛰️ Ping Discord WS', `${ping} ms`, true)
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		message.channel.send(pingEmbed);
	},
};
