const requests = require("requests");
const cheerio = require("cheerio");
const Discord = require("discord.js");

module.exports = {
  name: "test",
  description: "Test command",
  execute(message, args) {
    if (message.author.id !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");
  },
};
