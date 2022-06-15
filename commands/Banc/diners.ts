const { MessageEmbed } = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');
const { getUsersFromServer } = require('../../lib/database.js');

const TYPE = 'banc';

module.exports = {
	name: 'diners',
	description: 'Et mostra els diners que tens',
	usage: '[ @usuari ]',
	aliases: ['money', 'monedes'],
	type: TYPE,
	async execute(message) {
		let mention = {};
		let posicio = 1;

		if (message.mentions.users.first()) {
			mention = message.mentions.users.first();
		} else {
			mention = message.author;
		}

		if (mention.bot) {
			return message.reply('els Bots no tenen diners... pobres Bots 😫');
		}

		const users = await getUsersFromServer(message.guild.id);
		const money = users.find((user) => user.IDs.userID === mention.id).money;

		users.forEach((member) => {
			if (member.money > money) {
				posicio++;
			}
		});

		const msg = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle(`💰 MONEDES DE ${mention.username} 💰`)
			.setThumbnail(mention.avatarURL)
			.addField('❯ Diners', `$${money}`, true)
			.addField('❯ Posició a la classificació', posicio, true)
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		message.channel.send(msg);
	},
};
