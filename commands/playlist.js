const { GOOGLE_API_KEY } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
	name: 'playlist',
	description: 'Posa les primeres 20 cançons d\'una llista de reproducció',
	usage: '< link_playlist >',
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

        if (!message.member.voiceChannel) {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
            return;
        }

        if (!args[0]) {
            message.reply("Posa el link de la playlist que vulguis!");
            return;
        }

        if (!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: []
            };
        }

        youtube.getPlaylist(args[0])
        .then(playlist => {
            message.channel.send(`Inserint la playlist "${playlist.title}"`);
            playlist.getVideos(20)
            .then(videos => {
                let server = servers[message.guild.id];
                for(let k=0; k<videos.length; k++) {
                    server.queue.push(videos[k]);
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
        .catch(console.error);
	},
};