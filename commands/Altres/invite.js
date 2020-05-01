const Discord = require("discord.js");
let { clientid } = require('../../config.json');

module.exports = {
    name: 'invite',
    type: 'altres',
    description: 'T\'envia un missatge amb el invite-link del bot.',
    execute(message) {
        // Get the invite link With admin permissions
        let link = 'https://discordapp.com/oauth2/authorize?client_id=' + clientid + '&permissions=8&scope=bot';

        const embedMessage = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Invite link')
            .setURL(link)
            .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png', 'https://github.com/CatalaHD/CataBot')
            .setDescription('Aqui tens el link')
            .setThumbnail('https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png')
            .setTimestamp()
            .setFooter('Convida amb precaució');

        message.author.send(embedMessage).catch(console.error);
    },
};