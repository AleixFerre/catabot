module.exports = {
	name: 'next',
	description: 'Passa a la següent de la cua',
	execute(message, args, servers) {
        message.channel.send("Passant a la següent cançó...").then((msg) => {
            let server = servers[message.guild.id];
            if (server) {
                if (server.dispatcher) {
                    server.dispatcher.end();
                }
            } else {
                msg.edit("No es pot passar a la següent cançó!");
            }
        });
	},
};