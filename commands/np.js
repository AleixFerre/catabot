module.exports = {
	name: 'np',
	description: 'Mostra la cançó que s\'està reproduint ara mateix',
	execute(message, args, servers) {
        message.channel.send("S'està reproduint...").then((msg) => {

            let server = servers[message.guild.id];
            
            if (message.guild.voiceConnection) {
                let content = "**S'està reproduint...**\n```\n";
                if (server.loop) {
                    content += "LOOP ACTIVAT\n";
                } else {
                    content += "LOOP DESACTIVAT\n";
                }
                content += server.nowPlayingVideoInfo.title + '\n' + server.nowPlayingVideoInfo.url + '\n';
                msg.edit(content + "```\n");
            } else {
                msg.edit("No pots executar això si el bot no està en cap canal de veu!");
                message.channel.send(server.prefix + "help np");
            }
        }).catch(console.error);
	},
};