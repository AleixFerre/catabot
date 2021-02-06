const fs = require('fs');

module.exports = {
    name: 'setmembercount',
    description: 'Adjudica el canal contador de membres al canal que s\'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument',
    type: 'mod',
    usage: '[ nou nom del canal ]',
    aliases: ['counthere', 'setcount', 'setcounter'],
    execute(message, args, servers) {

        let paraula = "adjudicat";

        if (args[0]) {
            // Treure
            let id = servers[message.guild.id].counterChannel;
            let nomAnterior = servers[message.guild.id].counterChannelName;
            servers[message.guild.id].counterChannel = null;
            servers[message.guild.id].counterChannelName = null;
            paraula = "des" + paraula;

            message.guild.channels.resolve(id).setName(nomAnterior);
        } else {
            // Posar
            servers[message.guild.id].counterChannel = message.channel.id;
            servers[message.guild.id].counterChannelName = message.channel.name;

            let memberCount = message.guild.memberCount;

            message.guild.channels.resolve(message.channel.id).setName("members " + memberCount);
        }

        // Actualitzem el fitxer de disc
        let file = "Storage/servers.json";

        fs.writeFile(file, JSON.stringify(servers), (err) => {
            if (err) console.error(err);
        });
        message.reply("has " + paraula + " el canal <#" + message.channel.id + "> com a canal de contador de membres de forma correcta!");
    },
};