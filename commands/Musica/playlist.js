const { GOOGLE_API_KEY } = require("../../config.json");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
    name: 'playlist',
    description: "Posa les primeres n cançons d'una llista de reproducció, per defecte 20",
    usage: '< link_playlist >',
    aliases: ['pl'],
    type: 'musica',
    execute(message, args, servers) {

        function play(connection, message, msg) {
            let server = servers[message.guild.id];

            let musica = server.queue[0].video;
            if (server.loop) {
                musica = server.nowPlayingVideo;
            }

            try {
                server.dispatcher = connection.playStream(musica);
                msg.edit("⏯️S'està reproduint: " + server.nowPlayingVideoInfo.title + "\n" + server.nowPlayingVideoInfo.url);
            } catch (error) {
                msg.edit("--> " + error + '\n Link: ' + server.queue[0].url);
                message.channel.send(server.prefix + "help playlist");
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
            message.reply("Posa el link de la playlist que vulguis!");
            message.channel.send(server.prefix + "help playlist");
            return;
        }

        if (!message.member.voiceChannel) {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
            message.channel.send(server.prefix + "help playlist");
            return;
        }

        let mida = 20;

        if (args[1] && isNaN(args[1])) {
            message.reply("el segon argument ha de ser un numero!");
            return message.channel.send(server.prefix + "help playlist");
        } else if (Number(args[1]) > 20) {
            message.reply("només pots inserir fins a 20 cançons!");
        } else {
            mida = Number(args[1]);
        }


        youtube.getPlaylist(args[0])
            .then(playlist => {

                if (!playlist) {
                    return message.reply("No s'han trobat resultats!");
                }

                message.channel.send("Inserint " + mida + " cançons de la playlist " + playlist.title).then((msg) => {

                    playlist.getVideos(mida)
                        .then((videos) => {
                            let server = servers[message.guild.id];
                            for (let k = 0; k < videos.length; k++) {
                                server.queue.push({
                                    videoInfo: videos[k],
                                    video: ytdl(videos[k].url, { filter: "audioonly" })
                                });
                            }
                            msg.edit(`S'ha afegit la playlist amb ${videos.length} videos.`);
                            if (!message.guild.voiceConnection) {
                                message.member.voiceChannel.join().then((connection) => {

                                    server.nowPlayingVideo = server.queue[0].video;
                                    server.nowPlayingVideoInfo = server.queue[0].videoInfo;

                                    play(connection, message, msg);
                                });
                            }
                        })
                        .catch(console.error);
                });
            })
            .catch(() => {
                message.reply("Siusplau posa un link!");
                message.channel.send(server.prefix + "help playlist");
            });
    },
};