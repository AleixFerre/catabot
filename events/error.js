const { remove } = require('../lib/common.js');

module.exports = {
	name: 'error',
	execute(err) {
		console.error(remove(err.toString()));
	},
};
