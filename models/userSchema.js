const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    serverID: { type: String, require: true },
    money: { type: Number, default: 1000 },
    lastDaily: { type: String, default: "Not Collected" },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
});

const model = mongoose.model('users', userSchema);

module.exports = model;