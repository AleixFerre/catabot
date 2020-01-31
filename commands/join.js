module.exports = {
	name: 'join',
	description: 'El bot entra dins del teu canal de veu',
	execute(message) {
        message.channel.send("Intentant entrar al canal de veu...").then(m => {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join();
                m.edit("He entrat al canal " + message.member.voiceChannel.name);
            } else {
                m.edit("Posa't a un canal de veu perquè pugui unir-me.");
            }
        }).catch(console.error);
	},
};