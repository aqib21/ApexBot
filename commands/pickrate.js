const requests = require("requests");
const cheerio = require("cheerio");
const Discord = require("discord.js");
const errorLogger = require("../helper/error_logger.js");

module.exports = {
  name: "pickrate",
  description: "Shows the current pick rate of legends",
  execute(message, args) {
    try {
      requests(
        "https://apexlegendsstatus.com/game-stats/legends-pick-rates"
      ).on("data", (chunk) => {
        let $ = cheerio.load(chunk);
        let data = $(".legends-banner__item");
        let embeds = [];
        $(data).each(function (i, elem) {
          let image =
            "https://apexlegendsstatus.com/" + $(elem).find("img").attr("src");

          let contents = $(elem).find(".legends-banner__content");
          let legends = new Array(contents.length)
            .fill(0)
            .map((v, i) => contents.eq(i).html().split("<br>")[0].trim());

          $(contents).each(function (i, elem) {
            let content = $(elem).find("span");

            let embed = new Discord.MessageEmbed()
              .setTitle(legends[i])
              .setColor("BLACK")
              .setThumbnail(image)
              .addField(
                "Current Pick Rate",
                $(content).eq(0).text().trim(),
                true
              )
              .addField(
                "Average Rank",
                $(content)
                  .eq(4)
                  .text()
                  .trim()
                  .split("|")[0]
                  .replace("Avg rank ", ""),
                true
              )
              .addField(
                "Average Level",
                $(content)
                  .eq(4)
                  .text()
                  .trim()
                  .split("|")[1]
                  .replace(" level ", ""),
                true
              );

            embeds.push(embed);
          });
        });
        message.channel.send("Legend popularity - based on 12.8 M players");
        for (let i = 0; i < embeds.length; i += 10) {
          message.channel.send({ embeds: embeds.slice(i, i + 10) });
        }
      });
    } catch (error) {
      errorLogger.execute(error.message, "pickrate");
      return message.channel.send("Error Occurred, check logs.");
    }
  },
};
