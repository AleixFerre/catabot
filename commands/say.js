module.exports = {
	name: 'say',
	description: 'Fes que el bot digui el que vulguis',
	usage: '< text >',
	type: 'entreteniment',
	execute(message, args, servers) {
        if (args[0]) {
            if (args[0] === '!say')
                return message.reply("no em facis tornar boig!!");
            message.channel.send(args.join(" ")).catch(console.error);
        } else {
            message.reply("Què vols que digui?").catch(console.error);
            message.channel.send(servers[message.guild.id].prefix + "help say");
        }
	},
};