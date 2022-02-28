const TYPE = 'mod';

module.exports = {
	name: 'afegirrol',
	description: 'Afegeix un Rol a un Usuari en concret (si tens permisos)',
	usage: '< @usuari > < nom_del_rol >',
	type: TYPE,
	example: '@CatalaHD Admin',
	aliases: ['addrole', 'giverole'],
	execute(message, args, server) {
		const targetUser = message.mentions.users.first();
		const prefix = server.prefix;

		if (!targetUser) {
			message.reply('siusplau, menciona a qui li vols afegir un rol.');
			return message.channel.send(`${prefix}help afegirrol`);
		}

		args.shift();
		const roleName = args.join(' ');

		const { guild } = message;

		const role = guild.roles.cache.find((r) => {
			return r.name === roleName;
		});

		if (!role) {
			message.reply(`no s'ha trobat cap rol amb el nom ${roleName}`);
			return message.channel.send(`${prefix}help afegirrol`);
		}

		const member = guild.members.cache.get(targetUser.id);
		member.roles.add(role);

		message.reply("s'ha afegit el rol correctament!");
	},
};
