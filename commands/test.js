const errorLogger = require("../helper/error_logger.js");

module.exports = {
  name: "test",
  description: "Test command",
  execute(message, args) {
    if (message.author.id !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");

    try {
      // let msg = "";

      // message.guild.members
      //   .fetch({ force: true, cache: false })
      //   .then((members) => {
      //     members.forEach((member) => {
      //       if (member.user.bot) return;
      //       msg += `<@${member.user.id}>`;
      //     });
      //     message.channel.send(msg);
      //   })
      //   .catch(console.error);

      let dr = new Date(),
        dformat =
          [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-") +
          " " +
          [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
      console.log(dformat);
      // message.delete();
    } catch (error) {
      console.log(error.message);
      errorLogger.execute(error, "test");
    }
  },
};
