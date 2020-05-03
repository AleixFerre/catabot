const fs = require('fs');

module.exports = {
    name: 'progress',
    description: 'Et permet pujar de nivell. Comanda de prova',
    type: 'level',
    aliases: ['up'],
    execute(message, args, servers, userData) {

        let lvlUp = false;
        let add = Math.floor(Math.random() * 499 + 1); // Numero aleatori entre 1 i 500
        let content = `Has guanyat ${add}xp`;

        userData[message.guild.id + message.author.id].xp += add; // Afegim la xp
        while (userData[message.guild.id + message.author.id].xp > 1000) { // Si aquesta supera 1000
            lvlUp = true;
            userData[message.guild.id + message.author.id].level++; // Sumem un nivell
            userData[message.guild.id + message.author.id].xp -= 1000; // Corregim la xp pel seguent nivell
        }

        if (lvlUp) { // Si es puja de nivell, avisem
            content += `\nHas arribat a nivell ${userData[message.guild.id + message.author.id].level}`;
        }

        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        message.channel.send(content);
    },
};