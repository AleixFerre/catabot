const Discord = require("discord.js");
const fetch = require('node-fetch');
const champs = Object.keys(require('../../storage/lol/champion.json').data);
const spells = require('../../storage/lol/summoner.json').data;
const items = require('../../storage/lol/item.json').data;
const {
    getColorFromCommand
} = require('../../lib/common.js');

const TYPE = "entreteniment";

// Thanks to https://gist.github.com/andrei-m/982927#gistcomment-1931258
function distanciaEdicio(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    let tmp, i, j, prev, val, row;
    // swap to save some memory O(min(a,b)) instead of O(a)
    if (a.length > b.length) {
        tmp = a;
        a = b;
        b = tmp;
    }

    row = Array(a.length + 1);
    // init the row
    for (i = 0; i <= a.length; i++) {
        row[i] = i;
    }

    // fill in the rest
    for (i = 1; i <= b.length; i++) {
        prev = i;
        for (j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                val = row[j - 1]; // match
            } else {
                val = Math.min(row[j - 1] + 1, // substitution
                    Math.min(prev + 1, // insertion
                        row[j] + 1)); // deletion
            }
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }

    return row[a.length];
}

function predictChamp(champName) {

    if (champName.toLowerCase() === "wukong") {
        return "MonkeyKing";
    }

    // Si existeix un nom igual, retornar-lo
    if (champs.includes(champName)) {
        return champName;
    }

    for (let champ of champs) {
        if (distanciaEdicio(champ.toLowerCase(), champName.toLowerCase()) < 2) {
            return champ;
        }
    }

    return "-1";
}

function predict(nameToPredict, namesArray) {

    // Si existeix un nom igual, retornar-lo
    if (namesArray.includes(nameToPredict)) {
        return nameToPredict;
    }

    // SI existeix un nom semblant, retornar-lo
    for (let spell of namesArray) {
        if (distanciaEdicio(spell.toLowerCase(), nameToPredict.toLowerCase()) < 2) {
            return spell;
        }
    }

    // SI no existeix cap nom semblant, retorna "-1"
    return "-1";
}

async function showChampStats(champName) {

    let champ;
    try {
        champ = await fetch("http://ddragon.leagueoflegends.com/cdn/11.2.1/data/en_US/champion/" + champName + ".json");
        champ = await champ.json();
    } catch (err) {
        return "Ho sentim, però no existeix cap campió de nom **" + champName + "** 😦";
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
        .setColor(getColorFromCommand(TYPE))
        .setTitle("**" + champ.name + ", " + champ.title + "**");
    // .setDescription(champ.blurb); // Mucho texto

    if (champ.allytips.length !== 0) {
        embed.addField('❯ Ally tips', " 🔘 " + champ.allytips.join("\n 🔘 "), false);
    }

    if (champ.enemytips.length !== 0) {
        embed.addField('❯ Enemy tips', " 🔴 " + champ.enemytips.join("\n 🔴 "), false);
    }

    embed.addField('❯ Stats', stats, true)
        .addField('❯ Info', info, true)
        .addField('❯ Tags', champ.tags.join(", "), true)
        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.2.1/img/champion/" + champName + ".png")
        .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    return embed;
}

async function showSpellStats(spellName) {

    let spell = spells["Summoner" + spellName];
    let names = Object.keys(spells);

    names = names.map(n => n.substring(8));

    let predictedSpell = predict(spellName, names);

    if (predictedSpell === "-1") {
        return "No s'ha trobat cap spell de nom **" + spellName + "**\nPots provar amb algun d'aquests:\n" + names.join(", ");
    } else {
        spell = spells["Summoner" + predictedSpell];
    }

    let embed = new Discord.MessageEmbed()
        .setColor(getColorFromCommand(TYPE))
        .setTitle("**" + spell.name + "**")
        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.2.1/img/spell/Summoner" + predictedSpell + ".png")
        .setDescription(spell.description)
        .addField('❯ Cooldown', spell.cooldownBurn, true)
        .addField('❯ Summoner Level', spell.summonerLevel, true)
        .addField('❯ Range', spell.rangeBurn, true)
        .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

    return embed;
}

async function showItemStats(itemName) {

    const filteredItems = Object.values(items).filter(i => distanciaEdicio(i.name.toLowerCase(), itemName.toLowerCase()) < 3);

    if (filteredItems.length === 0) {
        return "No s'ha trobat cap item amb nom **" + itemName + "**";
    }

    const item = filteredItems[0];

    let embed = new Discord.MessageEmbed()
        .setColor(getColorFromCommand(TYPE))
        .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.2.1/img/item/" + item.image.full)
        .setTitle("**" + item.name + "**")
        .setDescription(item.plaintext)
        .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

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
        embed.addField("❯ Into", into.join(", "), false);
    }

    return embed;
}

module.exports = {
    name: 'lol',
    description: 'Busca la info del LoL que vulguis',
    usage: "champ < champName >\n [ or ] spell < spellName >\n [ or ] item < itemName >",
    type: TYPE,
    cooldown: 10,
    async execute(message, args, server) {

        if (args.length < 1) {
            message.reply("has d'escollir una opció!");
            message.channel.send(server.prefix + "help lol");
            return;
        }

        let commandType = args.shift().toLowerCase();
        let messageToReply;
        let theName = "";

        if (commandType === "champ" || commandType === "champion" || commandType === "champs") {
            for (let i = 0; i < args.length; i++) {
                const nameCapitalized = args[i].charAt(0).toUpperCase() + args[i].slice(1);
                theName += nameCapitalized;
            }

            let predictedName = predictChamp(theName);
            if (predictedName === "-1") {
                messageToReply = "Ho sentim, però no existeix cap campió de nom **" + args.join(" ") + "** 😦";
            } else {
                messageToReply = await showChampStats(predictedName, message);
            }

        } else if (commandType === "spell" || commandType === "summoner" || commandType === "summ") {
            for (let i = 0; i < args.length; i++) {
                const nameCapitalized = args[i].charAt(0).toUpperCase() + args[i].slice(1);
                theName += nameCapitalized;
            }
            messageToReply = await showSpellStats(theName, message);
        } else if (commandType === "item") {
            messageToReply = await showItemStats(args.join(" "), message);
        } else {
            // Cap de les que toca, avisar amb un missatge
            message.reply("no has escollit cap de les opcions!");
            message.channel.send(server.prefix + "help lol");
            return;
        }

        message.channel.send(messageToReply);

    },
};