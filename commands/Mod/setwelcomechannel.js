const fs = require('fs');

module.exports = {
    name: 'setwelcomechannel',
    description: 'Adjudica el canal de benvinguda al canal que s\'executa la comanda',
    type: 'mod',
    aliases: ['welcomehere', 'setwelcome'],
    execute(message, args, servers, userData) {

        servers[message.guild.id].welcomeChannel = message.channel.id;

        // Actualitzem el fitxer de disc
        fs.writeFile('Storage/servers.json', JSON.stringify(servers), (err) => { if (err) console.error(err); });
        message.reply("has adjudicat el canal <#" + message.channel.id + "> com a canal de benvinguda del bot de forma correcta!");
    },
};