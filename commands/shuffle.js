module.exports = {
	name: 'shuffle',
	description: 'Barreja la cua',
	execute(message, args, servers) {
        async function shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }

        message.channel.send("Barrejant la cua...").then((msg) => {
            let server = servers[message.guild.id];
            if (server) {
                if (server.queue.length > 1) {
                    shuffle(server.queue).then(() => {
                        msg.edit("S'ha barrejat amb èxit!\nFes !q o !queue per visualitzar-la");
                    }).catch(console.error);
                } else {
                    msg.edit("No hi ha prous elements per barrejar!");
                }
            } else {
                msg.edit("No hi ha cua!");
            }
        }).catch(console.error);
	},
};