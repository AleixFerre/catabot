const TYPE = "musica";
const {
	play_song,
	skip_song,
	stop_song,
	playnow_song,
	playnext_song,
	show_list,
	show_np,
	clear_list,
	playlist_songs,
	pause_song,
	resume_song,
	switch_loop,
	set_volume,
	silent_mode,
	shuffle_list,
	invert_list,
	mostrar_opcions,
	getServerQueue,
} = require("../../lib/musicModule.js");


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
		"playnow",
		"playnext",
		"loop",
		"volume",
		"volum",
		"vol",
		"silent",
		"silentmode",
		"shuffle",
		"invert"
	],
	cooldown: 0,
	async execute(message, args, server, _client, cmd) {

		if (cmd === "music" || cmd === "musica")
			return mostrar_opcions(message, server);

		const voice_channel = message.member.voice.channel;
		if (!voice_channel)
			return message.channel.send("**❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!**");

		const permissions = voice_channel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT"))
			return message.channel.send("**❌ Error: No tens els permissos correctes!**");
		if (!permissions.has("SPEAK"))
			return message.channel.send("**❌ Error: No tens els permissos correctes!**");

		const server_queue = getServerQueue(message.guild.id);

		if (server_queue && server_queue.voice_channel) {
			// Has d'estar al mateix canal del bot
			if (server_queue.voice_channel !== voice_channel) {
				return message.channel.send("**❌ Error: Has d'estar al mateix canal de veu que el bot!**");
			}
		}

		// Depenent del que vulguis fer, executa una funcio o una altra
		if (cmd === "play") play_song(message, args, server_queue, voice_channel, server.prefix);
		else if (cmd === "skip" || cmd === "next") skip_song(message, server_queue);
		else if (cmd === "stop" || cmd === "disconnect") stop_song(message, server_queue);
		else if (cmd === "playnow") playnow_song(message, args, server_queue, voice_channel, server.prefix);
		else if (cmd === "playnext") playnext_song(message, args, server_queue, voice_channel, server.prefix);
		else if (cmd === "q" || cmd === "llista" || cmd === "queue") show_list(message, server_queue, args);
		else if (cmd === "np" || cmd === "nowplaying") show_np(message, server_queue);
		else if (cmd === "clear") clear_list(message, server_queue, args);
		else if (cmd === "playlist") playlist_songs(message, args, server_queue, voice_channel);
		else if (cmd === "pause") pause_song(message, server_queue, server.prefix);
		else if (cmd === "resume") resume_song(message, server_queue);
		else if (cmd === "loop") switch_loop(message, server_queue);
		else if (cmd === "volume" || cmd === "vol" || cmd === "volum") set_volume(message, server_queue, args[0]);
		else if (cmd === "silent" || cmd === "silentmode") silent_mode(message, server_queue);
		else if (cmd === "shuffle") shuffle_list(message, server_queue);
		else if (cmd === "invert") invert_list(message, server_queue);
	},
};