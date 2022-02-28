const { updateServer } = require('../../lib/database.js');

const TYPE = 'mod';

module.exports = {
	name: 'canalbenvinguda',
	description:
		"Adjudica el canal de benvinguda al canal que s'executa la comanda\nEs pot desadjudicar el canal passant **treure** com a argument",
	type: TYPE,
	usage: '[ treure ]',
	aliases: ['setwelcome'],
	execute(message, args) {
		let paraula = 'adjudicat';
		let welcomeChannel = null;

		if (args[0] && args[0].toLowerCase() === 'treure') {
			welcomeChannel = null;
			paraula = `des${paraula}`;
		} else {
			welcomeChannel = message.channel.id;
		}

		updateServer(message.guild.id, {
			welcomeChannel: welcomeChannel,
		});

		message.reply(
			`has ${paraula} el canal <#${message.channel.id}> com a canal de benvinguda del bot de forma correcta!`,
		);
	},
};
