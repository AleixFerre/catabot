const { Schema, model } = require('mongoose');

const commandSchema = Schema({
	name: {
		type: String,
		require: true,
	},
	description: {
		type: String,
		require: true,
	},
	type: {
		type: String,
		require: true,
	},
	usage: {
		type: String,
		require: true,
	},
	aliases: {
		type: [String],
		require: true,
	},
});

const m = model('commands', commandSchema);

module.exports = m;
