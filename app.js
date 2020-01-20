const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");



client.on("ready", () => {
    console.log("Estoy listo!");
    client.user.setPresence({
        status: "online",
        game: {
            name: ".comandos",
            type: "PLAYING"
        }
    });

});

let prefix = config.prefix;

client.on("message", (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "hola") {
        //let user = message.mention.users.first();
        message.channel.send('**' + message.author.tag + '** pa ti mi cola');
    }

    if (command === "uwu") {
        //let user = message.mention.users.first();
        message.channel.send('**' + message.author.tag + '** uwu');
    }

    if (command === "embed") {
        message.channel.send({
            embed: {
                color: 3447003,
                description: "Esto es un simple mensaje embed."
            }
        });
    }

    if (command === "manueh") {
        message.channel.send("worst player euw. Elo: hell (Iron 4)").then(msgSent => {
            msgSent.react("✅")
        });
    }

    if (command === "españita") {
        message.channel.send(":flag_ea:").then(msgSent => {
            msgSent.react("✅")
        });
    }

    if (command === "say") {
        let texto = args.join(" ");
        message.delete(1000);
        message.channel.send(texto);
    }

    if (command === "richembed") {
        const embed = new Discord.RichEmbed()
            .setTitle("Este es su título, puede contener 256 caracteres")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor(0x00AE86)
            .setDescription("Este es el cuerpo principal del texto, puede contener 2048 caracteres.")
            .setFooter("Pie de página, puede contener 2048 caracteres", client.user.avatarURL)
            .setImage(message.author.avatarURL)
            .setThumbnail(message.author.avatarURL)
            .setTimestamp()
            .setURL("https://github.com/CraterMaik")
            .addField("Este es un título de campo, puede contener 256 caracteres",
                "Este es un valor de campo, puede contener 2048 caracteres.")
            .addField("Campo en línea", "Debajo del campo en línea", true)
            .addBlankField(true)
            .addField("Campo en línea 3", "Puede tener un máximo de 25 campos.", true);

        message.channel.send({
            embed
        });
    }

    if (command === 'avatar') {

        let img = message.mentions.users.first()
        if (!img) {

            const embed = new Discord.RichEmbed()
                .setImage(`${message.author.avatarURL}`)
                .setColor(0x66b3ff)
                .setFooter(`Avatar de ${message.author.username}#${message.author.discriminator}`);
            message.channel.send({
                embed
            });

        } else if (img.avatarURL === null) {

            message.channel.sendMessage("El usuario (" + img.username + ") no tiene avatar!");

        } else {

            const embed = new Discord.RichEmbed()
                .setImage(`${img.avatarURL}`)
                .setColor(0x66b3ff)
                .setFooter(`Avatar de ${img.username}#${img.discriminator}`);
            message.channel.send({
                embed
            });

        };

    }

    if (command === 'ping') {

        let ping = Math.floor(message.client.ping);

        message.channel.send(":ping_pong: Pong!")
            .then(m => {

                m.edit(`:incoming_envelope: Ping Mensajes: \`${Math.floor(m.createdTimestamp - Date.now())} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);

            });

    }

    if (command === 'server') {

        var server = message.guild;

        const embed = new Discord.RichEmbed()
            .setThumbnail(server.iconURL)
            .setAuthor(server.name, server.iconURL)
            .addField('ID', server.id, true)
            .addField('Region', server.region, true)
            .addField('Creado el', server.joinedAt.toDateString(), true)
            .addField('Dueño del Servidor', server.owner.user.username + '#' + server.owner.user.discriminator + ' (' + server.owner.user.id + ')', true)
            .addField('Miembros', server.memberCount, true)
            .addField('Roles', server.roles.size, true)
            .setColor(0x66b3ff)

        message.channel.send({
            embed
        });

    }

    if (command === 'user') {
        let userm = message.mentions.users.first()
        if (!userm) {
            var user = message.author;

            const embed = new Discord.RichEmbed()
                .setThumbnail(user.avatarURL)
                .setAuthor(user.username + '#' + user.discriminator, user.avatarURL)
                .addField('Jugando a', user.presence.game != null ? user.presence.game.name : "Nada", true)
                .addField('ID', user.id, true)
                .addField('Estado', user.presence.status, true)
                .addField('Apodo', message.member.nickname, true)
                .addField('Cuenta Creada', user.createdAt.toDateString(), true)
                .addField('Fecha de Ingreso', message.member.joinedAt.toDateString())
                .addField('Roles', message.member.roles.map(roles => `\`${roles.name}\``).join(', '))
                .setColor(0x66b3ff)

            message.channel.send({
                embed
            });
        } else {
            const embed = new Discord.RichEmbed()
                .setThumbnail(userm.avatarURL)
                .setAuthor(userm.username + '#' + userm.discriminator, userm.avatarURL)
                .addField('Jugando a', userm.presence.game != null ? userm.presence.game.name : "Nada", true)
                .addField('ID', userm.id, true)
                .addField('Estado', userm.presence.status, true)
                .addField('Cuenta Creada', userm.createdAt.toDateString(), true)
                .setColor(0x66b3ff)

            message.channel.send({
                embed
            });
        }
    }

    if (command === 'join') {
        let Canalvoz = message.member.voiceChannel;
        if (!Canalvoz || Canalvoz.type !== 'voice') {
            message.channel.send('¡Necesitas unirte a un canal de voz primero!.').catch(error => message.channel.send(error));
        } else if (message.guild.voiceConnection) {
            message.channel.send('Ya estoy conectado en un canal de voz.');
        } else {
            message.channel.send('Conectando...').then(m => {
                Canalvoz.join().then(() => {
                    m.edit(':white_check_mark: | Conectado exitosamente.').catch(error => message.channel.send(error));
                }).catch(error => message.channel.send(error));
            }).catch(error => message.channel.send(error));
        }
    }

    if (command === 'leave') {
        let Canalvoz = message.member.voiceChannel;
        if (!Canalvoz) {
            message.channel.send('No estoy en un canal de voz.');
        } else {
            message.channel.send('Dejando el canal de voz.').then(() => {
                Canalvoz.leave();
            }).catch(error => message.channel.send(error));
        }
    }

    if (command === 'play') {
        let Canalvoz = message.member.voiceChannel;
        if (!Canalvoz) return message.channel.send('Primero debo unirme a un canal de voz.');
        const dispatcher = message.guild.voiceConnection.playFile(`C:/Users/Desktop/audio.mp3`);
    }

    if (command === 'comandos') {
        message.channel.send('**COMANDOS DE CATABOT**\n```\n' +
            '-> ' + prefix + 'ping           :: Comprueba la latencia del bot y de tus mensajes.\n' +
            '-> ' + prefix + 'avatar <@user> :: Muestra el avatar de un usuario.\n' +
            '-> ' + prefix + 'user <@user>   :: Muestra información sobre un usuario mencioando.\n' +
            '-> ' + prefix + 'server         :: Muestra información de un servidor determinado.\n' +
            '-> ' + prefix + 'españita       :: Muestra la bandera de NUESTRO PAIS.\n' +
            '-> ' + prefix + 'hola           :: Retorna un saludo como mensaje.\n' +
            '-> ' + prefix + 'uwu            :: Retorna uwu.\n' +
            '-> ' + prefix + 'say            :: Haz que el bot diga lo que quieras\n' +
            '-> ' + prefix + 'manueh         :: Muestra información de @ElManueh.\n' +
            '-> ' + prefix + 'join           :: Entra en el canal de voz en el que estés.\n' +
            '-> ' + prefix + 'leave          :: Se va del canal de voz.\n```\n\n');

    }

});
client.login(config.token);