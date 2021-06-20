const { getUser, updateUser } = require('../../lib/database');
const TYPE = 'altres';

module.exports = {
  name: 'crearperfil',
  description:
    'Et crea un perfil si no el tens. Aquesta comanda et dona accés a totes les comandes de tipus **Jocs**, **Nivell** i **Banc**',
  type: TYPE,
  async execute(message, _args, server) {
    const user = await getUser(message.author.id, message.guild.id);
    if (user) {
      return message.channel.send('**❌ Error: Ja tens un perfil!**');
    }

    await updateUser([message.author.id, message.guild.id], {
      'IDs.userID': message.author.id,
      'IDs.serverID': message.guild.id,
      'money': Math.floor(Math.random() * 1000),
    });

    message.channel.send(
      `✅ Perfil creat correctament! Pots veure el teu perfil amb la comanda \`${server.prefix}perfil\``
    );
  },
};
