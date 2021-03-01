const {
    updateUser
} = require('../../lib/database');

const TYPE = "privat";

module.exports = {
    name: 'setlevel',
    description: "Adjudica el nivell d'algú. Comanda interna del bot",
    type: TYPE,
    usage: '<lvl, xp, @user>',
    cooldown: 5,
    async execute(message, args) {

        if (message.author.id !== process.env.IdOwner) {
            return message.reply("no tens permís per executar aquesta comanda!");
        }

        let to = message.mentions.users.first();

        if (!to) {
            return message.reply("no has posat a qui adjudicar el nivell!");
        }

        if (!args[0]) {
            return message.reply("no has posat la quantitat de nivell!!");
        } else if (isNaN(args[0])) {
            return message.reply("la xifra del nivell ha de ser un numero");
        }

        let lvl = Number(args[0]);

        if (!args[1]) {
            return message.reply("no has posat la quantitat de xp!!");
        } else if (isNaN(args[1])) {
            return message.reply("la xifra de la xp ha de ser un numero");
        }

        let xp = Number(args[1]);

        if (lvl >= 200) {
            lvl = 200;
            xp = 0;
        }

        let content = `${to.username}, ara tens \`Nivell ${lvl}\` i \`${xp}xp\``;

        await updateUser([to.id, message.guild.id], {
            level: lvl,
            xp: xp
        });

        await message.channel.send(content);

        if (message.author.bot)
            message.delete();
    },
};