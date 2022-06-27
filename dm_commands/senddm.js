const client = require("../index").client;

module.exports = {
  name: "senddm",
  async execute(message, args) {
    let [serverID, userID, ...msgs] = args;
    let msg = msgs.join(" ");

    try {
      let server = client.guilds.cache.get(serverID);
      let user = await server.members.fetch(userID);

      user.send(msg).catch(console.error);
      message.channel.send(`DM'd ${user.user.username} at ${server.name}.`);
    } catch (error) {
      message.channel.send(error.message);
    }
  },
};
