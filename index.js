require("dotenv").config();
const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
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
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error.message);
    message.channel.send(
      "Invalid command, type ;help to list the existing commands."
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
