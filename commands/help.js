const Discord = require("discord.js");
const fs = require("fs");
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

module.exports = {
  name: "help",
  description: "Help command",
  execute(message, args) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Help")
      .setColor("BLACK")
      .setFooter({
        text: "If you need further help, please contact rekt#0034",
        iconURL:
          "https://cdn.discordapp.com/avatars/313280699601911808/a793a48c59345400ca668be499b563b6.webp",
      });

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      if (["test", "help", "dm"].includes(command.name)) continue;
      embed.addField(`${command.name}`, `${command.description}`);
    }

    message.channel.send({ embeds: [embed] });
  },
};
