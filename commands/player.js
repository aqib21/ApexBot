const requests = require("requests");
const Discord = require("discord.js");
const errorLogger = require("../helper/error_logger.js");

module.exports = {
  name: "player",
  description: "Player Stats",
  execute(message, args) {
    let [player, platform] = args;
    if (!player) {
      message.channel.send("Please specify a player name");
      return;
    }
    if (!platform) {
      message.channel.send("Please specify platform - PC, PS4, X1");
      return;
    }
    url = `https://api.mozambiquehe.re/bridge?auth=${
      process.env.APEX_TOKEN
    }&player=${player}&platform=${platform.toUpperCase()}`;

    requests(url)
      .on("data", (chunk) => {
        let data = JSON.parse(chunk);
        if (data.Error) return message.channel.send(data.Error);

        let badges = [];

        data.legends.selected.gameInfo.badges.forEach((badge) => {
          if (badge.name === null) badge.name = "Empty";
          let emojiName =
            badge.name
              .toLowerCase()
              .replace(data.legends.selected.LegendName.toLowerCase(), "legend")
              .replace(/'/g, "")
              .replace(/ /g, "") + badge.value;
          let emoji = message.guild.emojis.cache.find(
            (emoji) => emoji.name === emojiName
          );
          if (emoji) badges.push(`<:${emoji.name}:${emoji.id}>`);
          else badges.push("");
        });

        try {
          let embed = new Discord.MessageEmbed()
            .setTitle(`${data.global.name}`)
            .setDescription(`Status: ${data.realtime.currentStateAsText}`)
            .setColor("BLACK")
            .setThumbnail(
              data.legends.selected.ImgAssets.icon.replace(" ", "%20")
            )
            .setImage(
              data.legends.selected.ImgAssets.banner.replace(" ", "%20")
            )
            .addField("Level", `${data.global.level}`, true)
            .addField(
              "BR Rank",
              data.global.rank.rankName + " " + data.global.rank.rankDiv,
              true
            )
            .addField(
              "Arena Rank",
              data.global.arena.rankName + " " + data.global.arena.rankDiv,
              true
            )
            .setFooter({ text: `${data.global.uid}` });

          data.legends.selected.data.forEach((tracker) => {
            embed.addField(tracker.name, `${tracker.value}`, true);
          });
          let badgeCount = 0;
          data.legends.selected.gameInfo.badges.forEach((badge) => {
            embed.addField(
              `Badge #${++badgeCount}`,
              badge.name + badges[badgeCount - 1],
              true
            );
          });
          message.channel.send({ embeds: [embed] });
        } catch (err) {
          console.log(err);
          message.channel.send("err: " + err);
        }
      })
      .on("end", (err) => {
        if (err) {
          errorLogger.execute(err, "player");
          return message.channel.send("Error Occurred, check logs.");
        }
      });
  },
};
