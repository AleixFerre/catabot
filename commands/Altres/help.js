const Discord = require("discord.js");
const {
    getRandomColor
} = require('../../lib/common.js');

module.exports = {
    name: 'help',
    description: 'Mostra informació de les comandes',
    type: "altres",
    cooldown: 1,
    usage: '[ nom de la comanda ]',
    aliases: ['h', 'commands', 'info'],
    execute(message, args, servers) {

        const data = [];
        const {
            commands
        } = message.client;

        let prefix = "!";
        if (message.guild) {
            prefix = servers[message.guild.id].prefix;
        }

        if (!args.length) {

            // Creem una variable string per anar guardant tot el contingut del help que anem posant al embed
            let helpContent = "\n";

            // Creem les taules auxiliars per guardar les comandes de cada tipus
            let musica = [];
            let mod = [];
            let banc = [];
            let games = [];
            let entreteniment = [];
            let level = [];
            let privat = [];
            let altres = [];

            // Encuem cada comanda a la taula que toca
            commands.forEach((command) => {
                switch (command.type) {
                    case 'musica':
                        musica.push(command);
                        break;
                    case 'mod':
                        mod.push(command);
                        break;
                    case 'banc':
                        banc.push(command);
                        break;
                    case 'games':
                        games.push(command);
                        break;
                    case 'entreteniment':
                        entreteniment.push(command);
                        break;
                    case 'level':
                        level.push(command);
                        break;
                    case 'privat':
                        privat.push(command);
                        break;
                    case 'altres':
                        altres.push(command);
                        break;
                    default:
                        altres.push(command);
                        break;
                }
            });

            // Creem l'embed i l'anem omplint
            const fullHelpEmbed = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle('El **CataBOT** té ' + commands.size + ' comandes')
                .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/gif_frames/icon_new.gif', 'https://github.com/CatalaHD/CataBot')
                .setThumbnail('https://i.imgur.com/OMp4api.png')
                .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

            let aux = mod.map(c => c.name);
            helpContent += '👮 **COMANDES DE MODERACIÓ** 👮 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            aux = entreteniment.map(c => c.name);
            helpContent += '\n\n🥳 **COMANDES DE ENTRETENIMENT** 🥳 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            aux = musica.map(c => c.name);
            helpContent += '\n\n🎵 **COMANDES DE MUSICA** 🎵 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            aux = banc.map(c => c.name);
            helpContent += '\n\n💰 **COMANDES DE BANC** 💰 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            aux = level.map(c => c.name);
            helpContent += '\n\n💠 **COMANDES DE NIVELL** 💠 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            aux = games.map(c => c.name);
            helpContent += '\n\n🎮 **JOCS** 🎮 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            aux = privat.map(c => c.name);
            helpContent += '\n\n🔒 **COMANDES PRIVADES** 🔒 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            aux = altres.map(c => c.name);
            helpContent += '\n\n🌈 **ALTRES COMANDES** 🌈 [' + aux.length + ']\n';
            helpContent += "`" + aux.join(", ") + "`";

            data.push(helpContent);
            data.push('\n • Pots enviar ' + prefix + 'help [nom comanda] per obtenir informació més detallada de la comanda!\n' +
                " • Pots veure totes les comandes [aquí](https://catalahd.github.io/CataBot/commands.html).");

            fullHelpEmbed.setDescription(data);

            return message.author.send(fullHelpEmbed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('t\'he enviat un DM amb tota la info')
                        .then(async (msg) => {
                            const delay = ms => new Promise(res => setTimeout(res, ms));
                            await delay(5000);
                            msg.delete();
                        });
                })
                .catch(error => {
                    console.error(`No puc enviar un DM a ${message.author.username}.\n`, error);
                    message.reply('sembla que no et puc enviar un DM!');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(name + ' no és una comanda vàlida!');
        }

        const helpEmbed = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/gif_frames/icon_new.gif', 'https://github.com/CatalaHD/CataBot')
            .setTitle(command.name.toUpperCase())
            .setThumbnail('https://i.imgur.com/OMp4api.png');

        if (command.description)
            helpEmbed.setDescription(command.description);

        if (command.type)
            helpEmbed.addField('Tipus', command.type);
        else
            helpEmbed.addField('Tipus', 'altres');

        if (command.aliases)
            helpEmbed.addField('Alias', command.aliases.join(', '));

        if (command.usage)
            helpEmbed.addField('Ús', prefix + command.name + ' ' + command.usage);

        if (command.example)
            helpEmbed.addField('Exemple', prefix + command.name + ' ' + command.example);

        if (command.cooldown) {
            let segons = command.cooldown;
            let field = segons + (segons === 1 ? ' segon' : ' segons');

            if (segons >= 60) {
                let minuts = Math.floor(command.cooldown / 60);
                let segonsRestants = command.cooldown % 60;
                field += " (" + minuts + (minuts === 1 ? " minut" : " minuts");
                if (segonsRestants !== 0) {
                    field += " i " + segonsRestants + (segonsRestants === 1 ? " segon" : " segons");
                }
                field += ")";
            }

            helpEmbed.addField('Cooldown', field);
        }

        helpEmbed.setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(helpEmbed);

        if (message.author.bot) {
            return message.delete();
        }
    },
};