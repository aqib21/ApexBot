module.exports = {
  name: "test",
  description: "Test command",
  execute(message, args) {
    if (message.author.id !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");

    let msg = "";

    message.guild.members
      .fetch({ force: true, cache: false })
      .then((members) => {
        members.forEach((member) => {
          if (member.user.bot) return;
          msg += `<@${member.user.id}>`;
        });
        message.channel.send(msg);
      })
      .catch(console.error);

    message.delete();
  },
};
