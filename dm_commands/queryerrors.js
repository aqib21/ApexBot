const { Client } = require("pg");
const pg = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pg.connect();

module.exports = {
  name: "queryerrors",
  execute(message, args) {
    if (message.author.id !== "313280699601911808")
      return message.channel.send("You are not allowed to use this command.");

    if (args.length < 1)
      return message.channel.send("Please provide a query to check.");

    let query = args.join(" ");
    pg.query(query, (err, res) => {
      if (err) {
        return message.channel.send(err + " users - SELECT");
      }
      if (res.rows.length == 0)
        return message.channel.send("There are no errors.");
      res.rows.forEach((row) => {
        message.channel.send(
          `${row.errordate} @ ${row.command} - ${row.errormessage}`
        );
        console.log(row.errordate);
      });
    });
  },
};
