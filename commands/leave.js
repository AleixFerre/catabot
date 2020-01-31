module.exports = {
	name: 'leave',
	description: 'Se\'n va del canal de veu',
	execute(message) {
        message.channel.send("Desconnectant...").then((msg) => {
            if(!message.guild.voiceConnection) {
                msg.edit('No estic a cap canal de veu!');
                return;
            }
            
            var userVoiceChannel = message.member.voiceChannel;
            if (!userVoiceChannel) {
                msg.edit('No estàs a cap canal!');
                return;
            }
            
            var clientVoiceConnection = message.guild.voiceConnection;
            if (userVoiceChannel === clientVoiceConnection.channel) {
                clientVoiceConnection.disconnect();
                msg.edit('Desconnectat correctament.');
            } else {
                msg.edit('Només pots executar aquesta comanda si estàs al mateix canal que el bot!');
            }
        }).catch(console.error);
	},
};