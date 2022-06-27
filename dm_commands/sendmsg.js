const client = require("../index").client;

module.exports = {
  name: "sendmsg",
  async execute(message, args) {
    let [serverID, channelID, ...msgs] = args;
    let msg = msgs.join(" ");

    try {
      let server = client.guilds.cache.get(serverID);
      let channel = await server.channels.fetch(channelID);

      channel.send(msg).catch(console.error);
      message.channel.send(`DM'd ${channel.name} at ${server.name}.`);
    } catch (error) {
      message.channel.send(error.message);
    }
  },
};
