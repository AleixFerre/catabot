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
        let max = 500; // Per defecte 500xp de maxim

        // Si ens passen un argument, llavors aquest
        if (args[0] && !isNaN(args[0])) {
            max = Number(args[0]);
        }

        let add = Math.floor(Math.random() * (max - 1) + 1); // Numero aleatori entre 1 i max
        let content = `Has guanyat ${add}xp`;

        userData[message.guild.id + to.id].level += Math.floor((add + userData[message.guild.id + to.id].xp) / 1000); // Sumem els nivells que falten
        userData[message.guild.id + to.id].xp += (add + userData[message.guild.id + to.id].xp) % 1000; // Afegim la xp

        if (add > 1000) { // Si es puja de nivell, avisa'm
            content += `\nHas arribat al nivell ${userData[message.guild.id + to.id].level}`;
        }

        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

        await message.channel.send(content);
        message.delete();
    },
};