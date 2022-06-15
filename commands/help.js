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
      });

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      if (["test", "help"].includes(command.name)) continue;
      embed.addField(`${command.name}`, `${command.description}`);
    }

    message.channel.send({ embeds: [embed] });
  },
};
