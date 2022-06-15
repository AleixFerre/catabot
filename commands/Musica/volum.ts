const TYPE = 'musica';

const { set_volume, getServerQueue } = require('../../lib/musicModule.js');

module.exports = {
	name: 'volum',
	description: 'Posa un nou volum de la reproducció. Et mostra el volum actual si no es passa cap paràmetre.',
	usage: '[ n / earrape ]',
	type: TYPE,
	aliases: ['volume', 'vol'],
	async execute(message, args) {
		const voice_channel = message.member.voice.channel;
		if (!voice_channel) {
			return message.channel.send('**❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!**');
		}

		const permissions = voice_channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('**❌ Error: No tens els permissos correctes!**');
		} else if (!permissions.has('SPEAK')) {
			return message.channel.send('**❌ Error: No tens els permissos correctes!**');
		}

		const server_queue = getServerQueue(message.guild.id);

		if (server_queue && server_queue.voice_channel) {
			// Has d'estar al mateix canal del bot
			if (server_queue.voice_channel !== voice_channel) {
				return message.channel.send("**❌ Error: Has d'estar al mateix canal de veu que el bot!**");
			}
		}

		set_volume(message, server_queue, args[0]);
	},
};
