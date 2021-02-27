const Discord = require("discord.js");
const moment = require('moment');
const {
    getRandomColor
} = require('../../lib/common.js');
const {
    getUser,
    updateUser
} = require("../../lib/database.js");

module.exports = {
    name: 'daily',
    description: 'Recolleix la teva recompensa diaria!',
    type: 'banc',
    cooldown: 60,
    async execute(message, _args, server) {

        let content = "";
        moment.locale("ca"); // Posem el contingut en català

        let recompensa = 500;
        let user = await getUser(message.author.id, message.guild.id);
        level = user.level;
        let rank = Math.floor(level / 10) + 1;
        if (rank > 19) {
            rank = 19;
        }

        recompensa += Math.floor(recompensa * (rank - 1) / 10);

        if (user.lastDaily != moment().format('L')) {
            user.lastDaily = moment().format('L');
            user.money += recompensa;
            content = "💰`" + recompensa + " monedes` han sigut afegides a la teva conta!\nGràcies per recollir la teva recompensa diaria!";

            xpMax = Math.floor(Math.random() * (recompensa - 1) + 1); // Numero aleatori entre 1 i recompensa

            message.channel.send(server.prefix + "progress " + xpMax + " <@" + message.author.id + ">");
        } else {
            content = "Ja has recollit la teva recompensa diaria!\nPots tornar-hi " + moment().endOf('day').fromNow();
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("💰 **DAILY** 💰")
            .setDescription(content)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        await updateUser([message.author.id, message.guild.id], {
            lastDaily: user.lastDaily,
            money: user.money
        });

        message.channel.send(msg);
    },
};