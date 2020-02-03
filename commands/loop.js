module.exports = {
	name: 'loop',
	description: 'Activa o Desactiva el Mode Loop :: Quan està activat, repeteix la mateixa cançó una i altra vegada',
	usage: '[ true/false ]',
    aliases: ['lp', 'l'],
	execute(message, args, servers) {
        
        let prefix = servers[message.guild.id].prefix;

        if (!message.member.voiceChannel) {
            message.reply("posa't a un canal de veu perquè pugui unir-me.");
            message.channel.send(prefix + 'help loop');
            message.delete().catch(console.error);
            return;
        }

        if (args[0]) {
            if (args[0] === 'true')
                servers[message.guild.id].loop = true;
            else if (args[0] === 'false')
                servers[message.guild.id].loop = false;
            else {
                message.reply("insereix un paràmetre vàlid (true/false)");
                message.channel.send(prefix + "help loop");
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