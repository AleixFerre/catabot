const { MessageEmbed } = require('discord.js');
const { getColorFromCommand } = require('../../lib/common.js');
const { getUser, updateUser } = require('../../lib/database.js');

const TYPE = 'games';

module.exports = {
	name: '3enratlla',
	description: 'Joc 1: [BETA] Juga al tres en ratlla!\nEscriu pel xat **NOMÉS LA LLETRA** de la posició on vols jugar.',
	aliases: ['tresenratlla', 'tictactoe', 'play1'],
	type: TYPE,
	execute(message, _args, server) {
		const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮'];
		const lletres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
		const creu = '❌';
		const rodona = '⭕';
		const recompensa = 500; // La meitat si no es en dificil

		let msg_tauler; // variable que guarda el missatge del tauler
		const player = message.author; // Mai cambia
		let player2 = null; // null si juguem contra la IA
		let torn = 1; // 1 per p1; 2 per p2 (sigui IA o no)
		let IA = false; // diu si estas jugant contra la IA o no
		let dificil = true; // diu si estas jugant contra la IA en dificil o no
		// en el cas de que no estiguis contra la IA, és igual però es posa en false per defecte

		const tauler = []; // 0: ningu | 1: jugador1 | 2: jugador2

		fase_sala(); // comença la festa!

		function montar_tauler_string() {
			let tauler_string = '';

			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					const posicio = tauler[j + 3 * i];
					if (posicio === 0) {
						tauler_string += emojis[j + 3 * i] + ' ';
					} else if (posicio === 1) {
						tauler_string += creu + ' ';
					} else {
						// 2
						tauler_string += rodona + ' ';
					}
				}
				tauler_string += '\n';
			}
			return tauler_string;
		}

		async function mostrar_tauler() {
			const tauler_string = montar_tauler_string();

			const msg = new MessageEmbed()
				.setColor(getColorFromCommand(TYPE))
				.setTitle('**TRES EN RATLLA**')
				.setDescription(
					`Torn de <@${player.id}>
Escriu la lletra de la posició a la que vols jugar`,
				)
				.addField('❯ Tauler', tauler_string, true)
				.setTimestamp()
				.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

			msg_tauler = await message.channel.send(msg);
		}

		async function editar_msg_tauler(acabat) {
			const tauler_string = montar_tauler_string();

			const msg = new MessageEmbed()
				.setColor(getColorFromCommand(TYPE))
				.setTitle('**TRES EN RATLLA**')
				.addField('❯ Tauler', tauler_string, true)
				.setTimestamp()
				.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

			if (acabat === -1) {
				let c = '';
				if (torn === 1) {
					// torn del p1
					c = `Torn de <@${player.id}>`;
				} else {
					c = `Torn de <@${player2.id}>`;
				}
				msg.setDescription(`${c}
Escriu la lletra de la posició a la que vols jugar`);
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
			const index = lletres.indexOf(lletra); // ens retorna l'index de la lletra
			// retornem si la posicio està lliure
			return tauler[index] === 0;
		}

		async function torn_jugador() {
			const filter = (m) =>
				lletres.includes(m.content.toLowerCase()) &&
				m.author.id === player.id &&
				torn === 1 &&
				posicio_valida(m.content.toLowerCase());

			return await message.channel
				.awaitMessages(filter, {
					max: 1,
					time: 60000,
					errors: ['time'],
				})
				.then((collected) => {
					const lletra = lletres.indexOf(collected.first().content.toLowerCase());
					return lletra;
				})
				.catch(() => {
					return tauler.indexOf(0);
				});
		}

		async function torn_jugador2() {
			const filter = (m) =>
				lletres.includes(m.content.toLowerCase()) &&
				m.author.id === player2.id &&
				torn === 2 &&
				posicio_valida(m.content.toLowerCase());

			return await message.channel
				.awaitMessages(filter, {
					max: 1,
					time: 60000,
					errors: ['time'],
				})
				.then((collected) => {
					const lletra = lletres.indexOf(collected.first().content.toLowerCase());
					return lletra;
				})
				.catch(() => {
					return tauler.indexOf(0);
				});
		}

		const scores = {
			0: 0, // Empat
			1: -10, // Guanya jugador
			2: 10, // Guanya IA
		};

		// Minimax algorithm based on:
		// https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_154_Tic_Tac_Toe_Minimax/P5/minimax.js
		function minimax(t, depth, isMaximizing) {
			const ratlla = comprovar_ratlla(t); // Retorna -1 si no hi ha cap ratlla, 1 si 1, 2 si 2
			const caselles_lliures = t.indexOf(0); // Retorna -1 si no hi ha cap casella lliure
			let resultat;

			// creem les contants de mapeig per cada torn
			const buit = 0;
			const human = 1;
			const ai = 2;

			// El resultat pot ser -1 si encara no hem acabat, 0 si empat, 1 si guanya 1 i 2 si 2
			if (ratlla !== -1) {
				resultat = ratlla;
			} else if (caselles_lliures !== -1) {
				resultat = -1;
			} else {
				resultat = 0;
			}

			// si estem en un estat terminal, retornem el resultat
			if (resultat !== -1) {
				return scores[resultat];
			}

			// En el cas de que no estem en cap estat terminal, mirem els possibles moviments
			if (isMaximizing) {
				let bestScore = -Infinity;
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						// Es pot posar fitxa?
						if (t[i * 3 + j] === buit) {
							t[i * 3 + j] = ai;
							const score = minimax(t, depth + 1, false);
							t[i * 3 + j] = buit;
							bestScore = Math.max(score, bestScore);
						}
					}
				}
				return bestScore;
			} else {
				let bestScore = Infinity;
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						// Es pot posar fitxa?
						if (t[i * 3 + j] === buit) {
							t[i * 3 + j] = human;
							const score = minimax(t, depth + 1, true);
							t[i * 3 + j] = buit;
							bestScore = Math.min(score, bestScore);
						}
					}
				}
				return bestScore;
			}
		}

		function torn_IA() {
			if (dificil) {
				// MINIMAX algorithm
				const buit = 0;
				const ai = 2;

				let bestScore = -Infinity;
				let bestMove;
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						// Si la posicio esta disponible
						if (tauler[i * 3 + j] === buit) {
							// Adjudiquem la posicio a la IA per comprovar via minimax
							// Quin tauler es millor
							tauler[i * 3 + j] = ai; // Fem el moviment
							const score = minimax(tauler, 0, false); // Mirem l'score d'aquest moviment
							tauler[i * 3 + j] = buit; // Desfem el moviment
							if (score > bestScore) {
								// Si es mes gran que el maxim
								bestScore = score; // Adjudiquem aquest moviment al millor
								bestMove = {
									i,
									j,
								};
							}
						}
					}
				}
				return bestMove.i * 3 + bestMove.j;
			} else {
				// retorna una posició aleatòria lliure del tauler
				const items = getAllIndexes(tauler, 0);
				return items[Math.floor(Math.random() * items.length)];
			}
		}

		function actualitzar_tauler(pos, jugador) {
			tauler[pos] = jugador;
			const ratlla = comprovar_ratlla(tauler);
			const caselles_lliures = tauler.indexOf(0); // retorna la posicio del primer 0 que troba (casella buida), sino -1
			if (ratlla !== -1) {
				// si hem trobat una ratlla
				// ha guanyat el jugador de ratlla
				return ratlla;
			} else if (caselles_lliures !== -1) {
				// sino si hi ha caselles liures
				// podem jugar
				return -1; // retornem -1, continuem jugant...
			} else {
				// sino
				// empat
				return 0;
			}
		}

		function comprovar_ratlla(t) {
			// retorna -1 si no hi ha cap ratlla, 1 si guanya 1, 2 si 2
			// Comprovar files
			for (let i = 0; i < 3; i++) {
				// Comprovar fila
				const tipus = t[i * 3];
				if (tipus !== 0) {
					let fila = true;
					for (let j = 1; j < 3; j++) {
						if (tipus !== t[i * 3 + j]) {
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
				const tipus = t[i];
				if (tipus !== 0) {
					let columna = true;
					for (let j = 1; j < 3; j++) {
						if (tipus !== t[j * 3 + i]) {
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
			let tipus = t[0];
			if (tipus !== 0) {
				let diagonal = true;
				for (let i = 1; i < 3; i++) {
					if (tipus !== t[i * 3 + i]) {
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
			tipus = t[posicio];
			if (tipus !== 0) {
				let diagonal = true;
				for (let i = 1; i < 3; i++) {
					posicio += 2; // mida-1
					if (tipus !== t[posicio]) {
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
			const indexes = [];
			for (let i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
			return indexes;
		}

		function acabar_partida(guanyador) {
			// 0 si empat, 1 si jugador 1, 2 si jugador 2
			let guanyador_string = '**GUANYADOR/A**\n';
			switch (guanyador) {
				case 0:
					guanyador_string += 'LA PARTIDA HA ACABAT EN EMPAT, ES REPARTEIX EL POT!';
					break;
				case 1:
					guanyador_string += `${player.username}, HAS GUANYAT LA PARTIDA!`;
					break;
				case 2:
					if (IA) {
						guanyador_string += 'LA IA HA GUANYAT LA PARTIDA!';
					} else {
						guanyador_string += `${player2.username}, HAS GUANYAT LA PARTIDA!`;
					}
					break;
				default:
					guanyador_string += 'Alguna cosa ha anat malament... :(';
					break;
			}
			message.channel.send(guanyador_string); // Enviem el missatge del guanyador
			afegir_recompenses(guanyador); // Afegim les recompenses adients
		}

		async function afegir_recompenses(guanyador) {
			const xp = Math.floor(Math.random() * 500 + 500); // Entre 500 i 1000
			const mitat = Math.floor(recompensa / 2);
			let recompensa_str = '**RECOMPENSES**\n';

			const user1 = await getUser(player.id, message.guild.id);

			if (IA) {
				// Si juguem contra la IA
				if (dificil) {
					if (guanyador === 1) {
						// Si guanyem nosaltres, tot el pot per nosaltres
						recompensa_str += `${player.username}, has guanyat 💰\`${recompensa}\` monedes💰!`;
						user1.money += recompensa;
					} else if (guanyador === 0) {
						// Empat, es reparteix el pot, però la maquina no juga
						recompensa_str += `${player.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
						user1.money += mitat;
					}
				} else {
					// Si estem jugant en facil
					// eslint-disable-next-line no-lonely-if
					if (guanyador === 1) {
						// Si guanyem nosaltres, tot el pot per nosaltres
						recompensa_str += `${player.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
						user1.money += mitat;
					} else if (guanyador === 0) {
						// Empat, es reparteix el pot, però la maquina no juga
						recompensa_str += `${player.username}, has guanyat 💰\`${mitat / 2}\` monedes💰!`;
						user1.money += mitat / 2;
					}
				}

				// Sumem xp al jugador perque la maquina no en té
				message.channel.send(`${server.prefix}progresa ${xp} ${player}`);
			} else {
				// Si estem jugant contra una altra persona

				const user2 = await getUser(player2.id, message.guild.id);

				if (guanyador === 1) {
					// Guanya p1, tot el pot per ell
					recompensa_str += `${player.username}, has guanyat 💰\`${recompensa}\` monedes💰!`;
					user1.money += recompensa;
				} else if (guanyador === 2) {
					// Guanya p2, tot el pot per ell
					recompensa_str += `${player2.username}, has guanyat 💰\`${recompensa}\`monedes💰!`;
					user2.money += recompensa;
				} else if (guanyador === 0) {
					// Empat, es reparteix el pot
					recompensa_str += `${player.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
					recompensa_str += `${player2.username}, has guanyat 💰\`${mitat}\` monedes💰!`;
					user1.money += mitat;
					user2.money += mitat;
				}

				await updateUser([player2.id, message.guild.id], {
					money: user2.money,
				});

				// Sumem xp als dos
				message.channel.send(`${server.prefix}progresa ${xp} ${player}`);
				message.channel.send(`${server.prefix}progresa ${xp} ${player2}`);
			}

			message.channel.send(recompensa_str);

			await updateUser([player.id, message.guild.id], {
				money: user1.money,
			});
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
			const embed_sala = new MessageEmbed()
				.setColor(getColorFromCommand(TYPE))
				.setTitle('**TRES EN RATLLA**')
				.setDescription(
					`=> [🚪] UNIR-SE A LA SALA
=> [🤖] IA FÀCIL
=> [👾] IA DIFÍCIL
=> [❌] CANCEL·LAR`,
				)
				.setTimestamp()
				.setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

			const msg_sala = await message.channel.send(embed_sala);

			Promise.all([msg_sala.react('🚪'), msg_sala.react('🤖'), msg_sala.react('👾'), msg_sala.react('❌')]);

			// Esperem a una reacció
			const filter = (reaction, user) =>
				((reaction.emoji.name === '🤖' && message.author.id === user.id) ||
					(reaction.emoji.name === '👾' && message.author.id === user.id) ||
					(reaction.emoji.name === '🚪' && message.author.id !== user.id) ||
					(reaction.emoji.name === '❌' && message.author.id === user.id)) &&
				!user.bot;

			const collected = await msg_sala
				.awaitReactions(filter, {
					max: 1,
					time: 60000,
					errors: ['time'],
				})
				.catch(async (error) => {
					console.error(error);
					return await message.channel.send("S'ha acabat el temps! La pròxima vegada vés més ràpid!");
				});

			msg_sala.delete();
			// Si la reacció es del bot i es de la mateixa persona que ha escrit el missatge
			const reaction = collected.first();
			if (reaction.emoji.name === '🤖') {
				// Comencem la partida contra la IA en facil
				IA = true;
				dificil = false;
				jugar_contra_IA_random();
			} else if (reaction.emoji.name === '👾') {
				// juguem contra la IA en dificl
				IA = true;
				dificil = true;
				jugar_contra_IA_random();
			} else if (reaction.emoji.name === '🚪') {
				// Sino si la reacció és de la porta i no es el mateix que ha escrit el missatge
				// Comencem la partida contra l'altre jugador (ell es el player 2)
				IA = false;
				player2 = reaction.users.cache.last();
				jugar_contra_jugador();
			} else if (reaction.emoji.name === '❌') {
				return await message.channel.send('**PARTIDA CANCEL·LADA**');
			}
		}
	},
};
