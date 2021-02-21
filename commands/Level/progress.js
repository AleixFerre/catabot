const fs = require('fs');
const { ranks } = require("../../Storage/ranks.json");

module.exports = {
    name: 'progress',
    description: 'Et permet pujar de nivell. Comanda interna del bot',
    type: 'privat',
    cooldown: 0,
    async execute(message, args, _servers, userData) {

        if (!message.author.bot && message.author.id !== process.env.IdOwner) {
            return message.reply("no tens permís per executar aquesta comanda!");
        }

        let to = message.mentions.users.first();

        if (!to) {
            return message.reply("no se a qui posar nivell!");
        }

        let add = 500; // Per defecte 500xp

        if (to.bot) {
            return message.reply("no es pot donar xp a un bot!");
        }

        // Si ens passen un argument, llavors aquest
        if (args[0] && !isNaN(args[0])) {
            add = Number(args[0]);
        }

        let content = `${to.username}, has guanyat \`${add}xp\``;

        let xp = userData[message.guild.id + to.id].xp;
        let level = userData[message.guild.id + to.id].level;
        let sumLvl = 0;
        let sumXp = 0;

        // Si tens nivell maxim, no sumes més
        if (level === 200) {
            return message.delete();
        }

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

        // Si just ens queda un sistema com aquest:
        // XP final: 1000 i sumLvl: n
        // Ho transformem a -> XP final: 0 i sumLvl: n+1
        if (xp + sumXp === 1000) {
            sumLvl++;
            sumXp = -xp;
        }

        // Calculem el rank de l'usuari avans
        let rankIndexPrev = Math.floor(level / 10) + 1;
        if (rankIndexPrev > 19) { // Maxim rank -> 19
            rankIndexPrev = 19;
        }

        // Si arrives a nivell 200, manten-te a nivell 200 i 0xp
        if (level + sumLvl >= 200) {
            userData[message.guild.id + to.id].level = 200;
            userData[message.guild.id + to.id].xp = 0;
        } else {
            userData[message.guild.id + to.id].level += sumLvl; // Sumem els nivells calculats
            userData[message.guild.id + to.id].xp += sumXp; // Afegim la xp calculada
        }

        // Calculem el rank de l'usuari ara
        let rankIndexPost = Math.floor(userData[message.guild.id + to.id].level / 10) + 1;
        if (rankIndexPost > 19) { // Maxim rank -> 19
            rankIndexPost = 19;
        }

        if (sumLvl > 0) { // Si es puja de nivell, avisa'm
            content += `\n${to.username}, has arribat al \`Nivell ${userData[message.guild.id + to.id].level}\``;
            if (level + sumLvl >= 200) { // Si just pujes a nivell 200, avisa
                content += `\n${to.username}, HAS ARRIBAT AL NIVELL MÀXIM!`;
            }
            if (rankIndexPrev !== rankIndexPost) { // Si pujes de rank, avisa
                content += `\n${to.username}, has arribat al rang de \`${ranks[rankIndexPost-1]}\`!`;
            }
        }

        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

        await message.channel.send(content);
        message.delete();
    },
};