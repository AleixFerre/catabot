const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const Discord = require('discord.js');
const {
	getColorFromCommand
} = require("../../lib/common.js");

const VIDEO_MAX_DURATION = 60 * 60 * 5; // 5h in seconds
const MAX_VIEW_SONG_LIST = 10; // Maximes cançons a mostrar a la llista | ASSERT MAX_VIEW_SONG_LIST != 0
const TYPE = "musica";

const queue = new Map();

module.exports = {
	name: "music",
	description: "Més info amb la comanda `!music`.",
	type: TYPE,
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
		"np",
		"playlist",
		"pause",
		"resume",
		"playnow"
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
		if (cmd === "play") play_song(message, args, server_queue, voice_channel, server.prefix);
		else if (cmd === "skip" || cmd === "next") skip_song(message, server_queue);
		else if (cmd === "stop" || cmd === "disconnect") stop_song(message, server_queue);
		else if (cmd === "playnow") playnow_song(message, args, server_queue, voice_channel, server.prefix);
		else if (cmd === "q" || cmd === "llista" || cmd === "queue") show_list(message, server_queue, args);
		else if (cmd === "np" || cmd === "nowplaying") show_np(message, server_queue);
		else if (cmd === "clear") clear_list(message, server_queue, args);
		else if (cmd === "playlist") playlist_songs(message, args, server_queue, voice_channel);
		else if (cmd === "pause") pause_song(message, server_queue, server.prefix);
		else if (cmd === "resume") resume_song(message, server_queue);
	},
};

const play_song = async function (message, args, server_queue, voice_channel, prefix) {
	if (!args.length)
		return message.channel.send("❌ Error: No se què he de posar! Necessito un segon argument.");
	let song = {};

	if (args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/i)) {
		return message.channel.send(`⚠️ Llista de reproducció detectada!\nFés servir la comanda \`${prefix}playlist < URL >\` per posar totes les cançons de cop.`);
	}

	if (ytdl.validateURL(args[0])) {
		const song_info = await ytdl.getInfo(args[0]);

		if (song_info.videoDetails.isLiveContent) {
			return message.channel.send("❌ Error: No es poden posar transmissions en directe! Prova millor amb un video.");
		}

		if (song_info.videoDetails.isPrivate) {
			return message.channel.send("❌ Error: El video és privat!");
		}

		song = {
			title: song_info.videoDetails.title,
			url: song_info.videoDetails.video_url,
			duration: parseInt(song_info.videoDetails.lengthSeconds),
			channel: song_info.videoDetails.ownerChannelName,
			thumbnail: song_info.videoDetails.thumbnails[song_info.videoDetails.thumbnails.length - 1].url,
			requestedBy: message.author
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
				channel: video.author.name,
				thumbnail: video.thumbnail,
				requestedBy: message.author
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
			video_player(message.guild, queue_constructor.songs[0], voice_channel.name);
		} catch (err) {
			queue.delete(message.guild.id);
			message.channel.send("❌ Error: Hi ha hagut un error al connectar-me!");
			throw err;
		}
	} else {
		// Temps del dispatcher actual
		const streamSeconds = server_queue.connection.dispatcher.streamTime / 1000;
		let estimatedTime = server_queue.songs[0].duration - streamSeconds; // Quant falta

		// + El temps de les de la cua
		for (let i = 1; i < server_queue.songs.length; i++) {
			estimatedTime += server_queue.songs[i].duration;
		}

		server_queue.songs.push(song);
		let embed = new Discord.MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle(`👍 **${song.title}** afegida a la cua correctament!`)
			.setDescription(`Temps estimat per reproduir: ${durationToString(Math.floor(estimatedTime))}`)
			.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);
		return message.channel.send(embed);
	}
};

const playnow_song = async function (message, args, server_queue, voice_channel, prefix) {
	if (!args.length)
		return message.channel.send("❌ Error: No se què he de posar! Necessito un segon argument.");
	let song = {};

	if (args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/i)) {
		return message.channel.send(`⚠️ Llista de reproducció detectada!\nFés servir la comanda \`${prefix}playlist < URL >\` per posar totes les cançons de cop.`);
	}

	if (ytdl.validateURL(args[0])) {
		const song_info = await ytdl.getInfo(args[0]);

		if (song_info.videoDetails.isLiveContent) {
			return message.channel.send("❌ Error: No es poden posar transmissions en directe! Prova millor amb un video.");
		}

		if (song_info.videoDetails.isPrivate) {
			return message.channel.send("❌ Error: El video és privat!");
		}

		song = {
			title: song_info.videoDetails.title,
			url: song_info.videoDetails.video_url,
			duration: parseInt(song_info.videoDetails.lengthSeconds),
			channel: song_info.videoDetails.ownerChannelName,
			thumbnail: song_info.videoDetails.thumbnails[song_info.videoDetails.thumbnails.length - 1].url,
			requestedBy: message.author
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
				channel: video.author.name,
				thumbnail: video.thumbnail,
				requestedBy: message.author
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
			video_player(message.guild, queue_constructor.songs[0], voice_channel.name);
		} catch (err) {
			queue.delete(message.guild.id);
			message.channel.send("❌ Error: Hi ha hagut un error al connectar-me!");
			throw err;
		}
	} else {
		// Posem la cançó a la primera posició de la llista
		server_queue.songs.splice(1, 0, song);
		// Passem a la seguent
		server_queue.connection.dispatcher.end();
	}
};

const playlist_songs = async function (message, args, server_queue, voice_channel) {
	if (!args.length) {
		return message.channel.send("❌ Error: No se què he de posar! Necessito un segon argument.");
	}
	let songs = [];

	if (args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/i)) {
		const video_finder = async (query) => {
			const url = new URL(query);
			const listID = url.searchParams.get("list");
			const video_result = await ytSearch({
				listId: listID
			});
			return video_result.videos.length > 1 ? video_result.videos : null;
		};

		const videos = await video_finder(args.join(" "));
		if (videos) {
			for (let video of videos) {
				if (video.duration.seconds <= VIDEO_MAX_DURATION && video.duration.seconds !== 0) {
					songs.push({
						title: video.title,
						url: `https://youtube.com/watch?v=${video.videoId}`,
						duration: video.duration.seconds,
						channel: video.author.name,
						thumbnail: video.thumbnail,
						requestedBy: message.author
					});
				}
			}
		} else {
			return message.channel.send("❌ Error: No s'ha trobat cap video a la playlist.");
		}
	} else {
		return message.channel.send("❌ Error: Posa un enllaç de playlist vàlid, siusplau.");
	}

	let willPlayNow = !server_queue;

	// Temps del dispatcher actual
	let estimatedTime = 0;
	if (server_queue) {
		const streamSeconds = server_queue.connection.dispatcher.streamTime / 1000;
		estimatedTime = server_queue.songs[0].duration - streamSeconds; // Quant falta

		// + El temps de les de la cua
		for (let i = 1; i < server_queue.songs.length; i++) {
			estimatedTime += server_queue.songs[i].duration;
		}
	}

	for (let song of songs) {
		if (!server_queue) {
			const queue_constructor = {
				voice_channel: voice_channel,
				text_channel: message.channel,
				connection: null,
				songs: [],
			};
			queue.set(message.guild.id, queue_constructor);
			queue_constructor.songs.push(song);
			server_queue = queue.get(message.guild.id);
		} else {
			server_queue.songs.push(song);
		}
	}

	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setTitle(`👍 S'ha afegit ${songs.length} cançons a la cua correctament!`)
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

	if (estimatedTime > 0) {
		embed.setDescription(`Temps estimat per reproduir: ${durationToString(Math.floor(estimatedTime))}`);
	}

	message.channel.send(embed);

	if (willPlayNow) {
		try {
			const connection = await voice_channel.join();
			server_queue.connection = connection;
			video_player(message.guild, server_queue.songs[0], voice_channel.name);
		} catch (err) {
			queue.delete(message.guild.id);
			message.channel.send("❌ Error: Hi ha hagut un error al connectar-me!");
			throw err;
		}
	}
};

const video_player = async (guild, song, voice_channel_name) => {
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
			video_player(guild, song_queue.songs[0], voice_channel_name);
		});

	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setTitle(`🎶 Està sonant: **${song.title}**`)
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);
	await song_queue.text_channel.send(embed);
};

const skip_song = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);
	if (!server_queue) {
		let embed = new Discord.MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle("No hi ha cap cançó a la cua 😔");
		return message.channel.send(embed);
	}
	server_queue.connection.dispatcher.end();
};

const stop_song = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue) {
		let embed = new Discord.MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle("No hi ha cap cançó a la cua 😔");
		return message.channel.send(embed);
	}

	server_queue.songs = [];
	server_queue.connection.dispatcher.end();
	message.react("👍");
};

const clear_list = (message, server_queue, args) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue || server_queue.songs.length === 1) {
		let embed = new Discord.MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle("No hi ha cap cançó a la cua 😔");
		return message.channel.send(embed);
	}

	let n = server_queue.songs.length - 1; // Totes menys la actual (la primera)

	if (args[0]) {
		if (isNaN(args[0])) {
			return message.channel.send("❌ Error: La quantitat a esborrar ha de ser un numero!");
		}
		n = parseInt(args[0]);
	}

	if (n <= 0) {
		return message.channel.send("❌ Error: La quantitat ha de ser un numero positiu!");
	}
	if (n >= server_queue.songs.length) {
		message.channel.send("⚠️ Avís: La quantitat és més gran que la mida de la llista, esborrant totes...");
		n = server_queue.songs.length - 1;
	}

	server_queue.songs.splice(1, n);

	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setTitle(`🗑️ Esborrades ${n} cançons!`)
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);
	return message.channel.send(embed);
};

const show_list = (message, server_queue, args) => {

	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue || server_queue.songs.length === 1) {
		let embed = new Discord.MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle("No hi ha cap cançó a la cua 😔");
		return message.channel.send(embed);
	}

	let nPagina = 1;

	if (args[0]) {
		if (isNaN(args[0])) {
			return message.channel.send("❌ Error: El numero de pàgina ha de ser un numero enter.");
		}
		nPagina = parseInt(args[0]);
	}

	const songs = server_queue.songs;
	const n = songs.length - 1;
	const nPagines = Math.ceil(n / MAX_VIEW_SONG_LIST);
	const ultimaPagina = n % MAX_VIEW_SONG_LIST;

	if (nPagina <= 0 || nPagina > nPagines) {
		return message.channel.send("❌ Error: Numero de pàgina invàlid.");
	}

	const minim = MAX_VIEW_SONG_LIST * (nPagina - 1) + 1;
	const midaPagina = (nPagina === nPagines) ? ultimaPagina : MAX_VIEW_SONG_LIST;

	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setTitle(`🎵 **${songs[0].title}** 🎵`)
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

	for (let i = minim; i < minim + midaPagina; i++) {
		embed.addField(`${i}.- ${songs[i].title}`, `${songs[i].channel} | ${durationToString(songs[i].duration)} | ${songs[i].requestedBy}`, false);
	}

	let totalTime = 0;
	for (let i = 1; i < songs.length; i++) {
		totalTime += songs[i].duration;
	}

	embed.setDescription(`Pàgina ${nPagina}/${nPagines} | Cançons ${minim}-${minim + midaPagina - 1} | Total ${n} | Duració ${durationToString(totalTime)}`);

	message.channel.send(embed);
};

const show_np = (message, server_queue) => {
	if (!message.member.voice.channel)
		return message.channel.send(
			"❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!"
		);

	if (!server_queue) {
		let embed = new Discord.MessageEmbed()
			.setColor(getColorFromCommand(TYPE))
			.setTitle("No està sonant cap cançó 😔");
		return message.channel.send(embed);
	}

	const current = server_queue.songs[0];
	const N_LINE_CHARS = 10;
	const secondsPlaying = server_queue.connection.dispatcher.streamTime / 1000;
	const percent = secondsPlaying / current.duration * N_LINE_CHARS;
	let line = "";

	for (let i = 0; i < N_LINE_CHARS; i++) {
		if (i < percent) {
			line += "▰";
		} else {
			line += "▱";
		}
	}

	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setDescription(`${line} ${durationToString(Math.floor(secondsPlaying))} | [🔗](${current.url})`)
		.setTitle(`🎵 **${current.title}** 🎵`)
		.addField('❯ Canal', current.channel, true)
		.addField('❯ Duració', durationToString(current.duration), true)
		.addField('❯ Afegida per', current.requestedBy, true)
		.setThumbnail(current.thumbnail)
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

	message.channel.send(embed);
};

const pause_song = (message, server_queue, prefix) => {
	if (server_queue.connection.dispatcher.paused) {
		return message.channel.send(`⚠️ Alerta: El reproductor ja està pausat! Posa \`${prefix}resume\``);
	}
	try {
		server_queue.connection.dispatcher.pause();
	} catch (err) {
		console.error(err);
		return message.channel.send("❌ Error: Hi ha hagut un error al pausar!");
	}
	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setTitle("⏸️ Pausant...")
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`)
		.setDescription(`Per rependre la reproducció posa \`${prefix}resume\``);
	message.channel.send(embed);
};

const resume_song = (message, server_queue) => {
	if (!server_queue.connection.dispatcher.paused) {
		return message.channel.send(`⚠️ Alerta: El reproductor no està pausat!`);
	}
	try {
		server_queue.connection.dispatcher.resume();
	} catch (err) {
		console.error(err);
		return message.channel.send("❌ Error: Hi ha hagut un error al rependre la cançó!");
	}
	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setTitle("⏯️ Reprenent...")
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);
	message.channel.send(embed);
};

const mostrar_opcions = (message, server) => {

	let prefix = server.prefix;

	let embed = new Discord.MessageEmbed()
		.setColor(getColorFromCommand(TYPE))
		.setTitle("🎵 **Comandes de MUSICA** 🎵")
		.setDescription("Els paràmetres entre < > són obligatoris i els marcats entre [ ] són opcionals.")
		.addField(`❯ ${prefix}play < URL / cerca >`, "El bot s'unirà al teu canal de veu i reproduirà les cançons que vulguis.", false)
		.addField(`❯ ${prefix}playNow < URL / cerca >`, "Posa una cançó ara mateix.\nLa comanda respectarà la cua següent però es passarà la cançó actual.", false)
		.addField(`❯ ${prefix}playlist < URL >`, "Posa totes les cançons que vulguis en una fracció de segon!", false)
		.addField(`❯ ${prefix}skip / next`, "Es passarà a la següent cançó de la llista.", false)
		.addField(`❯ ${prefix}stop / disconnect`, "No vols més musica? El bot s'envà del canal esborrant les cançons de la llista.", false)
		.addField(`❯ ${prefix}q / queue / llista [ nPagina ]`, "Et mostra la llista de reproducció.", false)
		.addField(`❯ ${prefix}np / nowplaying`, "Et mostra la cançó que està sonant ara mateix.", false)
		.addField(`❯ ${prefix}clear [ n ]`, "Esborra algunes o totes les cançons de la llista.", false)
		.addField(`❯ ${prefix}pause`, "Posa la reproducció en pausa.", false)
		.addField(`❯ ${prefix}resume`, "Repren la reproducció pausada.", false)
		.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

	message.channel.send(embed);

};

const durationToString = (duration) => {
	const UNA_HORA = 60 * 60;
	if (duration > UNA_HORA) // Si es mes gran que 1h
		return `${Math.floor(duration / UNA_HORA)} h ${Math.floor((duration % UNA_HORA) / 60)} min ${duration % 60} sec`;

	if (duration > 60)
		return `${Math.floor(duration / 60)} min ${duration % 60} sec`;

	return `${duration} sec`;
};