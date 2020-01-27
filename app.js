const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");

// HEROKU APP
const config = require("./config.json");
// const config = process.env;

// --------------------------------------

var servers = {};

var prefix = config.prefix;

client.on("ready", () => {
    console.log("Estic llest :: Version: " + config.version);
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

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'member-log');
    if (!channel) {
        return;
    }
    channel.send('Benvingut, ' + member + "!");
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

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();
        
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

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();

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

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();
        
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

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();

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

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();

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

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();

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

            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();

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
                    /**
                     * Kick the member
                     * Make sure you run this on a member, not a user!
                     * There are big differences between a user and a member
                     */
                    let kickmsg = 'Motiu del kick desconegut';
                    if (args[1]) kickmsg = args[1];

                    member.kick(kickmsg).then(() => {
                    // We let the message author know we were able to kick the person
                    message.reply("S'ha expulsat a " + user + " amb èxit.");
                    }).catch(err => {
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
            // Les comandes de moderació no s'esborren per mantindre l'ordre i saber qui ha
            // executat cada comanda
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
                    }).catch(err => {
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
            // Les comandes de moderació no s'esborren per mantindre l'ordre i saber qui ha
            // executat cada comanda
        break;


        // ----------------
        // HELP
        // ----------------
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
            '-> ' + prefix + 'leave     :: Se\'n va del canal de veu.\n```\n\n' +
            '**COMANDES DE MODERACIÓ**\n```\n' +
            '-> ' + prefix + 'kick @user [desc] :: Expulsa permanentment un usuari del servidor\n' +
            '-> ' + prefix + 'ban  @user [desc] :: Beta un usuari del servidor\n```\n\n';
            
            message.channel.send(hcontent);
            
            // Per mantindre el xat net, esborrem el missatge de l'usuari
            message.delete();
            
        break;
    }
});

client.login(config.token);


