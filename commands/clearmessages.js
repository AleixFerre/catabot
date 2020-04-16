module.exports = {
	name: 'clearmessages',
	description: 'Borra n missatges del canal de text on s\'estigui executant la comanda',
	type: 'mod',
	usage: '< nMessages >',
    aliases: ['cls', 'clm'],
	async execute (message, args, servers) {
        
        let amount = 1;
        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se quants missatges he de borrar!");
            return message.channel.send(server.prefix + "help clearmessages");
        } else {
            if (!isNaN(args[0]))
                amount = Math.abs(args[0]);
            else
                return message.reply("has de posar un numero!");
        }

        if (amount > 100) {
            return message.reply("no pots borrar més de 100 missatges alhora!");
        }


        let messages = await message.channel.fetchMessages({ limit: amount }).catch(console.error);
        let msg = await message.channel.send("🤔Borrant " + amount + " missatges...🤔");

        
        await Promise.all(messages.map(async (delMessage) => {
            await delMessage.delete();
        }));

        await msg.edit("☑️S'han borrat " + amount + " missatges correctament.☑️");
    
	},
};