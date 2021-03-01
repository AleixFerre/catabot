const TYPE = "mod";

module.exports = {
    name: 'addrole',
    description: 'Afegeix un Rol a un Usuari en concret (si tens permisos)',
    usage: '< @usuari > < nom del rol >',
    type: TYPE,
    example: '@CatalaHD Admin',
    aliases: ['afegirrol', 'giverole', 'adjudicarrol'],
    cooldown: 5,
    execute(message, args, server) {

        const targetUser = message.mentions.users.first();
        const prefix = server.prefix;

        if (!targetUser) {
            message.reply("siusplau, menciona a qui li vols esborrar un rol.");
            return message.channel.send(prefix + "help removerole");
        }

        args.shift();
        const roleName = args.join(" ");

        const {
            guild
        } = message;

        const role = guild.roles.cache.find((role) => {
            return role.name === roleName;
        });

        if (!role) {
            message.reply("no s'ha trobat cap rol amb el nom " + roleName);
            return message.channel.send(prefix + "help removerole");
        }

        const member = guild.members.cache.get(targetUser.id);
        member.roles.add(role);

        message.reply("s'ha afegit el rol correctament!");
    },
};