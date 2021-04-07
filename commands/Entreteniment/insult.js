const Discord = require("discord.js");
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "entreteniment";

module.exports = {
    name: 'insult',
    description: 'Insulta a qui vulguis',
    usage: "[ who ]",
    type: TYPE,
    cooldown: 10,
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
                .then(async (data) => {
                    if (data.error) {
                        return message.reply("hi ha hagut un error!\n" + data.error_message);
                    } else {
                        insult = data.insult;
                        await translate(insult, {
                            to: "ca"
                        }).then(res => {
                            insult = res.text;
                        });
                    }
                });
        }

        await getData();

        let msg = new Discord.MessageEmbed()
            .setColor(getColorFromCommand(TYPE))
            .setTitle(title)
            .setDescription(insult)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);
    },
};