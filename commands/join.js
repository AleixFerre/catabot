module.exports = {
	name: 'join',
	description: 'El bot entra dins del teu canal de veu',
	execute(message) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join();
            message.channel.send("He entrat al canal " + message.member.voiceChannel.name);
        } else {
            message.reply("Posa't a un canal de veu perquè pugui unir-me.");
        }
	},
};