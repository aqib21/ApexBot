const requests = require("requests");
const Discord = require("discord.js");
const errorLogger = require("../helper/error_logger.js");

module.exports = {
  name: "news",
  description: "Current news",
  execute(message, args) {
    let url = `https://api.mozambiquehe.re/news?auth=${process.env.APEX_TOKEN}`;
    requests(url)
      .on("data", (chunk) => {
        let data = JSON.parse(chunk);
        if (data.Error) return message.channel.send(data.Error);

        data = data.slice(0, 4);

        let embeds = [];

        data.forEach((news) => {
          let embed = new Discord.MessageEmbed()
            .setTitle(`${news.title}`)
            .setColor("BLACK")
            .setDescription(`${news.short_desc}`)
            .setImage(`${news.img}`)
            .setURL(`${news.link}`);

          embeds.push(embed);
        });

        message.channel.send({ embeds: embeds });
      })
      .on("end", (err) => {
        if (err) {
          errorLogger.execute(err, "news");
          return message.channel.send("Error Occurred, check logs.");
        }
      });
  },
};
