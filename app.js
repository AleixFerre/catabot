const fs = require('fs');
const Canvas = require('canvas');
const moment = require('moment');
const mongoose = require('mongoose');
require('dotenv').config();

const chalk = require('chalk');
const log = chalk.bold.green;
const remove = chalk.bold.red;
const bot = chalk.bold.blue;
const db = chalk.bold.cyan;

// Database facade functions
const {
    updateUser,
    updateServer
} = require('./lib/database.js');

const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

moment().utcOffset('120');

const cooldowns = new Map();

let userData = JSON.parse(fs.readFileSync("./Storage/userData.json", "utf8"));
let serversInfo = JSON.parse(fs.readFileSync("./Storage/servers.json", "utf8"));

let cmds = [];

/// Load the commands from all the folders -> files
const commandDirs = fs.readdirSync('./commands');
for (const dir of commandDirs) {
    const files = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const command = require(`./commands/${dir}/${file}`);
        client.commands.set(command.name, command);
        let usage = "";
        if (command.usage) {
            usage = command.usage;
        }
        cmds.push({
            name: command.name,
            description: command.description,
            type: command.type,
            usage: "!" + command.name + (usage.length !== 0 ? " " + usage : ""),
            aliases: command.aliases
        });
    }
}

fs.writeFile('docs/Storage/commands.json', JSON.stringify(cmds), (err) => {
    if (err) console.error(err);
});

let servers = {}; ///< The data structure that handles all the info for the servers

client.on("ready", async () => {
    for (let guild of client.guilds.cache) {
        guild = guild[1];

        updateServer(guild.id, {
            serverID: guild.id,
            prefix: process.env.prefix,
        }).then(() => {
            console.log(db(`DB: Actualitzat server ${guild.name} correctament!`));
        });

        let members = await guild.members.fetch();
        members.forEach((member) => {

            updateUser([member.id, guild.id], {
                "ID.userID": member.id,
                "ID.serverID": guild.id
            }).then(console.log(db(`* DB: Actualitzat usuari ${member.user.username} correctament!`)));

            if (!userData[guild.id + member.user.id])
                userData[guild.id + member.user.id] = {};

            if (!userData[guild.id + member.user.id].money) {
                if (userData[guild.id + member.user.id].money !== 0) {
                    if (member.user.bot)
                        userData[guild.id + member.user.id].money = -1;
                    else
                        userData[guild.id + member.user.id].money = Math.round(Math.random() * 1000);
                }
            }

            if (!userData[guild.id + member.user.id].lastDaily) {
                if (!member.user.bot)
                    userData[guild.id + member.user.id].lastDaily = "Not Collected";
            }

            if (!userData[guild.id + member.user.id].level) {
                if (!member.user.bot)
                    userData[guild.id + member.user.id].level = 1;
            }

            if (!userData[guild.id + member.user.id].xp) {
                if (!member.user.bot)
                    userData[guild.id + member.user.id].xp = 0;
            }
        });


        console.log(log(guild.name + ": " + guild.memberCount + " members"));


        if (!serversInfo[guild.id]) {
            serversInfo[guild.id] = {};
        }
        if (!serversInfo[guild.id].prefix) {
            serversInfo[guild.id].prefix = process.env.prefix;
        }
        if (!serversInfo[guild.id].alertChannel) {
            serversInfo[guild.id].alertChannel = null;
        }
        if (!serversInfo[guild.id].botChannel) {
            serversInfo[guild.id].botChannel = null;
        }
        if (!serversInfo[guild.id].counterChannel) {
            serversInfo[guild.id].counterChannel = null;
        }
        if (!serversInfo[guild.id].counterChannelName) {
            serversInfo[guild.id].counterChannelName = null;
        }
        if (!serversInfo[guild.id].welcomeChannel) {
            serversInfo[guild.id].welcomeChannel = null;
        }

        if (!servers[guild.id]) {
            servers[guild.id] = {
                prefix: serversInfo[guild.id].prefix,
                alertChannel: serversInfo[guild.id].alertChannel,
                botChannel: serversInfo[guild.id].botChannel,
                counterChannel: serversInfo[guild.id].counterChannel,
                counterChannelName: serversInfo[guild.id].counterChannelName,
                welcomeChannel: serversInfo[guild.id].welcomeChannel,
            };
        }

        try {
            let newName = "[ " + servers[guild.id].prefix + " ] CataBOT";
            guild.members.fetch(process.env.clientid).then((member) => {
                member.setNickname(newName);
            });
        } catch (err) {
            console.error(err);
        }

        if (servers[guild.id].counterChannel) {
            // Existeix un canal de contador, afegim un setInterval cada 12h
            setInterval(() => {
                guild.channels.resolve(servers[guild.id].counterChannel).setName("members " + guild.memberCount);
            }, 12 * 3600000);
        }
    }

    client.user.setPresence({
        status: "online",
        activity: {
            name: "catalahd.github.io/CataBot",
            type: "WATCHING"
        }
    });

    console.log(log("\nREADY :: Version " + process.env.version + "\nON " + client.guilds.cache.size + " servers with " + cmds.length + " commands\n" +
        "---------------------------------"));

    //! TODO: TREURE AIXÒ
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    });

    //! TODO: TREURE AIXÒ
    fs.writeFile('Storage/servers.json', JSON.stringify(serversInfo), (err) => {
        if (err) console.error(err);
    });

});

client.on("guildCreate", (guild) => {

    guild.members.fetch().then((members) => {
        members.forEach(member => {
            if (!userData[guild.id + member.user.id])
                userData[guild.id + member.user.id] = {};

            if (!userData[guild.id + member.user.id].money) {
                if (userData[guild.id + member.user.id].money !== 0) {
                    if (member.user.bot)
                        userData[guild.id + member.user.id].money = -1;
                    else
                        userData[guild.id + member.user.id].money = Math.round(Math.random() * 1000);
                }
            }

            if (!userData[guild.id + member.user.id].lastDaily) {
                if (!member.user.bot)
                    userData[guild.id + member.user.id].lastDaily = "Not Collected";
            }

            if (!userData[guild.id + member.user.id].level) {
                if (!member.user.bot)
                    userData[guild.id + member.user.id].level = 1;
            }

            if (!userData[guild.id + member.user.id].xp) {
                if (!member.user.bot)
                    userData[guild.id + member.user.id].xp = 0;
            }
        });
    });

    if (!serversInfo[guild.id]) {
        serversInfo[guild.id] = {};
    }
    if (!serversInfo[guild.id].prefix) {
        serversInfo[guild.id].prefix = process.env.prefix;
    }
    if (!serversInfo[guild.id].alertChannel) {
        serversInfo[guild.id].alertChannel = null;
    }
    if (!serversInfo[guild.id].botChannel) {
        serversInfo[guild.id].botChannel = null;
    }
    if (!serversInfo[guild.id].counterChannel) {
        serversInfo[guild.id].counterChannel = null;
    }
    if (!serversInfo[guild.id].counterChannelName) {
        serversInfo[guild.id].counterChannelName = null;
    }
    if (!serversInfo[guild.id].welcomeChannel) {
        serversInfo[guild.id].welcomeChannel = null;
    }

    if (!servers[guild.id]) {
        servers[guild.id] = {
            prefix: serversInfo[guild.id].prefix,
            alertChannel: serversInfo[guild.id].alertChannel,
            botChannel: serversInfo[guild.id].botChannel,
            counterChannel: serversInfo[guild.id].counterChannel,
            counterChannelName: serversInfo[guild.id].counterChannelName,
            welcomeChannel: serversInfo[guild.id].welcomeChannel,
        };
    }

    try {
        let newName = "[ " + serversInfo[guild.id].prefix + " ] CataBOT";
        guild.members.cache.get(process.env.clientid).setNickname(newName);
    } catch (err) {
        console.error(err);
    }

    // Enviem el missatge al owner de la guild
    let introMessage = "**DONA LA BENVINGUDA AL CATABOT!**\n" +
        "El primer bot de Discord en català!\n\n" +
        "**process.envURACIÓ GENERAL**\n" +
        "El bot permet executar una serie de comandes automàtiques sempre que un ADMINISTRADOR ho decideixi. També cal saber que totes les comandes de tipus MOD requereixen un rol d'ADMINISTRADOR per ser executades.\n" +
        "- El bot permet cambiar el prefix per defecte amb la comanda `" + serversInfo[guild.id].prefix + "prefix [prefix nou]` amb un màxim de 5 caràcters.\n" +
        "- També es pot process.envurar un canal de benvinguda perque digui Hola i Adeu a tots els integrants nous i passats del servidor amb `" + serversInfo[guild.id].prefix + "setwelcome`. També pots provar amb `" + serversInfo[guild.id].prefix + "welcome` i `" + serversInfo[guild.id].prefix + "bye`\n" +
        "- Es pot process.envurar un canal d'avisos amb `" + serversInfo[guild.id].prefix + "setalert`. En aquest canal s'avisarà de totes les novetats del bot.\n" +
        "- Finalment, es pot process.envurar un canal del bot amb `" + serversInfo[guild.id].prefix + "setbot`. Això el que farà serà avisar a tothom qui estigui usant el bot fora d'aquest canal.\n" +
        "Aquestes tres comandes es poden desactivar en qualsevol moment amb el paràmetre `null`. P.E. `" + serversInfo[guild.id].prefix + "setwelcome null`\n" +
        "Per veure tota la informació dels canals, fes servir la comanda `" + serversInfo[guild.id].prefix + "server`.\n\n" +
        "Més informació de les comandes amb `" + serversInfo[guild.id].prefix + "help` o `" + serversInfo[guild.id].prefix + "help [nom de la comanda]`.";

    try {
        guild.members.fetch(guild.ownerID).then((owner) => {
            owner.send(introMessage);
        });
    } catch (err) {
        console.error(err);
    }

    console.log(bot("El bot ha entrat al servidor \"" + guild.name + "\"\n"));

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    });
    fs.writeFile('Storage/servers.json', JSON.stringify(serversInfo), (err) => {
        if (err) console.error(err);
    });

});

client.on("guildDelete", (guild) => {

    guild.members.fetch().then((members) => {
        members.forEach(member => {
            if (userData[guild.id + member.user.id]) {
                userData[guild.id + member.user.id] = {};
            }
        });
    });

    if (servers[guild.id]) {
        servers[guild.id] = {};
    }

    if (serversInfo[guild.id]) {
        serversInfo[guild.id] = {};
    }

    console.log(remove("El bot ha sigut expulsat del servidor \"" + guild.name + "\"\n"));
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    });
    fs.writeFile('Storage/servers.json', JSON.stringify(serversInfo), (err) => {
        if (err) console.error(err);
    });

});

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
};

client.on('guildMemberAdd', async (member) => {

    if (member.user.bot) {
        console.log(bot("Nou bot \"" + member.user.username + "\" afegit a la guild " + member.guild.name + "\n"));
    } else {
        console.log(log("Nou membre \"" + member.user.username + "\" afegit a la guild " + member.guild.name + "\n"));
    }

    if (!userData[member.guild.id + member.user.id]) {
        userData[member.guild.id + member.user.id] = {};
    }

    if (!userData[member.guild.id + member.user.id].money) {
        if (member.user.bot)
            userData[member.guild.id + member.user.id].money = -1;
        else
            userData[member.guild.id + member.user.id].money = Math.round(Math.random() * 1000);
    }

    // Sino tens xp, tampoc tens nivell, no te sentit
    if (!userData[member.guild.id + member.user.id].xp) {
        if (member.user.bot) {
            userData[member.guild.id + member.user.id].xp = -1;
            userData[member.guild.id + member.user.id].level = -1;
        } else {
            userData[member.guild.id + member.user.id].xp = 0;
            userData[member.guild.id + member.user.id].level = 1;
        }
    }

    if (!userData[member.guild.id + member.user.id].lastDaily) {
        userData[member.guild.id + member.user.id].lastDaily = "Not Collected";
    }

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    });

    let channelID = servers[member.guild.id].welcomeChannel;
    if (!channelID) {
        // Si no hi ha el canal process.envurat, no enviem res
        return;
    }

    let channel = client.channels.cache.get(channelID);

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./imgs/wallpaper.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    let s = ctx.measureText('Benvingut al servidor,');
    ctx.strokeText('Benvingut al servidor,', 351 - (s.width / 2), (90 + 90));
    ctx.fillText('Benvingut al servidor,', 351 - (s.width / 2), (90 + 90));

    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#ffffff';
    let s2 = ctx.measureText(`${member.displayName}!`);
    ctx.strokeText(`${member.displayName}!`, 351 - (s2.width / 2), (90 + 125 + 20));
    ctx.fillText(`${member.displayName}!`, 351 - (s2.width / 2), (90 + 125 + 20));

    ctx.beginPath();
    ctx.arc(351, 90, 56, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
        format: 'png'
    }));
    ctx.drawImage(avatar, 289, 28, 125, 125);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`Benvingut al servidor, ${member}!`, attachment);
});

client.on('guildMemberRemove', async (member) => {

    // Es guardarà la info de cada membre SEMPRE perque no pugui fer relogin
    // Per resetejar les seves monedes o recollir el daily altre cop
    // El que vulgui parlar-ho, que contacti amb l'admin corresponent

    console.log(remove("El membre \"" + member.user.username + "\" ha sortit de la guild " + member.guild.name + "\n"));

    let channelID = servers[member.guild.id].welcomeChannel;
    if (!channelID) {
        // Si no hi ha el canal process.envurat, no enviem res
        return;
    }

    let channel = client.channels.cache.get(channelID);

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./imgs/wallpaper.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    let s = ctx.measureText('Adeu,');
    ctx.strokeText('Adeu,', 351 - (s.width / 2), (90 + 90));
    ctx.fillText('Adeu,', 351 - (s.width / 2), (90 + 90));

    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#ffffff';
    let s2 = ctx.measureText(`${member.displayName}!`);
    ctx.strokeText(`${member.displayName}!`, 351 - (s2.width / 2), (90 + 125 + 20));
    ctx.fillText(`${member.displayName}!`, 351 - (s2.width / 2), (90 + 125 + 20));

    ctx.beginPath();
    ctx.arc(351, 90, 56, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
        format: "png"
    }));
    ctx.drawImage(avatar, 289, 28, 125, 125);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'bye-image.png');

    channel.send(`Adeu, ${member}!`, attachment);
});

client.on('message', async (message) => {

    let prefix = process.env.prefix;
    if (message.guild) {
        prefix = servers[message.guild.id].prefix;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix))
        return;

    if (!message.channel.members && commandName != 'help' && commandName != 'h') {
        // Estem a DM, només funciona el help
        message.author.send("Prova millor `" + prefix + "help`");
        return;
    }

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command)
        return;

    if (command.type === 'mod') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.reply("no tens permisos d'administrador per executar aquesta comanda!");
            return;
        }
    }

    if (!message.author.bot && message.channel.members && !message.member.hasPermission("ADMINISTRATOR") &&
        commandName !== "setbot" && commandName !== "setalert" && commandName !== "h" && commandName !== "help") {
        if (message.channel.id !== servers[message.guild.id].botChannel) {
            message.author.send("Siusplau, utilitza el bot al canal pertinent. En aquest cas és <#" + servers[message.guild.id].botChannel + ">");
        }
    }

    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Discord.Collection());
    }

    const currentTime = Date.now();
    const timeStamps = cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown) * 1000;

    if (timeStamps.has(message.author.id)) {
        const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;
        if (currentTime < expirationTime) {
            const timeLeft = (expirationTime - currentTime) / 1000;
            return message.reply(`siusplau espera ${timeLeft.toFixed(1)} segons abans d'utilitzar la comanda \`${commandName}\``);
        }
    }

    timeStamps.set(message.author.id, currentTime);

    try {
        command.execute(message, args, servers, userData, client, commandName);
    } catch (error) {
        console.error(error);
        message.reply('alguna cosa ha anat malament, siusplau contacta amb ' + process.env.ownerDiscordUsername +
            '\nSi saps el que ha passat i vols reportar un bug pots fer-ho a\n' +
            'https://github.com/CatalaHD/CataBot/issues');
    }

});


// MONGO DB CONNECTION
mongoose.connect(process.env.MONGODBSRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(bot("CONNECTED TO THE DATABASE!"));
}).catch(console.error);

client.login(process.env.token);