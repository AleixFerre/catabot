const { log } = require('../lib/common.js');
const { getServer } = require('../lib/database.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    if (member.user.bot) {
      return;
    }

    console.log(log(`Nou membre "${member.user.username}" afegit a la guild ${member.guild.name}`));

    let channelInfo = await getServer(member.guild.id);
    // Si no hi ha el canal configurat, no enviem res
    if (!channelInfo) return;

    let channel = client.channels.resolve(channelInfo.welcomeChannel);
    if (!channel) return;

    channel.send(`${channelInfo.prefix}welcome ${member.user}`);
  },
};
