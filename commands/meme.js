var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const Discord = require("discord.js");

module.exports = {
	name: 'meme',
	description: 'Mostra un meme aleatori de reddit',
	type: 'entreteniment',
	execute(message) {

        let $ = require('jquery')(window);
        
        $.getJSON( "https://meme-api.herokuapp.com/gimme", function(data) {
            
            const exampleEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(data.title)
            .setImage(data.url);
            
            message.channel.send(exampleEmbed);
        });
	},
};