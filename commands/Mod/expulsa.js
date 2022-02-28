const TYPE = 'mod';

module.exports = {
	name: 'expulsa',
	description: 'Expulsa permanentment a un usuari del servidor',
	usage: '< @usuari > [ descripció ]',
	aliases: ['kick', 'expulsar'],
	type: TYPE,
	execute(message, args, server) {
		const prefix = server.prefix;

		const user = message.mentions.users.first();

		if (user) {
			const member = message.guild.member(user);
			if (member) {
				if (!member.kickable) return message.reply("No es pot fer fora a l'usuari.\nTinc un rol permisos d'administrador?");

				let kickmsg = "Motiu de l'expulsió desconegut";
				if (args[0]) kickmsg = args.join(' ');

				member
					.kick(kickmsg)
					.then(() => {
						// We let the message author know we were able to kick the person
						message.reply(`S'ha expulsat a ${user.username} amb èxit.`);
					})
					.catch((err) => {
						// An error happened
						// This is generally due to the bot not being able to kick the member,
						// either due to missing permissions or role hierarchy
						message.reply('No es pot expulsar al membre.\nTens permisos?\nProva-ho manualment.');
						message.channel.send(`${prefix}help kick`);
						// Log the error
						console.error(err);
					});
			} else {
				// The mentioned user isn't in this guild
				message.reply('Aquesta persona no pertany al servidor');
				message.channel.send(`${prefix}help kick`);
			}
			// Otherwise, if no user was mentioned
		} else {
			message.reply('Menciona a la persona que vols fer fora!');
			message.channel.send(`${prefix}help kick`);
		}
	},
};
