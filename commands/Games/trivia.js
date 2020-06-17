const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'trivia',
    description: 'Joc 2: [BETA] Juga amb els teus amics al joc de les preguntes!',
    aliases: ['quiz', 'playq'],
    usage: '[ quantitat_preguntes ]',
    type: 'games',
    async execute(message, args, servers, userData) {

        // Només cal ABCD, però per si un cas
        const emojis = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫"];
        const lletres = ["a", "b", "c", "d", "e", "f"];
        const recompensa = 50; // Punts que guanyes per cada resposta correcta

        let server = servers[message.guild.id];
        let preguntes = [];
        let participants = [message.author];
        let classificacio = [0];
        let n_preguntes = 10; // Quantitat de preguntes a realitar, per defecte 10
        let xp_recompensa = 50 * n_preguntes; // Recompensa que se li dona als participants al final en xp

        // Si ens entren un numero, posa aquest com a numero de preguntes
        if (args[0] && !isNaN(args[0])) {
            let n = Number(args[0]);
            if (n <= 50 && n >= 1) {
                n_preguntes = n;
            }
        }

        const link = "https://opentdb.com/api.php?amount=" + n_preguntes + "&encode=base64";

        await fetch(link)
            .then(response => response.json())
            .then(json => {
                preguntes = json.results;
            });

        // Sala d'espera per registrar les persones que es volen unir a la partida
        await fase_sala();
        // Quan ja tenim totes les persones a la sala, comencem a jugar!
        await comenca_joc();
        // Quan s'han respos les 10 preguntes, mostrem la classificacio
        await acabar_joc();


        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        async function fase_sala() {

            let embed_sala = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("**TRIVIA**")
                .setDescription("Clica al [🚪] si vols unir-te/sortir de la sala o bé clica al [✅] començar la partida.")
                .addField('❯ Participant 1: ', message.author.tag, false)
                .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

            let msg_sala = await message.channel.send(embed_sala);

            await msg_sala.react("🚪");
            await msg_sala.react("✅");

            // Esperem a una reacció
            const filter = (reaction, user) => ((reaction.emoji.name === '✅' && message.author.id === user.id) ||
                (reaction.emoji.name === '🚪' && message.author.id !== user.id)) && !user.bot;

            let entra_joc = false;

            while (!entra_joc) {
                let collected = await msg_sala.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .catch(() => -1);

                // si ha acabat el temps, sortim
                if (collected === -1) {
                    message.channel.send("S'ha acabat el temps! La pròxima vegada vés més ràpid!");
                    msg_sala.delete();
                    return;
                }

                // Si la reacció es ✅, entrem al joc
                const reaction = collected.first();
                if (reaction.emoji.name === "✅") {
                    entra_joc = true;
                } else if (reaction.emoji.name === "🚪") { // Si la reacció es 🚪, entra/surt de la sala
                    let index = participants.indexOf(reaction.users.cache.last());
                    if (index === -1) {
                        // No hi es, el posem
                        participants.push(reaction.users.cache.last());
                        classificacio.push(0);
                    } else {
                        // Ja hi era, el treiem
                        participants.splice(index, 1);
                        classificacio.pop();
                    }
                    await actualitzar_msg_sala(msg_sala);
                }
            }
            msg_sala.delete();
        }

        async function actualitzar_msg_sala(msg) {
            let embed = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("**TRIVIA**")
                .setDescription("Clica al [🚪] si vols unir-te/sortir de la sala o bé clica al [✅] començar la partida.")
                .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

            for (let i = 0; i < participants.length; i++) {
                embed.addField('❯ Participant ' + (i + 1) + ': ', participants[i].tag, false);
            }

            await msg.edit(embed);
        }

        // Anem mostrant els missatges i registrar els missatges dels participants
        async function comenca_joc() {
            for (let i = 0; i < n_preguntes; i++) { // TODO: AIXO HA DE SER 10
                let [msg, respostes, q_index] = await envia_missatge_pregunta(i);
                let guanyador = await esperem_reaccions(msg, respostes, q_index); // retorna index del guanyador (-1 si ningu)
                if (guanyador !== -1) {
                    classificacio[guanyador] += recompensa;
                }
            }
        }

        async function envia_missatge_pregunta(q_index) {

            let pregunta = preguntes[q_index];
            let buff = Buffer.from(pregunta.question, 'base64');
            let pregunta_decoded = buff.toString('ascii');

            let embed = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("**TRIVIA - PREGUNTA " + (q_index + 1) + "/" + n_preguntes + "**")
                .setDescription(pregunta_decoded)
                .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

            let respostes = [];

            // Inserim les respostes incorrectes
            for (let i = 0; i < pregunta.incorrect_answers.length; i++) {
                respostes.push({
                    name: pregunta.incorrect_answers[i],
                    correct: false
                });
            }

            // Inserim la resposta correcta
            respostes.push({
                name: pregunta.correct_answer,
                correct: true
            });

            // Desordenem l'array de forma eficient fent servir l'algorisme de Fisher-Yates 
            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            // Desordenem l'objecte sense deixar de saber quina resposta és correcta
            respostes = shuffle(respostes);

            for (let i = 0; i < respostes.length; i++) {
                let buff = Buffer.from(respostes[i].name, 'base64');
                let resposta_decoded = buff.toString('ascii');
                embed.addField("❯ " + emojis[i], resposta_decoded, true);
            }
            return [await message.channel.send(embed), respostes, q_index];
        }

        // Retorna si aquesta lletra és la solucio correcta
        function es_correcte(lletra, respostes) {
            let index = lletres.indexOf(lletra);
            return respostes[index].correct;
        }

        async function esperem_reaccions(msg, respostes, q_index) {
            const filter = msg => lletres.includes(msg.content.toLowerCase()) &&
                participants.includes(msg.author) &&
                es_correcte(msg.content.toLowerCase(), respostes);

            let collected = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .catch(() => -1);

            if (collected === -1) {
                await msg.delete();
                await message.channel.send("S'ha acabat el temps!");
                return -1;
            }

            // La resposta és correcta
            let guanyador = collected.first().author;
            await msg.channel.send(`${guanyador.username}, has encertat la pregunta ${q_index+1}! \`+${recompensa}p\``);
            await msg.delete();
            return participants.indexOf(guanyador);
        }

        function insercioOrdenada(board, user, money) {
            //Pre:	0<=board.length<MAX, board[0..board.length-1] ordenat creixentment
            //Post:	x inserit ordenadament a board

            // Busquem la posicio on volem inserir
            let i = board.length;
            while (i > 0 && money > board[i - 1].money) {
                i--;
            }

            // Inserim a la posició corresponent
            let inserit = {
                user: user,
                money: money
            };
            board.splice(i, 0, inserit);
            return board;
        }

        async function acabar_joc() {
            // mostrem la classificacio en ordre de qui te mes punts
            // sumem recompenses de monedes i xp a tots per igual

            let resultats = [];

            for (let i = 0; i < classificacio.length; i++) {
                resultats = insercioOrdenada(resultats, participants[i], classificacio[i]);
            }

            // Mostrar classificacio en pantalla
            // Per cada entrada de resultats
            // Mostrar posicio, nom i monedes

            let msg = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("🏆 Resultat de la partida 🏆")
                .setDescription("Només el primer recolleix el premi!")
                .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

            let i = 1;
            let recompenses_txt = "**RECOMPENSES**\n";
            let progresses = [];

            // 🥇 🥈 🥉

            resultats.forEach((result) => {
                let num = i;
                if (i === 1) {
                    num = '🥇';
                    recompenses_txt += `${result.user.username}, has guanyat 💰\`${result.money} monedes\`💰!`;
                    userData[message.guild.id + result.user.id].money += result.money;
                } else if (i === 2) {
                    num = '🥈';
                } else if (i === 3) {
                    num = '🥉';
                }
                msg.addField(num + '.- ' + result.user.username, result.money);
                progresses.push(`${server.prefix}progress ${xp_recompensa} ${result.user}`);
                i++;
            });

            await message.channel.send(msg);
            message.channel.send(recompenses_txt);

            progresses.forEach(p => {
                message.channel.send(p);
            });

            fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });

        }
    },
};