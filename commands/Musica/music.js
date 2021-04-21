const TYPE = "musica";

const {
	mostrar_opcions,
} = require("../../lib/musicModule.js");

module.exports = {
	name: "music",
	description: "Més info amb la comanda `!music`.",
	type: TYPE,
	execute(message, _args, server) {
		mostrar_opcions(message, server);
	},
};