const { MessageEmbed } = require('discord.js');
const translate = require('@vitalets/google-translate-api');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';
const usage = "< codi de l'idioma a traduir > < text >";
const codis = Object.keys(translate.languages).filter(
	(val) => val !== 'auto' && val !== 'isSupported' && val !== 'getCode',
);
const codisString = codis.join(', ');

module.exports = {
	name: 'traductor',
	description: "Tradueix el que vulguis a l'idioma que vulguis!",
	usage: usage,
	type: TYPE,
	aliases: ['translate', 'traduir', 'tradueix'],
	async execute(message, args, server) {
		let txt = '';
		let traduit = '';
		let codi = 'ca';

		if (args[0]) {
			codi = args[0];
			if (!codis.find((val) => val === codi)) {
				return message.reply(`el codi d'idioma \`${codi}\` no és vàlid!
Prova amb un d'aquests: \`${codisString}\`
Recorda que el format és: \`${server.prefix}traduir ${usage}\``);
			}

			args.shift();
			txt = args.join(' ');
		} else {
			message.reply('no has posat el text a traduir!');
			return message.channel.send(server.prefix + 'help translate');
		}

		await translate(txt, {
			to: codi,
		}).then((res) => {
			traduit = res.text;
		});

		const msg = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle('**TRADUCTOR**')
			.setDescription(traduit)
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		message.channel.send(msg);
	},
};
