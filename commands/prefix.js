const configPath = '../config.json';
const config = require(configPath);

module.exports = {
	name: 'prefix',
	description: 'Et mostra el prefix i et permet cambiar-lo amb un segon argument',
	usage: '[ nou_prefix ]',
	execute(message, args, servers) {

        let server = servers[message.guild.id];

        if (!args[0]) {
            message.channel.send("El prefix actual és: " + server.prefix);
        } else {
            // Si hi ha un segon argument, cambiem el prefix
            let server = servers[message.guild.id];
            server.prefix = args[0];

            let newName = "[ " + server.prefix + " ] CataBOT";
            message.guild.members.get(config.clientid).setNickname(newName).then(() => { 
                message.channel.send("El prefix ha cambiat a: " + server.prefix);
            });

        }
	},
};