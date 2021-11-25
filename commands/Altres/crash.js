const { exit } = require('process');

const TYPE = 'altres';

module.exports = {
  name: 'crash',
  type: TYPE,
  aliases: ['refresh'],
  description: 'Fes que el bot peti perque la musica no funciona.',
  async execute(message) {
    await message.reply('Adeu mi lord').catch(console.error);
    exit(-1);
  },
};
