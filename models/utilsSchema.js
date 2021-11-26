const { Schema, model } = require('mongoose');

const utilsSchema = Schema({
  lastForceReset: {
    type: {
      date: Date,
      userID: String,
      channelID: String,
    },
    require: true,
    unique: true,
  },
});

/**
 * ### Model for the unique and static values of the bot that needs to remember.
 *
 * lastForceReset: {
 *
 *    date: Date: Date of the last force reset.
 *
 *    userID: string: User ID of who forced the reset.
 *
 *    channelID: string: Channel ID of where the force reset was done.
 *
 * }
 */
const m = model('utils', utilsSchema);

module.exports = m;
