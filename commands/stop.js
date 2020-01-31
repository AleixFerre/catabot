module.exports = {
	name: 'stop',
	description: 'Borra tota la cua i desconnecta el bot del canal',
    execute(message, args, servers) {
        let server = servers[message.guild.id];
        message.channel.send("Borrant la cua i sortint del canal...");
        if (message.guild.voiceConnection) {
            for(var i = server.queue.length-1; i>=0; i--) {
                server.queue.splice(i,1);
            }
            server.dispatcher.end();
            message.channel.send("S'ha borrat la cua i s'ha sortit del canal correctament!");
        }

        if (message.guild.connection) {
            message.guild.connection.voiceConnection.disconnect();
        }
	},
};