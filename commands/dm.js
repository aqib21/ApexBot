const client = require("../index").client;
const fetch = require("node-fetch");
const errorLogger = require("../helper/error_logger.js");

module.exports = {
  name: "dm",
  description: "Direct Messaging",
  async execute(message) {
    message.channel.sendTyping();

    // if (message.author.id === "313280699601911808") return myCommands(message);

    let msg = `**${message.author.tag}:** ${message.content}`;
    let botMsg = "**BOT:** " + (await getResponse(message));

    let channelFound = await findChannel(message.author.id);

    channelFound.send(msg);
    channelFound.send(botMsg);
  },
};

async function getResponse(message) {
  const response = await fetch(
    `https://some-random-api.ml/chatbot?key=${
      process.env.CHATBOT_TOKEN
    }&message=${encodeURIComponent(message.content)}`
  ).catch(console.error);
  const json = await response.json().catch((err) => {
    errorLogger.execute(err.message, "dm - getResponse");
  });

  if (!response || !json) {
    let res = "Something went wrong, please try again later.";
    message.channel.send(res);
    return res;
  }

  message.channel.send(json.response);
  return json.response;
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

function myCommands(message) {
  const args = message.content.split(/ +/);
  const command = args.shift().toLowerCase();
  console.log(command);
}
