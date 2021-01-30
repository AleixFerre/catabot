const fs = require('fs');

module.exports = {
    name: 'setbotchannel',
    description: 'Adjudica el canal d\'alertes al canal que s\'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument',
    type: 'mod',
    usage: '[ null ]',
    aliases: ['bothere', 'setbot'],
    execute(message, args, servers, _userData, _client) {

        let paraula = "adjudicat";

        if (args[0] && args[0].toLowerCase() === "null") {
            servers[message.guild.id].botChannel = null;
            paraula = "des" + paraula;
        } else {
            servers[message.guild.id].botChannel = message.channel.id;
        }

        // Actualitzem el fitxer de disc
        let file = "Storage/servers.json";

        fs.writeFile(file, JSON.stringify(servers), (err) => {
            if (err) console.error(err);
        });
        message.reply("has " + paraula + " el canal <#" + message.channel.id + "> com a canal principal del bot de forma correcta!");
    },
};