const Discord = require("discord.js");
const config = require('../../config.json');
const fetch = require('node-fetch');
const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: 'dog',
    description: 'Mostra una imatge d\'un gos aleatori',
    type: 'entreteniment',
    async execute(message) {

        let desc = "";
        let catUrl = "https://stockpictures.io/wp-content/uploads/2020/01/image-not-found-big.png";

        async function getCat() {
            await fetch("https://api.thedogapi.com/v1/images/search?api_key='" + config.catAPIKey + "'?mime_types=gif")
                .then(res => res.json())
                .then((data) => {
                    catUrl = data[0].url;
                });
        }

        async function getTitle() {
            await fetch("https://some-random-api.ml/facts/dog")
                .then(res => res.json())
                .then(async(data) => {
                    desc += data.fact;
                    await translate(desc, { to: "es" }).then(res => {
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
            .setTitle("Fun fact about dogs!")
            .setDescription(desc)
            .setImage(catUrl).setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        message.channel.send(catEmbed);

    },
};