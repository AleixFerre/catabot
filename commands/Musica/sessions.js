const TYPE = 'musica';

const { showSessionCount } = require('../../lib/musicModule.js');

module.exports = {
  name: 'sessions',
  description: 'Mostra quantes sessions de musica hi ha en aquest moment actives.',
  type: TYPE,
  aliases: ['musicCount', 'sessionsCount'],
  async execute(message) {
    showSessionCount(message);
  },
};
