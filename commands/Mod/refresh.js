const TYPE = "mod";

module.exports = {
    name: 'refresh',
    description: 'Refresca el contador de membres manualment. Aquest contador s\'actualitza automàticament cada 12h.',
    type: TYPE,
    aliases: ['refreshcounter'],
    execute(message, _args, server) {

        let id = server.counterChannel;

        if (!id) {
            message.reply("No tinc cap canal de contador adjudicat!");
            return message.channel.send(server.prefix + "help refresh");
        }

        message.guild.channels.resolve(id).setName("members " + message.guild.memberCount);

        message.reply("s'ha actualitzat el contador correctament!");
    },
};