module.exports = {
	name: 'delete',
	description: 'Esborra la cançó de la posició que vulguis; per defecte, la següent',
	usage: '< posicio >',
    aliases: ['del'],
	execute(message, args, servers) {

        let prefix = servers[message.guild.id].prefix;

        let position = 1;
        if (args[0]) {
            position = args[0];
        }
        message.channel.send("Borrant la cançó de la posicio "+ position +"...").then((msg) => {
            let server = servers[message.guild.id];
            if (server) {
                if (server.queue.length > 0) {
                    if ( position > 0 && position <= server.queue.length ) {
                        server.queue.splice(position-1, 1);
                        msg.edit("Esborrat a la posicio " + position);
                    } else {
                        msg.edit("No existeix cap cançó a la posicio " + position);
                        message.channel.send(prefix + 'help delete');
                    }
                } else {
                    msg.edit("La cua és buida!"); 
                    message.channel.send(prefix + 'help delete');
                }
            } else {
                msg.edit("No has creat cap cua encara!");
                message.channel.send(prefix + 'help delete');
            }
        }).catch(console.error);
	},
};