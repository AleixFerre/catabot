const { remove } = require('../lib/common.js');
const { deleteServer, deleteUsersFromServer } = require('../lib/database.js');

module.exports = {
	name: 'guildDelete',
	execute(guild) {
		if (guild.members.cache.size <= 0) return;

		console.debug(remove(`El bot ha sortit del servidor "${guild.name}"`));

		deleteUsersFromServer(guild.id);
		deleteServer(guild.id);
	},
};
