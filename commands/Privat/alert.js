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

            // Busquem si hi ha un canal de text que es digui 'bot'
            let channel = guild.channels.filter(c => c.type === 'text').find(x => x.name.includes("bot"));

            // Si aquest no existeix
            if (!channel) {
                // Cerca el canal per defecte
                channel = guild.systemChannel;
            }

            // Si no hi ha canal per defecte
            if (!channel)
                channel = guild.channels.filter(c => c.type === 'text').find(x => x.position == 0); // Cerca el de la primera posició de tipus text

            // Només si hi ha algun canal de text en tot el servidor
            if (channel)
                await channel.send(msg); // Envia el missatge d'alerta
        });

        message.reply("missatges enviats correctament");

    },
};