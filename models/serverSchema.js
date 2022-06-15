const { Schema, model } = require('mongoose');

const serverSchema = Schema({
	serverID: { type: String, require: true, unique: true },
	prefix: { type: String, default: process.env.prefix },
	alertChannel: { type: String },
	botChannel: { type: String },
	counterChannel: { type: String },
	counterChannelName: { type: String },
	welcomeChannel: { type: String },
});

/**
 * ### Model for a Server.
 *
 * serverID [Primary Key]: String describing the guild.id given by Discord.
 *
 * prefix: String describing the bot prefix in this Server.
 *
 * alertChannel: String describing the channel.id from the alert channel given by Discord
 *
 * botChannel: String describing the channel.id from the bot channel given by Discord
 *
 * counterChannel: String describing the channel.id from the counter channel given by Discord
 *
 * counterChannelName: String describing the channel.name from the counter channel given by Discord
 *
 * welcomeChannel: String describing the channel.id from the welcome channel given by Discord
 */
const m = model('servers', serverSchema);

module.exports = m;
