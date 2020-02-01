module.exports = {
	name: 'money',
	description: 'Et mostra els diners que tens',
	execute(message, args, servers, userData) {
        message.channel.send({embed: {
            title: "Banco",
            color: 0xFF0000,
            fields: [{
                name: "Cuenta",
                value: message.author.username,
                inline: true
            }, {
                name: "Balance",
                value: userData[message.guild.id + message.author.id].money,
                inline: true
            }]
        }});
	},
};