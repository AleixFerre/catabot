const { getUser, updateUser } = require('../../lib/database.js');

const TYPE = 'banc';

module.exports = {
	name: 'apostaramb',
	description: 'Aposta en un 50% de guanyar monedes amb un altre usuari',
	type: TYPE,
	aliases: ['bet'],
	usage: '< quantitat/tot > < @usuari >',
	async execute(message, args, server) {
		let moneyA = await getUser(message.author.id, message.guild.id);
		moneyA = moneyA.money;
		let moneyB = 0;
		let amount = 0;
		let content = '';
		let other = {};

		if (!args[0]) {
			message.reply('no se quant vols apostar!');
			return message.channel.send(server.prefix + 'help bet');
		}

		if (message.mentions.users.first()) {
			other = message.mentions.users.first();
			moneyB = await getUser(other.id, message.guild.id);
			moneyB = moneyB.money;
		} else {
			message.reply('no has mencionat la persona amb la que apostar!');
			return message.channel.send(server.prefix + 'help bet');
		}

		if (args[0] === 'tot') {
			amount = moneyA;
		} else if (isNaN(args[0])) {
			message.reply('has de posar un numero vàlid o tot');
			return message.channel.send(server.prefix + 'help bet');
		} else {
			amount = parseInt(args[0]);
		}

		if (amount % 1 !== 0) {
			message.reply('només pots apostar nombres enters!');
			return message.channel.send(server.prefix + 'help bet');
		}

		if (amount <= 0) {
			return message.reply('només pots apostar una quantitat superior a 0!');
		}

		if (other.bot) {
			return message.reply('no pots apostar contra un bot! Per això utilitza el ' + server.prefix + 'gamble');
		} else if (other.id === message.author.id) {
			return message.reply('no pots apostar contra tu mateix, burro!');
		}

		if (amount > moneyA) {
			return message.reply('no tens prous diners!!');
		} else if (amount > moneyB) {
			return message.reply('el contrincant no té prous diners!!');
		}

		// ******************* Aceptem la aposta *******************

		async function calculateWinnerSendMessage() {
			// Comprovem si guanya A o B

			const coin = Math.round(Math.random()); // We round between 0-1 so we have randomly true or false
			let winner,
				looser = '';
			let winnerID,
				looserID = '';

			if (coin === 1) {
				// Guanya A
				moneyA += parseInt(amount);
				moneyB -= parseInt(amount);

				winner = message.author.username;
				looser = other.username;

				winnerID = message.author.id;
				looserID = other.id;
			} else {
				// Guanya B
				moneyB += parseInt(amount);
				moneyA -= parseInt(amount);

				winner = other.username;
				looser = message.author.username;

				winnerID = message.author.id;
				looserID = other.id;
			}

			content = `${winner} has guanyat😆\n${looser} has perdut😫\n💰${amount} monedes pagades de ${looser} a ${winner} correctament.💰`;

			let xpMax = amount * 10;
			if (xpMax > 1000) {
				xpMax = 1000;
			}

			xpMax = Math.floor(Math.random() * (xpMax - 1) + 1); // Numero aleatori entre 1 i max

			await updateUser([message.author.id, message.guild.id], {
				money: moneyA,
			});

			await updateUser([other.id, message.guild.id], {
				money: moneyB,
			});

			message.channel.send(`${server.prefix}progresa ${xpMax * 2} <@${winnerID}>`);
			message.channel.send(`${server.prefix}progresa ${xpMax} <@${looserID}>`);
			message.channel.send('```' + content + '```');
		}

		message.channel
			.send(
				`\`\`\`${other.username} clica al ✅ per acceptar l'aposta o a la ❌ per cancel·lar!\n(15s per contestar...)\`\`\``,
			)
			.then(async (msg) => {
				await msg.react('✅');
				await msg.react('❌');

				const filter = (reaction, user) =>
					(reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === other.id;

				msg
					.awaitReactions(filter, {
						max: 1,
						time: 15000,
						errors: ['time'],
					})
					.then((collected) => {
						if (collected.length === 0) {
							message.reply('no has escollit res!!');
							msg.delete();
							return;
						}
						let id = -1;
						const reaction = collected.first();

						switch (reaction.emoji.name) {
							case '✅':
								id = 1;
								break;
							case '❌':
								id = -1;
								break;
							default:
								id = -1;
								break;
						}

						if (id === -1) {
							return msg.delete();
						}

						calculateWinnerSendMessage();
						msg.delete();
					})
					.catch(() => {
						message.channel.send(`<@${other.id}>, no has escollit res, cancel·lant la proposta...`);
						msg.delete();
						return;
					});
			});
	},
};
