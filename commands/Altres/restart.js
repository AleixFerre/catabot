const { exit } = require('process');
const { MessageEmbed } = require('discord.js');
const { getColorFromCommand, getOwner } = require('../../lib/common');
const { setLastForceReset } = require('../../lib/database');

const TYPE = 'altres';

module.exports = {
  name: 'restart',
  type: TYPE,
  aliases: ['refresh'],
  description: 'Fes que el bot es reiniciï perque la musica no funciona.',
  async execute(message, _args, _server, client) {
    const authorID = message.author.id;
    const channelID = message.channel.id;

    const msg = new MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('Reiniciant el bot...')
      .setDescription('Siusplau espera a rebre un nou missatge notificant que el bot està actiu...');

    await Promise.all([
      message.channel.send(msg),
      setLastForceReset(authorID, channelID),
      adviceOwner(message, client),
    ]);
    exit(-1);
  },
};

async function adviceOwner(message, client) {
  const owner = await getOwner(client);
  const msg = new MessageEmbed()
    .setTitle("El bot s'està reiniciat!")
    .setColor('#ff0000')
    .setDescription(
      `Al canal ${message.channel} del servidor ${message.guild} i la comanda ha estat executada per ${message.author}.`
    );
  await owner.send(msg);
}
