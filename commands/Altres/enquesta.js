const { MessageEmbed } = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'altres';

module.exports = {
	name: 'enquesta',
	description: 'Genera una enquesta.',
	type: TYPE,
	aliases: ['vote', 'poll'],
	async execute(message, args) {
		// If there's no title, send the error to the user
		if (!args[0]) {
			return message.channel.send('**❌ Error: Has de posar un títol a la enquesta!**');
		}

		// Create the embed message
		const embed = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle(args.join(' '))
			.setFooter(`Enquesta inciada per ${message.author.tag}`);

		// Await to send the message
		const msg = await message.channel.send(embed);

		// Add all the reactions in whichever order
		Promise.all([msg.react('👍'), msg.react('👎')]);

		message.delete();
	},
};
