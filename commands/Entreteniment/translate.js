const Discord = require("discord.js");
const translate = require('@vitalets/google-translate-api');
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "entreteniment";

module.exports = {
    name: 'translate',
    description: 'Tradueix el que vulguis al espanyol!',
    usage: "< text >",
    type: TYPE,
    cooldown: 10,
    async execute(message, args, server) {

        let txt = "";
        let traducido = "";

        if (args[0]) {
            txt = args.join(" ");
        } else {
            message.reply("no has posat el text a traduir!");
            return message.channel.send(server.prefix + "help translate");
        }

        await translate(txt, {
            to: "es"
        }).then(res => {
            traducido = res.text;
        });

        let msg = new Discord.MessageEmbed()
            .setColor(getColorFromCommand(TYPE))
            .setTitle("**TRAUDEIX**")
            .setDescription(traducido)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);
    },
};