const { GOOGLE_API_KEY } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
	name: 'search',
	description: 'Mostra els 10 primers resultats de YouTube i pots escollir',
    usage: '< cerca >',
	type: 'musica',
	execute(message, args, servers) {

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

        let prefix = servers[message.guild.id].prefix;

        if (!args[0]) {
            message.reply("necessito saber el què buscar...");
            message.channel.send(prefix + "help search");
            return;
        }

        if (!message.member.voiceChannel) {
            message.reply("necessito que primer et posis a un canal de veu");
            message.channel.send(prefix + "help search");
            return;
        }

        let cerca = "";

        for(let i=0; i<args.length; i++) {
            cerca += args[i] + " ";
        }

        message.channel.send('Cercant ' + cerca + '...').then((msg) => {
            youtube.searchVideos(cerca, 10)
            .then(async (results) => {
                let content = "**CERCA per "+ cerca +"**\n```";
                if (results.length === 0) {
                    content += "No s'han trobat resultats per " + cerca;
                    msg.edit(content + '```');
                    return;
                }

                let i = 1;
                results.forEach((res) => {
                    content += i + '.- ' + res.title + '\n';
                    i++;
                });
                
                msg.edit(content + '```');

                msg.channel.send("Espera a que carreguin les reaccions...").then( async (msg_react) => {

                    // Create reactions
                    // :one: :two: :three: :four: :five: :six: :seven: :eight: :nine: :keycap_ten: 
                    try {
                        await msg.react('1️⃣');
                        await msg.react('2️⃣');
                        await msg.react('3️⃣');
                        await msg.react('4️⃣');
                        await msg.react('5️⃣');
                        await msg.react('6️⃣');
                        await msg.react('7️⃣');
                        await msg.react('8️⃣');
                        await msg.react('9️⃣');
                        await msg.react('🔟');
                        await msg.react('❌');
                    } catch (error) {
                        console.error('One of the emojis failed to react.');
                    }

                    // Await for user reactions 15s
                    // Creem un filtre perque només detecti les reaccions valides i de l'usuari que ho ha solicitat
                    const filter = (reaction, user) => (reaction.emoji.name === '1️⃣' ||
                                                        reaction.emoji.name === '2️⃣' || 
                                                        reaction.emoji.name === '3️⃣' || 
                                                        reaction.emoji.name === '4️⃣' || 
                                                        reaction.emoji.name === '5️⃣' || 
                                                        reaction.emoji.name === '6️⃣' || 
                                                        reaction.emoji.name === '7️⃣' || 
                                                        reaction.emoji.name === '8️⃣' || 
                                                        reaction.emoji.name === '9️⃣' || 
                                                        reaction.emoji.name === '🔟' || 
                                                        reaction.emoji.name === '❌' ) &&
                                                        user.id === message.author.id;
                
                    msg_react.edit("Esperant la resposta (15s)...").then((waiting) => {
                        msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time']})
                        .then((collected) => {
                            
                            waiting.delete();

                            if (collected.length === 0) {
                                message.reply("no has escollit res!!");
                                message.channel.send("!help search");
                                msg.delete();
                                return;
                            }

                            // Then queue the proper song
                            // Actually we can send !play <results[i-1].url> after join the member
                            let id = 1;
                            const reaction = collected.first();
                            
                            switch(reaction.emoji.name) {
                                case '1️⃣':
                                    id = 1;
                                break;
                                case '2️⃣':
                                    id = 2;
                                break;
                                case '3️⃣':
                                    id = 3;
                                break;
                                case '4️⃣':
                                    id = 4;
                                break;
                                case '5️⃣':
                                    id = 5;
                                break;
                                case '6️⃣':
                                    id = 6;
                                break;
                                case '7️⃣':
                                    id = 7;
                                break;
                                case '8️⃣':
                                    id = 8;
                                break;
                                case '9️⃣':
                                    id = 9;
                                break;
                                case '🔟':
                                    id = 10;
                                break;
                                case '❌':
                                    id = -1;
                                break;
                            }

                            if (id === -1) return msg.delete();
                            
                            let server = servers[message.guild.id];

                            server.queue.push({
                                video: ytdl(results[id-1].url, {filter: "audioonly"}),
                                videoInfo: results[id-1]
                            });

                            msg.clearReactions();

                            if (!message.guild.voiceConnection) {
                                server.nowPlayingVideo = server.queue[0].video;
                                server.nowPlayingVideoInfo = server.queue[0].videoInfo;
            
                                message.member.voiceChannel.join().then((connection) => {
                                    play(connection, server, msg);
                                });
                            }
                            
                            // ---------------------------------
                            function play (connection, server, msg) {
                                
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
                    
                                    // Next song
                                    server.queue.shift();
                                }
                                
                                server.dispatcher.on("end", function() {
                                    if (server.queue[0] || server.loop) {
                                        play(connection, server, msg);
                                    } else {
                                        connection.disconnect();
                                    }
                                });
                            }
                            // ---------------------------------

                        }).catch(console.error);

                    }).catch(console.error);
                    
                }).catch(console.error);

            }).catch(console.error);

        });
    }
};