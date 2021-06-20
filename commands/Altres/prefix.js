const Discord = require('discord.js');
const { getColorFromCommand, db } = require('../../lib/common.js');
const { updateServer } = require('../../lib/database.js');

const TYPE = 'altres';

module.exports = {
  name: 'prefix',
  description: 'Et mostra el prefix i et permet cambiar-lo amb un segon argument',
  type: TYPE,
  usage: '[ nou ]',
  async execute(message, args, server) {
    let prefixEmbed = new Discord.MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle('**PREFIX**')
      .setTimestamp()
      .setFooter('CataBOT ' + new Date().getFullYear() + ' © All rights reserved');

    if (!args[0]) {
      prefixEmbed.setDescription('Pots canviar el prefix del CataBOT');
      prefixEmbed.addField('❯ Prefix actual', `\`${server.prefix}\``);
      prefixEmbed.addField('❯ Per cambiar el prefix', `\`${server.prefix}prefix [ nou ]\``);
      prefixEmbed.addField('❯ Validació', '`Qualsevol text sense espais de com a màxim 5 caràcters`');
      message.channel.send(prefixEmbed);
    } else {
      // Si hi ha un segon argument, intentem cambiar el prefix
      let newPrefix = args[0];
      const roleNeeded = 'ADMINISTRATOR';

      if (!message.member.hasPermission(roleNeeded)) {
        return message.reply(`no tens permisos per executar aquesta comanda!
Es necessita \`${roleNeeded}\``);
      }

      if (newPrefix.length > 5) {
        return message.reply('el prefix ha de tenir com a màxim 5 caràcters');
      }

      prefixEmbed.addField('❯ Prefix anterior', server.prefix, true);
      prefixEmbed.addField('❯ Prefix nou', newPrefix, true);
      prefixEmbed.setDescription("El prefix s'ha cambiat correctament!");

      await updateServer(message.guild.id, {
        prefix: newPrefix,
      }).then(console.log(db("DB: S'ha guardat el nou prefix correctament!")));

      try {
        let newName = `[ ${newPrefix} ] CataBOT`;
        message.guild.me.setNickname(newName);
      } catch (err) {
        console.error(err);
      }

      message.channel.send(prefixEmbed);
    }
  },
};
