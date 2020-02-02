module.exports = {
	name: 'server',
	description: 'Display info about this server.',
    aliases: ['serverinfo'],
	execute(message) {
		message.channel.send({embed: {
            title: "Server info",
            color: 0xFF0000,
            fields: [{
                name: "Server",
                value: message.guild.name,
                inline: true
            }, {
                name: "Total members",
                value: message.guild.memberCount,
                inline: true
            }],
            timestamp: new Date()
        }});
	},
};