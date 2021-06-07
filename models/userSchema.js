const { Schema, model } = require('mongoose');

const userSchema = Schema({
  IDs: {
    type: {
      userID: { type: String },
      serverID: { type: String },
    },
    require: true,
    unique: true,
  },
  money: { type: Number, default: 1000 },
  lastDaily: { type: String, default: null },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

/**
 * ### Model for a User.
 *
 * It has IDs [Primary Key]: String UserID and String ServerID
 *
 * money: Number describing how much money he/she has.
 *
 * lastDaliy: String describing when you collected the last daliy.
 *
 * xp: Number describing how much xp you have.
 *
 * level: Number describing how many levels you have.
 */
const m = model('users', userSchema);

module.exports = m;
