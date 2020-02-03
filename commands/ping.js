module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message) {
        var ping = Math.floor(message.client.ping);
        message.channel.send(":ping_pong: Pong!").then((m) => {
            m.edit(`:incoming_envelope: Ping Missatges: \`${Math.floor(m.createdTimestamp - message.createdTimestamp)} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
        }).catch(console.error);
	},
};