module.exports = {
    name: 'ping',
    description: 'Retorna el ping del servidor i de la API!',
    type: 'altres',
    execute(message) {
        let ping = Math.floor(message.client.ping);
        message.channel.send(":ping_pong: Pong!").then((m) => {
            m.edit(`:incoming_envelope: Ping Missatges: \`${Math.floor(m.createdTimestamp - message.createdTimestamp)} ms\`\n:satellite_orbital: Ping DiscordAPI: \`${ping} ms\``);
        }).catch(console.error);
    },
};