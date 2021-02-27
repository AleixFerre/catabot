const Discord = require("discord.js");
const fetch = require('node-fetch');
const {
    getRandomColor
} = require('../../lib/common.js');

module.exports = {
    name: 'advice',
    description: 'Et diu un consell de la vida aleatori',
    usage: '[ search ]',
    type: 'entreteniment',
    aliases: ['consell'],
    cooldown: 5,
    async execute(message, args) {

        let adviceLink = "https://api.adviceslip.com/advice";
        let title = "**CONSELL #";
        let advice = "";
        let error = false;

        if (args[0]) {
            adviceLink += "/search/" + args[0];
        }

        async function getData() {
            await fetch(adviceLink)
                .then(res => res.json())
                .then(async (data) => {
                    if (data.message) {
                        error = true;
                        return message.reply("no s'ha trobat el consell que continguin la paraula `" + args[0] + "`.");
                    } else {
                        if (data.slip) advice = data.slip;
                        else advice = data.slips[0];
                    }
                });
        }

        await getData().catch(er => {
            message.reply("Error: " + er);
            error = true;
        });

        if (error) return;

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle(title + advice.id + "**")
            .setDescription(advice.advice)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);
    },
};