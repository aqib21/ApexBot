const requests = require("requests");
const errorLogger = require("../helper/error_logger.js");
const pd = require("paralleldots");

module.exports = {
  name: "chat",
  description: "Chat with AI",
  execute(message, args) {
    if (args.join().length < 1)
      return message.channel.send("Please provide a message to chat with AI.");
    //return message.channel.send("I'm grounded");

    let msg = args.join(" ");

    let url = `https://some-random-api.ml/chatbot?key=${process.env.CHATBOT_TOKEN}&message=${msg}`;
    try {
      reactToMessage(msg, message);

      requests(url)
        .on("data", (chunk) => {
          message.channel.sendTyping();
          let data = JSON.parse(chunk);

          if (data.error) return message.channel.send("Try again later");

          let filteredMsg = data.response
            .replace("Telk", "rekt")
            .replace("Some Random Chat", "Chatty")
            .replace("https://some-random-api.ml", "rekt")
            .replace("jonmjauu™#2189", "rekt");

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

async function reactToMessage(msg, message) {
  pd.apiKey = process.env.PARALLELDOTS_TOKEN;

  try {
    let response = await pd.abuse(msg);
    let result = JSON.parse(response);
    if (
      result.neither > result.abusive &&
      result.neither > result.hate_speech
    ) {
      message.react("😂");
    } else {
      message.react("🤬");
    }
  } catch (error) {
    errorLogger.execute(error.message, "chat - react");
    message.channel.send("Error Occurred, check logs.");
  }
}
