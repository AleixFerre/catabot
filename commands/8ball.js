const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: '8ball',
    description: 'Et permet preguntar-li a la bola de la sort el que et passarà al futur...',
    type: 'entreteniment',
    usage: '< question >',
    aliases: ['8', 'ball'],
    execute(message, args, servers) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se el que li vols preguntar a la pilota...");
            message.channel.send(server.prefix + "help 8ball");
            return;
        }

        let link = "https://8ball.delegator.com/magic/JSON/";
        let params = encodeURIComponent(args.join(' '));
        fetch(link + params)
            .then(response => response.json())
            .then(json => {

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
                    .setTitle("**8BALL**")
                    .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png', 'https://github.com/CatalaHD/CataBot')
                    .setThumbnail('http://bit.ly/CataBot_' + json.magic.type)
                    .addField('Question', json.magic.question, true)
                    .addField('Response', json.magic.answer, true)
                    .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

                message.channel.send(msg);

            });



    },
};