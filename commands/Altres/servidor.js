const Discord = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');
const { getUsersFromServer } = require('../../lib/database.js');

const TYPE = 'altres';

module.exports = {
  name: 'servidor',
  type: TYPE,
  description: 'Diu la informació del servidor.',
  aliases: ['serverinfo', 'guild', 'server'],
  async execute(message, _args, server, client) {
    let mesRicNom = '';
    let mesRicDiners = -1;
    let totalMoney = 0;
    let mesNivellNom = '';
    let mesNivellLevel = -1;
    let mesNivellXP = -1;

    let canalAvisos = `<#${server.alertChannel}>`;
    if (!server.alertChannel) {
      canalAvisos = '*No adjudicat*';
    }

    let canalBot = `<#${server.botChannel}>`;
    if (!server.botChannel) {
      canalBot = '*No adjudicat*';
    }

    let canalBenvinguda = `<#${server.welcomeChannel}>`;
    if (!server.welcomeChannel) {
      canalBenvinguda = '*No adjudicat*';
    }

    let canalCounter = `<#${server.counterChannel}>`;
    if (!server.counterChannel) {
      canalCounter = '*No adjudicat*';
    }

    let userData = await getUsersFromServer(message.guild.id);
    let usersCount = userData.length;
    let owner = await message.guild.members.fetch(message.guild.ownerID);

    let msg = new Discord.MessageEmbed()
      .setColor(getColorFromCommand(TYPE))
      .setTitle(message.guild.name)
      .setThumbnail(message.guild.iconURL())
      .addField('❯ Propietari', owner || '*Ningú*', true)
      .addField('❯ Num Membres', message.guild.memberCount, true)
      .addField('❯ Num Perfils', usersCount, true)
      .addField("❯ Canal d'avisos", canalAvisos, true)
      .addField('❯ Canal del bot', canalBot, true)
      .addField('❯ Canal de benvinguda', canalBenvinguda, true)
      .addField('❯ Canal comptador', canalCounter, true)
      .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`)
      .setTimestamp();

    if (usersCount !== 0) {
      for (let member of userData) {
        let id = member.IDs.userID;

        if (member.money > mesRicDiners) {
          mesRicDiners = member.money;
          mesRicNom = (await message.guild.members.fetch(id)).user.username;
        }

        if (member.level > mesNivellLevel) {
          mesNivellLevel = member.level;
          mesNivellXP = member.xp;
          mesNivellNom = (await message.guild.members.fetch(id)).user.username;
        } else if (member.level === mesNivellLevel) {
          if (member.xp > mesNivellXP) {
            mesNivellLevel = member.level;
            mesNivellXP = member.xp;
            mesNivellNom = (await message.guild.members.fetch(id)).user.username;
          }
        }

        totalMoney += member.money;
      }

      msg
        .addField('❯ Diners totals', `$${totalMoney}`, true)
        .addField('❯ El mes ric', `${mesRicNom} | $${mesRicDiners}` || '*Ningu*', true)
        .addField(
          '❯ Amb mes nivell',
          `${mesNivellNom} | Nivell ${mesNivellLevel} | ${mesNivellXP} xp` || '*Ningu*',
          true
        );
    }

    message.channel.send(msg);
  },
};
