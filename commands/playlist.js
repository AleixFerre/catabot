const { GOOGLE_API_KEY } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
	name: 'playlist',
	description: 'Posa les primeres n cançons d\'una llista de reproducció, per defecte 20',
	usage: '< link_playlist > [ n_cançons <= 20 ]',
	execute(message, args, servers) {
        
        function play (connection, message, msg) {
            let server = servers[message.guild.id];

            try {
                server.dispatcher = connection.playStream(server.queue[0].video);
                // msg.edit("S'està reproduint: " + server.queue[0].videoInfo.title + "\n" + server.queue[0].videoInfo.url);
            } catch (error) {
                msg.edit("--> " + error + '\n Link: ' + server.queue[0].videoInfo.url);
            }
            
            if (!server.loop) {
                server.queue.shift();
            }
            
            server.dispatcher.on("end", function() {
                if (server.queue[0]) {
                    play(connection, message, msg);
                } else {
                    connection.disconnect();
                }
            });
        }

        if (!message.member.voiceChannel) {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
            return;
        }

        if (!args[0]) {
            message.reply("Posa el link de la playlist que vulguis!");
            message.channel.send(server.prefix + "help playlist");
            return;
        }

        if (!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: [],
                nowInfo: [],
                prefix: '!',
                loop: false
            };
        }

        youtube.getPlaylist(args[0])
        .then(playlist => {
            message.channel.send(`Inserint la playlist "${playlist.title}"`);
            let mida = 20;
            if (args[1]) {
                mida = args[1];
            }
            playlist.getVideos(mida)
            .then(videos => {
                let server = servers[message.guild.id];
                for(let k=0; k<videos.length; k++) {
                    server.queue.push({
                        videoInfo: videos[k],
                        video: ytdl(videos[k].url, {filter: "audioonly"})
                    });
                }
                message.channel.send(`S'ha afegit la playlist amb ${videos.length} videos.`);
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join().then((connection) => {
                        message.channel.send(`Reproduint...`).then((msg) => {
                            play(connection, message, msg);
                        });
                    });
                }
            })
            .catch(console.error);
        })
        .catch( (err) => {
            message.reply("Siusplau posa un link!");
            message.channel.send("!help playlist");
        });
	},
};