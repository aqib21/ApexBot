const { Client } = require("pg");
const pg = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pg.connect();

module.exports = {
  execute(errorMessage, command) {
    let d = new Date();
    let CurrentDate =
      [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-") +
      " " +
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

    pg.query(
      `INSERT INTO errorlog (errordate, errormessage, command) VALUES ('${CurrentDate}', '${errorMessage}', '${command}')`,
      (err, res) => {
        if (err) {
          console.log(err);
        }
      }
    );
  },
};
