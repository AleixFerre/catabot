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
            
            let musica = server.queue[0].video;
            if (server.loop) {
                musica = server.nowPlayingVideo;
            }

            try {
                server.dispatcher = connection.playStream(musica);
                msg.edit("S'està reproduint: " + server.nowPlayingVideoInfo.title + "\n" + server.nowPlayingVideoInfo.url);
            } catch (error) {
                msg.edit("--> " + error + '\n Link: ' + server.queue[0].url);
            }
            
            if (!server.loop) {
                // Update now playing
                server.nowPlayingVideo = server.queue[0].video;
                server.nowPlayingVideoInfo = server.queue[0].videoInfo;

                // Next sond
                server.queue.shift();
            }
            
            server.dispatcher.on("end", function() {
                if (server.queue[0] || server.loop) {
                    play(connection, message, msg);
                } else {
                    connection.disconnect();
                }
            });
        }

        // Creem la estructura de dades...
        if (!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: [],
                nowPlayingVideo: [Video],
                nowPlayingVideoInfo: [PassThrough],
                prefix: '!',
                loop: false
            };
        }
        
        let server = servers[message.guild.id];
        
        if (!args[0]) {
            message.reply("No se el que vols buscar... :(");
            message.channel.send(server.prefix + "help play");
            return;
        }

        if (!message.member.voiceChannel) {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
            message.channel.send(server.prefix + "help play");
            return;
        }

        message.channel.send("Buscant la cançó...").then((msg) => {
            youtube.searchVideos(args[0], 1) // Get the first one
            .then((results) => {
                        
                let server = servers[message.guild.id];

                server.queue.push({
                    video: ytdl(results[0].url, {filter: "audioonly"}),
                    videoInfo: results[0]
                });

                msg.edit("S'ha afegit a la cua: " + results[0].title + '\n');
                
                if (!message.guild.voiceConnection) {

                    server.nowPlayingVideo = server.queue[0].video;
                    server.nowPlayingVideoInfo = server.queue[0].videoInfo;

                    message.member.voiceChannel.join().then((connection) => {
                        play(connection, message, msg);
                    });
                }
            }).catch(console.error);
        }).catch(console.error);
	},
};