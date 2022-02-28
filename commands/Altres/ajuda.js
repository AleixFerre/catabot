const { MessageEmbed } = require('discord.js');
const commandTypes = require('../../storage/commandTypes.json');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'altres';

module.exports = {
	name: 'ajuda',
	description: 'Mostra informació de les comandes',
	type: TYPE,
	usage: '[ nom / tipus de la comanda ]',
	aliases: ['h', 'help'],
	execute(message, args, server) {
		const data = [];
		const { commands } = message.client;

		let prefix = '!';
		if (message.guild) {
			prefix = server.prefix;
		}

		if (!args.length) {
			// Creem una variable string per anar guardant tot el contingut del help que anem posant al embed
			let helpContent = '\n';

			// Creem les taules auxiliars per guardar les comandes de cada tipus
			const musica = [];
			const mod = [];
			const banc = [];
			const games = [];
			const entreteniment = [];
			const level = [];
			const privat = [];
			const altres = [];

			// Encuem cada comanda a la taula que toca
			commands.forEach((command) => {
				switch (command.type) {
					case 'musica':
						musica.push(command);
						break;
					case 'mod':
						mod.push(command);
						break;
					case 'banc':
						banc.push(command);
						break;
					case 'games':
						games.push(command);
						break;
					case 'entreteniment':
						entreteniment.push(command);
						break;
					case 'level':
						level.push(command);
						break;
					case 'privat':
						privat.push(command);
						break;
					case 'altres':
						altres.push(command);
						break;
					default:
						altres.push(command);
						break;
				}
			});

			// Creem l'embed i l'anem omplint
			const fullHelpEmbed = new MessageEmbed()
				.setColor(getColorFromCommand(TYPE))
				.setTitle('El **CataBOT** té ' + commands.size + ' comandes')
				.setAuthor(
					'CataBOT',
					'https://raw.githubusercontent.com/AleixFerre/CataBot/master/img/icon_cat.png',
					'https://github.com/aleixferre/CataBot',
				)
				.setThumbnail('https://i.imgur.com/OMp4api.png')
				.setTimestamp()
				.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

			let aux = mod.map((c) => c.name);
			helpContent += '**' + commandTypes.mod.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			aux = entreteniment.map((c) => c.name);
			helpContent += '\n\n**' + commandTypes.entreteniment.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			aux = musica.map((c) => c.name);
			helpContent += '\n\n**' + commandTypes.musica.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			aux = banc.map((c) => c.name);
			helpContent += '\n\n**' + commandTypes.banc.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			aux = level.map((c) => c.name);
			helpContent += '\n\n**' + commandTypes.level.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			aux = games.map((c) => c.name);
			helpContent += '\n\n**' + commandTypes.games.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			aux = privat.map((c) => c.name);
			helpContent += '\n\n**' + commandTypes.privat.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			aux = altres.map((c) => c.name);
			helpContent += '\n\n**' + commandTypes.altres.displayName + '** [' + aux.length + ']\n';
			helpContent += '`' + aux.join(', ') + '`';

			data.push(helpContent);
			data.push(
				`
 • Pots enviar ${prefix}help [nom comanda] per obtenir informació més detallada de la comanda!
 • Pots veure totes les comandes [aquí](https://aleixferre.github.io/CataBot/#/commands).`,
			);

			fullHelpEmbed.setDescription(data);

			return message.author
				.send(fullHelpEmbed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply("t'he enviat un DM amb tota la info").then(async (msg) => {
						const delay = (ms) => new Promise((res) => setTimeout(res, ms));
						await delay(5000);
						msg.delete();
					});
				})
				.catch((error) => {
					console.error(`No puc enviar un DM a ${message.author.username}.\n`, error);
					message.reply('sembla que no et puc enviar un DM!');
				});
		}

		const name = args[0].toLowerCase();
		let command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));
		const isType = !command;

		if (isType) {
			command = commandTypes[name] || Object.values(commandTypes).find((c) => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.reply(`${name} no és una comanda vàlida ni un tipus de comandes!`);
			}
		}

		const helpEmbed = new MessageEmbed()
			.setAuthor(
				'CataBOT',
				'https://raw.githubusercontent.com/AleixFerre/CataBot/master/img/icon_cat.png',
				'https://github.com/aleixferre/CataBot',
			)
			.setTitle(command.name.toUpperCase())
			.setThumbnail('https://i.imgur.com/OMp4api.png')
			.setTimestamp()
			.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

		if (isType) {
			helpEmbed
				.setColor(command.color)
				.setTitle(command.displayName)
				.setDescription(command.description.replace(/ÇÇ/gi, prefix));

			if (command.aliases) {
				helpEmbed.addField('Alies', command.aliases.join(', '), false);
			}

			const cmds = [];
			commands.forEach((c) => {
				if (c.type === command.name) {
					cmds.push(c.name);
				}
			});
			helpEmbed.addField('Comandes:', cmds.join(', '), false);
		} else {
			helpEmbed.setColor(getColorFromCommand(command.type));

			if (command.description) helpEmbed.setDescription(command.description);

			if (command.type) helpEmbed.addField('Tipus', command.type);
			else helpEmbed.addField('Tipus', 'altres');

			if (command.aliases) helpEmbed.addField('Alies', command.aliases.join(', '));

			if (command.usage) helpEmbed.addField('Ús', `${prefix + command.name} ${command.usage}`);

			if (command.example) helpEmbed.addField('Exemple', `${prefix + command.name} ${command.example}`);
		}

		message.channel.send(helpEmbed);

		if (message.author.bot) {
			return message.delete();
		}
	},
};
