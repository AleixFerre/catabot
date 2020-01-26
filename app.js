const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");

// HEROKU APP
// const config = require("./config.json");
const config = process.env;

// --------------------------------------

var servers = {};

var prefix = config.prefix;

client.on("ready", () => {
    console.log("Estic llest! Version: " + config.version);
    client.user.setPresence({
        status: "online",
        game: {
            name: prefix + "help :: Version " + config.version,
            type: "PLAYING"
        }
    });
});

client.on('reconnecting', () => {
	console.log('Reconnecting!');
});

client.on('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    switch (command) {
    
        // ----------------
        // JOIN
        // ----------------
        case 'ping': 
            var ping = Math.floor(message.client.ping);
            message.channel.send(":ping_pong: Pong!")
                .then(m => {
                    m.edit(`:incoming_envelope: Ping Missatges: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
                });
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
            });
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
                        name: prefix + "help :: Version " + config.version,
                        type: "PLAYING"
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
                    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
                    msg.edit("S'està reproduint: " + server.queue[0]);
                } catch (error) {
                    msg.edit("--> " + error);
                }
                
                server.queue.shift();
                
                server.dispatcher.on("end", function() {
                    if (server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }
                });
            }
            
            let pattern = RegExp("/https?:\/\/www.youtube.com\/watch\?v=+.{11}/", "g");
            if (!args[0]) {
                message.channel.send("Necessito un link!");
                return;
            } else if (pattern.test(args[0])) {
                message.channel.send("Necessito un link vàlid!");
                return;
            }
    
            if (!message.member.voiceChannel) {
                message.channel.send("Posa't a un canal de veu perquè pugui unir-me.");
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
                server.queue.push(args[0]);

                msg.edit("S'ha afegit a la cua: " + args[0]);
        
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join().then((connection) => {
                        play(connection, message, msg);
                    });
                }
            });

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();

        break;


        // ----------------
        // SKIP
        // ----------------
        case 'skip':
            message.channel.send("Passant a la següent cançó...").then((msg) => {
                server = servers[message.guild.id];
                if (server) {
                    if (server.dispatcher) {
                        server.dispatcher.end();
                    }
                    msg.edit("Cançó actual: " + server.queue[0]);
                } else {
                    msg.edit("No es pot passar a la següent cançó!");
                }
            });
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
                console.log('stopped the queue');
            }

            if (message.guild.connection) {
                message.guild.connection.voiceConnection.disconnect();
            }
        break;


        // ----------------
        // QUEUE
        // ----------------
        case 'q':
            server = servers[message.guild.id];
            message.channel.send("Obtenint cua...").then((msg) => {
                if (message.guild.voiceConnection) {
                    if (server.queue.length < 1) {
                        msg.edit("No hi ha elements a la cua!");
                    } else {
                        var content = "**CUA DE CANÇONS**\n```\n";
                        
                        for(var j=0; j<server.queue.length; j++) {
                            content += (j+1) + ' ' + server.queue[j] + '\n';
                        }
                        msg.edit(content + "```\n");
                    }
                } else {
                    msg.edit("No s'ha creat cap cua encara!");
                }
            });
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
            });
        break;


        // ----------------
        // HELP
        // ----------------
        case 'help':
        case 'h':
        default:
            var hcontent = '**COMANDES DEL CATABOT**\n```\n' +
            '-> ' + prefix + 'ping      :: Comprova la latencia del bot i dels teus missatges.\n' +
            '-> ' + prefix + 'prefix    :: Et mostra el prefix i et permet cambiar-lo amb un segon argument\n' +
            '-> ' + prefix + 'join      :: Entra dins del teu canal de veu\n' +
            '-> ' + prefix + 'play      :: Posa la musica que vulguis amb un link\n' +
            '-> ' + prefix + 'skip      :: Passa a la següent de la cua\n' +
            '-> ' + prefix + 'q         :: Mostra la cua\n' +
            '-> ' + prefix + 'stop      :: Borra tota la cua i desconnecta el bot del canal\n' +
            '-> ' + prefix + 'leave     :: Se\'n va del canal de veu.\n```\n\n';
            
            message.channel.send(hcontent);
        break;
    }
});

client.login(config.token);


