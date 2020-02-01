module.exports = {
	name: 'queue',
	description: 'Mostra la cua',
	execute(message, args, servers) {
        message.channel.send("Obtenint cua...").then((msg) => {
            let server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                let content = "**CUA DE CANÇONS**\n```\n";  
                if (server.queue.length < 1) {
                    msg.edit(content + "No hi ha elements a la cua!```\n");
                } else {
                    for(let i = 0; i < server.queue.length; i++) {
                        content += (i + 1) + '.- ' + server.queue[i].videoInfo.title + '\n';
                    }
                    msg.edit(content + "```\n");
                }
            } else {
                msg.edit("No pots executar això si el bot no està en cap canal de veu!");
            }
        }).catch(console.error);
	},
};