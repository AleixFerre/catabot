const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const Discord = require('discord.js');
const {
	getRandomColor
} = require("../../lib/common.js");

const VIDEO_MAX_DURATION = 60 * 60 * 5; // 5h in seconds

const queue = new Map();

module.exports = {
	name: "music",
	description: "Més info amb la comanda `!music`.",
	type: "musica",
	aliases: [
		"musica",
		"play",
		"skip",
		"next",
		"stop",
		"disconnect",
		"clear",
		"q",
		"queue",
		"llista",
		"nowplaying",
		"np"
	],
	cooldown: 0,
	async execute(message, args, server, _client, cmd) {

		if (cmd === "music" || cmd === "musica")
			return mostrar_opcions(message, server);

		const voice_channel = message.member.voice.channel;
		if (!voice_channel)
			return message.channel.send(
				"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
			);
		const permissions = voice_channel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT"))
			return message.channel.send("❌ Error: No tens els permissos correctes!");
		if (!permissions.has("SPEAK"))
			return message.channel.send("❌ Error: No tens els permissos correctes!");

		const server_queue = queue.get(message.guild.id);

		// Depenent del que vulguis fer, executa una funcio o una altra
		if (cmd === "play") play_song(message, args, server_queue, voice_channel);
		else if (cmd === "skip" || cmd === "next") skip_song(message, server_queue);
		else if (cmd === "stop" || cmd === "disconnect") stop_song(message, server_queue);
		else if (cmd === "q" || cmd === "llista" || cmd === "queue") show_list(message, server_queue);
		else if (cmd === "np" || cmd === "nowplaying") show_np(message, server_queue);
		else if (cmd === "clear") clear_list(message, server_queue);
	},
};

const play_song = async function (message, args, server_queue, voice_channel) {
	if (!args.length)
		return message.channel.send("❌ Error: No se què he de posar! Necessito un segon argument.");
	let song = {};

	if (ytdl.validateURL(args[0])) {
		const song_info = await ytdl.getInfo(args[0]);

		song = {
			title: song_info.videoDetails.title,
			url: song_info.videoDetails.video_url,
			duration: parseInt(song_info.videoDetails.lengthSeconds),
			canal: song_info.videoDetails.ownerChannelName,
			thumbnail: song_info.videoDetails.thumbnails[song_info.videoDetails.thumbnails.length - 1].url
		};
	} else {
		const video_finder = async (query) => {
			const video_result = await ytSearch(query);
			return video_result.videos.length > 1 ? video_result.videos[0] : null;
		};

		const video = await video_finder(args.join(" "));

		if (video) {
			song = {
				title: video.title,
				url: video.url,
				duration: video.seconds,
				canal: video.author.name,
				thumbnail: video.thumbnail
			};
		} else {
			message.channel.send("❌ Error: No s'ha pogut cercar el video correctament.");
			return;
		}
	}

	if (song.duration > VIDEO_MAX_DURATION) {
		return message.channel.send("❌ Error: No es poden reproduir videos de més de 5h.");
	}

	if (!server_queue) {
		const queue_constructor = {
			voice_channel: voice_channel,
			text_channel: message.channel,
			connection: null,
			songs: [],
		};

		queue.set(message.guild.id, queue_constructor);
		queue_constructor.songs.push(song);

		try {
			const connection = await voice_channel.join();
			queue_constructor.connection = connection;
			video_player(message.guild, queue_constructor.songs[0]);
		} catch (err) {
			queue.delete(message.guild.id);
			message.channel.send("❌ Error: Hi ha hagut un error al connectar-me!");
			throw err;
		}
	} else {
		server_queue.songs.push(song);
		return message.channel.send(`👍 **${song.title}** afegida a la cua correctament!`);
	}
};

const video_player = async (guild, song) => {
	const song_queue = queue.get(guild.id);

	if (!song) {
		song_queue.voice_channel.leave();
		queue.delete(guild.id);
		return;
	}

	const stream = ytdl(song.url, {
		filter: "audioonly"
	});

	song_queue.connection
		.play(stream, {
			seek: 0,
			volume: 0.5
		})
		.on("finish", () => {
			song_queue.songs.shift();
			video_player(guild, song_queue.songs[0]);
		});

	await song_queue.text_channel.send(`🎶 S'està reproduint: **${song.title}**`);
};

const skip_song = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);
	if (!server_queue) {
		return message.channel.send(`No hi ha cap cançó a la cua 😔`);
	}
	server_queue.connection.dispatcher.end();
};

const stop_song = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue) {
		return message.channel.send(`No hi ha cap cançó a la cua 😔`);
	}

	server_queue.songs = [];
	server_queue.connection.dispatcher.end();
};

const clear_list = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue || server_queue.songs.length === 1) {
		return message.channel.send(`No hi ha cap cançó a la cua 😔`);
	}

	const n = server_queue.songs.length - 1;
	server_queue.songs.splice(1, n);
	message.channel.send(`🗑️ Esborrades ${n} cançons!`);
};

const show_list = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue || server_queue.songs.length === 1) {
		return message.channel.send(`No hi ha cap cançó a la cua 😔`);
	}

	const songs = server_queue.songs;

	let embed = new Discord.MessageEmbed()
		.setColor(getRandomColor())
		.setTitle("🎵 ** Està sonant: " + songs[0].title + "** 🎵")
		.setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

	for (let i = 1; i < Math.min(songs.length, 20); i++) {
		embed.addField(`${i}.- ${songs[i].title}`, songs[i].canal + " | " + durationToString(songs[i].duration), false);
	}

	message.channel.send(embed);
};

const show_np = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue) {
		return message.channel.send(`No s'està reproduint cap cançó 😔`);
	}

	const current = server_queue.songs[0];

	let embed = new Discord.MessageEmbed()
		.setColor(getRandomColor())
		.setTitle("🎵 **" + current.title + "** 🎵")
		.addField('❯ Canal', current.canal, true)
		.addField('❯ Duració', durationToString(current.duration), true)
		.setThumbnail(current.thumbnail)
		.setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

	message.channel.send(embed);
};

const mostrar_opcions = (message, server) => {

	let prefix = server.prefix;

	let embed = new Discord.MessageEmbed()
		.setColor(getRandomColor())
		.setTitle("🎵 **Comandes de MUSICA** 🎵")
		.addField('❯ ' + prefix + 'play < URL / cerca >', "El bot s'unirà al teu canal de veu i reproduirà les cançons que vulguis.", false)
		.addField('❯ ' + prefix + 'skip / next', "Es passarà a la següent cançó de la llista.", false)
		.addField('❯ ' + prefix + 'stop / disconnect', "No vols més musica? El bot s'envà del canal esborrant les cançons de la llista.", false)
		.addField('❯ ' + prefix + 'q / queue / llista', "Et mostra la llista de reproducció.", false)
		.addField('❯ ' + prefix + 'np / nowplaying', "Et mostra la cançó que s'està reproduint ara mateix.", false)
		.addField('❯ ' + prefix + 'clear', "Esborra totes les cançons de la llista.", false)
		.setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

	message.channel.send(embed);

};

const durationToString = (duration) => {
	const UNA_HORA = 60 * 60;
	if (duration > UNA_HORA) // Si es mes gran que 1h
		return `${Math.floor(duration / UNA_HORA)}h ${Math.floor((duration % UNA_HORA) / 60)}min ${duration % 60}sec`;

	if (duration > 60)
		return `${Math.floor(duration / 60)}min ${duration % 60}sec`;

	return `${duration}sec`;
};
