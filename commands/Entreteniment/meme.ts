const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
	name: 'meme',
	description: 'Mostra un meme aleatori de reddit traduit al català',
	type: TYPE,
	execute(message) {
		fetch('https://meme-api.herokuapp.com/gimme')
			.then((res) => res.json())
			.then(async (data) => {
				let title;
				await translate(data.title, {
					to: 'ca',
				}).then((res) => {
					title = res.text;
				});

				const memeEmbed = new MessageEmbed()
					.setColor(getColorFromCommand(TYPE))
					.setURL(data.postLink)
					.setTitle(data.subreddit.toUpperCase())
					.setDescription(title)
					.setImage(data.url)
					.setTimestamp()
					.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

				message.channel.send(memeEmbed);
			});
	},
};
