const requests = require("requests");
const errorLogger = require("../helper/error_logger.js");

module.exports = {
  name: "chat",
  description: "Chat with AI",
  execute(message, args) {
    if (args.join().length < 1)
      return message.channel.send("Please provide a message to chat with AI.");
    //return message.channel.send("I'm grounded");
    let url = `https://some-random-api.ml/chatbot?key=${
      process.env.CHATBOT_TOKEN
    }&message=${args.join(" ")}`;
    try {
      requests(url)
        .on("data", (chunk) => {
          message.channel.sendTyping();
          let data = JSON.parse(chunk);

          if (data.error) return message.channel.send("Try again later");

          let filteredMsg = data.response
            .replace("Telk", "rekt")
            .replace("Some Random Chat", "Chatty")
            .replace("https://some-random-api.ml", "rekt");

          message.channel.send(filteredMsg);
        })
        .on("end", (err) => {
          if (err) {
            errorLogger.execute(err, "chat");
            return message.channel.send("Error Occurred, check logs.");
          }
        });
    } catch (error) {
      errorLogger.execute(error.message, "chat");
      message.channel.send("Error Occurred, check logs.");
    }
  },
};
