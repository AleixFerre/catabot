const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const { Collection, Client } = require('discord.js');
const client = new Client();
client.commands = new Collection();

const { log, remove, db } = require('./lib/common.js');

const moment = require('moment');
moment().utcOffset('120');

// Describes if the system saves the commands into the docs/.../commands.json file
// Es preferible que es tingui a FALSE a no ser que es vulgui guardar especificament
const SAVE_COMMANDS = process.env.SAVE_COMMANDS === 'true';
const TESTING = process.env.TESTING === 'true'; // TESTING BOT

if (TESTING) {
  console.log(remove('AVÍS: TESTING ACTIVAT!'));
}
if (SAVE_COMMANDS) {
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
    if (SAVE_COMMANDS) {
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

const eventsFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
for (const eventFile of eventsFiles) {
  const event = require(`./events/${eventFile}`);
  client.on(event.name, (args) => event.execute(args, client));
}

if (SAVE_COMMANDS) {
  const path = 'docs/storage/commands.json';
  fs.writeFile(path, JSON.stringify(cmds), (err) => {
    if (err) console.error(err);
  });
  console.log(`Comandes escrites correctament a "${path}"`);
}

// MONGODB CONNECTION
mongoose
  .connect(TESTING ? process.env.MONGODBSRVTest : process.env.MONGODBSRV, {
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
  .login(TESTING ? process.env.tokenTest : process.env.token)
  .then(() => console.log(log('CONNECTAT CORRECTAMENT AMB Discord!')))
  .catch(console.log);
