const Discord = require("discord.js");

module.exports = {
    name: 'f',
    description: 'F en el chat chavales',
    type: 'entreteniment',
    execute(message) {

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const msg = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("**F**")
            .setImage("https://media.giphy.com/media/j6ZlX8ghxNFRknObVk/giphy.gif").setTimestamp().setFooter("Catabot 2020 © All rights reserved");

        message.channel.send(msg);
    },
};