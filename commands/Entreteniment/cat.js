const Discord = require("discord.js");
const config = require('../../config.json');
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: 'cat',
    description: 'Mostra una imatge d\'un gat aleatori',
    type: 'entreteniment',
    aliases: ['gat'],
    async execute(message) {

        let desc = "";
        let catUrl = "https://stockpictures.io/wp-content/uploads/2020/01/image-not-found-big.png";

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
                .then(async(data) => {
                    desc += data.fact;
                    await translate(desc, {
                        to: "es"
                    }).then(res => {
                        desc = res.text;
                    });
                });
        }

        await getCat().catch(console.error);
        await getTitle().catch(console.error);

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const catEmbed = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("🐱 GATETS!! 🐱")
            .setDescription(desc)
            .setImage(catUrl).setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(catEmbed);

    },
};