const { getOwner } = require('../lib/common.js');
const { getServer, getUser } = require('../lib/database.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		let prefix = process.env.prefix;
		let server;
		if (message.guild) {
			server = await getServer(message.guild.id);
			prefix = server.prefix;
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const commandName = args.shift().toLowerCase();

		if (!message.content.startsWith(prefix)) return;

		if (!message.channel.members && commandName != 'help' && commandName != 'h') {
			// Estem a DM, només funciona el help
			message.author.send(
				"**⚠️ Als canals privats només funciona la comanda `catahelp`. Prova millor d'executar aquesta comanda a un servidor.**",
			);
			return;
		}

		// Si no soc jo, el bot
		if (message.author.id !== client.user.id) {
			// Només si el servidor té el canal de bot adjudicat i no soc jo,
			if (message.author.id !== process.env.IdOwner && server.botChannel && message.channel.id !== server.botChannel) {
				// Si el missatge està en un altre canal,
				message.author.send(`Prova d'enviar el missatge pel canal del bot: <#${server.botChannel}>`);
				return; // ignorar
			}
		}

		const command =
			client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		if (command.type === 'mod') {
			if (!message.member.hasPermission('ADMINISTRATOR')) {
				message.reply("no tens els permisos d'Administrador necessaris per executar aquesta comanda!");
				return;
			}
		}

		if (command.type === 'games' || command.type === 'banc' || command.type === 'level') {
			const perfil = await getUser(message.author.id, message.guild.id);
			if (!perfil) {
				return message.channel.send(
					`**️️️⚠️ Alerta: Encara no tens un Perfil, el pots crear amb la comanda** \`${server.prefix}crearPerfil\`
  Amb un **Perfil** tindràs accés a totes les comandes de tipus **Banc**, **Nivell** i **Jocs**.`,
				);
			}
		}

		console.debug(`--- Nova comanda ---
  Autor: ${message.author} - ${message.author.tag}
  Contingut: ${message.content}
  Servidor: ${message.guild}
  Canal: ${message.channel.name}`);

		try {
			command.execute(message, args, server, client, commandName);
		} catch (error) {
			const errorEmbed = new MessageEmbed()
				.setColor(0xff0000) // Red
				.setTitle('⚠️ Alguna cosa ha anat malament! ⚠️')
				.setDescription(
					'Si saps el que ha passat, pots reportar el bug [aqui](https://github.com/CatalaHD/CataBot/issues).',
				)
				.addField('Error:', error);

			console.error(error);

			message.channel.send(errorEmbed); // Enviem la info pel canal

			errorEmbed
				.addField('Guild', message.guild.name, true)
				.addField('Channel', message.channel.name, true)
				.addField('Contingut', message.content, true);

			// Enviem info adicional al admin
			const owner = await getOwner(client);
			owner.send(errorEmbed);
		}
	},
};
