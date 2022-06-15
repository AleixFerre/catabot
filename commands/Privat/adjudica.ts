const { updateUser } = require('../../lib/database.js');

const TYPE = 'privat';

module.exports = {
	name: 'adjudica',
	description: 'Adjudica una quantitat a una persona. Comanda privada.',
	type: TYPE,
	aliases: ['setmoney', 'adjudicadiners'],
	usage: '< quantitat > < @usuari >',
	execute(message, args, server) {
		// ************* Precondicions *************

		if (message.author.id != process.env.IdOwner) {
			message.reply('aquesta comanda només pot ser executada per administradors del bot!');
			return message.channel.send(`${server.prefix}help adjudica`);
		}

		// Si no hi ha diners
		if (!args[0]) {
			message.reply('no has posat els diners!');
			return message.channel.send(`${server.prefix}help adjudica`);
		} else if (isNaN(args[0])) {
			// Si els diners no es un numero
			message.reply('els diners han de ser un numero!');
			return message.channel.send(`${server.prefix}help adjudica`);
		} else if (args[0] < 0) {
			// si el numero de diners es negatiu
			message.reply('els diners han de ser positius!');
			return message.channel.send(`${server.prefix}help adjudica`);
		}

		// si no hi ha usuari mencionat
		if (!args[1]) {
			message.reply("no has posat l'usuari a pagar!");
			return message.channel.send(`${server.prefix}help adjudica`);
		} else if (!message.mentions.members.first()) {
			message.reply("no has posat l'usuari a pagar!");
			return message.channel.send(`${server.prefix}help adjudica`);
		}

		const amount = parseInt(args[0]);
		const otherUser = message.mentions.users.first();

		if (otherUser.bot) {
			// si el mencionat es un bot
			return message.reply('no pots pagar a un bot!');
		}

		if (!message.guild.member(otherUser.id)) {
			// si el mencionat no esta al servidor
			return message.reply("l'usuari mencionat no es troba al servidor!");
		}

		// ************* Transacció *************

		// Adjudicar diners a otherUser
		updateUser([otherUser.id, message.guild.id], {
			money: amount,
		});

		message.reply(`has adjudicat ${amount} monedes a ${otherUser.username} correctament! 💸`);
	},
};
