const fs = require('fs');
const { log } = require('../lib/common.js');
const { getLastForceReset, resetLastForceReset } = require('../lib/database.js');
const { getServer } = require('../lib/database.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ready',
	async execute(_args, client) {
		if (process.env.SAVE_COMMANDS === 'true') {
			let nMembers = 0;
			client.guilds.cache.forEach((guild) => {
				nMembers += guild.memberCount;
			});

			const path = 'docs/Storage/info.json';
			fs.writeFile(
				path,
				JSON.stringify({ nMembers: nMembers, nServers: client.guilds.cache.size, nCommands: client.commands.size }),
				(err) => {
					if (err) console.error(err);
				},
			);
		}

		await initServers(client);

		client.user.setPresence({
			status: 'online',
			activity: {
				name: 'aleixferre.github.io/CataBot',
				type: 'WATCHING',
			},
		});

		checkForceRestart(client);

		console.debug(
			log(
				'---------------------------------\nREADY :: Version ' +
					process.env.version +
					'\nON ' +
					client.guilds.cache.size +
					' servers with ' +
					client.commands.size +
					' commands\n---------------------------------',
			),
		);
	},
};

async function initServers(client) {
	for (let guild of client.guilds.cache) {
		guild = guild[1];
		console.debug(log(`${guild.name}: ${guild.memberCount} membres`));

		const server = await getServer(guild.id);

		if (server.counterChannel) {
			// Existeix un canal de contador, afegim un setInterval cada 12h
			setInterval(
				(counterGuild, counterServer) => {
					counterGuild.channels.resolve(counterServer.counterChannel).setName(`${counterGuild.memberCount} membres`);
				},
				Math.random() * 12 * 3600000,
				guild,
				server,
			);
		}
	}
}

async function checkForceRestart(client) {
	const info = await getLastForceReset();
	if (!info) return;
	console.debug('Enviant el missatge del reset amb la info:', info);
	const channel = await client.channels.fetch(info.channelID).catch(() => {
		console.error("ERROR: No s'ha trobat el canal");
		return null;
	});
	if (channel) {
		await resetLastForceReset();

		const msg = new MessageEmbed()
			.setColor('#00ff00')
			.setTitle('El bot està llest!')
			.setDescription("Prova d'enviar una comanda per aquest canal de text!");

		channel.send(msg);
	}
}
