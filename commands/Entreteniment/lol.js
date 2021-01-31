const Discord = require("discord.js");
const fetch = require('node-fetch');
const champs = Object.keys(require('../../Storage/lol/champion.json').data);
const spells = require('../../Storage/lol/summoner.json');
const items = require('../../Storage/lol/item.json').data;

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

    const filteredItems = Object.values(items).filter(i => i.name.toLowerCase() === itemName.toLowerCase());

    if (filteredItems.length === 0) {
        let names = [];
        for (let item of Object.keys(items)) {
            names.push(items[item].name);
        }
        return "No s'ha trobat cap item amb nom **" + itemName + "**\nProva un d'aquests:\n" + names.join(", ").substring(0, 1900) + "...";
    }

    const item = filteredItems[0];

    let embed = new Discord.MessageEmbed()
        .setColor(getRandomColor())
        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/" + item.image.full)
        .setTitle("**" + item.name + "**")
        .setDescription(item.plaintext)
        .setTimestamp().setFooter("CataBOT " + new Date().getFullYear() + " © All rights reserved");

    let tags = item.tags;
    if (tags.length !== 0) {
        tags = tags.map(s => s.replace(/([A-Z])/g, ' $1').trim());
        tags = tags.join(", ");
        embed.addField('❯ Tags', tags, true);
    }

    embed.addField('❯ Gold', item.gold.total, true);

    let from = item.from;
    if (from) {
        from = from.map(i => items[i].name);
        embed.addField("❯ From", from.join(", "), false);
    }

    let into = item.into;
    if (into) {
        into = into.map(i => items[i].name);
        embed.addField("❯ Into", into.join(", "), true);
    }

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
        let theName = "";

        if (commandType === "champ" || commandType === "champion" || commandType === "champs") {
            for (let i = 0; i < args.length; i++) {
                const nameCapitalized = args[i].charAt(0).toUpperCase() + args[i].slice(1)
                theName += nameCapitalized;
            }
            messageToReply = await showChampStats(theName, message);
        } else if (commandType === "spell" || commandType === "summoner" || commandType === "summ") {
            for (let i = 0; i < args.length; i++) {
                const nameCapitalized = args[i].charAt(0).toUpperCase() + args[i].slice(1)
                theName += nameCapitalized;
            }
            messageToReply = await showSpellStats(theName, message);
        } else if (commandType === "item") {
            messageToReply = await showItemStats(args.join(" "), message);
        } else {
            // Cap de les que toca, avisar amb un missatge
            message.reply("no has escollit cap de les opcions!");
            message.channel.send(servers[message.guild.id].prefix + "help lol");
            return;
        }

        message.channel.send(messageToReply);

    },
};