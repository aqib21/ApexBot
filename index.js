require("dotenv").config();
const errorLogger = require("./helper/error_logger.js");
const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["CHANNEL"],
});

module.exports = { client };

const prefix = process.env.PREFIX;
const fs = require("fs");

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Dropping hot", {
    type: "STREAMING",
    url: "https://www.youtube.com/watch?v=XG1Y3ywb8ms",
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.channel.type === "DM"){
    return message.channel.send('This feature has been temporarily disabled. Contact Rekt for more info.')
    return client.commands.get("dm").execute(message);
  }

  if (message.mentions["users"].size !== 0) {
    if (message.mentions["users"].first().id === "836196253528227850") {
      const args = message.content
        .replace("<@836196253528227850>", "")
        .split(/ +/);
      return client.commands.get("chat").execute(message, args);
    }
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  if (!message.content.startsWith(prefix)) return;
  const command = args.shift().toLowerCase();
  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    message.channel.send(
      "Invalid command, type ;help to list the existing commands."
    );
    console.log(error);
  }
});

client.login(process.env.DISCORD_TOKEN);
