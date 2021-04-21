const {
    updateAllUsers
} = require('../../lib/database.js');

const TYPE = "privat";

module.exports = {
    name: 'resetlevel',
    description: 'Es resetejen tots els nivells de la gent. Comanda interna del bot.',
    type: TYPE,
    async execute(message) {

        if (message.author.id !== process.env.IdOwner) {
            return message.reply("no tens permís per executar aquesta comanda!");
        }

        await updateAllUsers({
            level: 1,
            xp: 0
        });

        message.channel.send("💠Nivells resetejats correctament!💠");
    },
};