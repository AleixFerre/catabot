const TYPE = "mod";

module.exports = {
    name: 'ban',
    description: 'Beta un usuari del servidor',
    usage: '< @usuari > [ descripcio ]',
    type: TYPE,
    cooldown: 30,
    execute(message, args, server) {

        let prefix = server.prefix;

        user = message.mentions.users.first();
        // If we have a user mentioned
        if (user) {
            // Now we get the member from the user
            const member = message.guild.member(user);
            // If the member is in the guild
            if (member) {
                let banmsg = 'Motiu del kick desconegut';
                if (args[0])
                    banmsg = args.join(' ');

                member.ban(banmsg).then(() => {
                    // We let the message author know we were able to ban the person
                    message.reply("S'ha banejat a " + user.username + " amb èxit.");
                }).catch((err) => {
                    // An error happened
                    // This is generally due to the bot not being able to ban the member,
                    // either due to missing permissions or role hierarchy
                    message.reply('No es pot banejar a l\'usuari\nTens permisos?\nProba-ho manualment\n' + err);
                    message.channel.send(prefix + 'help ban');
                });
            } else {
                // The mentioned user isn't in this guild
                message.reply('Aquest usuari no pertany al servidor!');
                message.channel.send(prefix + 'help ban');
            }
        } else {
            // Otherwise, if no user was mentioned
            message.reply('A qui vols que faci fora?');
            message.channel.send(prefix + 'help ban');
        }
    },
};