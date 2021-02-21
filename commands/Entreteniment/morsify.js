const Discord = require("discord.js");
const {
    getRandomColor
} = require('../../lib/common.js');

const decoding = {
    '.-': 'a',
    '-...': 'b',
    '-.-.': 'c',
    '-..': 'd',
    '.': 'e',
    '..-.': 'f',
    '--.': 'g',
    '....': 'h',
    '..': 'i',
    '.---': 'j',
    '-.-': 'k',
    '.-..': 'l',
    '--': 'm',
    '-.': 'n',
    '---': 'o',
    '.--.': 'p',
    '--.-': 'q',
    '.-.': 'r',
    '...': 's',
    '-': 't',
    '..-': 'u',
    '...-': 'v',
    '.--': 'w',
    '-..-': 'x',
    '-.--': 'y',
    '--..': 'z',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '-----': '0',
    ' ': ' '
};

const encoding = {
    'a': '.-',
    'b': '-...',
    'c': '-.-.',
    'd': '-..',
    'e': '.',
    'f': '..-.',
    'g': '--.',
    'h': '....',
    'i': '..',
    'j': '.---',
    'k': '-.-',
    'l': '.-..',
    'm': '--',
    'n': '-.',
    'o': '---',
    'p': '.--.',
    'q': '--.-',
    'r': '.-.',
    's': '...',
    't': '-',
    'u': '..-',
    'v': '...-',
    'w': '.--',
    'x': '-..-',
    'y': '-.--',
    'z': '--..',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '0': '-----',
    ' ': ' '
};

module.exports = {
    name: 'morsify',
    description: 'No saps codi Morse? Aqui tens un des/codificador.\nSi poses un text normal, te\'l tradueix a Morse i viceversa.',
    type: 'entreteniment',
    aliases: ['morse', 'demorsify'],
    usage: '< morse/ASCII >',
    cooldown: 1,
    execute(message, args) {

        if (!args[0])
            return message.reply("No se que vols traduir a Morse!");

        let out;
        let title = "MORSIFICAR";
        let str = args.join(" ").toLowerCase();
        let error = false;

        if (str[0] === '-' || str[0] === '.') {
            // Desmorsificar
            title = "DES" + title;
            out = [];

            str.split("   ").map((word) => {
                word.split(" ").map((letter) => {
                    out.push(decoding[letter]);
                });
                out.push(" ");
            });

            out = out.join("").substr(0, out.length-1);
        } else {
            // Morsificar
            out = [];
            for (let char of str) {
                let c = encoding[char];
                if (!c) {
                    error = true;
                    break;
                }
                out.push(c);
            }
            out = out.join(" ");
        }


        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("**" + title + "**")
            .addField('❯ Entrada', "`" + str + "`")
            .addField('❯ Resultat', error ? "`Error d'entrada, prova amb només lletres sense accent i números!`" : "`" + out + "`")
            .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

        message.channel.send(msg);
    },
};