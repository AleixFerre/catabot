const fs = require('fs');
const { log, getColorFromCommand } = require('../lib/common.js');
const { getLastForceReset, resetLastForceReset } = require('../lib/database.js');
const { getServer } = require('../lib/database.js');
const { MessageEmbed } = require('discord.js');

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

    checkForceRestart(client);

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

async function checkForceRestart(client) {
  const info = await getLastForceReset();
  if (!info) return;
  console.log('Enviant el missatge del reset amb la info:');
  console.log(info);
  const channel = await client.channels.fetch(info.channelID).catch(() => {
    console.log("No s'ha trobat el canal");
    return null;
  });
  if (channel) {
    await resetLastForceReset();

    const msg = new MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('El bot està llest!')
      .setDescription("Prova d'enviar una comanda per aquest canal de text!");

    channel.send(msg);
  }
}
