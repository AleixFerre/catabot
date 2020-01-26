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
    console.log("Estic llest! Ver: " + config.version);
    client.user.setPresence({
        status: "online",
        game: {
            name: prefix + "help :: Version " + config.version,
            type: "PLAYING"
        }
    });
});


client.on('message', (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    switch (command) {
    
        case 'ping': 
            var ping = Math.floor(message.client.ping);
            message.channel.send(":ping_pong: Pong!")
                .then(m => {
                    m.edit(`:incoming_envelope: Ping Missatges: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
                });
        break;
		
		case 'prova': 
            message.channel.send("Prova de reply");
        break;
        
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

        case 'prefix':
            if (!args[0]) {
                message.channel.send("El prefix actual és: " + prefix);
            } else {
                // Si hi ha un segon argument, cambiem el prefix
                prefix = args[0];
                client.user.setPresence({
                    status: "online",
                    game: {
                        name: prefix + "help",
                        type: "PLAYING"
                    }
                });
                message.channel.send("El prefix ha cambiat a: " + prefix);
            }
        break;


        case 'play':
            function play (connection, message) {

                var server = servers[message.guild.id];
                
                console.log(server.queue[0]);

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
                
                server.queue.shift();
                
                server.dispatcher.on("end", function() {
                    if (server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }
                });
            }
    
            if (!args[0]) {
                message.channel.send("Necessito un link!");
                return;
            }
    
            if (!message.member.voiceChannel) {
                message.channel.send("Posa't a un canal de veu perquè pugui unir-me.");
                return;
            }
    
            // Creem la cua de cançons...
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                };
            }
    
            var server = servers[message.guild.id];
            
            server.queue.push(args[0]);
    
            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then(function(connection) {
                    play(connection, message);
                });
            }
        break;

        case 'skip':
            server = servers[message.guild.id];
            if (server.dispatcher) {
                server.dispatcher.end();
            }
            message.channel.send("Passant a la següent cançó...");
        break;

        case 'stop':
            server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                for(var i = server.queue.length-1; i>=0; i--) {
                    server.queue.splice(i,1);
                }
                server.dispatcher.end();
                message.channel.send("Borrant la cua i sortint del canal...");
                console.log('stopped the queue');
            }

            if (message.guild.connection) {
                message.guild.connection.voiceConnection.disconnect();
            }
        break;

        case 'q':
            server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                if (server.queue.length < 1) {
                    message.channel.send("No hi ha elements a la cua!");
                } else {
                    var content = "**CUA DE CANÇONS**\n```\n";
                    
                    for(var j=0; j<server.queue.length; j++) {
                        content += (j+1) + ' ' + server.queue[j] + '\n';
                    }
                    message.channel.send(content + "```\n");
                }
            } else {
                message.channel.send("No s'ha creat cap cua encara!");
            }
        break;

        case 'leave':
            if(!message.guild.voiceConnection) {
                message.channel.send('No estic a cap canal de veu!');
                return;
            }

            var userVoiceChannel = message.member.voiceChannel;
            if (!userVoiceChannel) {
                message.channel.send('No estàs a cap canal!');
                return;
            }

            var clientVoiceConnection = message.guild.voiceConnection;
            if (userVoiceChannel === clientVoiceConnection.channel) {
                clientVoiceConnection.disconnect();
                message.channel.send('Desconnectat correctament.');
            } else {
                message.channel.send('Només pots executar aquesta comanda si estàs al mateix canal que el bot!');
            }
        break;

        case 'help':
        case 'h':
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

// HEROKU APP
//client.login(config.token);
client.login(process.env.token);


