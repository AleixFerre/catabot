const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require("./config.json");

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

var servers = {};

client.on("ready", () => {
    console.log("READY :: Version: " + config.version + '\nON ' + client.guilds.size + " servers");
    client.user.setPresence({
        status: "online",
        game: {
            name: client.guilds.size + " servers.",
            type: "WATCHING"
        }
	});

	client.guilds.forEach(guild => {

		if (!servers[guild.id]) {
			servers[guild.id] = {
				prefix: config.prefix,
				queue: []
			};
		}

		let newName = "[ " + config.prefix + " ] CataBOT";
		guild.members.get(config.clientid).setNickname(newName);
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
	const channel = member.guild.channels.find(ch => ch.name === 'general');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./imgs/wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Benvingut al servidor,', canvas.width / 2.5, canvas.height / 3.5);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`Benvingut al servidor, ${member}!`, attachment);
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
	
    if (!client.commands.has(commandName))
		return;
	
	if (!message.channel.members && commandName != 'help') {
		// Estem a DM, només funciona el help
		message.author.send("Aqui només funciona el help!");
		return;
	}

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, servers);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
	}
	
	// In order to keep all the history clean, we delete all the users commands from the chat.
	// message.delete();

});

client.login(config.token);


