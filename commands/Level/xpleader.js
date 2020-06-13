const Discord = require("discord.js");

module.exports = {
    name: 'xpleader',
    description: 'Mostra la classificació de nivell del servidor',
    aliases: ['xpl', 'lvltop', 'xptop', 'topxp', 'toplvl', 'toplevel'],
    type: 'level',
    usage: '[ amount ]',
    execute(message, args, servers, userData) {

        let board = [];
        let size = 10;
        let server = servers[message.guild.id];

        if (args[0] && !isNaN(args[0])) {
            size = Number(args[0]);
        }

        if (size > 10 || size <= 0) {
            message.reply("la mida ha de ser entre 1 i 10");
            return message.channel.send(server.prefix + "help xpl");
        }

        if (!message.guild.available) {
            message.reply('el servidor no està disponible!');
            return;
        }

        // ALGORISME per Inserció Directa || O(N) Optimized algorithm [we can also multiply N with 10 but is a constant value, but with the O notation, we don't keep it]
        // Per cada usuari del servidor (en el que s'ha enviat el missatge)
        // inserció ordenada per monedes // O(array_lenght(10)) but only with 10 elements max [max length fixed with the leaderboard]
        // si la mida de la taula > 10
        // pop_back (l'ultim)
        // La taula s'ha de mantenir sempre amb 10 elements com a maxim
        // Mostrar la info amb un embed corresponent

        function insercioOrdenada(user, nom) {
            //Pre:	0<=board.length<MAX, board[0..board.length-1] ordenat creixentment
            //Post:	x inserit ordenadament a board

            if (user.money === -1)
                return;

            // Busquem la posicio on volem inserir
            let i = board.length;
            while (i > 0 && (user.level * 1000) + user.xp > (board[i - 1].level * 1000) + board[i - 1].xp) {
                i--;
            }

            // Inserim a la posició corresponent
            let inserit = {
                level: user.level,
                xp: user.xp,
                name: nom
            };
            board.splice(i, 0, inserit);
        }


        message.guild.members.cache.forEach((member) => {
            // Per cada membre del servidor, apliquem aquesta funció

            let user = userData[message.guild.id + member.id];
            insercioOrdenada(user, member.user.username);

            // Mantenim la taula sempre com a maxim amb size elements
            // This is really an IF statement but just in case
            while (board.length > size) {
                board.pop();
            }
        });

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("💠 XPLeaderboard de " + message.guild.name + " 💠")
            // .setThumbnail(message.guild.iconURL())
            .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

        let i = 1;

        // 🥇 🥈 🥉

        board.forEach((user) => {
            let num = i;
            if (i === 1) {
                num = '🥇';
            } else if (i === 2) {
                num = '🥈';
            } else if (i === 3) {
                num = '🥉';
            }
            msg.addField(num + '.- ' + user.name, 'Nivell: ' + user.level + ' - ' + user.xp + 'xp');
            i++;
        });

        message.channel.send(msg);
    },
};