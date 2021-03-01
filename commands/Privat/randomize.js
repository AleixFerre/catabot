const {
    db
} = require('../../lib/common.js');
const {
    getUsersFromServer, updateUser
} = require('../../lib/database.js');

const TYPE = "privat";

module.exports = {
    name: 'randomize',
    description: 'Posa un valor aleatori de monedes a tots els usuaris del servidor',
    usage: '[ max ]',
    cooldown: 30,
    type: TYPE,
    async execute(message, args, server) {

        if (message.author.id != process.env.IdOwner) {
            message.reply("aquesta comanda només pot ser executada per administradors del bot!");
            return message.channel.send(server.prefix + "help randomize");
        }

        let max = 1000;
        if (args[0]) {
            if (!isNaN(args[0])) {
                max = Math.abs(args[0]);
            } else {
                message.reply("posa un numero!");
                return;
            }
        }

        let serverUsers = await getUsersFromServer(message.guild.id);
        serverUsers.forEach((user) => {
            updateUser([user.IDs.userID, message.guild.id], {
                money: Math.floor(Math.random() * max)
            }).then(console.log(db(`DB: Randomitzades les monedes de ${message.guild.members.resolve(user.IDs.userID).user.username} correctament`)));
        });

        message.channel.send('🔀 Monedes randomitzades correctament amb un valor maxim de ' + max + '! ✅');
    },
};