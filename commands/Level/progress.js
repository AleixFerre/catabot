const fs = require('fs');
const { IdOwner } = require("../../config.json");

module.exports = {
    name: 'progress',
    description: 'Et permet pujar de nivell. Comanda interna del bot',
    type: 'level',
    async execute(message, args, servers, userData) {

        if (!message.author.bot && message.author.id !== IdOwner) {
            return message.reply("no tens permís per executar aquesta comanda!");
        }

        let to = message.mentions.users.first();
        let max = 500;

        if (args[0] && !isNaN(args[0])) {
            max = Number(args[0]);
        }

        let lvlUp = false;
        let add = Math.floor(Math.random() * (max - 1) + 1); // Numero aleatori entre 1 i max
        let content = `Has guanyat ${add}xp`;

        userData[message.guild.id + to.id].xp += add; // Afegim la xp
        while (userData[message.guild.id + to.id].xp > 1000) { // Si aquesta supera 1000
            lvlUp = true;
            userData[message.guild.id + to.id].level++; // Sumem un nivell
            userData[message.guild.id + to.id].xp -= 1000; // Corregim la xp pel seguent nivell
        }

        if (lvlUp) { // Si es puja de nivell, avisa'm
            content += `\nHas arribat a nivell ${userData[message.guild.id + to.id].level}`;
        }

        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

        await message.channel.send(content);
        message.delete();
    },
};