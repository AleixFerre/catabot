const TYPE = 'mod';

module.exports = {
  name: 'esborrarrol',
  description: "Treu un Rol d'un Usuari en concret (si tens permisos)",
  usage: '< @usuari > < nom_del_rol >',
  type: TYPE,
  aliases: ['removerole', 'treurerol', 'deleterole'],
  example: '@CatalaHD Admin',
  execute(message, args, server) {
    const targetUser = message.mentions.users.first();
    const prefix = server.prefix;

    if (!targetUser) {
      message.reply('siusplau, menciona a qui li vols esborrar un rol.');
      return message.channel.send(`${prefix}help removerole`);
    }

    args.shift();
    const roleName = args.join(' ');

    const { guild } = message;

    const role = guild.roles.cache.find((role) => {
      return role.name === roleName;
    });

    if (!role) {
      message.reply(`no s'ha trobat cap rol amb el nom ${roleName}`);
      return message.channel.send(`${prefix}help removerole`);
    }

    const member = guild.members.cache.get(targetUser.id);

    if (member.roles.cache.get(role.id)) {
      member.roles.remove(role);
      message.reply(`s'ha tret el rol \`${roleName}\` de l'usuari \`${member.user.username}\` correctament!`);
    } else {
      message.reply(`l'usuari no té el rol amb el nom ${roleName}`);
    }
  },
};
