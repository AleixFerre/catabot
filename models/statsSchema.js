const { Schema, model } = require('mongoose');

const statsSchema = Schema({
	members: {
		type: String,
		require: true,
		unique: true,
	},
	servers: {
		type: String,
		require: true,
		unique: true,
	},
	commands: {
		type: String,
		require: true,
		unique: true,
	},
});

const m = model('stats', statsSchema);

module.exports = m;
