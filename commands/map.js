const requests = require("requests");
const Discord = require("discord.js");

module.exports = {
  name: "map",
  description: "Map rotations",
  execute(message, args) {
    let url = `https://api.mozambiquehe.re/maprotation?auth=${process.env.APEX_TOKEN}&version=2`;
    requests(url)
      .on("data", (chunk) => {
        let data = JSON.parse(chunk);
        if (data.Error) return message.channel.send(data.Error);

        let embeds = [];

        for (const mode in data) {
          let name =
            mode === "arenasRanked"
              ? "ARENAS RANKED"
              : mode.replace("_", " ").toUpperCase();

          let embed = new Discord.MessageEmbed()
            .setTitle(`${name}`)
            .setDescription(`${data[mode].current.map}`)
            .setColor("BLACK")
            .setImage(data[mode].current.asset)
            .addField(
              "Start Time",
              `${data[mode].current.readableDate_start}`,
              true
            )
            .addField(
              "End Time",
              `${data[mode].current.readableDate_end}`,
              true
            )
            .addField(
              "Remaining Timer",
              `${data[mode].current.remainingTimer}`,
              true
            )
            .setFooter({
              text: `Next map: ${data[mode].next.map} - Ends at: ${data[mode].next.readableDate_end}`,
              iconURL: `${data[mode].next.asset}`,
            });

          embeds.push(embed);
        }

        message.channel.send({ embeds: embeds });
      })
      .on("end", (err) => {
        if (err) {
          message.channel.send("Error Occurred, check logs.");
          return console.log("connection closed due to errors", err);
        }
      });
  },
};
