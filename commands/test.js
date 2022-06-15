const requests = require("requests");
const cheerio = require("cheerio");
const Discord = require("discord.js");

module.exports = {
  name: "test",
  description: "Test command",
  execute(message, args) {
    if (message.author.id !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");

    requests("https://apexlegendsstatus.com/game-stats/legends-pick-rates").on(
      "data",
      (chunk) => {
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
        //console.log(embeds)
        for (let i = 0; i < embeds.length; i += 10) {
          message.channel.send({ embeds: embeds.slice(i, i + 10) });
        }
      }
    );
  },
};
