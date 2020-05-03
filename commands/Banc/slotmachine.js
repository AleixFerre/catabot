const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'slotmachine',
    description: 'Maquina tragaperras de toda la vida.\nNecessites que totes siguin iguals',
    type: 'banc',
    usage: '< amount/all >',
    aliases: ['slot'],
    async execute(message, args, servers, userData) {

        let server = servers[message.guild.id];

        let amount = 0;
        let content = "";
        let all = false;
        const money = userData[message.guild.id + message.author.id].money;

        if (!args[0]) {
            message.reply("no se quant vols apostar!");
            return message.channel.send(server.prefix + "help slot");
        }

        if (args[0] === "all") {
            amount = money;
            all = true;
        } else if (isNaN(args[0])) {
            message.reply("has de posar un numero vàlid o all");
            return message.channel.send(server.prefix + "help slot");
        } else {
            amount = args[0];
        }

        if (amount <= 0) {
            return message.reply("només pots apostar una quantitat superior a 0!");
        }

        if (amount > money) {
            return message.reply("no tens prous diners!!");
        }

        // 💩 ⭐ 💎

        // Comprovem si doble o nada
        let machine = [0, 0, 0];
        let emojis = ["💩", "⭐", "💎"];
        for (let i = 0; i < machine.length; i++) {
            machine[i] = Math.round(Math.random() * 2); // We round between 0-1-2
        }


        if (machine[0] === machine[1] && machine[1] === machine[2]) {
            // Iguals
            if (machine[0] === 0) {
                // Mierda
                amount *= 2;
                content = message.author.username + " has guanyat una merda...💩";
            } else if (machine[0] === 1) {
                // Estrella
                amount *= 3;
                content = message.author.username + " has guanyat una estrella!⭐";
            } else if (machine[0] === 2) {
                // Diamant
                amount *= 5;
                content = message.author.username + " has guanyat un diamant!!!💎";
            } else {
                // Error
                throw message.reply("hi ha hagut un error!");
            }

            userData[message.guild.id + message.author.id].money += parseInt(amount);
            content += "\n💰" + amount + " monedes afegides a la teva conta.💰";
        } else {
            // Res
            userData[message.guild.id + message.author.id].money -= parseInt(amount);
            if (all) {
                content = message.author.username + " HAS PERDUT TOT";
            } else {
                content = message.author.username + " has perdut";
            }
            content += "😞!\n💰" + amount + " monedes esborrades de la teva conta.💰";
        }

        // Actualitzem el fitxer
        fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { if (err) console.error(err); });


        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let embed = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("**🎰 SLOT MACHINE 🎰**")
            .setAuthor('CataBOT', 'https://raw.githubusercontent.com/CatalaHD/CataBot/master/imgs/icon_cat.png', 'https://github.com/CatalaHD/CataBot');

        for (let i = 0; i < 3; i++) { // Adding the machine slots
            embed.addField((i + 1) + '.', emojis[machine[i]], true);
        }

        embed.setTimestamp().setFooter("CataBOT 2020 © All rights reserved");
        await message.channel.send(embed);
        await message.channel.send("```" + content + '```');
    },
};