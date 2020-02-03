module.exports = {
	name: 'money',
	description: 'Et mostra els diners que tens',
    aliases: ['profile', 'diners'],
	execute(message, args, servers, userData) {


        //TODO: ESTARIA BÉ QUE SI MENCIONES A ALGU, ET MOSTRÉS EL SEU PERFIL

        message.channel.send({embed: {
            title: "Banc",
            color: 0xFF0000,
            fields: [{
                name: "Conta",
                value: message.author.username,
                inline: true
            }, {
                name: "Balanç",
                value: userData[message.guild.id + message.author.id].money,
                inline: true
            }]
        }});
	},
};