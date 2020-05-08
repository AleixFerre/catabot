const fs = require('fs');
const { IdOwner } = require("../../config.json");

module.exports = {
    name: 'progress',
    description: 'Et permet pujar de nivell. Comanda interna del bot',
    type: 'privat',
    async execute(message, args, servers, userData) {

        if (!message.author.bot && message.author.id !== IdOwner) {
            return message.reply("no tens permís per executar aquesta comanda!");
        }

        let to = message.mentions.users.first();
        let add = 500; // Per defecte 500xp

        // Si ens passen un argument, llavors aquest
        if (args[0] && !isNaN(args[0])) {
            add = Number(args[0]);
        }

        let content = `${to.username}, has guanyat ${add}xp`;

        let xp = userData[message.guild.id + to.id].xp;
        let sumLvl = 0;
        let sumXp = 0;

        if (add < 1000) { // Si el que afegim es menor que el que val un nivell
            if (add + xp > 1000) { // Si la suma del que afegim i el que tenim, val un nivell
                sumLvl = 1; // Sumem un nivell
                sumXp = add - 1000; // Restem 1000 (el que val un nivell) al que sumem || xpactual + (add - 1000)
            } else { // Si no podem sumar cap nivell
                sumLvl = 0; // No sumem cap nivell
                sumXp = add; // Sumem la xp que podem
            }
        } else { // Si sumem mes d'un nivell en valor d'xp
            sumLvl = Math.floor(add / 1000); // Sumem els nivells que puguem
            let resta = add % 1000; // Agafem el que ens sobra per sumar
            if (resta + xp > 1000) { // Si el que ens queda mes el que tenim, fa un nivell
                sumLvl++; // Sumem un nivell
                sumXp = resta - 1000; // Restem un nivell al que actualment tenim més el que ens queda
            } else { // Si no podem sumar cap nivell
                sumXp = resta; // Sumem la xp que podem
            }
        }

        userData[message.guild.id + to.id].level += sumLvl; // Sumem els nivells calculats
        userData[message.guild.id + to.id].xp += sumXp; // Afegim la xp calculada

        if (sumLvl > 0) { // Si es puja de nivell, avisa'm
            content += `\n${to.username}, has arribat al nivell ${userData[message.guild.id + to.id].level}`;
        }

        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

        await message.channel.send(content);
        message.delete();
    },
};