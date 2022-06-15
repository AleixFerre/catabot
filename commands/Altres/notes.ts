const { MessageEmbed } = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');
const changelog = require('../../storage/CHANGELOG.json');

const TYPE = 'altres';

module.exports = {
	name: 'notes',
	description:
		"Mostra les notes d'una actualització del bot escollida. Si no es posa cap paràmetre s'escolleix la actual",
	usage: '[ versió: x.x ]',
	type: TYPE,
	example: '1.3',
	aliases: ['lastupdate', 'changes', 'changelog', 'canvis'],
	async execute(message, args, server) {
		const prefix = server.prefix;

		let versio = process.env.version;

		if (args[0]) {
			if (args[0].match(/\d{1,2}\.\d{1,2}/g)) {
				versio = args[0];
			} else {
				message.reply('la versió té un format incorrecte!');
				return message.channel.send(`${prefix}help notes`);
			}
		}

		const changes = changelog[versio];
		if (!changes) {
			let keys = Object.keys(changelog);
			keys = keys.map((i) => `\`${i}\``);
			return message.reply(
				`no existeix aquesta versió!
Pots escollir entre les versions disponibles: ${keys.join(', ')}`,
			);
		}

		versio = changes.nom;
		const dades = changes.dades;

		const embed = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle(`**NOTES DEL CATABOT ${versio}**`)
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		for (const nota of dades) {
			let cos = nota.secondary;
			const main = `❯ ${nota.main.replace(/ÇÇ/gi, prefix)}`;
			if (cos.length === 0) {
				embed.addField(main, '_No hi ha més informació._', false);
			} else {
				cos = cos.map((i) => `• ${i.replace(/ÇÇ/gi, prefix)}`);
				embed.addField(main, cos.join('\n'), false);
			}
		}

		await message.channel.send(embed);

		if (message.author.bot) message.delete();
	},
};
