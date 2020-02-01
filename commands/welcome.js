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

        const background = await Canvas.loadImage('./imgs/wallpaper.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        let s = ctx.measureText('Benvingut al servidor,');
        ctx.strokeText('Benvingut al servidor,', 351-(s.width/2), (90+90));
        ctx.fillText('Benvingut al servidor,', 351-(s.width/2), (90+90));

        ctx.font = applyText(canvas, `${member.displayName}!`);
        ctx.fillStyle = '#ffffff';
        let s2 = ctx.measureText(`${member.displayName}!`);
        ctx.strokeText(`${member.displayName}!`, 351-(s2.width/2), (90+125+20));
        ctx.fillText(`${member.displayName}!`, 351-(s2.width/2), (90+125+20));

        ctx.beginPath();
        ctx.arc(351, 90, 56, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
        ctx.drawImage(avatar, 289, 28, 125, 125);

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

        channel.send(`Benvingut al servidor, ${member}!`, attachment);
	},
};