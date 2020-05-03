const fs = require('fs');

module.exports = {
    name: 'gamble',
    description: '50% de guanyar, apostant monedes. Ara amb la possibilitat de multiplicar. Però recorda que tens menys probabilitats!!',
    type: 'banc',
    usage: '< amount/all > [ multiplyer ]',
    aliases: ['dobleonada'],
    execute(message, args, servers, userData) {

        let server = servers[message.guild.id];

        let amount = 0;
        let multiplyer = 1; // Per defecte x1
        let multiplicant = false;
        let content = "";
        let all = false;
        const money = userData[message.guild.id + message.author.id].money;

        if (!args[0]) {
            message.reply("no se quant vols apostar!");
            return message.channel.send(server.prefix + "help gamble");
        }

        if (args[1]) {
            if (!isNaN(args[1])) {
                multiplicant = true;
                multiplyer = Number(args[1]);
                if (multiplyer < 1) {
                    message.reply("només pots multiplicar per 1 (per defecte) o més!");
                    return message.channel.send(server.prefix + "help gamble");
                } else if (multiplyer % 1 !== 0) {
                    message.reply("només pots multiplicar nombres enters!");
                    return message.channel.send(server.prefix + "help gamble");
                }
            } else {
                message.reply("el multiplicador ha de ser un numero!");
                return message.channel.send(server.prefix + "help gamble");
            }
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

        if (amount % 1 !== 0) {
            message.reply("només pots apostar nombres enters!");
            return message.channel.send(server.prefix + "help gamble");
        }

        if (amount <= 0) {
            return message.reply("només pots apostar una quantitat superior a 0!");
        }

        if (amount > money) {
            return message.reply("no tens prous diners!!");
        }

        // Comprovem si guanyem o no
        let coin = Math.round(Math.random() * multiplyer); // We round between 0:n so we have randomly true or false
        if (coin === 1) {
            // Guanyem
            amount *= multiplyer; // Multipliquem per m per qui hagi apostat multiplicant
            userData[message.guild.id + message.author.id].money += parseInt(amount);
            content = message.author.username + " has guanyat😆!\n💰" + amount + " monedes afegides a la teva conta.💰";
            if (multiplicant) {
                content += "\nHas utilitzat el multiplicador x" + multiplyer;
            }
        } else {
            // Perdem
            userData[message.guild.id + message.author.id].money -= parseInt(amount);
            if (all) {
                content = message.author.username + " HAS PERDUT TOT";
            } else {
                content = message.author.username + " has perdut";
            }
            content += "😞!\n💰" + amount + " monedes esborrades de la teva conta.💰";
            if (multiplicant) {
                content += "\nHas utilitzat el multiplicador x" + multiplyer + ".\nRecorda que només tens menys probabilitats de perdre, però perds la quantitat apostada.";
            }
        }

        // Actualitzem el fitxer
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

        message.channel.send(server.prefix + "progress <@" + message.author.id + ">");
        message.channel.send("```" + content + "```");
    },
};