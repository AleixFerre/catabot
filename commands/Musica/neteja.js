const TYPE = 'musica';

const { clear_list, getServerQueue } = require('../../lib/musicModule.js');

module.exports = {
  name: 'neteja',
  description: "Esborra cançons de la llista. Si no s'especifica la quantitat, s'esborrarà tota la llista.",
  usage: '[ quantitat ]',
  aliases: ['clear', 'clearlist'],
  type: TYPE,
  async execute(message, args) {
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

    clear_list(message, server_queue, args);
  },
};
