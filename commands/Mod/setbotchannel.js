const fs = require('fs');

module.exports = {
    name: 'setbotchannel',
    description: 'Adjudica el canal d\'alertes al canal que s\'executa la comanda',
    type: 'mod',
    aliases: ['bothere', 'setbot'],
    execute(message, args, servers, userData) {

        servers[message.guild.id].botChannel = message.channel.id;

        // Actualitzem el fitxer de disc
        fs.writeFile('Storage/servers.json', JSON.stringify(servers), (err) => { if (err) console.error(err); });
        message.reply("has adjudicat el canal <#" + message.channel.id + "> com a canal principal del bot de forma correcta!");
    },
};