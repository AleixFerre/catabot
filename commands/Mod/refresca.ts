const TYPE = 'mod';

module.exports = {
	name: 'refresca',
	description: "Refresca el contador de membres manualment. Aquest contador s'actualitza automàticament cada 12h.",
	type: TYPE,
	aliases: ['refreshcounter', 'refrescacontador', 'refresh'],
	execute(message, _args, server) {
		const id = server.counterChannel;

		if (!id) {
			message.reply('No tinc cap canal de contador adjudicat!');
			return message.channel.send(`${server.prefix}help refresh`);
		}

		message.guild.channels.resolve(id).setName(`${message.guild.memberCount} membres`);

		message.reply("s'ha actualitzat el contador correctament!");
	},
};
