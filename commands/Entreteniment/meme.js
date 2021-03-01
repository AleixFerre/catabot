const Discord = require("discord.js");
const fetch = require('node-fetch');
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "entreteniment";

module.exports = {
    name: 'meme',
    cooldown: 10,
    description: 'Mostra un meme aleatori de reddit',
    type: TYPE,
    execute(message) {

        fetch("https://meme-api.herokuapp.com/gimme")
            .then(res => res.json())
            .then((data) => {
                const memeEmbed = new Discord.MessageEmbed()
                    .setColor(getColorFromCommand(TYPE))
                    .setURL(data.postLink)
                    .setTitle(data.subreddit.toUpperCase() + " MEME")
                    .setDescription(data.title)
                    .setImage(data.url)
                    .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

                message.channel.send(memeEmbed);
            });
    },
};