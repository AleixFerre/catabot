const fs = require('fs');

module.exports = {
    name: 'resetlevel',
    description: 'Es resetejen tots els nivells de la gent. Comanda interna del bot',
    type: 'privat',
    cooldown: 60,
    async execute(message, _args, _servers, userData, client) {

        if (message.author.id !== process.env.IdOwner) {
            return message.reply("no tens permís per executar aquesta comanda!");
        }

        client.guilds.cache.forEach(guild => {
            if (guild.id !== "264445053596991498") {
                guild.members.cache.forEach(member => {
                    userData[guild.id + member.id].level = 1;
                    userData[guild.id + member.id].xp = 0;
                });
            }
        });

        fs.writeFile('storage/userData.json', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        });
        message.channel.send("Nivells resetejats correctament");
    },
};