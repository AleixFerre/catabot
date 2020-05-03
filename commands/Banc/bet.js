const fs = require('fs');

module.exports = {
    name: 'bet',
    description: 'Aposta en un 50% de guanyar monedes amb un amic, si en tens...',
    type: 'banc',
    usage: '< amount/all > < @user >',
    execute(message, args, servers, userData) {

        const server = servers[message.guild.id];

        let moneyA = userData[message.guild.id + message.author.id].money;
        let amount = 0;
        let content = "";
        let all = false;
        let moneyB = 0;
        let other = {};

        if (!args[0]) {
            message.reply("no se quant vols apostar!");
            return message.channel.send(server.prefix + "help bet");
        }

        if (message.mentions.users.first()) {
            other = message.mentions.users.first();
            moneyB = userData[message.guild.id + other.id].money;
        } else {
            message.reply("no has mencionat la persona amb la que apostar!");
            return message.channel.send(server.prefix + "help bet");
        }

        if (args[0] === "all") {
            amount = moneyA;
            all = true;
        } else if (isNaN(args[0])) {
            message.reply("has de posar un numero vàlid o all");
            return message.channel.send(server.prefix + "help bet");
        } else {
            amount = Number(args[0]);
        }

        if (amount <= 0) {
            return message.reply("només pots apostar una quantitat superior a 0!");
        }

        if (other.bot) {
            return message.reply("no pots apostar contra un bot! Per això utilitza el !gamble");
        } else if (other.id === message.author.id) {
            return message.reply("no pots apostar contra tu mateix, burro!");
        }

        if (amount > moneyA) {
            return message.reply("no tens prous diners!!");
        } else if (amount > moneyB) {
            return message.reply("el contrincant no té prous diners!!");
        }

        // ******************* Aceptem la aposta ******************* 

        function calculateWinnerSendMessage() {
            // Comprovem si guanya A o B
            let coin = Math.round(Math.random()); // We round between 0-1 so we have randomly true or false
            let winner, looser = "";
            if (coin === 1) {
                // Guanya A
                userData[message.guild.id + message.author.id].money += parseInt(amount);
                userData[message.guild.id + other.id].money -= parseInt(amount);

                winner = message.author.username;
                looser = other.username;

            } else {
                // Guanya B
                userData[message.guild.id + other.id].money += parseInt(amount);
                userData[message.guild.id + message.author.id].money -= parseInt(amount);

                winner = other.username;
                looser = message.author.username;
            }

            content = winner + " has guanyat😆\n" + looser + " has perdut😫\n💰" + amount + " monedes pagades de " + looser + " a " + winner + " correctament.💰";

            // Actualitzem el fitxer
            fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
            message.channel.send(server.prefix + "progress 1000 <@" + winner.id + ">");
            message.channel.send(server.prefix + "progress 500 <@" + looser.id + ">");
            message.channel.send("```" + content + "```");
        }

        message.channel.send("```" + other.username + " clica al ✅ per acceptar l'aposta o a la ❌ per cancel·lar!\n(15s per contestar...)```")
            .then(async msg => {
                await msg.react("✅");
                await msg.react("❌");

                const filter = (reaction, user) =>
                    (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') &&
                    user.id === other.id;

                msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
                    .then((collected) => {
                        if (collected.length === 0) {
                            message.reply("no has escollit res!!");
                            msg.delete();
                            return;
                        }
                        let id = -1;
                        const reaction = collected.first();

                        switch (reaction.emoji.name) {
                            case '✅':
                                id = 1;
                                break;
                            case '❌':
                                id = -1;
                                break;
                            default:
                                id = -1;
                                break;
                        }

                        if (id === -1) {
                            return msg.delete();
                        }

                        calculateWinnerSendMessage();
                        msg.delete();

                    }).catch(collected => {
                        message.channel.send("<@" + other.id + ">, no has escollit res, cancel·lant la proposta...");
                        msg.delete();
                        return;
                    });
            });

    },
};