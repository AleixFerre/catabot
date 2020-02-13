const Discord = require("discord.js");
const config = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'cat',
	description: 'Mostra una imatge d\'un gat aleatori',
	type: 'entreteniment',
	async execute(message) {

        let title = "Gatito";
        let catUrl = "";
        
        async function getCat() {
            await fetch("https://api.thecatapi.com/v1/images/search?api_key='" + config.catAPIKey + "'?mime_types=gif")
            .then(res => res.json())
            .then((data) => {
                catUrl = data[0].url;
            });
        }

        async function getTitle() {
            await fetch("https://some-random-api.ml/facts/cat")
            .then(res => res.json())
            .then((data) => {
                title = data.fact;
            });
        }

        await getCat().catch(console.error);
        await getTitle().catch(console.error);
    
        const exampleEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setImage(catUrl);
                
        message.channel.send(exampleEmbed);
        
	},
};