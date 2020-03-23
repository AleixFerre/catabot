const fs = require('fs');
const Canvas = require('canvas');
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require("./config.json");
let userData = JSON.parse(fs.readFileSync("./Storage/userData.json", 'utf8'));
let nMembers = 0; ///< The actual Number of Members in total (all guilds the bot is in)


/// Load the commands from all the files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

var servers = {}; ///< The data structure that handles all the info for the servers

client.on("guildCreate", (guild) => {

	guild.members.forEach(member => {
		if (!userData[guild.id + member.user.id]) {
			userData[guild.id + member.user.id] = {};
		}
		if (!userData[guild.id + member.user.id].money) {
			if (member.user.bot)
				userData[guild.id + member.user.id].money = -1;
			else
				userData[guild.id + member.user.id].money = Math.round(Math.random() * 1000);
		}
		nMembers++;
	});
	
	if (!servers[guild.id]) {
		servers[guild.id] = {
			queue: [],
			nowPlayingVideo: {},
			nowPlayingVideoInfo: {},
			prefix: config.prefix,
			loop: false
		};
	}

	try {
		let newName = "[ " + config.prefix + " ] CataBOT";
		guild.members.get(config.clientid).setNickname(newName);
	} catch (err) {
		console.error(err);
	}

	client.user.setPresence({
        status: "online",
        game: {
            name: client.guilds.size + " servers.",
            type: "WATCHING"
        }
	});

	console.log("El bot ha entrat al servidor \"" + guild.name + "\"\n" +
				"Storing " + nMembers + " users");
	fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});

});

client.on("guildDelete", (guild) => {

	guild.members.forEach(member => {
		if (userData[guild.id + member.user.id]) {
			userData[guild.id + member.user.id] = null;
		}
		nMembers--;
	});
	
	if (servers[guild.id]) {
		servers[guild.id] = null;
	}

	client.user.setPresence({
        status: "online",
        game: {
            name: client.guilds.size + " servers.",
            type: "WATCHING"
        }
	});

	console.log("El bot ha sigut expulsat del servidor \"" + guild.name + "\"\n" +
				"Storing " + nMembers + " users");
	fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});

});

client.on("ready", () => {

    client.user.setPresence({
        status: "online",
        game: {
            name: client.guilds.size + " servers.",
            type: "WATCHING"
        }
	});

	client.guilds.forEach(guild => {
		guild.members.forEach(member => {
			if (!userData[guild.id + member.user.id])
				userData[guild.id + member.user.id] = {};

			if (!userData[guild.id + member.user.id].money) {
				if (member.user.bot)
					userData[guild.id + member.user.id].money = -1;
				else
					userData[guild.id + member.user.id].money = Math.round(Math.random() * 1000);
			}
			nMembers++;
		});
		
		if (!servers[guild.id]) {
			servers[guild.id] = {
				queue: [],
                nowPlayingVideo: {},
                nowPlayingVideoInfo: {},
				prefix: config.prefix,
				loop: false
			};
		}

		try {
			let newName = "[ " + config.prefix + " ] CataBOT";
			guild.members.get(config.clientid).setNickname(newName);
		} catch (err) {
			console.error(err);
		}

	});

	console.log("READY :: Version " + config.version + "\nON " + client.guilds.size + " servers\n" + 
				"Storing " + nMembers + " users\n"+
				"---------------------------------");
	fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});

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

	if (!userData[member.guild.id + member.user.id]) {
		userData[member.guild.id + member.user.id] = {};
	}

	if (!userData[member.guild.id + member.user.id].money) {
		if (member.user.bot)
			userData[member.guild.id + member.user.id].money = -1;
		else
			userData[member.guild.id + member.user.id].money = Math.round(Math.random() * 1000);
	}

	nMembers++;

	fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});

	console.log("Nou membre \"" + member.user.username + "\" afegit\n" + 
				"Storing " + nMembers + " users");
	
	let channel = member.guild.systemChannel;
	if (!channel) channel = member.guild.channels.find(ch => ch.name === 'general');
	if (!channel) channel = message.channel;
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
	ctx.strokeText('Benvingut al servidor,', 351-(s.width/2), (90+90));
	ctx.fillText('Benvingut al servidor,', 351-(s.width/2), (90+90));

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	let s2 = ctx.measureText(`${member.displayName}!`);
	ctx.strokeText(`${member.displayName}!`, 351-(s2.width/2), (90+125+20));
	ctx.fillText(`${member.displayName}!`, 351-(s2.width/2), (90+125+20));

	ctx.beginPath();
	ctx.arc(351, 90, 56, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	ctx.drawImage(avatar, 289, 28, 125, 125);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Benvingut al servidor, ${member}!`, attachment);
});

client.on('guildMemberRemove', async (member) => {

	if (userData[member.guild.id + member.user.id]) {
		userData[member.guild.id + member.user.id] = null;
	}

	nMembers--;

	fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});

	console.log("El membre \"" + member.user.username + "\" ha sigut esborrat\n" + 
				"Storing " + nMembers + " users");
		
	let channel = member.guild.systemChannel;
	if (!channel) channel = member.guild.channels.find(ch => ch.name === 'general');
	if (!channel) channel = message.channel;
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
	ctx.strokeText('Adeu,', 351-(s.width/2), (90+90));
	ctx.fillText('Adeu,', 351-(s.width/2), (90+90));

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	let s2 = ctx.measureText(`${member.displayName}!`);
	ctx.strokeText(`${member.displayName}!`, 351-(s2.width/2), (90+125+20));
	ctx.fillText(`${member.displayName}!`, 351-(s2.width/2), (90+125+20));

	ctx.beginPath();
	ctx.arc(351, 90, 56, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	ctx.drawImage(avatar, 289, 28, 125, 125);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Adeu, ${member}!`, attachment);

	
});

client.on('message', async (message) => {

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
	
	if (!command) return;

	if (command.type == 'mod') {
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.reply("no tens permisos d'administrador per executar aquesta comanda!");
			return;
		}
	}

    try {
        command.execute(message, args, servers, userData);
    } catch (error) {
        console.error(error);
		message.reply('alguna cosa ha anat malament, siusplau contacta amb ' + config.ownerDiscordUsername +
						'\nSi saps el que ha passat i vols reportar un bug pots fer-ho a\n'+
						'https://github.com/CatalaHD/DiscordBot/issues');
	}
	
	// In order to keep all the history clean, we delete all the users' commands from the chat.
	// message.delete();

});

client.login(config.token);
