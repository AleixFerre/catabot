const Discord = require("discord.js");
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: 'insult',
    description: 'Insulta a qui vulguis',
    usage: "[ who ]",
    type: 'entreteniment',
    async execute(message, args) {

        let insultLink = "https://insult.mattbas.org/api/insult.json";
        let title = "**INSULT";
        let insult = "";

        if (args[0]) {
            let who = args.join(" ");
            if (message.mentions.users.first()) {
                who = message.mentions.users.first().username;
            }
            title += " to " + who + "**";
            insultLink += "?who=" + who;
        } else {
            title += "**";
        }

        async function getData() {
            await fetch(insultLink)
                .then(res => res.json())
                .then(async(data) => {
                    if (data.error) {
                        return message.reply("hi ha hagut un error!\n" + data.error_message);
                    } else {
                        insult = data.insult;
                        await translate(insult, { to: "es" }).then(res => {
                            insult = res.text;
                        });
                    }
                });
        }

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        await getData();

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle(title)
            .setDescription(insult)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};