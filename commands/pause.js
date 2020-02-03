module.exports = {
	name: 'pause',
	description: 'Pausa la cançó que s\'està reproduint actualment',
	execute(message, args, servers) {
                
        let server = servers[message.guild.id];

        if (!server.dispatcher) {
            message.reply("No s'està reproduint cap cançó!");
            message.channel.send(server.prefix + "help pause");
            return;
        }

        if (message.member.voiceChannel !== message.guild.me.voiceChannel) {
            message.reply("Em sembla que no estas al mateix canal que el bot");
            message.channel.send(server.prefix + "help pause");
            return;
        }

        if (server.dispatcher.paused) {
            message.reply("Ja està pausat!");
            message.channel.send(server.prefix + "help pause");
            return;
        }

        server.dispatcher.pause();

        message.channel.send("S'ha pausat correctament!");
	},
};