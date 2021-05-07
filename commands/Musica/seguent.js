const TYPE = 'musica';

const { skip_song, getServerQueue } = require('../../lib/musicModule.js');

module.exports = {
  name: 'seguent',
  description: 'Es passarà a la següent cançó de la llista.',
  type: TYPE,
  aliases: ['next', 'skip', 'següent'],
  async execute(message) {
    const voice_channel = message.member.voice.channel;
    if (!voice_channel) {
      return message.channel.send('**❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!**');
    }

    const permissions = voice_channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
      return message.channel.send('**❌ Error: No tens els permissos correctes!**');
    } else if (!permissions.has('SPEAK')) {
      return message.channel.send('**❌ Error: No tens els permissos correctes!**');
    }

    const server_queue = getServerQueue(message.guild.id);

    if (server_queue && server_queue.voice_channel) {
      // Has d'estar al mateix canal del bot
      if (server_queue.voice_channel !== voice_channel) {
        return message.channel.send("**❌ Error: Has d'estar al mateix canal de veu que el bot!**");
      }
    }

    skip_song(message, server_queue);
  },
};
