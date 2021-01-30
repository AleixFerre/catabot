const Discord = require("discord.js");
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: 'translate',
    description: 'Tradueix el que vulguis al espanyol!',
    usage: "< text >",
    type: 'entreteniment',
    async execute(message, args, servers) {

        let server = servers[message.guild.id];
        let txt = "";
        let traducido = "";

        if (args[0]) {
            txt = args.join(" ");
        } else {
            message.reply("no has posat el text a traduir!");
            return message.channel.send(server.prefix + "help translate");
        }

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        await translate(txt, { to: "es" }).then(res => {
            traducido = res.text;
        });

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**TRAUDEIX**")
            .setDescription(traducido)
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};