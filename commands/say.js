module.exports = {
	name: 'say',
	description: 'Fes que el bot digui el que vulguis',
	usage: '< text >',
	type: 'entreteniment',
	execute(message, args, servers) {
        if (args[0]) {
            if (args[0][0] === '!')
                return message.reply("recorda que les comandes les has d'executar tu 😅");
            message.channel.send(args.join(" ")).then(msg => {
                message.delete();
            }).catch(console.error);
        } else {
            message.reply("Què vols que digui?").catch(console.error);
            message.channel.send(servers[message.guild.id].prefix + "help say");
        }
	},
};