const Discord = require("discord.js");
const fetch = require('node-fetch');
const { getRandomColor } = require('../../lib/common.js');

module.exports = {
    name: 'pokedex',
    description: 'Mostra la pokedex del pokemon que li entris',
    usage: '< pokemon >',
    aliases: ['poke', 'pokemon'],
    type: 'entreteniment',
    cooldown: 10,
    execute(message, args, servers) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.reply("No se el que vols buscar!");
            message.channel.send(server.prefix + "help pokedex");
            return;
        }

        let APIname = args.join("-");
        let realName = args.join(" ");

        fetch("https://some-random-api.ml/pokedex?pokemon=" + APIname)
            .then(res => res.json())
            .then((data) => {

                if (data.error) {
                    message.channel.send("```No hi ha cap pokemon que es digui " + realName + "```");
                    message.channel.send(server.prefix + "help pokedex");
                    return;
                }

                function capitalize(s) {
                    return s.charAt(0).toUpperCase() + s.slice(1);
                }

                let body = "• Height: `" + data.height.substring(0, data.height.indexOf('(')).slice(0, -1) + "`\n" +
                    "• Weight: `" + data.weight.substring(0, data.weight.indexOf('(')).slice(0, -1) + "`\n" +
                    "• Base experience: `" + data.base_experience + " xp`";

                let gender = "";
                if (data.gender === "Genderless") {
                    gender = "Genderless";
                } else {
                    gender = data.gender.join("\n").replace("male", "♂️").replace("female", "♀");
                }

                // Si te un sol tipus, posem Type, sino posem Types
                let type = data.type.length === 1 ? "Type" : "Types";

                let stats = "• HP: `" + data.stats.hp + '`\n' +
                    "• Attack: `" + data.stats.attack + '`\n' +
                    "• Defense: `" + data.stats.defense + '`\n' +
                    "• Special Attck: `" + data.stats.sp_atk + '`\n' +
                    "• Special Defense: `" + data.stats.sp_def + '`\n' +
                    "• Speed: `" + data.stats.speed + '`\n' +
                    "• Total: `" + data.stats.total + '`';


                const pokeEmbed = new Discord.MessageEmbed()
                    .setColor(getRandomColor())
                    .setAuthor('POKEDEX', 'https://pngimage.net/wp-content/uploads/2018/06/pokemon-go-icon-png-3.png', 'https://pokemon.fandom.com/es/wiki/' + args.join("_"))
                    .setTitle("**#" + data.id + " | " + capitalize(data.name) + " | " + data.generation + "º GEN**") // Capitalize the first letter
                    .setDescription(data.description)
                    .setThumbnail("http://i.some-random-api.ml/pokemon/" + APIname + ".gif")
                    .addField("❯ " + type + ':', data.type.join(", "), true)
                    .addField('❯ Abilities:', data.abilities.join(", "), true)
                    .addField('❯ Species:', data.species.join(", "), true)
                    .addField("❯ Stats: ", stats, true)
                    .addField("❯ Body:", body, true)
                    .addField("❯ Gender: ", gender, true)
                    .addField("❯ Egg groups:", data.egg_groups.join(", "), true);

                if (data.family.evolutionLine.length > 0) {
                    // Treu els repetits ja que està en un Set
                    let uniqueEvos = [...new Set(data.family.evolutionLine)];
                    for (i = 0; i < uniqueEvos.length; i++) {
                        if (uniqueEvos[i].toUpperCase() === realName.toUpperCase()) {
                            uniqueEvos[i] = "**" + uniqueEvos[i] + "**";
                        }
                    }
                    pokeEmbed.addField('❯ Evolutions:', uniqueEvos.join(", "), true);
                }

                pokeEmbed.setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

                message.channel.send(pokeEmbed).catch(console.error);
            });
    },
};