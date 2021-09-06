const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { getColorFromCommand } = require('../../lib/common.js');

const TYPE = 'entreteniment';

module.exports = {
  name: 'pokedex',
  description: 'Mostra la pokedex del pokemon que li entris',
  usage: '< pokemon >',
  aliases: ['poke', 'pokemon'],
  type: TYPE,
  execute(message, args, server) {
    if (!args[0]) {
      message.reply('No se el que vols buscar!');
      message.channel.send(`${server.prefix}help pokedex`);
      return;
    }

    let APIname = args.join('-');
    let realName = args.join(' ');

    fetch(`https://some-random-api.ml/pokedex?pokemon=${APIname}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          message.channel.send(`\`\`\`No hi ha cap pokemon que es digui ${realName}\`\`\``);
          message.channel.send(`${server.prefix}help pokedex`);
          return;
        }

        function capitalize(s) {
          return s.charAt(0).toUpperCase() + s.slice(1);
        }

        let body =
          '• Altura: `' +
          data.height.substring(0, data.height.indexOf('(')).slice(0, -1) +
          '`\n' +
          '• Pes: `' +
          data.weight.substring(0, data.weight.indexOf('(')).slice(0, -1) +
          '`\n' +
          '• Experiència base: `' +
          data.base_experience +
          ' xp`';

        let gender = '';
        if (data.gender === 'Genderless') {
          gender = 'Sense Genère';
        } else {
          gender = data.gender.join('\n').replace('male', '♂️').replace('female', '♀');
        }

        // Si te un sol tipus, posem Type, sino posem Types
        let type = 'Tipus';

        let stats =
          '• Vida: `' +
          data.stats.hp +
          '`\n' +
          '• Atac: `' +
          data.stats.attack +
          '`\n' +
          '• Defensa: `' +
          data.stats.defense +
          '`\n' +
          '• Atac Especial: `' +
          data.stats.sp_atk +
          '`\n' +
          '• Defensa Especial: `' +
          data.stats.sp_def +
          '`\n' +
          '• Velocitat: `' +
          data.stats.speed +
          '`\n' +
          '• Total: `' +
          data.stats.total +
          '`';

        const pokeEmbed = new MessageEmbed()
          .setColor(getColorFromCommand(TYPE))
          .setAuthor(
            'POKEDEX',
            'https://pngimage.net/wp-content/uploads/2018/06/pokemon-go-icon-png-3.png',
            'https://pokemon.fandom.com/es/wiki/' + args.join('_')
          )
          .setTitle('**#' + data.id + ' | ' + capitalize(data.name) + ' | ' + data.generation + 'º GENERACIÓ**') // Capitalize the first letter
          .setDescription(data.description)
          .setThumbnail('http://i.some-random-api.ml/pokemon/' + APIname + '.gif')
          .addField('❯ ' + type + ':', data.type.join(', '), true)
          .addField('❯ Abilitats:', data.abilities.join(', '), true)
          .addField('❯ Especies:', data.species.join(', '), true)
          .addField('❯ Estadístiques: ', stats, true)
          .addField('❯ Cos:', body, true)
          .addField('❯ Gènere: ', gender, true)
          .addField("❯ Grups d'ous:", data.egg_groups.join(', '), true);

        if (data.family.evolutionLine.length > 0) {
          // Treu els repetits ja que està en un Set
          let uniqueEvos = [...new Set(data.family.evolutionLine)];
          for (i = 0; i < uniqueEvos.length; i++) {
            if (uniqueEvos[i].toUpperCase() === realName.toUpperCase()) {
              uniqueEvos[i] = '**' + uniqueEvos[i] + '**';
            }
          }
          pokeEmbed.addField('❯ Evolucions:', uniqueEvos.join(', '), true);
        }

        pokeEmbed.setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(pokeEmbed).catch(console.error);
      });
  },
};
