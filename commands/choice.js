const Discord = require("discord.js");

module.exports = {
    name: 'choice',
    description: 'Deix que el bot escolleixi per tu',
    type: 'entreteniment',
    usage: '< choice1, choice2, ..., choiceN >\n[**MUST** be separated by **", "**]',
    execute(message, args) {

        if (!args[0]) {
            message.reply("no se que escollir!");
            return message.channel.send("!help choice");
        }

        let choices = args.join(" ").split(", ");
        let choice = choices[Math.floor(Math.random()*choices.length)];
        
        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let msg = new Discord.RichEmbed()
        .setColor(getRandomColor())
        .setTitle("**CHOICE**")
        .setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://github.com/CatalaHD/DiscordBot')
        .setThumbnail('http://bit.ly/CataBot_Icon')
        .addField('Choice', choice, true)
        .setTimestamp().setFooter("Catabot 2020 © All rights reserved");

        message.channel.send(msg);
    },
};