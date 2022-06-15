const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
	name: 'consell',
	description: 'Et diu un consell de la vida aleatori',
	usage: '[ search ]',
	type: TYPE,
	aliases: ['advice'],
	async execute(message, args) {
		let adviceLink = 'https://api.adviceslip.com/advice';
		const title = '**CONSELL #';
		let advice = '';
		let error = false;

		if (args[0]) {
			adviceLink += '/search/' + args[0];
		}

		async function getData() {
			await fetch(adviceLink)
				.then((res) => res.json())
				.then(async (data) => {
					if (data.message) {
						error = true;
						return message.reply(`no s'ha trobat el consell que continguin la paraula \`${args[0]}\`.`);
					} else if (data.slip) {
						advice = data.slip;
					} else {
						advice = data.slips[0];
					}
				});
		}

		await getData().catch((er) => {
			message.reply('Error: ' + er);
			error = true;
		});

		if (error) return;

		let translated = '';

		await translate(advice.advice, {
			to: 'ca',
		}).then((res) => {
			translated = res.text;
		});

		const msg = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle(title + advice.id + '**')
			.setDescription(translated)
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		message.channel.send(msg);
	},
};
