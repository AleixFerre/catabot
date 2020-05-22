const { IdOwner } = require("../../config.json");

module.exports = {
    name: 'alert',
    description: "Avisa a tots els servidors d'alguna cosa\nNomés l'owner del bot pot executar-ho",
    type: 'privat',
    usage: '< msg >',
    async execute(message, args, servers, userData, client) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se de què avisar!");
            return message.channel.send(server.prefix + "help alert");
        } else if (message.author.id != IdOwner) {
            message.reply("aquesta comanda només pot ser executada per administradors del bot!");
            return message.channel.send(server.prefix + "help alert");
        }

        msg = args.join(" ");

        await client.guilds.forEach(async guild => {

            let channelID = servers[guild.id].alertChannel;
            let channel = client.channels.get(channelID);

            // Només si hi ha algun canal de text en tot el servidor
            if (channel)
                await channel.send(msg); // Envia el missatge d'alerta
        });

        message.reply("missatges enviats correctament");

    },
};