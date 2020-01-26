const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("_config.json");
const ytdl = require("ytdl-core");

let servers = {};
let prefix = config.prefix;

client.on("ready", () => {
    console.log("Estic llest!");
    client.user.setPresence({
        status: "online",
        game: {
            name: prefix + "help",
            type: "PLAYING"
        }
    });
});


client.on('message', (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    switch (command) {
    
        case 'ping': 
            let ping = Math.floor(message.client.ping);
            message.channel.send(":ping_pong: Pong!")
                .then(m => {
                    m.edit(`:incoming_envelope: Ping Missatges: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
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
                let server = servers[message.guild.id];
                servers.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
                server.queue.shift();
                server.dispatcher.on("end", function(){
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
    
            if (!message.channel.voiceChannel) {
                message.channel.send("Posa't a un canal de veu perquè pugui unir-me.");
                return;
            }
    
            // Creem la cua de cançons...
            if (!servers[message.guild.id]) {
                servers.guild.id = {
                    queue: []
                };
            }
    
            let server = servers[message.guild.id];
    
            server.queue.push(args[1]);
    
            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then(function(connection) {
                    play(connection, message);
                });
                
            }
        break;

        case 'leave':
            let canalvoz = message.member.voiceChannel;
            if (!canalvoz) {
                message.channel.send('No estic en cap canal de veu!');
            } else {
                message.channel.send('Deixant el canal de veu...').then(() => {
                    canalvoz.leave();
                }).catch(error => message.channel.send(error));
            }
        break;

        case 'help':
            message.channel.send('**COMANDES DEL CATABOT**\n```\n' +
            '-> ' + prefix + 'ping           :: Comprova la latencia del bot i dels teus missatges.\n' +
            '-> ' + prefix + 'prefix         :: Et mostra el prefix i et permet cambiar-lo amb un segon argument\n' +
            '-> ' + prefix + 'play           :: Posa la musica que vulguis amb un link\n' +
            '-> ' + prefix + 'leave          :: Se\'n va del canal de veu.\n```\n\n');
        break;

    }

});
client.login(config.token);



