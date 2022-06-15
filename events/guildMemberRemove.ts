const { loadImage, createCanvas } = require('canvas');
const { getServer, deleteUser } = require('../lib/database.js');
const { applyText } = require('../lib/common.js');
const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member, client) {
		if (member.user.bot) {
			return;
		}

		deleteUser([member.id, member.guild.id]);

		let channelID = await getServer(member.guild.id);
		channelID = channelID.welcomeChannel;
		if (!channelID) {
			// Si no hi ha el canal configurat, no enviem res
			return;
		}

		const channel = client.channels.resolve(channelID);

		const canvas = createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const background = await loadImage('./img/wallpaper.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.font = '28px sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		const s = ctx.measureText('Adeu,');
		ctx.strokeText('Adeu,', 351 - s.width / 2, 90 + 90);
		ctx.fillText('Adeu,', 351 - s.width / 2, 90 + 90);

		ctx.font = applyText(canvas, `${member.displayName}!`);
		ctx.fillStyle = '#ffffff';
		const s2 = ctx.measureText(`${member.displayName}!`);
		ctx.strokeText(`${member.displayName}!`, 351 - s2.width / 2, 90 + 125 + 20);
		ctx.fillText(`${member.displayName}!`, 351 - s2.width / 2, 90 + 125 + 20);

		ctx.beginPath();
		ctx.arc(351, 90, 56, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await loadImage(
			member.user.displayAvatarURL({
				format: 'png',
			}),
		);
		ctx.drawImage(avatar, 289, 28, 125, 125);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'bye-image.png');

		channel.send(`Adeu, ${member}!`, attachment);
	},
};
