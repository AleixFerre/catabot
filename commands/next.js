module.exports = {
	name: 'next',
	description: 'Passa a la següent de la cua',
	execute(message) {
        message.channel.send("!skip");
	},
};