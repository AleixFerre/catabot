module.exports = {
	name: 'say',
	description: 'Fes que el bot digui el que vulguis',
	usage: '< text >',
	execute(message, args) {
        if (args[0]) {
            message.channel.send(args.join(" ")).catch(console.error);
        } else {
            message.reply("Què vols que digui?").catch(console.error);
        }
	},
};