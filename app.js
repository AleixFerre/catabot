const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');

// HEROKU APP
const config = require("./config.json");
// const config = process.env;

// --------------------------------------

const youtube = new YouTube(config.GOOGLE_API_KEY);

var servers = {};

var prefix = config.prefix;

client.on("ready", () => {
    console.log("READY :: Version: " + config.version + '\nON ' + client.guilds.size + " servers");
    client.user.setPresence({
        status: "online",
        game: {
            name: client.guilds.size + " servers | " + prefix + "help",
            type: "WATCHING"
        }
    });
});

client.on('reconnecting', () => {
	console.log('Reconnecting!');
});

client.on('disconnect', () => {
	console.log('Disconnect!');
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'general');
    if (!channel) {
        return;
    }
    channel.send('Benvingut, ' + member + "!");
});

client.on('message', (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.channel.members) {
        // Estem a DM
        message.author.send("No es poden utilitzar les comandes aqui!");
        return;
    }

    switch (command) {
        

        // ----------------
        // PING
        // ----------------
        case 'ping': 
            var ping = Math.floor(message.client.ping);
            message.channel.send(":ping_pong: Pong!")
                .then(m => {
                    m.edit(`:incoming_envelope: Ping Missatges: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
                }).catch(console.error);        
        break;
        
        // ----------------
        // INVITE
        // ----------------
        case 'invite':
            // Get the invite link With admin permissions
            let link = 'https://discordapp.com/oauth2/authorize?client_id='+ config.clientid +'&permissions=8&scope=bot';

            const embedMessage = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Invite link')
                .setURL(link)
                .setAuthor('CataBOT', 'https://i.imgur.com/UXoPSuU.jpg', 'https://discord.js.org')
                .setDescription('Aqui tens el link')
                .setThumbnail('https://i.imgur.com/UXoPSuU.jpg')
                .setTimestamp()
                .setFooter('Convida amb precaució');

            message.author.send(embedMessage);

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete().catch(console.error);

        break;
        

        // ----------------
        // JOIN
        // ----------------
        case 'join':
            message.channel.send("Intentant entrar al canal de veu...").then(m => {
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join();
                    m.edit("He entrat al canal " + message.member.voiceChannel.name);
                } else {
                    m.edit("Posa't a un canal de veu perquè pugui unir-me.");
                }
            }).catch(console.error);

        break;


        // ----------------
        // PREFIX
        // ----------------
        case 'prefix':
            if (!args[0]) {
                message.channel.send("El prefix actual és: " + prefix);
            } else {
                // Si hi ha un segon argument, cambiem el prefix
                prefix = args[0];
                client.user.setPresence({
                    status: "online",
                    game: {
                        name: client.guilds.size + " servers | " + prefix + "help",
                        type: "WATCHING"
                    }
                });
                message.channel.send("El prefix ha cambiat a: " + prefix);
            }

        break;

        
        // ----------------
        // PLAY
        // ----------------
        case 'play':
            function play (connection, message, msg) {
                var server = servers[message.guild.id];

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
        
                var server = servers[message.guild.id];

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

        break;

        
        // ----------------
        // PLAYLIST
        // ----------------
        case 'playlist':

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
                    server = servers[message.guild.id];
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

        break;


        // ----------------
        // SKIP or NEXT
        // ----------------
        case 'skip':
        case 'next':
            message.channel.send("Passant a la següent cançó...").then((msg) => {
                server = servers[message.guild.id];
                if (server) {
                    if (server.dispatcher) {
                        server.dispatcher.end();
                    }
                } else {
                    msg.edit("No es pot passar a la següent cançó!");
                }
            });

        break;


        // ----------------
        // CLEAR
        // ----------------
        case 'clear':
            message.channel.send("Borrant la cua...").then((msg) => {
                server = servers[message.guild.id];
                if (message.guild.voiceConnection) {
                    if (server.queue.length > 0) {
                        for(var i = server.queue.length-1; i>=0; i--) {
                            server.queue.splice(i,1);
                        }
                        msg.edit("S'ha borrat la cua correctament!");
                    } else {
                        msg.edit("No hi ha elements a la cua!");
                    }
                } else {
                    msg.edit("Has d'estar en un canal de veu amb el bot!");
                }
            }).catch(console.error);

        break;


        // ----------------
        // SHUFFLE
        // ----------------
        case 'shuffle':

            async function shuffle(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            }

            message.channel.send("Barrejant la cua...").then((msg) => {
                server = servers[message.guild.id];
                if (server) {
                    if (server.queue.length > 1) {
                        shuffle(server.queue).then(() => {
                            msg.edit("S'ha barrejat amb èxit!\nFes !q o !queue per visualitzar-la");
                        }).catch(console.error);
                    } else {
                        msg.edit("No hi ha prous elements per barrejar!");
                    }
                } else {
                    msg.edit("No hi ha cua!");
                }
            }).catch(console.error);

        break;


        // ----------------
        // DELETE
        // ----------------
        case 'delete':

            function deleteHelp() {
                var dcontent = '**COM USAR EL DELETE?**\n```\n' +
                '-> ' + prefix + 'delete [ pos ]\n' + 
                '       Esborra la cançó de la posició que vulguis; per defecte la següent \n```\n';
                message.channel.send(dcontent);
            }

            let position = 1;
            if (args[1]) {
                position = args[1];
            }
            message.channel.send("Borrant la cançó de la posicio "+ position +"...").then((msg) => {
                server = servers[message.guild.id];
                if (server) {
                    if (server.queue.length > 0) {
                        if (server.queue[i-1]) {
                            server.queue.splice(i-1,1);
                        } else {
                            msg.edit("No existeix cap cançó a la posicio " + position);
                            deleteHelp();
                        }
                    } else {
                        msg.edit("La cua és buida!"); 
                        deleteHelp();
                    }
                } else {
                    msg.edit("No has creat cap cua encara!");
                    deleteHelp();
                }
            }).catch(console.error);

        break;


        // ----------------
        // STOP
        // ----------------
        case 'stop':
            message.channel.send("Borrant la cua i sortint del canal...");
            server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                for(var i = server.queue.length-1; i>=0; i--) {
                    server.queue.splice(i,1);
                }
                server.dispatcher.end();
                message.channel.send("S'ha borrat la cua i s'ha sortit del canal correctament!");
            }

            if (message.guild.connection) {
                message.guild.connection.voiceConnection.disconnect();
            }

        break;


        // ----------------
        // QUEUE or Q
        // ----------------
        case 'queue':
        case 'q':
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

        break;


        // ----------------
        // LEAVE
        // ----------------
        case 'leave':
            message.channel.send("Desconnectant...").then((msg) => {
                if(!message.guild.voiceConnection) {
                    msg.edit('No estic a cap canal de veu!');
                    return;
                }
                
                var userVoiceChannel = message.member.voiceChannel;
                if (!userVoiceChannel) {
                    msg.edit('No estàs a cap canal!');
                    return;
                }
                
                var clientVoiceConnection = message.guild.voiceConnection;
                if (userVoiceChannel === clientVoiceConnection.channel) {
                    clientVoiceConnection.disconnect();
                    msg.edit('Desconnectat correctament.');
                } else {
                    msg.edit('Només pots executar aquesta comanda si estàs al mateix canal que el bot!');
                }
            }).catch(console.error);

        break;


        // ----------------
        // SAY
        // ----------------
        case 'say':
            if (args[0]) {
                message.channel.send(args.join(" ")).catch(console.error);
            } else {
                message.reply("Què vols que digui?").catch(console.error);
            }
                
            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete().catch(console.error);

        break;


        // ---------------
        // KICK
        // ---------------
        case 'kick':
            function kickHelp() {
                var kcontent = '**COM USAR EL KICK?**\n```\n' +
                '-> ' + prefix + 'kick @user [ Descripció del kick ]\n' + 
                '       Expulsa permanentment la persona del servidor.\n' +
                '       Aquesta acció es pot desfer si ets Administrador \n```\n';

                message.channel.send(kcontent);
            }

            var user = args[0]; 
            if (user) {
                const member = message.guild.member(user);
                if (member) {
                    let kickmsg = 'Motiu del kick desconegut';
                    if (args[1]) kickmsg = args[1];

                    member.kick(kickmsg).then(() => {
                    // We let the message author know we were able to kick the person
                    message.reply("S'ha expulsat a " + user + " amb èxit.");
                    }).catch((err) => {
                        // An error happened
                        // This is generally due to the bot not being able to kick the member,
                        // either due to missing permissions or role hierarchy
                        message.reply('No es pot expulsar al membre.\nTens permisos?\nProva-ho manualment.');
                        kickHelp();
                        // Log the error
                        console.error(err);
                    });
                } else {
                    // The mentioned user isn't in this guild
                    message.reply('Aquesta persona no pertany al servidor');
                    kickHelp();
                }
            // Otherwise, if no user was mentioned
            } else {
                message.reply('Menciona a la persona que vols fer fora!');
                kickHelp();
            }
            
        break;


        // ---------------
        // BAN
        // ---------------
        case 'ban':
            function banHelp() {
                var kcontent = '**COM USAR EL BAN?**\n```\n' +
                '-> ' + prefix + 'ban @user [ Descripció del ban ]\n' + 
                '       Baneja la persona del servidor.\n' +
                '       Aquesta acció es pot desfer si ets Administrador \n```\n';

                message.channel.send(kcontent);
            }
            user = args[0];
            // If we have a user mentioned
            if (user) {
                // Now we get the member from the user
                const member = message.guild.member(user);
                // If the member is in the guild
                if (member) {
                    member.ban({
                    reason: args[0] + ' no seas malo... :/',
                    }).then(() => {
                        // We let the message author know we were able to ban the person
                        message.reply("S'ha banejat a " + user + " amb èxit.");
                    }).catch((err) => {
                        // An error happened
                        // This is generally due to the bot not being able to ban the member,
                        // either due to missing permissions or role hierarchy
                        message.reply('No es pot banejar a l\'usuari\nTens permisos?\nProba-ho manualment');
                        banHelp();
                        // Log the error
                        console.error(err);
                    });
                } else {
                    // The mentioned user isn't in this guild
                    message.reply('Aquest usuari no pertany al servidor!');
                    banHelp();
                }
            } else {
                // Otherwise, if no user was mentioned
                message.reply('A qui vols que faci fora?');
                banHelp();
            }
            
        break;


        // ----------------
        // HELP
        // ----------------
        case 'help':
        case 'h':
            var hcontent = '**COMANDES DEL CATABOT**\n```\n' +
            '-> ' + prefix + 'ping                  :: Comprova la latencia del bot i dels teus missatges.\n' +
            '-> ' + prefix + 'invite                :: T\'envia un missatge amb el invite link del bot.\n' +
            '-> ' + prefix + 'prefix [newPrefix]    :: Et mostra el prefix i et permet cambiar-lo amb un segon argument\n' +
            '-> ' + prefix + 'join                  :: Entra dins del teu canal de veu\n' +
            '-> ' + prefix + 'play <link, cerca>    :: Posa la musica que vulguis amb un link\n' +
            '-> ' + prefix + 'playlist <link>       :: Posa la musica que vulguis amb un link\n' +
            '-> ' + prefix + 'skip/next             :: Passa a la següent de la cua\n' +
            '-> ' + prefix + 'q/queue               :: Mostra la cua\n' +
            '-> ' + prefix + 'shuffle               :: Barreja la cua\n' +
            '-> ' + prefix + 'stop                  :: Borra tota la cua i desconnecta el bot del canal\n' +
            '-> ' + prefix + 'delete [pos]          :: Esborra la cançó de la posició que vulguis; per defecte, la següent\n' +
            '-> ' + prefix + 'leave                 :: Se\'n va del canal de veu.\n```' +
            '**COMANDES DE MODERACIÓ**\n```\n' +
            '-> ' + prefix + 'kick <@user> [desc] 	:: Expulsa permanentment un usuari del servidor\n' +
            '-> ' + prefix + 'ban  <@user> [desc] 	:: Beta un usuari del servidor\n```';
            
            message.author.send(hcontent).catch(console.error);
            
            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete().catch(console.error);
            
        break;
    }

});

client.login(config.token);


