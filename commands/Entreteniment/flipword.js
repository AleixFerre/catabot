const Discord = require("discord.js");

module.exports = {
    name: 'flipword',
    description: 'Posa la paraula al revés',
    type: 'entreteniment',
    usage: '< word >',
    aliases: ['flip'],
    execute(message, args, servers) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se què girar!");
            message.channel.send(server.prefix + "help flipword");
            return;
        }

        function reverseString(str) {
            return str.split("").reverse().join("");
        }

        let word = args.join(" ");
        word = reverseString(word);

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
            .setTitle("**FLIP THE WORD**")
            .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png', 'https://github.com/CatalaHD/CataBot')
            .setThumbnail('https://bit.ly/CataBot_RawIcon')
            .addField('Resultat', word, true)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(msg);
    },
};