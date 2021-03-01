const {
    ranks
} = require("../../storage/ranks.json");
const {
    getUser,
    updateUser
} = require('../../lib/database.js');
const {
    db
} = require('../../lib/common');


const TYPE = "privat";

module.exports = {
    name: 'progress',
    description: 'Et permet pujar de nivell. Comanda interna del bot.',
    type: TYPE,
    cooldown: 0,
    async execute(message, args) {

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

        let userData = await getUser(to.id, message.guild.id);

        if (!userData) {
            message.channel.send("Error: No s'ha trobat a l'usuari!");
            return;
        }

        let level = userData.level;
        let xp = userData.xp;
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
            level = 200;
            xp = 0;
        } else {
            level += sumLvl; // Sumem els nivells calculats
            xp += sumXp; // Afegim la xp calculada
        }

        // Calculem el rank de l'usuari ara
        let rankIndexPost = Math.floor(level / 10) + 1;
        if (rankIndexPost > 19) { // Maxim rank -> 19
            rankIndexPost = 19;
        }

        if (sumLvl > 0) { // Si es puja de nivell, avisa'm
            content += `\n${to.username}, has arribat al \`Nivell ${level}\``;
            if (level + sumLvl >= 200) { // Si just pujes a nivell 200, avisa
                content += `\n${to.username}, HAS ARRIBAT AL NIVELL MÀXIM!`;
            }
            if (rankIndexPrev !== rankIndexPost) { // Si pujes de rank, avisa
                content += `\n${to.username}, has arribat al rang de \`${ranks[rankIndexPost-1]}\`!`;
            }
        }

        updateUser([userData.IDs.userID, userData.IDs.serverID], {
            level: level,
            xp: xp
        }).then(db(`DB: Usuari ${to.username} actualitzat ${level, xp}`));

        await message.channel.send(content);
        if (message.author.bot)
            message.delete();
    },
};