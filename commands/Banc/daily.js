const Discord = require("discord.js");
const moment = require('moment');
const fs = require('fs');

module.exports = {
    name: 'daily',
    description: 'Recolleix la teva recompensa diaria!',
    type: 'banc',
    execute(message, args, servers, userData) {

        let content = "";
        moment.locale("ca"); // Posem el contingut en català

        let server = servers[message.guild.id];

        let recompensa = 500;
        let level = userData[message.guild.id + message.author.id].level;
        let rank = Math.floor(level / 10) + 1;
        if (rank > 19) {
            rank = 19;
        }

        recompensa += Math.floor(recompensa * (rank - 1) / 10);

        if (userData[message.guild.id + message.member.id].lastDaily != moment().format('L')) {
            userData[message.guild.id + message.member.id].lastDaily = moment().format('L');
            userData[message.guild.id + message.member.id].money += recompensa;
            content = "💰`" + recompensa + " monedes` han sigut afegides a la teva conta!\nGràcies per recollir la teva recompensa diaria!";

            xpMax = Math.floor(Math.random() * (recompensa - 1) + 1); // Numero aleatori entre 1 i recompensa

            message.channel.send(server.prefix + "progress " + xpMax + " <@" + message.author.id + ">");
        } else {
            content = "Ja has recollit la teva recompensa diaria!\nPots tornar-hi " + moment().endOf('day').fromNow();
        }

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
            .setTitle("💰 **DAILY** 💰")
            .setDescription(content)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
        message.channel.send(msg);
    },
};