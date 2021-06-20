const Discord = require('discord.js');
const { paraules } = require('../../storage/paraules.json');
const { getColorFromCommand, db } = require('../../lib/common.js');
const { getUser, updateUser } = require('../../lib/database');

const TYPE = 'games';

module.exports = {
  name: 'penjat',
  description: 'Joc 3: [BETA] Juga amb els teus amics al joc del penjat!',
  aliases: ['ahorcado', 'hangman', 'play3'],
  type: TYPE,
  async execute(message, _args, server) {
    const lletres = 'abcdefghijklmnopqrstuvwxyz'.split(''); // totes les lletres que pot tenir una paraula
    const recompensa = 500; // Punts que guanyes al final
    const xp_recompensa = 500; // Recompensa que se li dona als participants al final en xp
    const caracter_no_descobert = '⬜';

    let jugant_sol = false; // Diu si estas jugant sol o no
    let dites = [];
    let paraula = '';
    let participants = [message.author];
    let errades = 0; // Quantitat d'errades que s'han fet a la partida
    let max_errades = 6; // Tens 6 errades maxim
    let torn = 1;

    // Sala d'espera per registrar les persones que es volen unir a la partida
    let index = await fase_sala();
    if (index === -1) {
      return;
    }

    // Quan ja tenim totes les persones a la sala, comencem a jugar!
    let acabat = await comenca_joc();
    // Quan s'han resolt totes les lletres de la paraula, mostrem la classificacio
    await acabar_joc(acabat);

    async function fase_sala() {
      let embed_sala = new Discord.MessageEmbed()
        .setColor(getColorFromCommand(TYPE))
        .setTitle('**EL JOC DEL PENJAT**')
        .setDescription(
          '=> [🚪] UNIR-SE / SORTIR DE LA SALA\n=> [✅] COMENÇAR PARTIDA\n' +
            '=> [❌] CANCEL·LAR\n' +
            '**[ Màxim 5 persones per sala! ]**'
        )
        .addField('❯ Participant 1: ', message.author.tag, false)
        .setTimestamp()
        .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

      let msg_sala = await message.channel.send(embed_sala);

      await msg_sala.react('🚪');
      await msg_sala.react('✅');
      await msg_sala.react('❌');

      // Esperem a una reacció
      const filter = (reaction, user) =>
        ((reaction.emoji.name === '✅' && message.author.id === user.id) ||
          (reaction.emoji.name === '🚪' && message.author.id !== user.id) ||
          (reaction.emoji.name === '❌' && message.author.id === user.id)) &&
        !user.bot;

      let entra_joc = false;

      while (!entra_joc && participants.length < 5) {
        let collected = await msg_sala
          .awaitReactions(filter, {
            max: 1,
            time: 60000,
            errors: ['time'],
          })
          .catch(() => -1);

        // si ha acabat el temps, sortim
        if (collected === -1) {
          message.channel.send("S'ha acabat el temps! La pròxima vegada vés més ràpid!");
          msg_sala.delete();
          return -1;
        }

        // Si la reacció es ✅, entrem al joc
        const reaction = collected.first();
        if (reaction.emoji.name === '✅') {
          entra_joc = true;
        } else if (reaction.emoji.name === '🚪') {
          // Si la reacció es 🚪, entra/surt de la sala
          let index = participants.indexOf(reaction.users.cache.last());
          if (index === -1) {
            // No hi es, el posem
            participants.push(reaction.users.cache.last());
          } else {
            // Ja hi era, el treiem
            participants.splice(index, 1);
          }
          await actualitzar_msg_sala(msg_sala);
        } else if (reaction.emoji.name === '❌') {
          await msg_sala.delete();
          await message.channel.send('**PARTIDA CANCEL·LADA**');
          return -1;
        }
      }
      msg_sala.delete();
    }

    async function actualitzar_msg_sala(msg) {
      let embed = new Discord.MessageEmbed()
        .setColor(getColorFromCommand(TYPE))
        .setTitle('**EL JOC DEL PENJAT**')
        .setDescription(
          '=> [🚪] UNIR-SE / SORTIR DE LA SALA\n=> [✅] COMENÇAR PARTIDA\n' +
            '=> [❌] CANCEL·LAR\n' +
            '**[ Màxim 5 persones per sala! ]**'
        )
        .setTimestamp()
        .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

      for (let i = 0; i < participants.length; i++) {
        embed.addField(`❯ Participant ${i + 1}: `, participants[i].tag, false);
      }

      await msg.edit(embed);
    }

    // Si totes les lletres de la paraula estan dins de l'array de lletres vàlides => true; else false
    function paraula_valida(array) {
      for (i = 0; i < array.length; i++) {
        if (!lletres.includes(array[i])) {
          return false;
        }
      }
      return true;
    }

    async function demanar_paraula() {
      const contingut = `**EL JOC DEL PENJAT**
Com a host de la partida, has d'escollir la paraula
**RECORDA QUE HAS DE SUBTITUIR TOTS ELS ACCENTS PER LA SEVA RESPECTIVA LLETRA SENSE**[ p.e. àcid => acid ]`;

      let demanar_msg = await message.author.send(contingut);
      let server_msg = await message.channel.send('El host està escollint la paraula...');

      const filter = (msg) => paraula_valida(msg.content.toLowerCase().split('')) && !msg.author.bot;
      let collected = await demanar_msg.channel
        .awaitMessages(filter, {
          max: 1,
          time: 60000,
          errors: ['time'],
        })
        .catch(() => -1);

      if (collected === -1) {
        await server_msg.edit("**S'ha acabat el temps! Partida cancel·lada.**");
        return await message.author.send("**S'ha acabat el temps! Torna a executar la comanda!**");
      }

      paraula = collected.first().content.toLowerCase();
      await server_msg.edit('Paraula vàlida, començant partida...');
    }

    function generar_paraula() {
      let str = '';
      for (i = 0; i < paraula.length; i++) {
        if (dites.includes(paraula[i])) {
          // Si la lletra està dita
          str += ':regional_indicator_' + paraula[i] + ':';
        } else {
          // Si la lletra no està dita
          str += caracter_no_descobert;
        }
      }
      return str;
    }

    async function escriure_missatge() {
      // Escriu el missatge de la paraula

      let embed_paraula = new Discord.MessageEmbed()
        .setColor(getColorFromCommand(TYPE))
        .setTitle(`**EL JOC DEL PENJAT -- TORN ${torn}**`)
        .setDescription(
          `**PARAULA => **${generar_paraula()}
Lletres dites => [ ${dites.join(' ').toUpperCase()} ]
Errades => ${errades}/${max_errades}`
        )
        .setThumbnail(`https://raw.githubusercontent.com/AleixFerre/CataBot/master/imgs/hangman/white_${errades}.png`)
        .setTimestamp()
        .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

      return await message.channel.send(embed_paraula);
    }

    async function actualitzar_msg_paraula(missatge) {
      // Actualitzem el missatge de la paraula
      let embed_paraula = new Discord.MessageEmbed()
        .setColor(getColorFromCommand(TYPE))
        .setTitle(`**EL JOC DEL PENJAT -- TORN ${torn}**`)
        .setDescription(
          `**PARAULA => **${generar_paraula()}
Lletres dites => [ ${dites.join(' ').toUpperCase()} ]
Errades => ${errades}/${max_errades}`
        )
        .setThumbnail(`https://raw.githubusercontent.com/AleixFerre/CataBot/master/imgs/hangman/white_${errades}.png`)
        .setTimestamp()
        .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

      await missatge.edit(embed_paraula);
    }

    function es_bona(lletra) {
      // Retorna si la lletra es pot fer servir
      // Si la paraula no té la lletra
      if (!paraula.includes(lletra)) {
        return false;
      }
      // Si la lletra ja s'ha dit
      if (dites.includes(lletra)) {
        return false;
      }
      return true;
    }

    function lletra_valida(lletra) {
      return lletres.includes(lletra);
    }

    function comprovar_host(msg) {
      if (jugant_sol) {
        // Si jugo sol, només puc contestar jo
        return msg.author.id === message.author.id;
      } else {
        // Si juguem amb amics
        // Poden contestar tots menys jo
        if (msg.author.id === message.author.id) {
          return false;
        }
        // Si no he sigut jo, comprovo que sigui un dels participants
        return participants.includes(message.author);
      }
    }

    async function esperar_lletra(msg) {
      // Retorna la lletra del missatge
      const filter = (msg) => lletra_valida(msg.content[0].toLowerCase()) && comprovar_host(msg) && !msg.author.bot;
      let collected = await msg.channel
        .awaitMessages(filter, {
          max: 1,
          time: 60000,
          errors: ['time'],
        })
        .catch(() => -1);

      if (collected === -1) {
        // Acabem la partida per inactivitat, 60s de no rebre cap missatge vàlid
        return -1;
      }

      return collected.first().content[0].toLowerCase(); // Retornem la primera lletra del missatge en minuscula
    }

    function descobrir_lletra(lletra) {
      // Retorna si has descobert tota la paraula
      // Si la lletra es correcta, mai s'haura dit abans així que sempre fem el push
      dites.push(lletra);

      for (i = 0; i < paraula.length; i++) {
        if (!dites.includes(paraula[i])) {
          // Si la lletra no està dita
          // encara no he descobert tota la paraula
          return -1;
        }
      }
      // Ja s'han comprovat totes les lletres, s'ha acabat el joc
      return 1;
    }

    function fallar(lletra) {
      // Retorna si s'ha acabat la partida per errades
      // Si la lletra encara no s'ha dit, fem el push
      if (!dites.includes(lletra)) {
        dites.push(lletra);
      }
      errades++;
      if (errades >= max_errades) {
        return 0;
      } else {
        return -1;
      }
    }

    async function comenca_joc() {
      if (participants.length === 1) {
        // Si juguem amb una sola persona
        paraula = paraules[Math.floor(Math.random() * paraules.length)];
        jugant_sol = true;
      } else {
        // Si juguem amb multiples persones
        jugant_sol = false;
        await demanar_paraula();
      }

      let missatge_paraula = await escriure_missatge();
      let acabat = -1; // -1 si ha de continuar la partida, 0 si perdut, 1 si guanyat
      while (acabat === -1) {
        torn++;
        let lletra = await esperar_lletra(missatge_paraula);
        if (lletra === -1) {
          return -1;
        }
        if (es_bona(lletra)) {
          acabat = descobrir_lletra(lletra);
        } else {
          acabat = fallar(lletra);
        }
        await actualitzar_msg_paraula(missatge_paraula);
      }
      return acabat;
    }

    async function acabar_joc(acabat) {
      // mostrem la classificacio en ordre de qui te mes punts
      // sumem recompenses de monedes i xp a tots per igual

      if (acabat === -1) {
        return await message.channel.send(
          "**AVÍS D'INACTIVITAT**\nLa partida s'ha acabat de forma soptada degut a la inactivitat. Si es vol començar alguna altra partida, torneu a executar la comanda."
        );
      }

      let emoji = '🏆';
      let desc = '';
      let link = `https://dlc.iec.cat/Results?DecEntradaText=${paraula}`;
      let questionLink = 'https://raw.githubusercontent.com/AleixFerre/CataBot/master/imgs/hangman/question.png';

      if (acabat === 1) {
        desc = `Hem guanyat! Tots els integrants guanyen 💰\`${recompensa} monedes\`💰!`;
        participants.forEach(async (participant) => {
          message.channel.send(`${server.prefix}progresa ${xp_recompensa} ${participant}`);
          let user = await getUser(participant.id, message.guild.id);
          user.money += recompensa;
          await updateUser([participant.id, message.guild.id], {
            money: user.money,
          });
          console.log(db(`DB: Afegida la recompensaa l'usuari ${participant.username} correctament`));
        });
      } else {
        emoji = '😦';
        desc = 'Hem perdut, no hi ha premi...';
      }

      let embed_final = new Discord.MessageEmbed()
        .setColor(getColorFromCommand(TYPE))
        .setTitle(`**${emoji} FINAL DE LA PARTIDA ${emoji}**`)
        .setDescription(desc)
        .setAuthor(paraula.toUpperCase(), questionLink, link)
        .setTimestamp()
        .setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

      await message.channel.send(embed_final);
    }
  },
};
