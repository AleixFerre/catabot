const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
	name: 'pokedex',
	description: 'Mostra la pokedex del pokemon',
    usage: '< pokemon >',
    aliases: ['poke', 'pokemon'],
	type: 'entreteniment',
	execute(message, args, servers) {
        
        let server = servers[message.guid.id];

        if (!args[0]) {
            message.reply("No se el que vols buscar!");
            message.channel.send(server.prefix + "help pokedex");
            return;
        }

        fetch("https://some-random-api.ml/pokedex?pokemon=" + args[0])
        .then(res => res.json())
        .then((data) => {

            if (data.error) {
                message.channel.send("```No hi ha cap pokemon que es digui "+ args[0] +"```");
                message.channel.send(server.prefix + "help pokedex");
                return;
            }

            function getRandomColor() {
                let letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            const pokeEmbed = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setAuthor('POKEDEX', 'https://pngimage.net/wp-content/uploads/2018/06/pokemon-go-icon-png-3.png', 'https://pokemon.fandom.com/es/wiki/' + data.name)
            .setTitle(data.name.charAt(0).toUpperCase() + data.name.slice(1)) // Capitalize the first letter
            .setDescription(data.description)
            .setThumbnail(data.sprites.animated)
            .addField('Types:', data.type.join(", "), true);

            if (data.family.evolutionLine.length > 0) {
                let uniqueEvos = [...new Set(data.family.evolutionLine)];
                pokeEmbed.addField('Evolutions:', uniqueEvos.join(", "), true);
            }

            pokeEmbed.setTimestamp().setFooter("Catabot 2020 © All rights reserved");
            
            message.channel.send(pokeEmbed).catch(console.error);
        });
	},
};