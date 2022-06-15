const requests = require("requests");
const { Client } = require("pg");
const pg = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pg.connect();

module.exports = {
  name: "register",
  description: "Register your apex account to run ;mystats command",
  execute(message, args) {
    let [player, platform] = args;
    let userID = message.author.id;

    if (!player) {
      message.channel.send("Please specify a player name");
      return;
    }
    if (!platform) {
      message.channel.send("Please specify platform - PC, PS4, X1");
      return;
    }

    let url = `https://api.mozambiquehe.re/nametouid?auth=${
      process.env.APEX_TOKEN
    }&player=${player}&platform=${platform.toUpperCase()}`;
    requests(url)
      .on("data", (chunk) => {
        let data = JSON.parse(chunk);
        if (data.Error) return message.channel.send(data.Error);

        pg.query(
          `SELECT * FROM apex_users WHERE user_id = '${userID}'`,
          (err, res) => {
            if (err) {
              console.log(err);
              return message.channel.send(`Error Occurred, check logs. ${err}`);
            }
            if (res.rows.length > 0)
              return message.channel.send(
                `You are already registered as ${res.rows[0].username}.`
              );

            pg.query(
              `SELECT * FROM apex_users WHERE username = '${player.toLowerCase()}'`,
              (err, res) => {
                if (err) {
                  console.log(err);
                  return message.channel.send(
                    `Error Occurred, check logs. ${err}`
                  );
                }
                if (res.rows.length > 0)
                  return message.channel.send(
                    `${player} is already registered by <@${res.rows[0].user_id}>.`
                  );

                pg.query(
                  `INSERT INTO apex_users (user_id, username, platform) VALUES ('${userID}', '${player.toLowerCase()}', '${platform.toUpperCase()}')`,
                  (err, res) => {
                    if (err) {
                      console.log(err);
                      return message.channel.send(
                        `Error Occurred, check logs. ${err}`
                      );
                    }
                    message.channel.send("Successfully registered.");
                  }
                );
              }
            );
          }
        );
      })
      .on("end", (err) => {
        if (err) {
          message.channel.send("Error Occurred, check logs.");
          return console.log("connection closed due to errors", err);
        }
      });
  },
};
