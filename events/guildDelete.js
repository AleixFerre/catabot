const { remove, db } = require('../lib/common.js');
const { deleteServer, deleteUsersFromServer } = require('../lib/database.js');

module.exports = {
  name: 'guildDelete',
  execute(guild) {
    if (guild.members.cache.size <= 0) return;

    console.log(remove(`El bot ha sortit del servidor "${guild.name}"`));

    deleteUsersFromServer(guild.id).then((deletedCount) => {
      console.log(db(`Esborrats els ${deletedCount} usuaris de la guild ${guild.name}`));
    });

    deleteServer(guild.id).then(console.log(db(`DB: Esborrat el server ${guild.name} correctament!`)));
  },
};
