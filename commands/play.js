const { GOOGLE_API_KEY } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
	name: 'play',
	description: 'Posa la musica que vulguis a Youtube!',
	usage: '< link/cerca >',
	execute(message, args, servers) {
        function play (connection, message, msg) {
            let server = servers[message.guild.id];

            try {
                server.dispatcher = connection.playStream(ytdl(server.queue[0].url, {filter: "audioonly"}));
                msg.edit("S'està reproduint: " + server.queue[0].title + "\n" + server.queue[0].url);
            } catch (error) {
                msg.edit("--> " + error + '\n Link: ' + server.queue[0].url);
            }
            
            server.queue.shift();
            
            server.dispatcher.on("end", function() {
                if (server.queue[0]) {
                    play(connection, message, msg);
                } else {
                    connection.disconnect();
                }
            });
        }
        
        if (!args[0]) {
            message.reply("No se el que vols buscar... :(");
            message.delete().catch(console.error);
            return;
        }

        if (!message.member.voiceChannel) {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
            message.delete().catch(console.error);
            return;
        }

        message.channel.send("Inserint la cançó...").then((msg) => {
            // Creem la cua de cançons...
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                };
            }
    
            let server = servers[message.guild.id];

            youtube.searchVideos(args[0])
            .then((results) => {
                msg.edit("S'ha afegit a la cua: " + results[0].title + '\n');
                server.queue.push(results[0]);
                
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join().then((connection) => {
                        play(connection, message, msg);
                    });
                }
            })
            .catch(console.error);
        }).catch(console.error);
	},
};