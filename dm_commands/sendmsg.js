const client = require("../index").client;

module.exports = {
  name: "sendmsg",
  async execute(message, args) {
    if (message.author.id !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");
    
    let [serverID, channelID, ...msgs] = args;
    let msg = msgs.join(" ");

    try {
      let server = client.guilds.cache.get(serverID);

      if (channelID === "all") {
        server.channels.fetch().then((channels) => {
          channels.forEach((channel) => {
            if (channel.type !== "GUILD_TEXT") return;
            channel.send(msg).catch(console.error);
          });
        });
        message.channel.send(`Sent to all at ${server.name}.`);
      } else {
        let channel = await server.channels.fetch(channelID);
        channel.send(msg).catch(console.error);
        message.channel.send(`Sent to ${channel.name} at ${server.name}.`);
      }
    } catch (error) {
      message.channel.send(error.message);
    }
  },
};
