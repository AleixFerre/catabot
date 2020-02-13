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
	type: 'entreteniment',
	async execute(message) {

        let $ = require('jquery')(window);
        let title = "Gatito";
        let catUrl = "";
        
        async function getCat() {
            await $.getJSON( "https://api.thecatapi.com/v1/images/search?api_key='" + config.catAPIKey + "'?mime_types=gif", (data) => {
                catUrl = data[0].url;
            });
        }

        await getCat().catch(console.error);
    
        const exampleEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setImage(catUrl);
                
        message.channel.send(exampleEmbed);
        
	},
};