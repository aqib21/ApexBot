const client = require("../index").client;
const fetch = require("node-fetch");
const errorLogger = require("../helper/error_logger.js");
const prefix = process.env.PREFIX;
const fs = require("fs");

const commandFiles = fs
  .readdirSync("./dm_commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`../dm_commands/${file}`);
  client.commands.set(command.name, command);
}

module.exports = {
  name: "dm",
  description: "Direct Messaging",
  async execute(message) {
    message.channel.sendTyping();

    if (
      message.author.id === "313280699601911808" &&
      message.content.startsWith(prefix)
    ) {
      const args = message.content.slice(prefix.length).split(/ +/);
      const command = args.shift().toLowerCase();
      try {
        return client.commands.get(command).execute(message, args);
      } catch (error) {
        return message.channel.send(error.message);
      }
    }

    let msg = `**${message.author.tag}:** ${message.content}`;
    let botMsg = "**BOT:** " + (await getResponse(message));

    let channelFound = await findChannel(message.author.id);

    channelFound.send(msg);
    channelFound.send(botMsg);
  },
};

async function getResponse(message) {
  try {
    const response = await fetch(
      `https://some-random-api.ml/chatbot?key=${process.env.CHATBOT_TOKEN}&message=${message.content}`
    );
    const json = await response.json();

    message.channel.send(json.response);
    return json.response;
  } catch (error) {
    errorLogger.execute(error.message, "dm - getResponse");
    message.channel.send("Something went wrong, please try again later.");
    return "error";
  }
}

async function findChannel(authorID) {
  let server = client.guilds.cache.get("975301742545735680");
  let channelFound = server.channels.cache.find((c) => c.name === authorID);
  if (channelFound === undefined) {
    channelFound = await server.channels
      .create(authorID, { type: "text" })
      .then((c) => {
        c.setParent("989805996933259305");
        return c;
      })
      .catch((err) => {
        errorLogger.execute(err.message, "dm - getResponse");
      });
  }
  return channelFound;
}
