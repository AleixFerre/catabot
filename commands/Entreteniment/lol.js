const Discord = require("discord.js");
const fetch = require('node-fetch');
const champs = Object.keys(require('../../Storage/champion.json').data);

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function showChampStats(champName) {

    if (champName.toLowerCase() === "wukong") {
        champName = "MonkeyKing";
    }

    try {
        var champ = await fetch("http://ddragon.leagueoflegends.com/cdn/11.2.1/data/en_US/champion/" + champName + ".json");
        champ = await champ.json();
    } catch (err) {
        return "No existeix cap campió de nom **" + champName + "** \nProva millor amb algun d'aquests:\n" + champs.join(", ");
    }

    champ = champ.data[champName];

    let info = "• Attack: `" + champ.info.attack + '`\n' +
        "• Deffense: `" + champ.info.defense + '`\n' +
        "• Magic: `" + champ.info.magic + '`\n' +
        "• Difficulty: `" + champ.info.difficulty + '`';

    let stats = "• HP: `" + champ.stats.hp + '`\n' +
        "• Mana: `" + champ.stats.mp + '`\n' +
        "• Move Speed: `" + champ.stats.movespeed + '`\n' +
        "• Armor: `" + champ.stats.armor + '`\n' +
        "• Spell Block: `" + champ.stats.spellblock + '`\n' +
        "• Attack Damage: `" + champ.stats.attackdamage + '`\n' +
        "• Attack Range: `" + champ.stats.attackrange + '`\n' +
        "• Attack Speed: `" + champ.stats.attackspeed + '`';

    let embed = new Discord.MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("**" + champ.name + ", " + champ.title + "**")
        // .setDescription(champ.blurb); // Mucho texto

    if (champ.allytips.length !== 0) {
        embed.addField('❯ Ally tips', " 🔘 " + champ.allytips.join("\n 🔘 "), false)
    }

    if (champ.enemytips.length !== 0) {
        embed.addField('❯ Enemy tips', " 🔴 " + champ.enemytips.join("\n 🔴 "), false)
    }

    embed.addField('❯ Stats', stats, true)
        .addField('❯ Info', info, true)
        .addField('❯ Tags', champ.tags.join(", "), true)
        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/" + champName + ".png")
        .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

    return embed;
}

async function showSpellStats(spellName) {
    
    try {
        var spells = await fetch("http://ddragon.leagueoflegends.com/cdn/11.2.1/data/en_US/summoner.json");
        spells = await spells.json();
    } catch (err) {
        return "No s'ha pogut rebre la informació del servidor.";
    }
    
    // const spellCapitalized = spellName.charAt(0).toUpperCase() + spellName.slice(1);
    let spell = spells.data["Summoner" + spellName];
    let names = Object.keys(spells.data);

    names = names.map(n => n.substring(8));

    if (!spell) {
        return "No s'ha trobat cap spell de nom **" + spellName + "**\nPots provar amb algun d'aquests:\n" + names.join(", ");
    }
    
    let embed = new Discord.MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("**" + spell.name + "**")
        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.2.1/img/spell/Summoner" + spellName + ".png")
        .setDescription(spell.description)
        .addField('❯ Cooldown', spell.cooldownBurn, true)
        .addField('❯ Summoner Level', spell.summonerLevel, true)
        .addField('❯ Range', spell.rangeBurn, true)
        .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

    return embed;
}

async function showItemStats(itemName) {
    let embed = new Discord.MessageEmbed()
        .setColor(getRandomColor())
        .setTitle("**Item**")
        .addField('❯ Name', itemName, true)
        .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

    return embed;
}

module.exports = {
    name: 'lol',
    description: 'Busca la info del LoL que vulguis',
    usage: "champ < champName >\n.......spell < spellName >\n.......item < itemName >",
    type: 'entreteniment',
    async execute(message, args, servers) {

        let commandType = args.shift().toLowerCase();
        let messageToReply;
        let champName = "";

        for (let i = 0; i < args.length; i++) {
            const nameCapitalized = args[i].charAt(0).toUpperCase() + args[i].slice(1)
            champName += nameCapitalized;
        }

        if (commandType === "champ" || commandType === "champion" || commandType === "champs") {
            messageToReply = await showChampStats(champName, message);
        } else if (commandType === "spell" || commandType === "summoner" || commandType === "summ") {
            messageToReply = await showSpellStats(champName, message);
        } else if (commandType === "item") {
            messageToReply = await showItemStats(champName, message);
        } else {
            // Cap de les que toca, avisar amb un missatge
            message.reply("no has escollit cap de les opcions!");
            message.channel.send(servers[message.guild.id].prefix + "help lol");
            return;
        }

        message.channel.send(messageToReply);

    },
};