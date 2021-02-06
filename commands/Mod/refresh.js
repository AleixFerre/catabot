module.exports = {
    name: 'refresh',
    description: 'Refresca el contador de membres. S\'actualitza automàticament cada 12h.',
    type: 'mod',
    aliases: ['refreshcounter'],
    execute(message, _args, servers) {
        let server = servers[message.guild.id];
        let id = server.counterChannel;

        message.guild.channels.resolve(id).setName("members " + message.guild.memberCount);

        message.reply("s'ha actualitzat el contador correctament!");
    },
};