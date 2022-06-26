const errorLogger = require("../helper/error_logger.js");
const { Client } = require("pg");
const pg = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pg.connect();

module.exports = {
  name: "users",
  description: "Current registered users - under construction",
  execute(message, args) {
    let userID = message.author.id;
    if (userID !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");
    pg.query(`SELECT * FROM apex_users`, (err, res) => {
      if (err) {
        errorLogger.execute(err, "users - SELECT");
        return message.channel.send("Error Occurred, check logs.");
      }
      if (res.rows.length == 0)
        return message.channel.send("There are no users registered.");

      let count = 0;
      let msg = "Current Users\n";
      res.rows.forEach((row) => {
        count++;
        msg += `${row.user_id === userID ? "**" : ""}${count}. <@${
          row.user_id
        }> - ${row.username} (${row.platform})${
          row.user_id === userID ? "**" : ""
        }\n`;
      });
      message.channel.send(msg);
    });
  },
};
