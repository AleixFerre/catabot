const Discord = require("discord.js");
let { clientid } = require('../config.json');

module.exports = {
	name: 'invite',
	description: 'T\'envia un missatge amb el invite-link del bot.',
	execute(message) {
        // Get the invite link With admin permissions
        let link = 'https://discordapp.com/oauth2/authorize?client_id='+ clientid +'&permissions=8&scope=bot';

        const embedMessage = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Invite link')
            .setURL(link)
            .setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')
            .setDescription('Aqui tens el link')
            .setThumbnail('https://i.imgur.com/UXoPSuU.jpg')
            .setTimestamp()
            .setFooter('Convida amb precaució');

        message.author.send(embedMessage).catch(console.error);
	},
};