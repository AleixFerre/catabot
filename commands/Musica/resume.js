module.exports = {
	name: 'resume',
	description: 'Torna a reproduir la cançó que s\'estava reproduint',
	type: 'musica',
	execute(message, args, servers) {     

        let server = servers[message.guild.id];

        if (!server.dispatcher) {
            message.reply("No s'està reproduint cap cançó!");
            message.channel.send(server.prefix + "help resume");
            return;
        }

        if (message.member.voiceChannel !== message.guild.me.voiceChannel) {
            message.reply("Em sembla que no estas al mateix canal que el bot");
            message.channel.send(server.prefix + "help resume");
            return;
        }

        if (!server.dispatcher.paused) {
            message.reply("No està pausat!");
            message.channel.send(server.prefix + "help resume");
            return;
        }

        server.dispatcher.pause();

        message.channel.send("S'ha continuat amb la musica correctament!");

	}
};