const {
    db
} = require('../../lib/common.js');
const {
    updateServer
} = require('../../lib/database.js');

module.exports = {
    name: 'setmembercount',
    description: 'Adjudica el canal contador de membres al canal que s\'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument',
    type: 'mod',
    cooldown: 60,
    usage: '[ nou nom del canal ]',
    aliases: ['counthere', 'setcount', 'setcounter'],
    execute(message, args, server) {

        let paraula = "adjudicat";

        if (args[0]) {
            // Treure
            let id = server.counterChannel;
            let nomAnterior = server.counterChannelName;
            server.counterChannel = null;
            server.counterChannelName = null;
            paraula = "des" + paraula;

            message.guild.channels.resolve(id).setName(nomAnterior);
        } else {
            // Posar
            server.counterChannel = message.channel.id;
            server.counterChannelName = message.channel.name;

            let memberCount = message.guild.memberCount;

            message.guild.channels.resolve(message.channel.id).setName("members " + memberCount);
        }

        updateServer(message.guild.id, {
            counterChannel: server.counterChannel,
            counterChannelName: server.counterChannelName
        }).then(console.log(db(`DB: Actualitzat el canal de benvinguda del servidor ${message.guild.name} correctament!`)));

        message.reply("has " + paraula + " el canal <#" + message.channel.id + "> com a canal de contador de membres de forma correcta!");
    },
};