module.exports = {
	name: 'delete',
	description: 'Esborra la cançó de la posició que vulguis; per defecte, la següent',
	usage: '< posicio >',
	execute(message, args, servers) {
        function deleteHelp() {
            var dcontent = '**COM USAR EL DELETE?**\n```\n' +
            '-> ' + prefix + 'delete [ pos ]\n' + 
            '       Esborra la cançó de la posició que vulguis; per defecte la següent \n```\n';
            message.channel.send(dcontent);
        }

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
                        deleteHelp();
                    }
                } else {
                    msg.edit("La cua és buida!"); 
                    deleteHelp();
                }
            } else {
                msg.edit("No has creat cap cua encara!");
                deleteHelp();
            }
        }).catch(console.error);
	},
};