const fs = require('fs');

module.exports = {
	name: 'pay',
	description: 'Paga una quantitat a una persona',
	type: 'banc',
	usage: '< amount > < @user >',
	execute(message, args, servers, userData) {
        
        // ************* Precondicions *************
        
        let server = servers[message.guild.id];

        // Si no hi ha diners
        if (!args[0]) {
            message.reply("no has posat els diners!");
            return message.channel.send(server.prefix + "help pay");
        } else if (isNaN(args[0])) {
            // Si els diners no es un numero
            message.reply("els diners han de ser un numero!");
            return message.channel.send(server.prefix + "help pay");
        } else if (args[0] <= 0) {
            // si el numero de diners es negatiu
            message.reply("els diners han de ser més grans que 0!");
            return message.channel.send(server.prefix + "help pay");
        }

        // si no hi ha usuari mencionat
        if (!args[1]) {
            message.reply("no has posat l'usuari a pagar!");
            return message.channel.send(server.prefix + "help pay");
        } else if (!message.mentions.members.first()) {
            message.reply("no has posat l'usuari a pagar!");
            return message.channel.send(server.prefix + "help pay");
        }

        let amount = Number(args[0]);
        let otherUser = message.mentions.users.first();

        if (otherUser.bot) {
            // si el mencionat es un bot
            return message.reply("no pots pagar a un bot!");
        }

        if (otherUser.id === message.author.id) {
            // si el mencionat es un bot
            return message.reply("no et pots pagar a tu mateix!");
        }
        
        
        if (!message.guild.member(otherUser.id)) {
            // si el mencionat no esta al servidor
            return message.reply("l'usuari mencionat no es troba al servidor!");
        }

        // Si no tens els diners suficients
        let dinersActuals = userData[message.guild.id + message.author.id].money;

        if (dinersActuals < amount) {
            return message.reply("no tens tants diners!\n```Téns: " + dinersActuals + "\nVols pagar: " + amount + '\n```');
        }

        
        // ************* Transacció *************

        // Treure diners de message.author
        userData[message.guild.id + message.author.id].money -= amount;

        // Posar diners a otherUser
        userData[message.guild.id + otherUser.id].money += amount;

        // Actualitzem el fitxer de disc
	    fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});
        message.reply("has pagat " + amount + " monedes a " + otherUser.username + " correctament! 💸");
	},
};