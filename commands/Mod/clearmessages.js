module.exports = {
    name: 'clearmessages',
    description: 'Borra n missatges del canal de text on s\'estigui executant la comanda',
    type: 'mod',
    usage: '< amount >',
    aliases: ['cls', 'clm'],
    async execute(message, args, servers) {

        let amount = 1;
        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se quants missatges he de borrar!");
            return message.channel.send(server.prefix + "help clearmessages");
        } else {
            if (isNaN(args[0]))
                return message.reply("has de posar un numero!");
            else
                amount = Number(args[0]);
        }

        if (amount > 100) {
            return message.reply("no pots borrar més de 100 missatges alhora!");
        } else if (amount < 1) {
            return message.reply("no pots borrar menys d'1 missatge!");
        }


        let messages = await message.channel.fetchMessages({ limit: amount + 1 }).catch(console.error);
        let msg = await message.channel.send("🤔Borrant " + amount + " missatges...🤔");

        // Per tots els missatges que agafem
        await Promise.all(messages.map(async(delMessage) => {
            // Ens esperem a esborrar-los en ordre
            await delMessage.delete();
        }));

        // Quan s'ha acabat, editem el missatge de confirmació
        await msg.edit("☑️S'han borrat " + amount + " missatges correctament.☑️");

    },
};