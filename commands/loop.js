const { GOOGLE_API_KEY } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
	name: 'loop',
	description: 'Activa o Desactiva el Mode Loop',
	usage: '[ true/false ]',
	execute(message, args, servers) {
        
        if (!message.member.voiceChannel) {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
            message.delete().catch(console.error);
            return;
        }

        if (args[0]) {
            if (args[0] === 'true')
                servers[message.guild.id].loop = true;
            else if (args[0] === 'false')
                servers[message.guild.id].loop = false;
            else {
                message.channel.send(servers[message.guild.id].prefix + "help loop");
                return;
            }
        } else {
            // Si no ens posen cap element, swap
            servers[message.guild.id].loop = !servers[message.guild.id].loop;
        }

        let activat;
        if (servers[message.guild.id].loop)
            activat = "ACTIVAT";
        else 
            activat = "DESACTIVAT";

        message.channel.send('El LOOP està ' + activat);

	},
};