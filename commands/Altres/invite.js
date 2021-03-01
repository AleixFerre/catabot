const Discord = require("discord.js");
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "altres";

module.exports = {
    name: 'invite',
    type: TYPE,
    cooldown: 0,
    description: 'T\'envia un missatge amb el link del bot.',
    execute(message) {
        // Get the invite link With admin permissions
        let link = 'https://discordapp.com/oauth2/authorize?client_id=' + process.env.clientid + '&permissions=8&scope=bot';

        const embedMessage = new Discord.MessageEmbed()
            .setColor(getColorFromCommand(TYPE))
            .setTitle('Invite link')
            .setURL(link)
            .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/gif_frames/icon_new.gif', 'https://github.com/CatalaHD/CataBot')
            .setDescription('Aqui tens el link')
            .setThumbnail('https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png')
            .setTimestamp().setFooter('CataBOT ' + new Date().getFullYear() + ' © All rights reserved');

        message.author.send(embedMessage).catch(console.error);
    },
};