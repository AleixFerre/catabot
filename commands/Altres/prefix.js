const config = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: 'prefix',
    description: 'Et mostra el prefix i et permet cambiar-lo amb un segon argument',
    type: "altres",
    usage: '[ new ]',
    async execute(message, args, servers, userData, client, prefixes) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.channel.send("```El prefix actual és: " + server.prefix + "```");
        } else {
            // Si hi ha un segon argument, cambiem el prefix
            let server = servers[message.guild.id];
            let newPrefix = args[0];
            server.prefix = newPrefix;

            if (!prefixes[message.guild.id]) {
                console.log("algo va mal");
            }

            prefixes[message.guild.id].prefix = newPrefix;
            fs.writeFile('./Storage/servers.json', JSON.stringify(prefixes, null, 2), (err) => { if (err) console.error(err); });

            let newName = "[ " + server.prefix + " ] CataBOT";
            await message.guild.me.setNickname(newName);
            message.channel.send("```El prefix ha cambiat a: " + server.prefix + "\n```");
        }
    },
};