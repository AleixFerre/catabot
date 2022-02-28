const { MessageEmbed } = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
	name: 'escolleix',
	description: 'Deix que el bot escolleixi per tu.\n**SI QUE ES PERMETEN ESPAIS** mentre es repectin les comes',
	type: TYPE,
	aliases: ['choice', 'escull'],
	usage: '< opció1, opció2, ...>',
	execute(message, args, server) {
		if (!args[0]) {
			message.reply('no se que escollir!');
			return message.channel.send(server.prefix + 'help choice');
		}

		const choices = args.join(' ').split(', ');
		const choice = choices[Math.floor(Math.random() * choices.length)];

		const msg = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle('**ESCOLLEIX**')
			.addField('❯ He escollit...', choice, true)
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		message.channel.send(msg);
	},
};
