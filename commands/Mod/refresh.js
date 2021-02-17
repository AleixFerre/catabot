module.exports = {
    name: 'refresh',
    description: 'Refresca el contador de membres manualment. Aquest contador s\'actualitza automàticament cada 12h.',
    type: 'mod',
    cooldown: 300,
    aliases: ['refreshcounter'],
    execute(message, _args, servers) {
        let server = servers[message.guild.id];
        let id = server.counterChannel;

        message.guild.channels.resolve(id).setName("members " + message.guild.memberCount);

        message.reply("s'ha actualitzat el contador correctament!");
    },
};