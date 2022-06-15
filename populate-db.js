const database = require('./lib/database');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

// MONGODB CONNECTION
mongoose
	.connect('mongodb://localhost:27017/CataBOTDB')
	.then(() => {
		console.debug('CONNECTAT CORRECTAMENT A LA BASE DE DADES!');
		const commands = JSON.parse(fs.readFileSync('./data/commands.json', 'utf8'));
		const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
		const servers = JSON.parse(fs.readFileSync('./data/servers.json', 'utf8'));
		const utils = JSON.parse(fs.readFileSync('./data/utils.json', 'utf8'));
		const stats = JSON.parse(fs.readFileSync('./data/stats.json', 'utf8'));

		database.initAll(commands, users, servers, utils, stats);
	})
	.catch(console.error);
