const { updateServer } = require('../../lib/database.js');

const TYPE = 'mod';

module.exports = {
	name: 'canalalertes',
	description:
		"Adjudica el canal d'alertes al canal que s'executa la comanda\nEs pot desadjudicar el canal passant **treure** com a argument",
	type: TYPE,
	usage: '[ treure ]',
	aliases: ['setalert'],
	execute(message, args) {
		let paraula = 'adjudicat';
		let alertChannel = null;

		if (args[0] && args[0].toLowerCase() === 'treure') {
			alertChannel = null;
			paraula = `des${paraula}`;
		} else {
			alertChannel = message.channel.id;
		}

		updateServer(message.guild.id, {
			alertChannel: alertChannel,
		});

		message.reply(`has ${paraula} el canal <#${message.channel.id}> com a canal d'alertes del bot de forma correcta!`);
	},
};
