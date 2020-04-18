const Discord = require("discord.js");

module.exports = {
	name: 'help',
    description: 'Mostra informació de les comandes',
	usage: '[ nom de la comanda ]',
    aliases: ['h', 'command', 'commands', 'list', 'c'],
	execute(message, args, servers) {

        const data = [];
        const { commands } = message.client;

        let prefix = "!";
        if (message.guild) {
            prefix = servers[message.guild.id].prefix;
        }
        
        if (!args.length) {

			// Creem una variable string per anar guardant tot el contingut del help que anem posant al embed
			let helpContent = "\n";

			// Creem les taules auxiliars per guardar les comandes de cada tipus
			let musica = [];
			let mod = [];
			let banc = [];
			let entreteniment = [];
			let altres = [];

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
					case 'entreteniment':
						entreteniment.push(command);
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
			const fullHelpEmbed = new Discord.RichEmbed()
            .setColor(getRandomColor())
			.setTitle('**Comandes del CataBOT**')
			.setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')
			.setThumbnail('https://i.imgur.com/OMp4api.png');
			
			
			helpContent += '🎵 **COMANDES DE MUSICA** 🎵\n `';
			helpContent += musica.map(c => c.name).join(", ");

			helpContent += '`\n\n👮 **COMANDES DE MODERACIÓ** 👮\n`';
			helpContent += mod.map(c => c.name).join(", ");

			helpContent += '`\n\n💰 **COMANDES DE BANC** 💰\n`';
			helpContent += banc.map(c => c.name).join(", ");

			helpContent += '`\n\n🥳 **COMANDES DE ENTRETENIMENT** 🥳\n`';
			helpContent += entreteniment.map(c => c.name).join(", ");

			helpContent += '`\n\n🌈 **ALTRES COMANDES** 🌈\n`';
			helpContent += altres.map(c => c.name).join(", ");

			data.push(helpContent + '`');
			data.push('\nPots enviar ' + prefix + 'help [nom comanda] per obtenir informació més detallada de la comanda!');
			
			fullHelpEmbed.setDescription(data);
			
            fullHelpEmbed.setTimestamp().setFooter("Catabot 2020 © All rights reserved");

			return message.author.send(fullHelpEmbed)
				.then(() => {
					if (message.channel.type === 'dm') return;
                    message.reply('T\'he enviat un DM amb tota la info').then(async (msg) => {
                        const delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(5000);
                        msg.delete();
                    });
				})
				.catch(error => {
					console.error(`No puc enviar un DM a ${message.author.tag}.\n`, error);
					message.reply('sembla que no et puc enviar un DM!');
				});
        }
        
        const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply(name + ' no és una comanda vàlida!');
		}
		
		function getRandomColor() {
			let letters = '0123456789ABCDEF';
			let color = '#';
			for (let i = 0; i < 6; i++) {
			  color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}

		const helpEmbed = new Discord.RichEmbed()
		.setColor(getRandomColor())
		.setAuthor('CataBot', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')    
		.setTitle(command.name.toUpperCase())
		.setThumbnail('https://i.imgur.com/OMp4api.png');

		if (command.description)
			helpEmbed.setDescription(command.description);

		if (command.type) 
			helpEmbed.addField('Tipus', command.type);
		else
			helpEmbed.addField('Tipus', 'altres');

		if (command.aliases) 
			helpEmbed.addField('Alias', command.aliases.join(', '));
		
		if (command.usage)
			helpEmbed.addField('Ús', prefix + command.name + ' ' +  command.usage);

		helpEmbed.setTimestamp().setFooter("Catabot 2020 © All rights reserved");

		message.channel.send(helpEmbed);
		
		if (message.author.bot) {
			return message.delete();
		}
	},
};