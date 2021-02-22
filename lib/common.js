const chalk = require('chalk');

module.exports = {
    getRandomColor: () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    // Log colors
    log: chalk.bold.green,
    remove: chalk.bold.red,
    bot: chalk.bold.blue,
    db: chalk.bold.cyan
};