const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Retorna el ping del servidor i de la API!',
    type: 'altres',
    execute(message) {
        let ping = Math.floor(message.client.ws.ping);
        let guildPing = Math.floor(message.guild.shard.ping);

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const pingEmbed = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle('**PING**')
            .addField("❯ 🛰️ Ping DiscordAPI", `${ping} ms`, true)
            .addField("❯ 🌐 Ping Servidor", `${guildPing} ms`, true)
            .setTimestamp().setFooter('CataBOT 2020 © All rights reserved');

        message.channel.send(":ping_pong: Pong!").then((m) => {
            pingEmbed.addField("❯ 📨 Ping Missatges", `${Math.floor(m.createdTimestamp - message.createdTimestamp)} ms`, true);
            m.channel.send(pingEmbed);
            m.delete();
        }).catch(console.error);
    },
};