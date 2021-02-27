const Discord = require("discord.js");
const {
    getRandomColor
} = require('../../lib/common.js');
const {
    getUsersFromServer
} = require('../../lib/database.js');

module.exports = {
    name: 'money',
    description: 'Et mostra els diners que tens',
    usage: '[ @user ]',
    aliases: ['diners'],
    cooldown: 10,
    type: 'banc',
    async execute(message) {

        let mention = {};
        let posicio = 1;

        if (message.mentions.users.first()) {
            mention = message.mentions.users.first();
        } else {
            mention = message.author;
        }

        if (mention.bot) {
            return message.reply("els Bots no tenen diners... pobres Bots 😫");
        }

        let users = await getUsersFromServer(message.guild.id);
        let money = users.find((user) => user.IDs.userID === mention.id).money;

        users.forEach(member => {
            if (member.money > money) {
                posicio++;
            }
        });

        let msg = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle("💰 Banc 💰")
            .setThumbnail(mention.avatarURL)
            .addField('❯ Compte', mention.username, true)
            .addField('❯ Diners', money, true)
            .addField('❯ Top', posicio, true)
            .setTimestamp().setFooter(`CataBOT ${new Date().getFullYear()} © All rights reserved`);

        message.channel.send(msg);
    },
};