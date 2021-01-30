const fs = require('fs');

module.exports = {
    name: 'setwelcomechannel',
    description: 'Adjudica el canal de benvinguda al canal que s\'executa la comanda\nEs pot desadjudicar el canal passant **null** com a argument',
    type: 'mod',
    usage: '[ null ]',
    aliases: ['welcomehere', 'setwelcome'],
    execute(message, args, servers, _userData, _client) {

        let paraula = "adjudicat";

        if (args[0] && args[0].toLowerCase() === "null") {
            servers[message.guild.id].welcomeChannel = null;
            paraula = "des" + paraula;
        } else {
            servers[message.guild.id].welcomeChannel = message.channel.id;
        }

        // Actualitzem el fitxer de disc
        let file = "Storage/servers.json";

        fs.writeFile(file, JSON.stringify(servers), (err) => {
            if (err) console.error(err);
        });
        message.reply("has " + paraula + " el canal <#" + message.channel.id + "> com a canal de benvinguda del bot de forma correcta!");
    },
};