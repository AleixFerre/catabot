const Discord = require("discord.js");
const weather = require('weather-js');
const { getRandomColor } = require('../../lib/common.js');

module.exports = {
    name: 'weather',
    description: 'Mostra el temps que fa.',
    type: 'entreteniment',
    cooldown: 10,
    aliases: ['temps', 'tiempo'],
    async execute(message, args, servers) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no has posat la ciutat!");
            return message.channel.send(server.prefix + "help weather");
        }

        let city = args.join(" ");
        let result = null;

        await weather.find({ search: city, degreeType: 'C', lang: 'ca' }, (err, _result) => {
            if (err) {
                console.log(err);
                return message.channel.send("Hi ha hagut un error al buscar\n" + err);
            }

            result = _result[0];

            if (!result) {
                return message.reply("la ciutat " + city + " no existeix");
            }

            let msg = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("**TEMPS a " + result.location.name + "**")
                .setThumbnail(result.current.imageUrl)
                .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

            Object.keys(result.current).forEach(camp => {
                // Convertimos el campo en space case
                let majTxt = camp.replace(/([A-Z])/g, " $1");
                let finalResult = majTxt.charAt(0).toUpperCase() + majTxt.slice(1);

                msg.addField("❯ " + finalResult, result.current[camp], true);
            });

            message.channel.send(msg);

        });
    },
};