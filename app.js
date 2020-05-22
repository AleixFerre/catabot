const fs = require('fs');
const Canvas = require('canvas');
const Discord = require("discord.js");
const moment = require('moment');
const client = new Discord.Client();
client.commands = new Discord.Collection();

moment().utcOffset('120');

const testing = false;

let config = {};
if (testing) {
    config = require("./config_test.json");
} else {
    config = require("./config.json");
}

let userData = JSON.parse(fs.readFileSync("./Storage/userData.json", 'utf8'));

let serversInfo = {};
if (testing) {
    serversInfo = JSON.parse(fs.readFileSync("./Storage/servers_test.json", "utf8"));
} else {
    serversInfo = JSON.parse(fs.readFileSync("./Storage/servers.json", "utf8"));
}

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
            usage: "!" + command.name + " " + usage,
            aliases: command.aliases
        });
    }
}

fs.writeFile('docs/Storage/commands.json', JSON.stringify(cmds), (err) => { if (err) console.error(err); });

let servers = {}; ///< The data structure that handles all the info for the servers

client.on("guildCreate", (guild) => {

    guild.members.forEach(member => {
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

    if (!serversInfo[guild.id]) {
        serversInfo[guild.id] = {};
    }
    if (!serversInfo[guild.id].prefix) {
        serversInfo[guild.id].prefix = config.prefix;
    }
    if (!serversInfo[guild.id].alertChannel) {
        serversInfo[guild.id].alertChannel = searchAlertChannel(guild);
    }
    if (!serversInfo[guild.id].botChannel) {
        serversInfo[guild.id].botChannel = searchBotChannel(guild);
    }

    if (!servers[guild.id]) {
        servers[guild.id] = {
            queue: [],
            nowPlayingVideo: {},
            nowPlayingVideoInfo: {},
            prefix: serversInfo[guild.id].prefix,
            alertChannel: serversInfo[guild.id].alertChannel,
            botChannel: serversInfo[guild.id].botChannel,
            loop: false
        };
    }

    try {
        let newName = "[ " + config.prefix + " ] CataBOT";
        guild.members.get(config.clientid).setNickname(newName);
    } catch (err) {
        console.error(err);
    }

    console.log("El bot ha entrat al servidor \"" + guild.name + "\"\n");
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
    fs.writeFile('Storage/servers.json', JSON.stringify(serversInfo), (err) => { if (err) console.error(err); });

});

client.on("guildDelete", (guild) => {

    guild.members.forEach(member => {
        if (userData[guild.id + member.user.id]) {
            userData[guild.id + member.user.id] = {};
        }
    });

    if (servers[guild.id]) {
        servers[guild.id] = {};
    }

    if (serversInfo[guild.id]) {
        serversInfo[guild.id] = {};
    }

    console.log("El bot ha sigut expulsat del servidor \"" + guild.name + "\"\n");
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
    fs.writeFile('Storage/servers.json', JSON.stringify(serversInfo), (err) => { if (err) console.error(err); });

});

client.on("ready", () => {

    client.guilds.forEach(guild => {
        guild.members.forEach(member => {
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

        console.log(guild.name + ": " + guild.memberCount + " members");

        if (!serversInfo[guild.id]) {
            serversInfo[guild.id] = {};
        }
        if (!serversInfo[guild.id].prefix) {
            serversInfo[guild.id].prefix = config.prefix;
        }
        if (!serversInfo[guild.id].alertChannel) {
            serversInfo[guild.id].alertChannel = searchAlertChannel(guild);
        }
        if (!serversInfo[guild.id].botChannel) {
            serversInfo[guild.id].botChannel = searchBotChannel(guild);
        }

        if (!servers[guild.id]) {
            servers[guild.id] = {
                queue: [],
                nowPlayingVideo: {},
                nowPlayingVideoInfo: {},
                prefix: serversInfo[guild.id].prefix,
                alertChannel: serversInfo[guild.id].alertChannel,
                botChannel: serversInfo[guild.id].botChannel,
                loop: false
            };
        }

        try {
            let newName = "[ " + config.prefix + " ] CataBOT";
            if (testing) {
                newName += " TEST";
            }
            guild.members.get(config.clientid).setNickname(newName);
        } catch (err) {
            console.error(err);
        }
    });

    client.user.setPresence({
        status: "online",
        game: {
            name: "catalahd.github.io/CataBot",
            type: "WATCHING"
        }
    });

    console.log("\nREADY :: Version " + config.version + "\nON " + client.guilds.size + " servers\n" +
        "---------------------------------");
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

    if (testing) {
        fs.writeFile('Storage/servers_test.json', JSON.stringify(serversInfo), (err) => { if (err) console.error(err); });
    } else {
        fs.writeFile('Storage/servers.json', JSON.stringify(serversInfo), (err) => { if (err) console.error(err); });
    }


});

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
};

client.on('guildMemberAdd', async(member) => {

    console.log("Nou membre \"" + member.user.username + "\" afegit a la guild " + member.guild.name + "\n");

    if (!userData[member.guild.id + member.user.id]) {
        userData[member.guild.id + member.user.id] = {};
    }

    if (!userData[member.guild.id + member.user.id].money) {
        if (member.user.bot)
            userData[member.guild.id + member.user.id].money = -1;
        else
            userData[member.guild.id + member.user.id].money = Math.round(Math.random() * 1000);
    }

    if (!userData[member.guild.id + member.user.id].lastDaily) {
        userData[member.guild.id + member.user.id].lastDaily = "Not Collected";
    }

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

    let channel = member.guild.systemChannel;
    if (!channel) channel = guild.channels.filter(c => c.type === 'text').find(x => x.position == 0);
    if (!channel) return;

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

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.drawImage(avatar, 289, 28, 125, 125);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`Benvingut al servidor, ${member}!`, attachment);
});

client.on('guildMemberRemove', async(member) => {

    // Es guardarà la info de cada membre SEMPRE perque no pugui fer relogin
    // Per resetejar les seves monedes o recollir el daily altre cop
    // El que vulgui parlar-ho, que contacti amb l'admin corresponent

    console.log("El membre \"" + member.user.username + "\" ha sortit de la guild " + member.guild.name + "\n");

    let channel = member.guild.systemChannel;
    if (!channel) channel = guild.channels.filter(c => c.type === 'text').find(x => x.position == 0);
    if (!channel) return;

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

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.drawImage(avatar, 289, 28, 125, 125);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`Adeu, ${member}!`, attachment);

});

client.on('message', async(message) => {

    let prefix = "!";
    if (message.guild) {
        prefix = servers[message.guild.id].prefix;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix))
        return;

    if (!message.channel.members && commandName != 'help' && commandName != 'h') {
        // Estem a DM, només funciona el help
        message.author.send("Aqui només funciona el !help");
        return;
    }

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command)
        return;

    if (command.type == 'mod') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.reply("no tens permisos d'administrador per executar aquesta comanda!");
            return;
        }
    }

    if (!message.author.bot && message.channel.members && commandName !== "setbot" && commandName !== "setalert" && commandName !== "h" && commandName !== "help") {
        if (message.channel.id !== servers[message.guild.id].botChannel) {
            message.author.send("Siusplau, utilitza el bot al canal pertinent. En aquest cas és <#" + servers[message.guild.id].botChannel + ">");
        }
    }

    try {
        command.execute(message, args, servers, userData, client, serversInfo);
    } catch (error) {
        console.error(error);
        message.reply('alguna cosa ha anat malament, siusplau contacta amb ' + config.ownerDiscordUsername +
            '\nSi saps el que ha passat i vols reportar un bug pots fer-ho a\n' +
            'https://github.com/CatalaHD/CataBot/issues');
    }

});

function searchAlertChannel(guild) {
    let channel = guild.channels.filter(c => c.type === 'text').find(x => x.name.includes("alertas"));
    // Si aquest no existeix
    if (!channel) {
        // Cerca el canal per defecte
        channel = guild.systemChannel;
    }
    // Si no hi ha canal per defecte
    if (!channel)
        channel = guild.channels.filter(c => c.type === 'text').find(x => x.position == 0); // Cerca el de la primera posició de tipus text
    return channel.id;
}

function searchBotChannel(guild) {
    let channel = guild.channels.filter(c => c.type === 'text').find(x => x.name.includes("bot"));
    // Si aquest no existeix
    if (!channel) {
        // Cerca el canal per defecte
        channel = guild.systemChannel;
    }
    // Si no hi ha canal per defecte
    if (!channel)
        channel = guild.channels.filter(c => c.type === 'text').find(x => x.position == 0); // Cerca el de la primera posició de tipus text
    return channel.id;
}

client.login(config.token);