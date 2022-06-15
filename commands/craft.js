const requests = require("requests");
const Discord = require("discord.js");

module.exports = {
  name: "craft",
  description: "Current crafting rotation",
  execute(message, args) {
    let url = `https://api.mozambiquehe.re/crafting?auth=${process.env.APEX_TOKEN}`;
    requests(url)
      .on("data", (chunk) => {
        let data = JSON.parse(chunk);
        if (data.Error) return message.channel.send(data.Error);

        data = data.slice(0, 4);

        let embeds = [];

        data.forEach((bundle) => {
          bundle.bundleContent.forEach((content) => {
            let embed = new Discord.MessageEmbed()
              .setTitle(
                `${content.itemType.name.replace(/_+/g, " ").toUpperCase()}`
              )
              .addField("Rarity", content.itemType.rarity, true)
              .addField("Cost", `${content.cost}`, true)
              .setColor(`${content.itemType.rarityHex}`)
              .setThumbnail(content.itemType.asset)
              .setFooter({
                text: `Ends on: ${
                  bundle.bundleType === "permanent" ? "N/A" : bundle.endDate
                }`,
              });

            embeds.push(embed);
          });
        });

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
