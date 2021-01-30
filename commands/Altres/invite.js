const Discord = require("discord.js");
let { clientid } = require('../../config.json');

module.exports = {
    name: 'invite',
    type: 'altres',
    description: 'T\'envia un missatge amb el link del bot.',
    execute(message) {
        // Get the invite link With admin permissions
        let link = 'https://discordapp.com/oauth2/authorize?client_id=' + clientid + '&permissions=8&scope=bot';

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const embedMessage = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle('Invite link')
            .setURL(link)
            .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png', 'https://github.com/CatalaHD/CataBot')
            .setDescription('Aqui tens el link')
            .setThumbnail('https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png')
            .setTimestamp().setFooter('CataBOT " + new Date().getFullYear() + " © All rights reserved');

        message.author.send(embedMessage).catch(console.error);
    },
};