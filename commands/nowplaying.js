module.exports = {
	name: 'nowplaying',
	description: 'Mostra la cançó que s\'està reproduint ara mateix',
	type: 'musica',
    aliases: ['np'],
	execute(message, args, servers) {
        message.channel.send("S'està reproduint...").then((msg) => {

            let server = servers[message.guild.id];
            
            if (message.guild.voiceConnection) {
                let content = "**S'està reproduint...**\n```";
                if (server.loop) {
                    content += "diff\n-LOOP ACTIVAT 🔁\n```\n```";
                }
                content += '\n' + server.nowPlayingVideoInfo.title + '\n' + server.nowPlayingVideoInfo.url + '\n';
                msg.edit(content + "```\n");
            } else {
                msg.edit("No pots executar això si el bot no està en cap canal de veu!");
                message.channel.send(server.prefix + "help np");
            }
        }).catch(console.error);
	},
};