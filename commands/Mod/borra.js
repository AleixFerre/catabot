const TYPE = 'mod';

module.exports = {
	name: 'borra',
	description: "Borra n missatges del canal de text on s'estigui executant la comanda",
	type: TYPE,
	usage: "< quantitat (inclos l'enviat) >",
	aliases: ['cls', 'clm', 'clearmessages'],
	async execute(message, args, server) {
		let amount = 1;

		if (!args[0]) {
			message.reply('no se quants missatges he de borrar!');
			return message.channel.send(server.prefix + 'help esborra');
		}
		if (isNaN(args[0])) {
			return message.reply('has de posar un numero!');
		}

		amount = parseInt(args[0]);

		if (amount > 100) {
			return message.reply('no pots borrar més de 100 missatges alhora!');
		} else if (amount < 1) {
			return message.reply("no pots borrar menys d'1 missatge!");
		}

		await message.channel.messages
			.fetch({ limit: amount })
			.then((messages) => {
				message.channel.bulkDelete(messages, true);
			})
			.catch(console.error);
	},
};
