module.exports = {
	name: 'q',
	description: 'Mostra la cua',
	execute(message) {
        message.channel.send("!queue");
	},
};