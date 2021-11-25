const fs = require('fs');
const { log, getOwner } = require('../lib/common.js');
const { getServer } = require('../lib/database.js');

module.exports = {
  name: 'ready',
  async execute(_args, client) {
    if (process.env.SAVE_COMMANDS === 'true') {
      let nMembers = 0;
      client.guilds.cache.forEach((guild) => {
        nMembers += guild.memberCount;
      });

      const path = 'docs/Storage/info.json';
      fs.writeFile(
        path,
        JSON.stringify({ nMembers: nMembers, nServers: client.guilds.cache.size, nCommands: client.commands.size }),
        (err) => {
          if (err) console.error(err);
        }
      );
      console.log(`Info escrita correctament a "${path}"`);
    }

    for await (let guild of client.guilds.cache) {
      guild = guild[1];
      console.log(log(`${guild.name}: ${guild.memberCount} membres`));

      let server = await getServer(guild.id);

      if (server.counterChannel) {
        // Existeix un canal de contador, afegim un setInterval cada 12h
        setInterval(
          (guild, server) => {
            guild.channels.resolve(server.counterChannel).setName(`${guild.memberCount} membres`);
          },
          Math.random() * 12 * 3600000,
          guild,
          server
        );
      }
    }

    client.user.setPresence({
      status: 'online',
      activity: {
        name: 'aleixferre.github.io/CataBot',
        type: 'WATCHING',
      },
    });

    getOwner(client).then((owner) => {
      owner.send('EL BOT ESTÀ ACTIU');
    });

    console.log(
      log(
        '---------------------------------\nREADY :: Version ' +
          process.env.version +
          '\nON ' +
          client.guilds.cache.size +
          ' servers with ' +
          client.commands.size +
          ' commands\n---------------------------------'
      )
    );
  },
};
