const { Client } = require("pg");
const pg = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pg.connect();

module.exports = {
  name: "unregister",
  description: "Remove your apex account from the database",
  execute(message, args) {
    let userID = message.author.id;

    pg.query(
      `SELECT * FROM apex_users WHERE user_id = '${userID}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          return message.channel.send(`Error Occurred, check logs. ${err}`);
        }
        if (res.rows.length == 0)
          return message.channel.send("You are not registered.");

        pg.query(
          `DELETE FROM apex_users WHERE user_id = '${userID}'`,
          (err, res) => {
            if (err) {
              console.log(err);
              return message.channel.send(`Error Occurred, check logs. ${err}`);
            }
            message.channel.send("Successfully unregistered.");
          }
        );
      }
    );
  },
};
