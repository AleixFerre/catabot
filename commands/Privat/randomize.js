const fs = require('fs');

module.exports = {
    name: 'randomize',
    description: 'Posa un valor aleatori de monedes a tots els usuaris del servidor',
    usage: '[ max ]',
    cooldown: 30,
    type: 'privat',
    execute(message, args, server, userData) {

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

        message.guild.members.cache.forEach(member => {
            if (userData[message.guild.id + member.user.id]) {
                if (userData[message.guild.id + member.user.id].money) {
                    if (member.user.bot)
                        userData[message.guild.id + member.user.id].money = -1;
                    else
                        userData[message.guild.id + member.user.id].money = Math.round(Math.random() * max);
                }
            }
        });

        fs.writeFile('storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
        message.channel.send('🔀 Monedes randomitzades correctament amb un valor maxim de ' + max + '! ✅');
    },
};