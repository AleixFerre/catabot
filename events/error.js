const { remove } = require('../lib/common.js');

module.exports = {
  name: 'error',
  execute(err) {
    console.log(remove(err.toString()));
  },
};
