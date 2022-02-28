const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const { getRandomColor } = require('../../lib/common.js');

const TYPE = 'entreteniment';

function generateText(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function invertColor(hex) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	// invert color components
	const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
		g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
		b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
	// pad each with zeros and return
	return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
	len = len || 2;
	const zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}

function getRandomTransform() {
	const max = 0.2;
	return Math.random() * (max * 2) - max;
}

module.exports = {
	name: 'captcha',
	description: 'Et genera un nou parell imatge-text de Captcha',
	type: TYPE,
	async execute(message) {
		const text = generateText(5);
		const description = 'Escriu pel xat el codi per verificar la teva conta (60 segons per respondre):';

		const canvas = Canvas.createCanvas(200, 100);
		const ctx = canvas.getContext('2d');

		const bgColor = getRandomColor();

		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.setTransform(1, getRandomTransform(), 0, 1, 0, 0);

		ctx.font = '28px sans-serif';
		const s = ctx.measureText(text);
		ctx.fillStyle = invertColor(bgColor);
		ctx.fillText(text, canvas.width / 2 - s.width / 2, canvas.height / 2);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'captcha.png');

		await message.channel.send(description, attachment);

		// Await messages that fit the code
		const filter = (m) => m.content === text && m.author.id === message.author.id;
		// Errors: ['time'] treats ending because of the time limit as an error
		message.channel
			.awaitMessages(filter, {
				max: 1,
				time: 60000,
				errors: ['time'],
			})
			.then(() => {
				// S'ha respos correctament el codi
				message.channel.send('✅ Has respòs correctament! ✅');
			})
			.catch(() => {
				// Ha pasat el temps
				message.channel.send("⏰ S'ha acabat el temps! ⏰");
			});
	},
};
