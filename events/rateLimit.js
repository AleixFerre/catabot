const { getOwner } = require('../lib/common.js');

module.exports = {
  name: 'rateLimit',
  async execute(rateLimitData, client) {
    let owner = await getOwner(client);
    owner.send(
      "T'has passat el limit de rate!\n --------------- INFO ---------------\n```" +
        JSON.stringify(rateLimitData, null, 2) +
        '\n```'
    );
    console.log(rateLimitData);
  },
};
