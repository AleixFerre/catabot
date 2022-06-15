const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { getColorFromCommand } = require('../../lib/common.js');
const { getUser, updateUser } = require('../../lib/database.js');

const TYPE = 'banc';

module.exports = {
	name: 'diaria',
	description: 'Recolleix la teva recompensa diaria!',
	type: TYPE,
	aliases: ['recompensa', 'daily'],
	async execute(message, _args, server) {
		let content = '';
		moment.locale('ca'); // Posem el contingut en català

		let recompensa = 500;
		const user = await getUser(message.author.id, message.guild.id);
		const level = user.level;
		let rank = Math.floor(level / 10) + 1;
		if (rank > 19) {
			rank = 19;
		}

		recompensa += Math.floor((recompensa * (rank - 1)) / 10);

		if (user.lastDaily != moment().format('L')) {
			user.lastDaily = moment().format('L');
			user.money += recompensa;
			content = `💰\`${recompensa} monedes\` han sigut afegides a la teva conta!
Gràcies per recollir la teva recompensa diaria!`;

			const xpMax = Math.floor(Math.random() * (recompensa - 1) + 1); // Numero aleatori entre 1 i recompensa

			message.channel.send(`${server.prefix}progresa ${xpMax} <@${message.author.id}>`);
		} else {
			content = `Ja has recollit la teva recompensa diaria!
Pots tornar-hi ${moment().endOf('day').fromNow()}`;
		}

		const msg = new MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle('💰 **DAILY** 💰')
			.setDescription(content)
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		await updateUser([message.author.id, message.guild.id], {
			lastDaily: user.lastDaily,
			money: user.money,
		});

		message.channel.send(msg);
	},
};
