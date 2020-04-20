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
        } else if (isNaN(args[0])) {
            message.reply("has de posar un numero vàlid o all");
            return message.channel.send(server.prefix + "help gamble");
        } else {
            amount = Number(args[0]);
        }

        if (amount <= 0) {
            return message.reply("només pots apostar una quantitat superior a 0!");
        }

        if (amount > money) {
            return message.reply("no tens prous diners!!");
        }

        // Comprovem si doble o nada
        let coin = Math.round(Math.random()); // We round between 0-1 so we have randomly true or false
        if (coin === 1) {
            // Doble
            userData[message.guild.id + message.author.id].money += parseInt(amount);
            content = message.author.username + " has guanyat😆!\n💰" + amount + " monedes afegides a la teva conta.💰";
        } else {
            // Nada
            userData[message.guild.id + message.author.id].money -= parseInt(amount);
            if (all) {
                content = message.author.username + " HAS PERDUT TOT";
            } else {
                content = message.author.username + " has perdut";
            }
            content += "😞!\n💰" + amount + " monedes esborrades de la teva conta.💰";
        }

        // Actualitzem el fitxer
        fs.writeFile('Storage/userData.json', JSON.stringify(userData, null, 2), (err) => {if(err) console.error(err);});

        message.channel.send("```" + content + "```");
	},
};