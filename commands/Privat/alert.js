module.exports = {
    name: 'alert',
    description: "Avisa a tots els servidors d'alguna cosa\nNomés l'owner del bot pot executar-ho",
    type: 'privat',
    usage: '< msg >',
    cooldown: 60,
    async execute(message, args, servers, _userData, client) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se de què avisar!");
            return message.channel.send(server.prefix + "help alert");
        } else if (message.author.id != process.env.IdOwner) {
            message.reply("aquesta comanda només pot ser executada per administradors del bot!");
            return message.channel.send(server.prefix + "help alert");
        }

        msg = args.join(" ");

        await client.guilds.cache.forEach(async guild => {

            let channelID = servers[guild.id].alertChannel;
            let channel = client.channels.cache.get(channelID);

            // Només si hi ha algun canal de text en tot el servidor
            if (channel)
                await channel.send(msg); // Envia el missatge d'alerta
        });

        message.reply("missatges enviats correctament");

    },
};