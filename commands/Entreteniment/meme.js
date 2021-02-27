const Discord = require("discord.js");
const fetch = require('node-fetch');
const {
    getRandomColor
} = require('../../lib/common.js');

module.exports = {
    name: 'meme',
    cooldown: 10,
    description: 'Mostra un meme aleatori de reddit',
    type: 'entreteniment',
    execute(message) {

        fetch("https://meme-api.herokuapp.com/gimme")
            .then(res => res.json())
            .then((data) => {
                const memeEmbed = new Discord.MessageEmbed()
                    .setColor(getRandomColor())
                    .setURL(data.postLink)
                    .setTitle(data.subreddit.toUpperCase() + " MEME")
                    .setDescription(data.title)
                    .setImage(data.url)
                    .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

                message.channel.send(memeEmbed);
            });
    },
};