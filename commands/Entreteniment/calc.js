const Discord = require("discord.js");
const {
    evaluate
} = require('mathjs');
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "entreteniment";

module.exports = {
    name: 'calc',
    description: 'No tens calculadora? Aquí en tens una.',
    type: TYPE,
    aliases: ['math', 'calcula', 'calculadora', 'eval'],
    usage: '< expression > or < multiple/M exp1;; exp2>',
    execute(message, args, server) {

        let expressions = []; // Array d'strings que contenen les expressions

        if (!args[0]) {
            message.reply("no se què calcular!");
            return message.channel.send(server.prefix + "help calc");
        }

        if (args[0].toLowerCase() === "multiple" || args[0].toUpperCase() === "M") {
            args.shift(); // Esborra el "multiple" || ["mutiple", "2+2;;", "3+3;;", "4+4"] => ["2+2;;", "3+3;;", "4+4"]
            let a = args.join(" "); // Torna a unir els arguments || ["2+2;;", "3+3;;", "4+4"] => "2+2;; 3+3;; 4+4"
            expressions = a.split(";;"); // Les funcions estan separades per comes, per tant les separem en un array
            // "2+2;; 3+3;; 4+4" => ["2+2" "3+3" "4+4"]
        } else {
            if (args.join(" ").includes(";; ")) {
                message.reply("Em sembla que t'has descuidat el `multiple`!");
                return;
            }
            expressions.push(args.join(" "));
        }

        let resultat;
        try {
            resultat = evaluate(expressions);
        } catch (e) {
            // si surt un error, el mostrem al camp de resultat
            resultat = e;
        }

        if (resultat.length) {
            let str = "";
            // si es un array, el convertim a string
            for (i = 0; i < resultat.length; i++) {
                if (typeof (resultat[i]) === "function") {
                    str += "function";
                } else {
                    str += resultat[i];
                }
                if (i !== resultat.length - 1) {
                    str += ", ";
                }
            }
            resultat = str;
        }

        let msg = new Discord.MessageEmbed()
            .setColor(getColorFromCommand(TYPE))
            .setTitle("**CALCULADORA**")
            .addField('❯ Entrada', "```js\n" + expressions.join(', ') + "```")
            .addField('❯ Resultat', "```js\n" + resultat + "```")
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);
    },
};