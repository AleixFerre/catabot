const fs = require('fs');
const {
    PartialGroupDMChannel
} = require('discord.js');

module.exports = {
    name: 'setalertchannel',
    description: 'Adjudica el canal d\'alertes al canal que s\'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument',
    type: 'mod',
    usage: '[ null ]',
    aliases: ['alerthere', 'setalert'],
    execute(message, args, servers, _userData, _client, testing) {

        let paraula = "adjudicat";

        if (args[0] && args[0].toLowerCase() === "null") {
            servers[message.guild.id].alertChannel = null;
            paraula = "des" + paraula;
        } else {
            servers[message.guild.id].alertChannel = message.channel.id;
        }

        // Actualitzem el fitxer de disc
        let file = "Storage/servers.json";
        if (testing) {
            file = "Storage/servers_test.json";
        }

        fs.writeFile(file, JSON.stringify(servers), (err) => {
            if (err) console.error(err);
        });
        message.reply("has " + paraula + " el canal <#" + message.channel.id + "> com a canal d'alertes del bot de forma correcta!");
    },
};