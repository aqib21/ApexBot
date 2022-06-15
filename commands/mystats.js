const player = require("./player.js");
const { Client } = require("pg");
const pg = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pg.connect();

module.exports = {
  name: "mystats",
  description: "Your apex stats",
  execute(message, args) {
    let userID = message.author.id;
    pg.query(
      `SELECT * FROM apex_users WHERE user_id = '${userID}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          return message.channel.send("Error Occurred, check logs.");
        }
        if (res.rows.length == 0)
          return message.channel.send("You are not registered.");

        let parameters = [];
        parameters.push(res.rows[0].username);
        parameters.push(res.rows[0].platform);

        player.execute(message, parameters);
      }
    );
  },
};
