const client = require("../index").client;

module.exports = {
  name: "serverlist",
  execute(message, args) {
    client.guilds.cache.forEach((guild) => {
      message.channel.send(`${guild.name} | ${guild.id}`);
    });
  },
};
