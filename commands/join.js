module.exports = {
	name: 'join',
	description: 'El bot entra dins del teu canal de veu',
    aliases: ['j'],
	execute(message, args, servers) {
        
        let prefix = servers[message.guild.id].prefix;

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join();
            message.channel.send("He entrat al canal " + message.member.voiceChannel.name);
        } else {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
            message.channel.send(prefix + 'help join');
        }
	},
};