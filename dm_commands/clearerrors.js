const { Client } = require("pg");
const pg = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pg.connect();

module.exports = {
  name: "clearerrors",
  execute(message, args) {
    if (message.author.id !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");

    pg.query(`DELETE FROM errorlog`, (err, res) => {
      if (err) {
        return message.channel.send(err);
      }
      message.channel.send("Errors cleared.");
    });
  },
};
