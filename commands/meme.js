const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
	name: 'meme',
	description: 'Mostra un meme aleatori de reddit',
	type: 'entreteniment',
	execute(message) {

        fetch("https://meme-api.herokuapp.com/gimme")
        .then(res => res.json())
        .then((data) => {
            const exampleEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(data.title)
            .setImage(data.url);
            
            message.channel.send(exampleEmbed);
        });
	},
};