const { getUsersFromServer, updateUser } = require('../../lib/database.js');

const TYPE = 'privat';

module.exports = {
	name: 'aleatoritzar',
	description: 'Posa un valor aleatori de monedes a tots els usuaris del servidor. Comanda privada.',
	usage: '[ maxim ]',
	aliases: ['randomize'],
	type: TYPE,
	async execute(message, args, server) {
		if (message.author.id != process.env.IdOwner) {
			message.reply('aquesta comanda només pot ser executada per administradors del bot!');
			return message.channel.send(`${server.prefix}help aleatoritzar`);
		}

		let max = 1000;
		if (args[0]) {
			if (!isNaN(args[0])) {
				max = Math.abs(args[0]);
			} else {
				message.reply('posa un numero!');
				return;
			}
		}

		const serverUsers = await getUsersFromServer(message.guild.id);
		serverUsers.forEach((user) => {
			updateUser([user.IDs.userID, message.guild.id], {
				money: Math.floor(Math.random() * max),
			});
		});

		message.channel.send(`🔀 Monedes randomitzades correctament amb un valor maxim de ${max}! ✅`);
	},
};
