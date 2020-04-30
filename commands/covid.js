const Discord = require("discord.js");
const config = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
    name: 'covid',
    description: 'Mostra la info del Coronavirus actualment',
    type: 'entreteniment',
    usage: '[ country ]',
    aliases: ['coronavirus'],
    async execute(message, args, servers) {

        let covidUrl = "https://coronavirus-19-api.herokuapp.com/";
        let codeUrl = "https://api.printful.com/countries/";
        let covidData = {};
        let flag = "https://bit.ly/35fnRmu";
        let country = "";
        let server = servers[message.guild.id];

        if (args[0]) {
            covidUrl += "countries/" + args[0];
            country = args[0];
        } else {
            covidUrl += "all";
            country = "THE WORLD";
        }

        async function getInfo() {
            await fetch(covidUrl)
                .then(res => res.json())
                .then((data) => {
                    covidData = data;
                });
        }

        async function getFlag() {
            await fetch(codeUrl)
                .then(res => res.json())
                .then((data) => {
                    let code = "";
                    data.result.forEach(element => {
                        if (element.name.toLowerCase() === args[0].toLowerCase()) {
                            code = element.code;
                        }
                    });
                    flag = "https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/png250px/" + code.toLowerCase() + ".png";
                });
        }

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        await getInfo().catch(console.error);

        if (country !== "THE WORLD") {
            await getFlag().catch(console.error);
        }

        if (!covidData.cases) {
            message.reply("el país no existeix! Recorda que ho has de posar en angles!");
            return message.channel.send(server.prefix + "help covid");
        }

        const covidEmbed = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("**CORONAVIRUS in " + country.toUpperCase() + "**")
            .setThumbnail(flag);


        Object.keys(covidData).forEach(camp => {
            // Convertimos el campo en space case
            let text = camp;
            let result = text.replace(/([A-Z])/g, " $1");
            let finalResult = result.charAt(0).toUpperCase() + result.slice(1);

            covidEmbed.addField(finalResult, covidData[camp], true);
        });

        covidEmbed.setTimestamp().setFooter("Catabot 2020 © All rights reserved");

        message.channel.send(covidEmbed);

    },
};