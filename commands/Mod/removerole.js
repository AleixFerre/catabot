const { getServerPrefix } = require("../../lib/common.js");

module.exports = {
    name: 'removerole',
    description: 'Treu un Rol d\'un Usuari en concret (si tens permisos)',
    usage: '< @usuari > < nom del rol >',
    type: 'mod',
    aliases: ['esborrarrol', 'treurerol', 'esborrarrol', 'delrole'],
    example: '@CatalaHD Admin',
    cooldown: 5,
    execute(message, args, servers) {

        const targetUser = message.mentions.users.first();
        const prefix = getServerPrefix(message, servers);
        
        if (!targetUser) {
            message.reply("siusplau, menciona a qui li vols esborrar un rol.");
            return message.channel.send(prefix + "help removerole");
        }

        args.shift();
        const roleName = args.join(" ");

        const { guild } = message;

        const role = guild.roles.cache.find((role) => {
            return role.name === roleName;
        });

        if (!role) {
            message.reply("no s'ha trobat cap rol amb el nom " + roleName);
            return message.channel.send(prefix + "help removerole");
        }

        const member = guild.members.cache.get(targetUser.id);
        
        if (member.roles.cache.get(role.id)) {
            member.roles.remove(role);
            message.reply("s'ha tret el rol `" + roleName + "` de l'usuari `" + member.user.username + "` correctament!");
        } else {
            message.reply("l'usuari no té el rol amb el nom " + roleName);
        }
    },
};