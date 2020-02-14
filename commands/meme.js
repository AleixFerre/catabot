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

            function getRandomColor() {
                let letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            const memeEmbed = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle(data.title)
            .setImage(data.url).setTimestamp().setFooter("Catabot 2020 © All rights reserved");
            
            message.channel.send(memeEmbed);
        });
	},
};