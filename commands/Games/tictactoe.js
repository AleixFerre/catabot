const Discord = require("discord.js");

module.exports = {
    name: 'tictactoe',
    description: 'BETA: Juga al tres en ratlla! Escriu pel xat NOMÉS LA LLETRA de la posició on vols jugar.',
    aliases: ['tresenratlla', '3enratlla', 'playt'],
    type: 'games',
    async execute(message, args, servers) {

        const emojis = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮"];
        const lletres = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
        const creu = "❌";
        const rodona = "⭕";

        let msg_tauler; // variable que guarda el missatge del tauler
        let player = message.author.id;

        let tauler = []; // 0: ningu | 1: jugador1 | 2: jugador2

        await jugar_contra_IA_random();

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
                .addField('❯ Tauler', tauler_string, true)
                .setDescription("Escriu la posició a la que vols jugar")
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
                msg.setDescription("Escriu la posició a la que vols jugar");
            } else {
                msg.setDescription("La partida s'ha acabat");
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
            const filter = (message, user) => ((lletres.includes(message.content.toLowerCase())) &&
                user.id === player.id &&
                posicio_valida(message.content.toLowerCase()));
            return await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    let lletra = lletres.indexOf(collected.first().content.toLowerCase());
                    return lletra;
                }).catch(() => {
                    return tauler.indexOf(0);
                });
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
            var indexes = [],
                i = -1;
            for (i = 0; i < arr.length; i++)
                if (arr[i] === val)
                    indexes.push(i);
            return indexes;
        }

        function torn_IA() {
            var items = getAllIndexes(tauler, 0);
            return items[Math.floor(Math.random() * items.length)]; // retorna una posició aleatòria lliure del tauler
        }

        function acabar_partida(guanyador) { // 0 si empat, 1 si jugador 1, 2 si jugador 2
            let guanyador_string = "**GUANYADOR**\n";
            switch (guanyador) {
                case 0:
                    guanyador_string += "Hi ha hagut un empat!";
                    break;
                case 1:
                    guanyador_string += "<@" + message.author.id + ">, has guanyat!";
                    break;
                case 2:
                    guanyador_string += "Ha guanyat la IA!";
                    break;
                default:
                    guanyador_string += "Alguna cosa ha anat malament...";
                    break;
            }
            message.channel.send(guanyador_string);
        }

        // Programa principal
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

    },
};