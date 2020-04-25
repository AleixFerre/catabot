const { IdOwner } = require("../config.json");

module.exports = {
    name: 'alert',
    description: "Avisa a tots els servidors d'alguna cosa\nNomés l'owner del bot pot executar-ho",
    type: 'privat',
    usage: '< msg >',
    execute(message, args, servers, userData, client) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se de què avisar!");
            return message.channel.send(server.prefix + "help alert");
        } else if (message.author.id != IdOwner) {
            message.reply("aquesta comanda només pot ser executada per administradors del bot!");
            return message.channel.send(server.prefix + "help alert");
        }

        msg = args.join(" ");

        client.guilds.forEach(async guild => {
            // Cerca el canal per defecte
            let channel = guild.systemChannel;
            // Si no existeix
            if (channel === null)
            // Cerca el de la primera posició de tipus text
                channel = guild.channels.filter(c => c.type === 'text').find(x => x.position == 0);
            await channel.send(msg);
        });
    },
};