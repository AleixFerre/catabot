const Discord = require("discord.js");
let { clientid } = require('../../config.json');
const { getRandomColor } = require('../../common.js');

module.exports = {
    name: 'invite',
    type: 'altres',
    cooldown: 1,
    description: 'T\'envia un missatge amb el link del bot.',
    execute(message) {
        // Get the invite link With admin permissions
        let link = 'https://discordapp.com/oauth2/authorize?client_id=' + clientid + '&permissions=8&scope=bot';

        const embedMessage = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle('Invite link')
            .setURL(link)
            .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/gif_frames/icon_new.gif', 'https://github.com/CatalaHD/CataBot')
            .setDescription('Aqui tens el link')
            .setThumbnail('https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png')
            .setTimestamp().setFooter('CataBOT ' + new Date().getFullYear() + ' © All rights reserved');

        message.author.send(embedMessage).catch(console.error);
    },
};