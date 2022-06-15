const { log } = require('../lib/common.js');

module.exports = {
  name: 'debug',
  execute(msg) {
    console.log(log(msg.toString()));
  },
};
