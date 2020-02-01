const Canvas = require('canvas');
const Discord = require("discord.js");

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
};

module.exports = {
	name: 'welcome',
	description: 'Et dona la benvinguda',
	async execute(message) {

        const member = message.member;
        let channel = message.guild.systemChannel;
        if (!channel) channel = member.guild.channels.find(ch => ch.name === 'general');
        if (!channel) channel = message.channel;
        if (!channel) return;

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./imgs/wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Benvingut al servidor,', canvas.width / 2.5, canvas.height / 3.5);

        ctx.font = applyText(canvas, `${member.displayName}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

        channel.send(`Benvingut al servidor, ${member}!`, attachment);
	},
};