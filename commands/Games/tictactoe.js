const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'tictactoe',
    description: 'BETA: Juga al tres en ratlla! Escriu pel xat NOMÉS LA LLETRA de la posició on vols jugar.',
    aliases: ['tresenratlla', '3enratlla', 'playt'],
    type: 'games',
    async execute(message, _args, servers, userData) {

        const emojis = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮"];
        const lletres = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
        const creu = "❌";
        const rodona = "⭕";
        const recompensa = 1000;

        let server = servers[message.guild.id];
        let msg_tauler; // variable que guarda el missatge del tauler
        let player = message.author;
        let player2 = null;
        let torn = 1; // 1 per p1; 2 per p2 (sigui IA o no)
        let IA = false; // diu si estas jugant contra la IA o no

        let tauler = []; // 0: ningu | 1: jugador1 | 2: jugador2

        await fase_sala();

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function montar_tauler_string() {

            let tauler_string = "";

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let posicio = tauler[j + 3 * i];
                    if (posicio === 0) {
                        tauler_string += emojis[j + 3 * i] + " ";
                    } else if (posicio === 1) {
                        tauler_string += creu + " ";
                    } else { // 2
                        tauler_string += rodona + " ";
                    }
                }
                tauler_string += "\n";
            }
            return tauler_string;
        }

        async function mostrar_tauler() {

            let tauler_string = montar_tauler_string();

            let msg = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("**TRES EN RATLLA**")
                .setDescription(`Torn de <@${player.id}>` + "\nEscriu la lletra de la posició a la que vols jugar")
                .addField('❯ Tauler', tauler_string, true)
                .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

            msg_tauler = await message.channel.send(msg);
        }

        async function editar_msg_tauler(acabat) {

            let tauler_string = montar_tauler_string();

            let msg = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("**TRES EN RATLLA**")
                .addField('❯ Tauler', tauler_string, true)
                .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

            if (acabat === -1) {
                let c = "";
                if (torn === 1) { // torn del p1
                    c = `Torn de <@${player.id}>`;
                } else {
                    c = `Torn de <@${player2.id}>`;
                }
                msg.setDescription(c + "\nEscriu la lletra de la posició a la que vols jugar");
            } else {
                msg.setDescription("La partida s'ha acabat!");
            }

            await msg_tauler.edit(msg);
        }

        function generar_tauler() {
            for (let i = 0; i < 9; i++) {
                tauler[i] = 0;
            }
        }

        function posicio_valida(lletra) {
            let index = lletres.indexOf(lletra); // ens retorna l'index de la lletra
            // retornem si la posicio està lliure
            return tauler[index] === 0;
        }

        async function torn_jugador() {

            const filter = message => lletres.includes(message.content.toLowerCase()) &&
                message.author.id === player.id && torn === 1 &&
                posicio_valida(message.content.toLowerCase());

            return await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    let lletra = lletres.indexOf(collected.first().content.toLowerCase());
                    return lletra;
                }).catch(() => {
                    return tauler.indexOf(0);
                });
        }

        async function torn_jugador2() {

            const filter = message => lletres.includes(message.content.toLowerCase()) &&
                message.author.id === player2.id && torn === 2 &&
                posicio_valida(message.content.toLowerCase());

            return await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    let lletra = lletres.indexOf(collected.first().content.toLowerCase());
                    return lletra;
                }).catch(() => {
                    return tauler.indexOf(0);
                });
        }

        function torn_IA() {
            // retorna una posició aleatòria lliure del tauler
            let items = getAllIndexes(tauler, 0);
            return items[Math.floor(Math.random() * items.length)];
        }

        function actualitzar_tauler(pos, jugador) {
            tauler[pos] = jugador;
            let ratlla = comprovar_ratlla();
            let caselles_lliures = tauler.indexOf(0); // retorna la posicio del primer 0 que troba (casella buida), sino -1
            if (ratlla !== -1) { // si hem trobat una ratlla
                // ha guanyat el jugador de ratlla
                return ratlla;
            } else if (caselles_lliures !== -1) { // sino si hi ha caselles liures
                // podem jugar
                return -1; // retornem -1, continuem jugant...
            } else { // sino
                // empat
                return 0;
            }
        }

        function comprovar_ratlla() { // retorna -1 si no hi ha cap ratlla, 1 si guanya 1, 2 si 2
            // Comprovar files
            for (let i = 0; i < 3; i++) {
                // Comprovar fila
                let tipus = tauler[i * 3];
                if (tipus !== 0) {
                    let fila = true;
                    for (let j = 1; j < 3; j++) {
                        if (tipus !== tauler[i * 3 + j]) {
                            fila = false;
                            break;
                        }
                    }
                    if (fila) {
                        return tipus;
                    }
                }
            }

            // Comprovar columnes
            for (let i = 0; i < 3; i++) {
                // Comprovar columna
                let tipus = tauler[i];
                if (tipus !== 0) {
                    let columna = true;
                    for (let j = 1; j < 3; j++) {
                        if (tipus !== tauler[j * 3 + i]) {
                            columna = false;
                            break;
                        }
                    }
                    if (columna) {
                        return tipus;
                    }
                }
            }

            // Comprovar diagonals
            // Comprovar diagonal descendent
            let tipus = tauler[0];
            if (tipus !== 0) {
                let diagonal = true;
                for (let i = 1; i < 3; i++) {
                    if (tipus !== tauler[i * 3 + i]) {
                        diagonal = false;
                        break;
                    }
                }
                if (diagonal) {
                    return tipus;
                }
            }

            // Comprovar diagonal ascendent
            let posicio = 2; // mida-1
            tipus = tauler[posicio];
            if (tipus !== 0) {
                let diagonal = true;
                for (let i = 1; i < 3; i++) {
                    posicio += 2; // mida-1
                    if (tipus !== tauler[posicio]) {
                        diagonal = false;
                        break;
                    }
                }
                if (diagonal) {
                    return tipus;
                }
            }

            // Si no es compleix cap d'aquestes, no hi ha cap 3 en ratlla
            return -1; // continuem amb el joc
        }

        function getAllIndexes(arr, val) {
            let indexes = [],
                i = -1;
            for (i = 0; i < arr.length; i++)
                if (arr[i] === val)
                    indexes.push(i);
            return indexes;
        }

        function acabar_partida(guanyador) { // 0 si empat, 1 si jugador 1, 2 si jugador 2
            let guanyador_string = "**GUANYADOR/A**\n";
            switch (guanyador) {
                case 0:
                    guanyador_string += "LA PARTIDA HA ACABAT EN EMPAT, ES REPARTEIX EL POT!";
                    break;
                case 1:
                    guanyador_string += `${player.username}, HAS GUANYAT LA PARTIDA!`;
                    break;
                case 2:
                    if (IA) {
                        guanyador_string += "LA IA HA GUANYAT LA PARTIDA!";
                    } else {
                        guanyador_string += `${player2.username}, HAS GUANYAT LA PARTIDA!`;
                    }
                    break;
                default:
                    guanyador_string += "Alguna cosa ha anat malament... :(";
                    break;
            }
            message.channel.send(guanyador_string); // Enviem el missatge del guanyador
            afegir_recompenses(guanyador); // Afegim les recompenses adients
        }

        function afegir_recompenses(guanyador) {
            const xp = Math.floor(Math.random() * 500 + 500); // Entre 500 i 1000
            const mitat = Math.floor(recompensa / 2);
            let recompensa_str = "**RECOMPENSES**\n";

            if (IA) { // Si juguem contra la IA
                if (guanyador === 1) { // Si guanyem nosaltres, tot el pot per nosaltres
                    recompensa_str += `${player.username}, has guanyat 💰\`${recompensa}\` monedes💰!`;
                    userData[message.guild.id + player.id].money += recompensa;
                } else if (guanyador === 0) { // Empat, es reparteix el pot, però la maquina no juga
                    recompensa_str += `${player.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
                    userData[message.guild.id + player.id].money += mitat;
                }

                // Sumem xp al jugador perque la maquina no en té
                message.channel.send(`${server.prefix}progress ${xp} ${player}`);

            } else { // Si estem jugant contra una altra persona
                if (guanyador === 1) { // Guanya p1, tot el pot per ell
                    recompensa_str += `${player.username}, has guanyat 💰\`${recompensa}\` monedes💰!`;
                    userData[message.guild.id + player.id].money += recompensa;
                } else if (guanyador === 2) { // Guanya p2, tot el pot per ell
                    recompensa_str += `${player2.username}, has guanyat 💰\`${recompensa}\`monedes💰!`;
                    userData[message.guild.id + player2.id].money += recompensa;
                } else if (guanyador === 0) { // Empat, es reparteix el pot
                    recompensa_str += `${player.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
                    recompensa_str += `${player2.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
                    userData[message.guild.id + player.id].money += mitat;
                    userData[message.guild.id + player2.id].money += mitat;
                }

                // Sumem xp als dos
                message.channel.send(`${server.prefix}progress ${xp} ${player}`);
                message.channel.send(`${server.prefix}progress ${xp} ${player2}`);
            }

            message.channel.send(recompensa_str);

            fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });
        }

        // Programa principal IA
        async function jugar_contra_IA_random() {
            generar_tauler();
            await mostrar_tauler();
            let acabat = -1; // -1 si encara no ha acabat, 0 si empat, 1 si ha guanyat 1, 2 si 2
            while (acabat === -1) {
                let pos = await torn_jugador();
                acabat = actualitzar_tauler(pos, 1);
                await editar_msg_tauler(acabat);
                if (acabat === -1) {
                    pos = torn_IA();
                    acabat = actualitzar_tauler(pos, 2);
                    await editar_msg_tauler(acabat);
                }
            }
            acabar_partida(acabat);
        }

        // Programa principal PVP
        async function jugar_contra_jugador() {
            generar_tauler();
            await mostrar_tauler();
            let acabat = -1; // -1 si encara no ha acabat, 0 si empat, 1 si ha guanyat 1, 2 si 2
            while (acabat === -1) {
                let pos = await torn_jugador();
                acabat = actualitzar_tauler(pos, torn);
                torn = 2;
                await editar_msg_tauler(acabat);
                if (acabat === -1) {
                    pos = await torn_jugador2();
                    acabat = actualitzar_tauler(pos, torn);
                    torn = 1;
                    await editar_msg_tauler(acabat);
                }
            }
            acabar_partida(acabat);
        }

        // Fase anterior al joc on s'escolleix quin mode volem jugar
        async function fase_sala() {
            let embed_sala = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle("**TRES EN RATLLA**")
                .setDescription("Clica al [🚪] si vols unir-te a la sala o bé clica al [🤖] si vols jugar contra la IA.")
                .setTimestamp().setFooter("CataBOT 2020 © All rights reserved");

            let msg_sala = await message.channel.send(embed_sala);

            await msg_sala.react("🤖");
            await msg_sala.react("🚪");

            // Esperem a una reacció
            const filter = (reaction, user) =>
                ((reaction.emoji.name === '🤖' && message.author.id === user.id) || (reaction.emoji.name === '🚪' && message.author.id !== user.id)) && !user.bot;
            msg_sala.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    msg_sala.delete();
                    // Si la reacció es del bot i es de la mateixa persona que ha escrit el missatge
                    const reaction = collected.first();
                    if (reaction.emoji.name === "🤖") {
                        // Comencem la partida contra la IA
                        IA = true;
                        jugar_contra_IA_random();
                    } else if (reaction.emoji.name === "🚪") {
                        // Sino si la reacció és de la porta i no es el mateix que ha escrit el missatge
                        // Comencem la partida contra l'altre jugador (ell es el player 2)
                        IA = false;
                        player2 = reaction.users.cache.last();
                        jugar_contra_jugador();
                    }
                })
                .catch(error => {
                    console.error(error);
                    return message.channel.send("S'ha acabat el temps! La pròxima vegada vés més ràpid!");
                });
        }
    },
};