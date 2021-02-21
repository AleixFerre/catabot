const Discord = require('discord.js');
const { getRandomColor } = require('../../lib/common.js');

module.exports = {
    name: 'ping',
    description: 'Retorna el ping del servidor i de la API!',
    type: 'altres',
    cooldown: 1,
    execute(message) {
        let ping = Math.floor(message.client.ws.ping);

        const pingEmbed = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle('**PING**')
            .addField("❯ 🛰️ Ping Discord WS", `${ping} ms`, true)
            .setTimestamp().setFooter('CataBOT ' + new Date().getFullYear() + ' © All rights reserved');

        message.channel.send(":ping_pong: Pong!").then((m) => {
            pingEmbed.addField("❯ 📨 Ping Missatges", `${Math.floor(m.createdTimestamp - message.createdTimestamp)} ms`, true);
            m.channel.send(pingEmbed);
            m.delete();
        }).catch(console.error);
    },
};