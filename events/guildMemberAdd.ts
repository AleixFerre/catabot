const { getServer } = require('../lib/database.js');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member, client) {
		if (member.user.bot) {
			return;
		}

		const channelInfo = await getServer(member.guild.id);
		// Si no hi ha el canal configurat, no enviem res
		if (!channelInfo) return;

		const channel = client.channels.resolve(channelInfo.welcomeChannel);
		if (!channel) return;

		channel.send(`${channelInfo.prefix}welcome ${member.user}`);
	},
};
