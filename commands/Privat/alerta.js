const { getAllServers } = require('../../lib/database.js');

const TYPE = 'privat';

module.exports = {
  name: 'alerta',
  description: "Avisa a tots els servidors d'alguna cosa. Comanda privada.",
  type: TYPE,
  aliases: ['alert'],
  usage: '"changelog" [ or ] < missatge >',
  async execute(message, args, server, client) {
    if (!args[0]) {
      message.reply('no se de què avisar!');
      return message.channel.send(`${server.prefix}help alerta`);
    } else if (message.author.id != process.env.IdOwner) {
      message.reply('aquesta comanda només pot ser executada per administradors del bot!');
      return message.channel.send(`${server.prefix}help alerta`);
    }

    msg = args.join(' ');

    let servers = await getAllServers();

    servers.forEach(async (server) => {
      let channelID = server.alertChannel;
      if (channelID) {
        let channel = client.channels.resolve(channelID);

        // Només si hi ha algun canal de text en tot el servidor
        if (channel) {
          if (msg.toLowerCase() === 'changelog') {
            await channel.send(`${server.prefix}notes`); // Envia la comanda de notes
          } else {
            await channel.send(msg); // Envia el missatge d'alerta
          }
        }
      }
    });

    message.reply('missatges enviats correctament!');
  },
};
