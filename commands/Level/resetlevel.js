const fs = require('fs');
const { IdOwner } = require("../../config.json");

module.exports = {
    name: 'resetlevel',
    description: 'Es resetejen tots els nivells de la gent. Comanda interna del bot',
    type: 'privat',
    async execute(message, args, servers, userData, client) {

        if (message.author.id !== IdOwner) {
            return message.reply("no tens permís per executar aquesta comanda!");
        }

        client.guilds.forEach(guild => {
            if (guild.id !== "264445053596991498") {
                guild.members.forEach(member => {
                    userData[guild.id + member.id].level = 1;
                    userData[guild.id + member.id].xp = 0;
                });
            }
        });

        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
        message.channel.send("Nivells resetejats correctament");
    },
};