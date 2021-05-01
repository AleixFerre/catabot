const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
  serverID: { type: String, require: true, unique: true },
  prefix: { type: String, default: process.env.prefix },
  alertChannel: { type: String },
  botChannel: { type: String },
  counterChannel: { type: String },
  counterChannelName: { type: String },
  welcomeChannel: { type: String },
});

const model = mongoose.model('servers', serverSchema);

module.exports = model;
