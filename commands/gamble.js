const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
	name: 'gamble',
	description: 'Doble o nada, apostant monedes',
	type: 'banc',
    usage: '< amount/all >',
    aliases: ['dobleonada'],
    execute(message, args, servers, userData) {

        let server = servers[message.guild.id];

        let amount = 0;
        let content = "";
        let all = false;
        const money = userData[message.guild.id + message.author.id].money;
        
        if (!args[0]) {
            message.reply("no se quant vols apostar!");
            return message.channel.send(server.prefix + "help gamble");
        }

        if (args[0] === "all") {
            amount = money;
            all = true;
        } else if (isnan(args[0])) {
            message.reply("has de posar un numero vàlid o all");
            return message.channel.send(server.prefix + "help gamble");
        } else {
            amount = args[0];
        }

        if (amount > money) {
            return message.reply("no tens prous diners!!");
        }

        // Comprovem si doble o nada
        let coin = Math.round(Math.random()); // We round between 0-1 so we have randomly true or false
        if (coin === 1) {
            // Doble
            //TODO
        } else {
            // Nada
            //TODO
        }

        // Actualitzem el fitxer
        fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});



        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        message.channel.send(content);
	},
};