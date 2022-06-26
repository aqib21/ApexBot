const client = require("../index").client;
const fetch = require("node-fetch");

module.exports = {
  name: "dm",
  description: "Direct Messaging",
  async execute(message) {
    message.channel.sendTyping();

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
    }&message=${message.content}`
  ).catch(console.error);
  const json = await response.json().catch(console.error);

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
      .catch(console.error);
  }
  return channelFound;
}
