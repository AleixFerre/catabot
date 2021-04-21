const TYPE = "musica";

const {
    getServerQueue,
    seekSecond,
} = require("../../lib/musicModule.js");

module.exports = {
    name: "seek",
    description: "Ves a un segon de la cançó actual.",
    type: TYPE,
    execute(message, args, server) {

        if (!args) {
            return message.channel.send("**❌ Error: Cal que em diguis a quin segon vols anar!**");
        } else if (isNaN(args[0])) {
            return message.channel.send("**❌ Error: Cal que el segon sigui un numero!**");
        }

        const voice_channel = message.member.voice.channel;
        if (!voice_channel) {
            return message.channel.send("**❌ Error: Necessites estar en un canal de veu per executar aquesta comanda!**");
        }

        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            return message.channel.send("**❌ Error: No tens els permissos correctes!**");
        } else if (!permissions.has("SPEAK")) {
            return message.channel.send("**❌ Error: No tens els permissos correctes!**");
        }

        const server_queue = getServerQueue(message.guild.id);

        if (server_queue && server_queue.voice_channel) {
            // Has d'estar al mateix canal del bot
            if (server_queue.voice_channel !== voice_channel) {
                return message.channel.send("**❌ Error: Has d'estar al mateix canal de veu que el bot!**");
            }
        }

        seekSecond(message, server_queue, voice_channel, parseInt(args[0]));
    },
};