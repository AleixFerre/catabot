module.exports = {
	name: 'help',
    description: 'Mostra informació de les comandes',
	usage: '[ nom de la comanda ]',
    aliases: ['h'],
	execute(message, args, servers) {

        const data = [];
        const { commands } = message.client;

        let prefix = "!";
        if (message.guild) {
            prefix = servers[message.guild.id].prefix;
        }
        
        if (!args.length) {
			data.push('**COMANDES DEL CATABOT**\n```\n');
			data.push(commands.map(command => command.name).join(', '));
			data.push('\nPots enviar ' + prefix + 'help [nom comanda] per obtenir informació més detallada de la comanda!```');

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
                    message.reply('T\'he enviat un DM amb tota la info').then(async (msg) => {
                        const delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(5000);
                        msg.delete();
                    });
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
        }
        
        const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply(command + ' no és una comanda vàlida!');
		}
		
		if (message.author.bot) {
			message.delete();
		} 

		data.push(`**Nom:** ${command.name}`);

		if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Descripció:** ${command.description}`);
		if (command.usage) data.push(`**Ús:** ${prefix}${command.name} ${command.usage}`);

		message.channel.send(data, { split: true });
	},
};