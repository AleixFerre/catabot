const fs = require('fs');
const Canvas = require('canvas');
const moment = require('moment');
const mongoose = require('mongoose');
require('dotenv').config();

const { log, remove, bot, db, getOwner } = require('./lib/common.js');

// Database facade functions
const {
  updateServer,
  getServer,
  deleteUser,
  deleteServer,
  deleteUsersFromServer,
  getUser,
} = require('./lib/database.js');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
// client.events = new Discord.Collection();

moment().utcOffset('120');

// Describes if the system saves the commands into the docs/.../commands.json file
// Es preferible que es tingui a FALSE a no ser que es vulgui guardar especificament
const wantToSaveCommands = process.env.SAVE_COMMANDS === 'true';
const testing = process.env.TESTING === 'true'; // TESTING BOT

if (testing) {
  console.log(remove('AVÍS: TESTING ACTIVAT!'));
}
if (wantToSaveCommands) {
  console.log(remove('AVÍS: GUARDAT DE COMANDES ACTIVAT!'));
}

let cmds = []; // Array that will store all the bot commands

/// Load the commands from all the folders -> files
const commandDirs = fs.readdirSync('./commands');
for (const dir of commandDirs) {
  const files = fs.readdirSync(`./commands/${dir}`).filter((file) => file.endsWith('.js'));
  for (const file of files) {
    const command = require(`./commands/${dir}/${file}`);
    client.commands.set(command.name, command);
    if (wantToSaveCommands) {
      cmds.push({
        name: command.name,
        description: command.description,
        type: command.type,
        usage: `!${command.name}${command.usage || ''}`,
        aliases: command.aliases,
      });
    }
  }
}

// const eventsFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
// for (const eventFile of eventsFiles) {
//   client.events.set(eventFile.name, eventFile);
// }

if (wantToSaveCommands) {
  const path = 'docs/storage/commands.json';
  fs.writeFile(path, JSON.stringify(cmds), (err) => {
    if (err) console.error(err);
  });
  console.log(`Comandes escrites correctament a "${path}"`);
}

client.on('ready', async () => {
  if (wantToSaveCommands) {
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
    console.log(`Comandes escrites correctament a "${path}"`);
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

  console.log(
    log(
      `READY :: Version ${process.env.version}
ON ${client.guilds.cache.size} servers with ${client.commands.size} commands
---------------------------------`
    )
  );

  if (!process.env.testing) {
    let owner = await getOwner(client);
    let embed = new Discord.MessageEmbed()
      .setTitle('✅ TOT LLEST.')
      .setDescription('Estic online correctament!')
      .setColor('0x00FF00');
    owner.send(embed);
  }
});

client.on('error', (err) => {
  console.log(remove(err.toString()));
});

client.on('rateLimit', async (rateLimitData) => {
  let owner = await getOwner(client);
  owner.send(`T'has passat el limit de rate!
--------------- INFO --------------- 
${JSON.stringify(rateLimitData, null, 2)}`);
  console.log(rateLimitData);
});

client.on('guildCreate', (guild) => {
  updateServer(guild.id, {
    serverID: guild.id,
    prefix: process.env.prefix,
  }).then(console.log(db(`DB: Guardada la nova guild ${guild.name} correctament!`)));

  try {
    let newName = `[ ${process.env.prefix} ] CataBOT`;
    guild.me.setNickname(newName);
  } catch (err) {
    console.error(err);
  }

  // Enviem el missatge al owner de la guild
  let introMessage = `**DONA LA BENVINGUDA AL CATABOT!**
El primer bot de Discord en català!

**CONFIGURACIÓ GENERAL**
El bot permet executar una serie de comandes automàtiques sempre que un ADMINISTRADOR ho decideixi. També cal saber que totes les comandes de tipus MOD requereixen un rol d'ADMINISTRADOR per ser executades.
- El bot permet cambiar el prefix per defecte amb la comanda \`${process.env.prefix}prefix [prefix nou]\` amb un màxim de 5 caràcters.
- També es pot configurar un canal de benvinguda perque digui Hola i Adeu a tots els integrants nous i passats del servidor amb \`${process.env.prefix}setwelcome\`. També pots provar amb \`${process.env.prefix}welcome\` i \`${process.env.prefix}bye\`
- Es pot configurar un canal d'avisos amb \`${process.env.prefix}setalert\`. En aquest canal s'avisarà de totes les novetats del bot.
- Finalment, es pot configurar un canal del bot amb \`${process.env.prefix}setbot\`. Això el que farà serà avisar a tothom qui estigui usant el bot fora d'aquest canal.
Aquestes tres comandes es poden desactivar en qualsevol moment amb el paràmetre \`treure\`. P.E. \`${process.env.prefix}setwelcome treure\`
Per veure tota la informació dels canals, fes servir la comanda \`${process.env.prefix}server\`.

Més informació de les comandes amb \`${process.env.prefix}help\` o \`${process.env.prefix}help [nom de la comanda]\`.`;

  try {
    guild.members.fetch(guild.ownerID).then((owner) => {
      owner.send(introMessage);
    });
  } catch (err) {
    console.error(err);
  }

  console.log(bot(`El bot ha entrat al servidor "${guild.name}"`));
});

client.on('guildDelete', (guild) => {
  console.log(remove(`El bot ha sortit del servidor "${guild.name}"`));

  deleteUsersFromServer(guild.id).then((deletedCount) => {
    console.log(db(`Esborrats els ${deletedCount} usuaris de la guild ${guild.name}`));
  });

  deleteServer(guild.id).then(console.log(db(`DB: Esborrat el server ${guild.name} correctament!`)));
});

const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');
  let fontSize = 70;

  do {
    ctx.font = `${(fontSize -= 10)}px sans-serif`;
  } while (ctx.measureText(text).width > canvas.width - 300);

  return ctx.font;
};

client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) {
    return;
  }

  console.log(log(`Nou membre "${member.user.username}" afegit a la guild ${member.guild.name}`));

  let channelInfo = await getServer(member.guild.id);
  // Si no hi ha el canal configurat, no enviem res
  if (!channelInfo) return;

  let channel = client.channels.resolve(channelInfo.welcomeChannel);
  if (!channel) return;

  channel.send(`${channelInfo.prefix}welcome ${member.user}`);
});

client.on('guildMemberRemove', async (member) => {
  if (member.user.bot) {
    return;
  }

  deleteUser([member.id, member.guild.id]).then(
    console.log(db(`DB: Esborrat el nou usuari ${member.user.username} correctament!`))
  );

  console.log(remove(`El membre "${member.user.username}" ha sortit de la guild ${member.guild.name}`));

  let channelID = await getServer(member.guild.id);
  channelID = channelID.welcomeChannel;
  if (!channelID) {
    // Si no hi ha el canal configurat, no enviem res
    console.log(bot('No té canal de benvinguda, ignorant...'));
    return;
  }

  let channel = client.channels.resolve(channelID);

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./img/wallpaper.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  let s = ctx.measureText('Adeu,');
  ctx.strokeText('Adeu,', 351 - s.width / 2, 90 + 90);
  ctx.fillText('Adeu,', 351 - s.width / 2, 90 + 90);

  ctx.font = applyText(canvas, `${member.displayName}!`);
  ctx.fillStyle = '#ffffff';
  let s2 = ctx.measureText(`${member.displayName}!`);
  ctx.strokeText(`${member.displayName}!`, 351 - s2.width / 2, 90 + 125 + 20);
  ctx.fillText(`${member.displayName}!`, 351 - s2.width / 2, 90 + 125 + 20);

  ctx.beginPath();
  ctx.arc(351, 90, 56, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({
      format: 'png',
    })
  );
  ctx.drawImage(avatar, 289, 28, 125, 125);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'bye-image.png');

  channel.send(`Adeu, ${member}!`, attachment);
});

client.on('message', async (message) => {
  let prefix = process.env.prefix;
  let server;
  if (message.guild) {
    server = await getServer(message.guild.id);
    prefix = server.prefix;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix)) return;

  if (!message.channel.members && commandName != 'help' && commandName != 'h') {
    // Estem a DM, només funciona el help
    message.author.send(
      "**⚠️ Als canals privats només funciona la comanda `catahelp`. Prova millor d'executar aquesta comanda a un servidor.**"
    );
    return;
  }

  // Només si el servidor té el canal de bot adjudicat i no soc jo,
  if (message.author.id !== process.env.IdOwner && server.botChannel && message.channel.id !== server.botChannel) {
    // Si el missatge està en un altre canal,
    message.author.send(`Prova d'enviar el missatge pel canal del bot: <#${server.botChannel}>`);
    return; // ignorar
  }

  const command =
    client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.type === 'mod') {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply("no tens els permisos d'Administrador necessaris per executar aquesta comanda!");
      return;
    }
  }

  if (command.type === 'games' || command.type === 'banc' || command.type === 'level') {
    let perfil = await getUser(message.author.id, message.guild.id);
    if (!perfil) {
      return message.channel.send(
        `**️️️⚠️ Alerta: Encara no tens un Perfil, el pots crear amb la comanda** \`${server.prefix}crearPerfil\`
Amb un **Perfil** tindràs accés a totes les comandes de tipus **Banc**, **Nivell** i **Jocs**.`
      );
    }
  }

  console.log(`--- Nova comanda ---
Autor: ${message.author} - ${message.author.tag}
Contingut: ${message.content}
Servidor: ${message.guild}
Canal: ${message.channel.name}`);

  try {
    command.execute(message, args, server, client, commandName);
  } catch (error) {
    const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000) // Red
      .setTitle('⚠️ Alguna cosa ha anat malament! ⚠️')
      .setDescription(
        'Si saps el que ha passat, pots reportar el bug [aqui](https://github.com/CatalaHD/CataBot/issues).'
      )
      .addField('Error:', error);

    console.log(error);

    message.channel.send(errorEmbed); // Enviem la info pel canal

    errorEmbed
      .addField('Guild', message.guild.name, true)
      .addField('Channel', message.channel.name, true)
      .addField('Contingut', message.content, true);

    // Enviem info adicional al admin
    let owner = await getOwner(client);
    owner.send(errorEmbed);
  }
});

// MONGODB CONNECTION
mongoose
  .connect(testing ? process.env.MONGODBSRVTest : process.env.MONGODBSRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(db('CONNECTAT CORRECTAMENT A LA BASE DE DADES!'));
  })
  .catch(console.error);

// DISCORD BOT CONNECTION
client
  .login(testing ? process.env.tokenTest : process.env.token)
  .then(() => console.log(log('CONNECTAT CORRECTAMENT AMB Discord!')))
  .catch(console.log);
