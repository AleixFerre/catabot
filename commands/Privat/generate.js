const fs = require('fs');
const { IdOwner } = require("../../config.json");

module.exports = {
    name: 'generate',
    description: 'Ingresa una quantitat a una persona',
    type: 'privat',
    usage: '< amount > < @user >',
    execute(message, args, servers, userData) {

        // ************* Precondicions *************

        let server = servers[message.guild.id];

        if (message.author.id != IdOwner) {
            message.reply("aquesta comanda només pot ser executada per administradors del bot!");
            return message.channel.send(server.prefix + "help generate");
        }

        // Si no hi ha diners
        if (!args[0]) {
            message.reply("no has posat els diners!");
            return message.channel.send(server.prefix + "help generate");
        } else if (isNaN(args[0])) {
            // Si els diners no es un numero
            message.reply("els diners han de ser un numero!");
            return message.channel.send(server.prefix + "help generate");
        } else if (args[0] <= 0) {
            // si el numero de diners es negatiu
            message.reply("els diners a ingressar han de ser més grans que 0!");
            return message.channel.send(server.prefix + "help generate");
        }

        // si no hi ha usuari mencionat
        if (!args[1]) {
            message.reply("no has posat l'usuari a ingressar!");
            return message.channel.send(server.prefix + "help generate");
        } else if (!message.mentions.members.first()) {
            message.reply("no has posat l'usuari a ingressar!");
            return message.channel.send(server.prefix + "help generate");
        }

        let amount = Number(args[0]);
        let otherUser = message.mentions.users.first();

        if (otherUser.bot) {
            // si el mencionat es un bot
            return message.reply("no pots ingressar diners a un bot!");
        }

        if (!message.guild.member(otherUser.id)) {
            // si el mencionat no esta al servidor
            return message.reply("l'usuari mencionat no es troba al servidor!");
        }

        // ************* Transacció *************

        // Posar diners a otherUser
        userData[message.guild.id + otherUser.id].money += amount;

        // Actualitzem el fitxer de disc
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
        message.reply("has ingressat " + amount + " monedes a " + otherUser.username + " correctament! 💸");
    },
};