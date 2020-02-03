var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const Discord = require("discord.js");
const config = require('../config.json');

module.exports = {
	name: 'cat',
	description: 'Mostra una imatge d\'un gat aleatori',
	execute(message) {

        let $ = require('jquery')(window);
        
        $.getJSON( "https://api.thecatapi.com/v1/images/search?api_key='" + config.catAPIKey + "'?mime_types=gif", function(data) {
            
            const exampleEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Mira que gatito mas mono... :3')
            .setImage(data[0].url);
            
            message.channel.send(exampleEmbed);
        });
	},
};