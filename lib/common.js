module.exports = {
    getRandomColor: function() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    getServerPrefix: function(message, servers) {
        return servers[message.guild.id].prefix;
    }
};