const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'connect4',
    description: 'Joc 4: [BETA] Juga al 4 en ratlla amb els teus amics o contra la IA!',
    type: 'games',
    aliases: ['4enratlla', 'play4', '_'], //! TREURE EL _ DE ALIASES [només placeholder per fer proves]
    async execute(message, _args, servers, userData) {

        let server = servers[message.guild.id];

        let player = message.author;
        let player2 = null;
        let IA = false;
        let dificil = false; // Diu si s'està jugant contra la IA en dificil o no
        let depth = 5; // Torns que la IA prediu
        let scores = { // Objecte per predir el valor de cada jugada
            1: -Infinity,
            2: Infinity
        };

        let torn = 1; // 1 per torn del jugador 1; 2 pel 2
        let msg_tauler; // missatge on el tauler es va actualitzant
        let torns_per_actualitzar = 6; // Torns que han de passar per tornar a enviar un nou missatge
        let n_torn = 1; // Numero de torn actual
        let recompensa = 500; // Monedes que se li sumaran al guanyador

        const emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];
        const res = "⬜"; // Quan no hi ha res
        const vermell = "🔴"; // Equip 1
        const blau = "🔵"; // Equip 2

        let tauler = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];

        await fase_sala();

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function generar_str_tauler() {
            let str = "";
            for (i = 0; i < tauler.length; i++) {
                for (j = 0; j < tauler[i].length; j++) {
                    if (tauler[i][j] === 1) {
                        str += vermell;
                    } else if (tauler[i][j] === 2) {
                        str += blau;
                    } else { // Si no hi ha res, 0
                        str += res;
                    }
                }
                str += "\n";
            }
            for (i = 1; i <= tauler[0].length; i++) {
                str += emojis[i];
            }

            return str + "\n";
        }

        async function mostrar_tauler() {
            let tauler_str = "**TORN " + n_torn + " -- " + player.username +
                "**\n_ESCRIU EL NUMERO DE LA COLUMNA QUE VOLS JUGAR_\n" +
                generar_str_tauler();
            msg_tauler = await message.channel.send(tauler_str);
        }

        // Retorna l'index de la primera columna no-plena
        function primera_columna_valida() {
            for (i = 0; i < tauler[0].length; i++) {
                if (!columna_plena(i)) {
                    return i;
                }
            }
            return -1; // Retornem -1 quan el tauler està ple
        }

        // Retorna si el tauler està ple, per tant hi ha empat
        function comprovar_empat() {
            for (i = 0; i < tauler.length; i++) {
                if (!columna_plena(i)) {
                    return false;
                }
            }
            return true;
        }

        // Retorna un index de columna no-plena
        function columna_valida_aleatoria() {
            let valids = [];
            for (i = 0; i < tauler[0].length; i++) {
                if (!columna_plena(i)) {
                    valids.push(i);
                }
            }
            // Retorna un index aleatori de la llista
            return valids[Math.floor(Math.random() * valids.length)];
        }

        function chkLine(a, b, c, d) {
            // Check first cell non-zero and all cells match
            return ((a != 0) && (a == b) && (a == c) && (a == d));
        }

        // Retorna 1 o 2 si ha guanyat algu, -1 si no (per comprovar empat, cridar la funció comprovar_empat())        
        function comprovar_guanyador() {
            // Check down
            for (r = 0; r < 3; r++) {
                for (c = 0; c < 7; c++)
                    for (c = 0; c < 7; c++)
                        if (chkLine(tauler[r][c], tauler[r + 1][c], tauler[r + 2][c], tauler[r + 3][c]))
                            return tauler[r][c];
            }

            // Check right
            for (r = 0; r < 6; r++) {
                for (c = 0; c < 4; c++)
                    if (chkLine(tauler[r][c], tauler[r][c + 1], tauler[r][c + 2], tauler[r][c + 3]))
                        return tauler[r][c];
            }

            // Check down-right
            for (r = 0; r < 3; r++) {
                for (c = 0; c < 4; c++)
                    if (chkLine(tauler[r][c], tauler[r + 1][c + 1], tauler[r + 2][c + 2], tauler[r + 3][c + 3]))
                        return tauler[r][c];
            }

            // Check down-left
            for (r = 3; r < 6; r++) {
                for (c = 0; c < 4; c++)
                    if (chkLine(tauler[r][c], tauler[r - 1][c + 1], tauler[r - 2][c + 2], tauler[r - 3][c + 3]))
                        return tauler[r][c];
            }

            return -1;
        }

        // Retorna si aquesta columna està plena o no
        function columna_plena(j) {
            return tauler[0][j] !== 0;
        }

        // Retorna la i posició on posar la fitxa a la columna j
        function fons_columna(j) {
            let i = 0;
            let trobat = false;

            // Anem baixant fins que toquem el fons, 
            while (!trobat && i < tauler.length) {
                if (tauler[i][j] !== 0) {
                    trobat = true;
                    return i - 1;
                }
                i++;
            }

            if (!trobat) {
                // Hem tocat el fons
                return i - 1;
            }
        }

        function actualitzar_tauler(columna, jugador) {

            let i = fons_columna(columna);
            tauler[i][columna] = jugador;

            // si hi ha empat, retornem 0
            if (comprovar_empat()) {
                return 0;
            }

            return comprovar_guanyador(); // Retorna -1 si no hi ha res; 1 si guanya 1, 2 si 2

        }

        async function editar_msg_tauler(acabat) {
            let jugador_actual = "";
            if (torn % 2 === 0) {
                if (IA) {
                    jugador_actual = "IA";
                } else {
                    jugador_actual = player2.username;
                }
            } else {
                jugador_actual = player.username;
            }

            let tauler_str = "";

            if (acabat === -1) {
                tauler_str += "**TORN " + n_torn + " -- " + jugador_actual +
                    "**\n_ESCRIU EL NUMERO DE LA COLUMNA QUE VOLS JUGAR_\n";
            } else if (acabat === 1) {
                tauler_str += `**${player.username}, HAS GUANYAT**\n`;
            } else if (acabat === 2) {
                if (IA) {
                    tauler_str += `**HA GUANYAT LA IA**\n`;
                } else {
                    tauler_str += `**${player2.username}, HAS GUANYAT**\n`;
                }
            }

            tauler_str += generar_str_tauler();

            if (n_torn % torns_per_actualitzar === 0) { // Cada n torns
                await msg_tauler.delete();
                msg_tauler = await message.channel.send(tauler_str);
            } else {
                await msg_tauler.edit(tauler_str);
            }
            n_torn++;
        }

        function countPieces(i, j, i2, j2, player) {
            let pieces = 0;

            for (i; i < i2; i++) {
                for (j; j < j2; j++) {
                    if (board[i][j] == player) {
                        pieces += 1;
                    }

                }

            }
            return pieces;
        }

        function countDiagonal(i, j, direction, player) {

            let pieces = 0;

            for (x = 0; x < 4; x++) {
                if (direction == 1) {
                    if (i + x < h && j + x < w) {

                        if (board[i + x][j + x] == player) {
                            pieces += 1;
                        }
                    }

                } else {
                    if (i + x < h && j - x < w && j - x > 0) {

                        if (board[i + x][j - x] == player) {
                            pieces += 1;
                        }

                    }

                }

            }
            return pieces;
        }

        function score_position(player, player2) {
            // Aproximació heurística
            let score = 0;

            for (i = 1; i < h; i++) {
                for (j = 1; j < w; j++) {
                    if ((countPieces(i, j, i + 4, j, player) == 3 && countPieces(i, j, i + 4, j, 0) == 1) || (countPieces(i, j, i, j + 4, player) == 3 && countPieces(i, j, i, j + 4, 0) == 1) ||
                        (countDiagonal(i, j, 0, player) == 3 && countDiagonal(i, j, 0, 0) == 1) ||
                        (countDiagonal(i, j, 1, player) == 3 && countDiagonal(i, j, 1, 0) == 1)) {
                        score += 1000;
                    }

                    if ((countPieces(i, j, i + 4, j, player) == 2 && countPieces(i, j, i + 4, j, 0) == 2) || (countPieces(i, j, i, j + 4, player) == 2 && countPieces(i, j, i, j + 4, 0) == 2) ||
                        (countDiagonal(i, j, 0, player) == 2 && countDiagonal(i, j, 0, 0) == 2) ||
                        (countDiagonal(i, j, 1, player) == 2 && countDiagonal(i, j, 1, 0) == 2)) {
                        score += 10;
                    }

                    if ((countPieces(i, j, i + 4, j, player) == 1 && countPieces(i, j, i + 4, j, 0) == 3) || (countPieces(i, j, i, j + 4, player) == 1 && countPieces(i, j, i, j + 4, 0) == 3) ||
                        (countDiagonal(i, j, 0, player) == 1 && countDiagonal(i, j, 0, 0) == 3) ||
                        (countDiagonal(i, j, 1, player) == 1 && countDiagonal(i, j, 1, 0) == 3)) {
                        score += 1;

                    }

                    if ((countPieces(i, j, i + 4, j, player2) == 3 && countPieces(i, j, i + 4, j, 0) == 1) || (countPieces(i, j, i, j + 4, player2) == 3 && countPieces(i, j, i, j + 4, 0) == 1) ||
                        (countDiagonal(i, j, 0, player2) == 3 && countDiagonal(i, j, 0, 0) == 1) ||
                        (countDiagonal(i, j, 1, player2) == 3 && countDiagonal(i, j, 1, 0) == 1)) {
                        score -= 1000;

                    }

                    if ((countPieces(i, j, i + 4, j, player2) == 2 && countPieces(i, j, i + 4, j, 0) == 2) || (countPieces(i, j, i, j + 4, player2) == 2 && countPieces(i, j, i, j + 4, 0) == 2) ||
                        (countDiagonal(i, j, 0, player2) == 2 && countDiagonal(i, j, 0, 0) == 2) ||
                        (countDiagonal(i, j, 1, player2) == 2 && countDiagonal(i, j, 1, 0) == 2)) {
                        score -= 10;
                    }

                    if ((countPieces(i, j, i + 4, j, player2) == 1 && countPieces(i, j, i + 4, j, 0) == 3) || (countPieces(i, j, i, j + 4, player2) == 1 && countPieces(i, j, i, j + 4, 0) == 3) ||
                        (countDiagonal(i, j, 0, player2) == 1 && countDiagonal(i, j, 0, 0) == 3) ||
                        (countDiagonal(i, j, 1, player2) == 1 && countDiagonal(i, j, 1, 0) == 3)) {
                        score -= 1;

                    }
                }
            }
            return score;
        }

        function minimax(board, depth, isMaximizing, nr_moves, alpha, beta) {
            let result = comprovar_empat() ? 0 : comprovar_guanyador(); // Si empat, llavors 0; sino, comprovem guanyador

            if (result > 0) {
                return scores[result] - 20 * nr_moves;
            }

            if (result === -1) {
                return 0 - 50 * nr_moves;
            }

            if (depth === 0) {
                return score_position(1, 2, nr_moves);
            }

            if (isMaximizing) {

                let bestScore = -Infinity;

                for (j = 0; j < tauler[0].length; j++) {
                    if (!columna_plena(j)) {

                        // Trobem el fons d'aquella columna
                        let i = fons_columna(j);

                        board[i][j] = 1;

                        let score = minimax(board, depth - 1, false, nr_moves + 1, alpha, beta);

                        board[i][j] = 0;

                        bestScore = Math.max(score, bestScore);

                        alpha = Math.max(bestScore, alpha);
                        if (alpha >= beta) {
                            break;
                        }
                    }
                }
                return bestScore;

            } else {
                let bestScore = Infinity;
                for (j = 0; j < tauler[0].length; j++) {
                    if (!columna_plena(j)) {

                        // Trobem el fons d'aquella columna
                        let i = fons_columna(j);

                        board[i][j] = 2;

                        let score = minimax(board, depth - 1, true, nr_moves + 1, alpha, beta);

                        board[i][j] = 0;

                        bestScore = Math.min(score, bestScore);

                        beta = Math.min(bestScore, beta);
                        if (alpha >= beta) {
                            break;
                        }
                    }
                }
                return bestScore;
            }
        }

        function torn_IA() {
            if (dificil) {
                // Algorisme Minimax
                // CREDIT: Connect 4 miniMax with depth/heuristic and alpha/beta pruning by KobeL
                // Find it in: https://editor.p5js.org/KobeL/sketches/_F_AdrK9t

                let bestScore = -Infinity;
                let move;

                for (j = 0; j < tauler[0].length; j++) {
                    if (!columna_plena(j)) {

                        // Trobem el fons d'aquella columna
                        let i = fons_columna(j);

                        // Fem el moviment
                        tauler[i][j] = 2;

                        // Calculem el valor d'aquella jugada
                        let score = minimax(tauler, depth, false, 1, -Infinity, Infinity);
                        console.log(score);
                        // Desfem el moviment
                        tauler[i][j] = 0;

                        // Comprovem el maxim
                        if (score > bestScore) {
                            bestScore = score;
                            move = j;
                        }
                    }
                }
                console.log(move);
                return move;

            } else {
                return columna_valida_aleatoria();
            }
        }

        async function torn_jugador() {

            const filter = message => {
                if (isNaN(message.content) || message.author.id !== player.id || torn !== 1) {
                    // Si no es un numero o no es el jugador actual o no es el seu torn
                    return false;
                }

                let n = Number(message.content) - 1;
                if (n > tauler[0].length || n < 0) { // Si està fora del tauler
                    return false;
                }

                if (columna_plena(n)) { // Si aquella fila està plena, no hi podem posar cap més fitxa
                    return false;
                }

                return true;

            };

            return await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    return Number(collected.first().content - 1); // Ajustem a la notacio començant per 0
                }).catch(() => {
                    return primera_columna_valida();
                });
        }

        async function torn_jugador2() {

            const filter = message => {
                if (isNaN(message.content) || message.author.id !== player2.id || torn !== 2) {
                    // Si no es un numero o no es el jugador actual o no es el seu torn
                    return false;
                }

                let n = Number(message.content) - 1;
                if (n > tauler[0].length || n < 0) { // Si està fora del tauler
                    return false;
                }

                if (columna_plena(n)) { // Si aquella fila està plena, no hi podem posar cap més fitxa
                    return false;
                }

                return true;

            };

            return await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    return Number(collected.first().content - 1); // Ajustem a la notacio començant per 0
                }).catch(() => {
                    return primera_columna_valida();
                });
        }

        async function jugar_contra_IA() {
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

        function acabar_partida(guanyador) {
            // guanyador pot ser 0 si empat, 1 si ha guanyat 1, 2 si 2
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

        // Funciona exactament igual que el 3 en ratlla
        function afegir_recompenses(guanyador) {
            const xp = Math.floor(Math.random() * 500 + 500); // Entre 500 i 1000
            const mitat = Math.floor(recompensa / 2);
            let recompensa_str = "**RECOMPENSES**\n";

            if (IA) { // Si juguem contra la IA
                if (dificil) {
                    if (guanyador === 1) { // Si guanyem nosaltres, tot el pot per nosaltres
                        recompensa_str += `${player.username}, has guanyat 💰\`${recompensa}\` monedes💰!`;
                        userData[message.guild.id + player.id].money += recompensa;
                    } else if (guanyador === 0) { // Empat, es reparteix el pot, però la maquina no juga
                        recompensa_str += `${player.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
                        userData[message.guild.id + player.id].money += mitat;
                    }
                } else { // Si estem jugant en facil
                    if (guanyador === 1) { // Si guanyem nosaltres, tot el pot per nosaltres
                        recompensa_str += `${player.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
                        userData[message.guild.id + player.id].money += mitat;
                    } else if (guanyador === 0) { // Empat, es reparteix el pot, però la maquina no juga
                        recompensa_str += `${player.username}, has guanyat 💰\`${mitat/2}\` monedes💰!`;
                        userData[message.guild.id + player.id].money += mitat / 2;
                    }
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

        async function jugar_contra_jugador() {
            await mostrar_tauler();
            let acabat = -1; // -1 si encara no ha acabat, 0 si empat, 1 si ha guanyat 1, 2 si 2
            while (acabat === -1) {
                let pos = await torn_jugador();
                acabat = actualitzar_tauler(pos, 1);
                torn = 2;
                await editar_msg_tauler(acabat);
                if (acabat === -1) {
                    pos = await torn_jugador2();
                    acabat = actualitzar_tauler(pos, 2);
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
                .setTitle("**QUATRE EN RATLLA**")
                .setDescription("=> [🚪] UNIR-SE A LA SALA\n=> [🤖] VS IA\n=> [👾] VS IA DIFÍCIL\n" +
                    "=> [❌] CANCEL·LAR")
                .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

            let msg_sala = await message.channel.send(embed_sala);

            // Optimizationwise this is async and should run faster
            Promise.all([
                msg_sala.react("🚪"),
                msg_sala.react("🤖"),
                msg_sala.react("👾"),
                msg_sala.react("❌")
            ]);

            // Esperem a una reacció
            const filter = (reaction, user) =>
                ((reaction.emoji.name === '🤖' && message.author.id === user.id) ||
                    (reaction.emoji.name === '👾' && message.author.id === user.id) ||
                    (reaction.emoji.name === '🚪' && message.author.id !== user.id) ||
                    (reaction.emoji.name === '❌' && message.author.id === user.id)) && !user.bot;

            let collected = await msg_sala.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .catch(async error => {
                    console.error(error);
                    return await message.channel.send("S'ha acabat el temps! La pròxima vegada vés més ràpid!");
                });

            // Si la reacció es del bot i es de la mateixa persona que ha escrit el missatge
            const reaction = collected.first();
            await msg_sala.delete();
            if (reaction.emoji.name === "🤖") {
                // Comencem la partida contra la IA en facil
                IA = true;
                dificil = false;
                await jugar_contra_IA();
            } else if (reaction.emoji.name === "👾") {
                // Comencem la partida contra la IA en dificil
                IA = true;
                dificil = true;
                await jugar_contra_IA();
            } else if (reaction.emoji.name === "🚪") {
                // Sino si la reacció és de la porta i no es el mateix que ha escrit el missatge
                // Comencem la partida contra l'altre jugador (ell es el player 2)
                IA = false;
                player2 = reaction.users.cache.last();
                await jugar_contra_jugador();
            } else if (reaction.emoji.name === "❌") {
                return await message.channel.send("**PARTIDA CANCEL·LADA**");
            }
        }

    },
};