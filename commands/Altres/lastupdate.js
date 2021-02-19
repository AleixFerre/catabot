const fs = require("fs");

module.exports = {
    name: 'lastupdate',
    description: 'Mostra les notes de la ultima actualització del bot',
    type: 'altres',
    cooldown: 10,
    aliases: ['parche', 'notes', 'changes', 'changelog', 'canvis'],
    execute(message) {
        let changes = fs.readFileSync("CHANGELOG.md")
            .toString().split("[")[1].split("]");

        let versio = changes[0].replace("\\", "").trim();
        changes = changes[1].replace("\\", "")
            .replace(/-/ig, "❯")
            .replace(/  ❯/ig, "  •")
            .trim();

        message.channel.send("**NOTES DEL CATABOT " + versio + "**" + "\n" + changes);
    }
};