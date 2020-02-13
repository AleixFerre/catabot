const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
	name: 'pokedex',
	description: 'Mostra la pokedex del pokemon',
    usage: '< pokemon >',
    aliases: ['poke', 'pokemon'],
	type: 'entreteniment',
	execute(message, args) {
        
        fetch("https://some-random-api.ml/pokedex?pokemon=" + args[0])
        .then(res => res.json())
        .then((data) => {

            if (data.error) {
                message.channel.send("```No hi ha cap pokemon que es digui "+ args[0] +"```");
                return;
            }

            console.log(data);

            const exampleEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(data.name.charAt(0).toUpperCase() + data.name.slice(1)) // Capitalize the first letter
            .setDescription(data.description)
            .setThumbnail(data.sprites.animated);
            
            message.channel.send(exampleEmbed);
        });
	},
};