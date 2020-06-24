const Discord = require("discord.js");

module.exports = {
    name: 'choice',
    description: 'Deix que el bot escolleixi per tu.\n**SI QUE ES PERMETEN ESPAIS** mentre es repectin les comes',
    type: 'entreteniment',
    aliases: ['escolleix'],
    usage: '< choice 1, choice2, ...>',
    execute(message, args, servers) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("no se que escollir!");
            return message.channel.send(server.prefix + "help choice");
        }

        let choices = args.join(" ").split(", ");
        let choice = choices[Math.floor(Math.random() * choices.length)];

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**ESCOLLEIX**")
            .setThumbnail('https://bit.ly/CataBot_RawIcon')
            .addField('❯ Escollida', choice, true)
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(msg);
    },
};