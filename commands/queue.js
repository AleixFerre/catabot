module.exports = {
	name: 'queue',
	description: 'Mostra la cua',
	execute(message, args, servers) {
        message.channel.send("Obtenint cua...").then((msg) => {
            let server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                if (server.queue.length < 1) {
                    msg.edit("No hi ha elements a la cua!");
                } else {
                    var content = "**CUA DE CANÇONS**\n```\n";
                    
                    for(var j=0; j<server.queue.length; j++) {
                        content += (j+1) + '.- ' + server.queue[j].title + '\n';
                    }
                    msg.edit(content + "```\n");
                }
            } else {
                msg.edit("No pots executar això si el bot no està en cap canal de veu!");
            }
        }).catch(console.error);
	},
};